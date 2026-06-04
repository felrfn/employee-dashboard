import type { RowDataPacket } from 'mysql2';
import { normalizePagination } from './pagination';
import { queryOne, queryRows } from './sql';
import type {
  DashboardStats,
  DeptHistoryRow,
  EmployeeNameRow,
  EmployeeDetail,
  EmployeeListItem,
  ManagerHistoryRow,
  PagedResult,
  SalaryRow,
  TitleRow
} from './types';

type StatsRow = RowDataPacket & {
  totalEmployees: number | string;
  totalDepartments: number | string;
  avgCurrentSalary: number | string | null;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const row = await queryOne<StatsRow>(
    `
    SELECT
      (SELECT COUNT(*) FROM employees) AS totalEmployees,
      (SELECT COUNT(*) FROM departments) AS totalDepartments,
      (
        SELECT AVG(s.salary)
        FROM employees e
        JOIN salaries s
          ON s.emp_no = e.emp_no
         AND s.to_date = '9999-01-01'
      ) AS avgCurrentSalary
    `
  );

  if (!row) {
    return { totalEmployees: 0, totalDepartments: 0, avgCurrentSalary: null };
  }

  return {
    totalEmployees: Number(row.totalEmployees),
    totalDepartments: Number(row.totalDepartments),
    avgCurrentSalary: row.avgCurrentSalary === null ? null : Number(row.avgCurrentSalary)
  };
}

type CountRow = RowDataPacket & { total: number | string };

export async function listEmployees(input: {
  page?: number;
  pageSize?: number;
  q?: string;
}): Promise<PagedResult<EmployeeListItem>> {
  const q = (input.q ?? '').trim();
  const like = q ? `${q}%` : '';
  const { page, pageSize, offset } = normalizePagination({ page: input.page, pageSize: input.pageSize });

  const countRow = await queryOne<CountRow>(
    `
    SELECT COUNT(*) AS total
    FROM employees e
    WHERE (? = '' OR e.first_name LIKE ? OR e.last_name LIKE ?)
    `,
    [q, like, like]
  );

  const total = Number(countRow?.total ?? 0);
  const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  const items = await queryRows<RowDataPacket & EmployeeListItem>(
    `
    SELECT
      e.emp_no,
      e.first_name,
      e.last_name,
      e.gender,
      e.hire_date,
      cs.salary AS current_salary,
      ct.title AS current_title,
      d.dept_no,
      d.dept_name
    FROM employees e
    LEFT JOIN salaries cs
      ON cs.emp_no = e.emp_no
     AND cs.to_date = '9999-01-01'
    LEFT JOIN titles ct
      ON ct.emp_no = e.emp_no
     AND ct.to_date = '9999-01-01'
    LEFT JOIN dept_emp de
      ON de.emp_no = e.emp_no
     AND de.to_date = '9999-01-01'
    LEFT JOIN departments d
      ON d.dept_no = de.dept_no
    WHERE (? = '' OR e.first_name LIKE ? OR e.last_name LIKE ?)
    ORDER BY e.emp_no
    LIMIT ? OFFSET ?
    `,
    [q, like, like, pageSize, offset]
  );

  return { items, page, pageSize, total, totalPages };
}

type EmployeeBaseRow = RowDataPacket & {
  emp_no: number;
  birth_date: string;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  hire_date: string;
  current_salary: number | null;
  current_title: string | null;
  dept_no: string | null;
  dept_name: string | null;
};

