export type Gender = 'M' | 'F';

export type DashboardStats = {
  totalEmployees: number;
  totalDepartments: number;
  avgCurrentSalary: number | null;
};

export type EmployeeListItem = {
  emp_no: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  hire_date: string;
  current_salary: number | null;
  current_title: string | null;
  dept_no: string | null;
  dept_name: string | null;
};

export type SalaryRow = {
  salary: number;
  from_date: string;
  to_date: string;
};

export type TitleRow = {
  title: string;
  from_date: string;
  to_date: string;
};

export type DeptHistoryRow = {
  dept_no: string;
  dept_name: string;
  from_date: string;
  to_date: string;
};

export type EmployeeDetail = {
  employee: {
    emp_no: number;
    birth_date: string;
    first_name: string;
    last_name: string;
    gender: Gender;
    hire_date: string;
    current_salary: number | null;
    current_title: string | null;
    current_department: { dept_no: string; dept_name: string } | null;
  };
  salaryHistory: SalaryRow[];
  titleHistory: TitleRow[];
  deptHistory: DeptHistoryRow[];
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ManagerHistoryRow = {
  emp_no: number;
  first_name: string;
  last_name: string;
  gender: Gender;
  hire_date: string;
  dept_no: string;
  dept_name: string;
  from_date: string;
  to_date: string;
};

export type EmployeeNameRow = {
  emp_no: number;
  first_name: string;
  last_name: string;
  hire_date: string;
};