export async function getEmployeeDetail(empNo: number): Promise<EmployeeDetail | null> {
  const employee = await queryOne<EmployeeBaseRow>(
    `
    SELECT
      e.emp_no,
      e.birth_date,
      e.first_name,
      e.last_name,
      e.gender,
      e.hire_date,
      cs.salary AS current_salary,
      ct.title AS current_title,
      d.dept_no,
      d.dept_name
    FROM employees e
    LEFT JOIN salaries cs
      ON cs.emp_no = e.emp_no
     AND cs.to_date = '9999-01-01'
    LEFT JOIN titles ct
      ON ct.emp_no = e.emp_no
     AND ct.to_date = '9999-01-01'
    LEFT JOIN dept_emp de
      ON de.emp_no = e.emp_no
     AND de.to_date = '9999-01-01'
    LEFT JOIN departments d
      ON d.dept_no = de.dept_no
    WHERE e.emp_no = ?
    LIMIT 1
    `,
    [empNo]
  );

  if (!employee) return null;

  const [salaryHistory, titleHistory, deptHistory] = await Promise.all([
    queryRows<RowDataPacket & SalaryRow>(
      `
      SELECT s.salary, s.from_date, s.to_date
      FROM salaries s
      JOIN employees e
        ON e.emp_no = s.emp_no
      WHERE s.emp_no = ?
      ORDER BY s.from_date DESC
      `,
      [empNo]
    ),
    queryRows<RowDataPacket & TitleRow>(
      `
      SELECT t.title, t.from_date, t.to_date
      FROM titles t
      JOIN employees e
        ON e.emp_no = t.emp_no
      WHERE t.emp_no = ?
      ORDER BY t.from_date DESC
      `,
      [empNo]
    ),
    queryRows<RowDataPacket & DeptHistoryRow>(
      `
      SELECT d.dept_no, d.dept_name, de.from_date, de.to_date
      FROM dept_emp de
      JOIN departments d
        ON d.dept_no = de.dept_no
      WHERE de.emp_no = ?
      ORDER BY de.from_date DESC
      `,
      [empNo]
    )
  ]);

  return {
    employee: {
      emp_no: employee.emp_no,
      birth_date: employee.birth_date,
      first_name: employee.first_name,
      last_name: employee.last_name,
      gender: employee.gender,
      hire_date: employee.hire_date,
      current_salary: employee.current_salary,
      current_title: employee.current_title,
      current_department:
        employee.dept_no && employee.dept_name
          ? { dept_no: employee.dept_no, dept_name: employee.dept_name }
          : null
    },
    salaryHistory,
    titleHistory,
    deptHistory
  };
}

type ViewCountRow = RowDataPacket & { total: number | string };

export async function listManagerHistory(input: {
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<ManagerHistoryRow>> {
  const { page, pageSize, offset } = normalizePagination({ page: input.page, pageSize: input.pageSize });

  const countRow = await queryOne<ViewCountRow>(
    `
    SELECT COUNT(*) AS total
    FROM v_department_managers
    `
  );

  const total = Number(countRow?.total ?? 0);
  const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  const items = await queryRows<RowDataPacket & ManagerHistoryRow>(
    `
    SELECT
      emp_no,
      first_name,
      last_name,
      gender,
      hire_date,
      dept_no,
      dept_name,
      from_date,
      to_date
    FROM v_department_managers
    ORDER BY dept_no, from_date DESC, emp_no
    LIMIT ? OFFSET ?
    `,
    [pageSize, offset]
  );

  return { items, page, pageSize, total, totalPages };
}

export async function searchEmployeesByLastNamePrefix(input: {
  lastNamePrefix: string;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<EmployeeNameRow>> {
  const lastNamePrefix = input.lastNamePrefix.trim();
  const { page, pageSize, offset } = normalizePagination({ page: input.page, pageSize: input.pageSize });

  if (!lastNamePrefix) {
    return { items: [], page, pageSize, total: 0, totalPages: 1 };
  }

  const like = `${lastNamePrefix}%`;

  const countRow = await queryOne<CountRow>(
    `
    SELECT COUNT(*) AS total
    FROM employees
    WHERE last_name LIKE ?
    `,
    [like]
  );

  const total = Number(countRow?.total ?? 0);
  const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

  const items = await queryRows<RowDataPacket & EmployeeNameRow>(
    `
    SELECT emp_no, first_name, last_name, hire_date
    FROM employees
    WHERE last_name LIKE ?
    ORDER BY last_name, emp_no
    LIMIT ? OFFSET ?
    `,
    [like, pageSize, offset]
  );

  return { items, page, pageSize, total, totalPages };
}

