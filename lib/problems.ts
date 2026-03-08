export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
export type Category = 'SELECT' | 'WHERE' | 'JOIN' | 'GROUP BY' | 'SUBQUERY' | 'CTE' | 'WINDOW' | 'AGGREGATE' | 'DATE' | 'STRING'

export type Problem = {
  id: number
  title: string
  difficulty: Difficulty
  category: Category
  description: string
  tables: string[]
  hint: string
  solution: string
  expectedColumns: string[]
}

// ──────────────────────────────────────────────
// 5 TABLES (used across all problems)
// ──────────────────────────────────────────────
// employees(id, name, department_id, salary, hire_date, manager_id, email, status)
// departments(id, name, budget, location, created_at)
// orders(id, customer_id, employee_id, total_amount, status, order_date, shipped_date)
// customers(id, name, email, city, country, tier, joined_at)
// products(id, name, category, price, stock_qty, supplier_id, created_at)

export const SCHEMA_SQL = `
-- Run this in your Supabase SQL editor to create the tables

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  budget NUMERIC(12,2),
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INTEGER REFERENCES departments(id),
  salary NUMERIC(10,2),
  hire_date DATE,
  manager_id INTEGER REFERENCES employees(id),
  email TEXT UNIQUE,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  city TEXT,
  country TEXT,
  tier TEXT DEFAULT 'standard',
  joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  employee_id INTEGER REFERENCES employees(id),
  total_amount NUMERIC(10,2),
  status TEXT DEFAULT 'pending',
  order_date TIMESTAMP DEFAULT NOW(),
  shipped_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  price NUMERIC(10,2),
  stock_qty INTEGER DEFAULT 0,
  supplier_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── SEED DATA ──────────────────────────────────
INSERT INTO departments (name, budget, location) VALUES
  ('Engineering', 1200000, 'San Francisco'),
  ('Sales', 800000, 'New York'),
  ('Marketing', 600000, 'Austin'),
  ('HR', 400000, 'Chicago'),
  ('Finance', 900000, 'Boston')
ON CONFLICT DO NOTHING;

INSERT INTO employees (name, department_id, salary, hire_date, email, status) VALUES
  ('Alice Chen',      1, 125000, '2019-03-15', 'alice@corp.com',   'active'),
  ('Bob Martinez',    2,  85000, '2020-07-01', 'bob@corp.com',     'active'),
  ('Carol White',     1, 140000, '2017-11-20', 'carol@corp.com',   'active'),
  ('David Kim',       3,  72000, '2021-02-14', 'david@corp.com',   'active'),
  ('Eva Johansson',   4,  68000, '2022-06-30', 'eva@corp.com',     'active'),
  ('Frank Osei',      5, 110000, '2018-09-05', 'frank@corp.com',   'active'),
  ('Grace Liu',       1, 118000, '2020-01-10', 'grace@corp.com',   'active'),
  ('Henry Brown',     2,  79000, '2021-08-22', 'henry@corp.com',   'inactive'),
  ('Isla Patel',      3,  76000, '2019-12-01', 'isla@corp.com',    'active'),
  ('Jack Nguyen',     1, 132000, '2016-04-18', 'jack@corp.com',    'active')
ON CONFLICT DO NOTHING;

INSERT INTO customers (name, email, city, country, tier) VALUES
  ('Acme Corp',      'acme@acme.com',      'New York',    'USA',    'gold'),
  ('Beta LLC',       'info@beta.com',      'London',      'UK',     'silver'),
  ('Gamma Inc',      'hello@gamma.io',     'Berlin',      'DE',     'standard'),
  ('Delta Co',       'ops@delta.net',      'Tokyo',       'JP',     'gold'),
  ('Epsilon GmbH',   'info@epsilon.de',    'Munich',      'DE',     'silver'),
  ('Zeta Partners',  'zeta@zeta.co',       'Sydney',      'AU',     'standard'),
  ('Eta Solutions',  'eta@eta.com',        'Toronto',     'CA',     'gold'),
  ('Theta Tech',     'hi@theta.io',        'Singapore',   'SG',     'silver'),
  ('Iota Services',  'iota@iota.biz',      'Paris',       'FR',     'standard'),
  ('Kappa Digital',  'kappa@kappa.com',    'New York',    'USA',    'gold')
ON CONFLICT DO NOTHING;

INSERT INTO orders (customer_id, employee_id, total_amount, status, order_date, shipped_date) VALUES
  (1, 2, 15400.00, 'delivered', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
  (2, 2, 8200.50,  'delivered', NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days'),
  (3, 4, 3100.00,  'shipped',   NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
  (4, 2, 22000.00, 'delivered', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
  (5, 4, 4500.75,  'pending',   NOW() - INTERVAL '2 days',  NULL),
  (1, 7, 9800.00,  'delivered', NOW() - INTERVAL '60 days', NOW() - INTERVAL '55 days'),
  (6, 2, 1200.00,  'cancelled', NOW() - INTERVAL '15 days', NULL),
  (7, 7, 33000.00, 'delivered', NOW() - INTERVAL '90 days', NOW() - INTERVAL '85 days'),
  (8, 4, 7600.25,  'shipped',   NOW() - INTERVAL '7 days',  NOW() - INTERVAL '3 days'),
  (9, 2, 2900.00,  'pending',   NOW() - INTERVAL '1 day',   NULL),
  (10,7, 18500.00, 'delivered', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
  (2, 2, 5100.00,  'delivered', NOW() - INTERVAL '35 days', NOW() - INTERVAL '30 days')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, category, price, stock_qty, supplier_id) VALUES
  ('Laptop Pro 15',      'Electronics',  1299.99, 45,  1),
  ('Wireless Mouse',     'Electronics',    29.99, 200, 1),
  ('Standing Desk',      'Furniture',     599.00, 12,  2),
  ('Ergonomic Chair',    'Furniture',     899.00, 8,   2),
  ('Monitor 4K 27"',     'Electronics',   649.99, 30,  1),
  ('Notebook Set',       'Stationery',     12.99, 500, 3),
  ('USB-C Hub',          'Electronics',    49.99, 150, 1),
  ('Whiteboard Large',   'Office',        189.00, 20,  3),
  ('Coffee Maker Pro',   'Appliances',    249.99, 15,  4),
  ('Headphones ANC',     'Electronics',   299.99, 60,  1)
ON CONFLICT DO NOTHING;
`

export const PROBLEMS: Problem[] = [
  // ── BEGINNER: SELECT ──────────────────────────
  {
    id: 1,
    title: 'All Active Employees',
    difficulty: 'BEGINNER',
    category: 'SELECT',
    description: 'Retrieve the name, email, and salary of all employees whose status is `active`. Order by salary descending.',
    tables: ['employees'],
    hint: 'Use WHERE to filter by status and ORDER BY ... DESC for sorting.',
    solution: `SELECT name, email, salary
FROM employees
WHERE status = 'active'
ORDER BY salary DESC;`,
    expectedColumns: ['name', 'email', 'salary'],
  },
  {
    id: 2,
    title: 'Products Under $100',
    difficulty: 'BEGINNER',
    category: 'WHERE',
    description: 'Find all products priced under $100. Return the product name, category, and price. Sort by price ascending.',
    tables: ['products'],
    hint: 'Filter with price < 100 and ORDER BY price ASC.',
    solution: `SELECT name, category, price
FROM products
WHERE price < 100
ORDER BY price ASC;`,
    expectedColumns: ['name', 'category', 'price'],
  },
  {
    id: 3,
    title: 'Gold Tier Customers',
    difficulty: 'BEGINNER',
    category: 'SELECT',
    description: 'List all customers in the `gold` tier. Show their name, city, country, and email.',
    tables: ['customers'],
    hint: 'Simple WHERE tier = \'gold\'.',
    solution: `SELECT name, city, country, email
FROM customers
WHERE tier = 'gold';`,
    expectedColumns: ['name', 'city', 'country', 'email'],
  },
  {
    id: 4,
    title: 'High-Value Orders',
    difficulty: 'BEGINNER',
    category: 'WHERE',
    description: 'Show all orders with a total_amount greater than $10,000. Include order id, total_amount, status, and order_date.',
    tables: ['orders'],
    hint: 'Filter total_amount > 10000.',
    solution: `SELECT id, total_amount, status, order_date
FROM orders
WHERE total_amount > 10000
ORDER BY total_amount DESC;`,
    expectedColumns: ['id', 'total_amount', 'status', 'order_date'],
  },

  // ── BEGINNER: AGGREGATE ───────────────────────
  {
    id: 5,
    title: 'Count Employees Per Department',
    difficulty: 'BEGINNER',
    category: 'GROUP BY',
    description: 'How many employees does each department have? Show department_id and employee count. Order by count descending.',
    tables: ['employees'],
    hint: 'GROUP BY department_id and use COUNT(*).',
    solution: `SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
ORDER BY employee_count DESC;`,
    expectedColumns: ['department_id', 'employee_count'],
  },
  {
    id: 6,
    title: 'Average Salary Per Department',
    difficulty: 'BEGINNER',
    category: 'AGGREGATE',
    description: 'Calculate the average salary for each department_id. Round to 2 decimal places. Order by avg_salary descending.',
    tables: ['employees'],
    hint: 'Use AVG() with ROUND() and GROUP BY.',
    solution: `SELECT department_id, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department_id
ORDER BY avg_salary DESC;`,
    expectedColumns: ['department_id', 'avg_salary'],
  },
  {
    id: 7,
    title: 'Total Revenue by Status',
    difficulty: 'BEGINNER',
    category: 'AGGREGATE',
    description: 'What is the total order amount grouped by order status? Show status and total_revenue.',
    tables: ['orders'],
    hint: 'SUM(total_amount) grouped by status.',
    solution: `SELECT status, SUM(total_amount) AS total_revenue
FROM orders
GROUP BY status
ORDER BY total_revenue DESC;`,
    expectedColumns: ['status', 'total_revenue'],
  },

  // ── INTERMEDIATE: JOIN ────────────────────────
  {
    id: 8,
    title: 'Employee + Department Name',
    difficulty: 'INTERMEDIATE',
    category: 'JOIN',
    description: 'List each employee\'s name, their department name, and their salary. Use an INNER JOIN. Order alphabetically by employee name.',
    tables: ['employees', 'departments'],
    hint: 'JOIN employees e ON e.department_id = departments.id.',
    solution: `SELECT e.name AS employee_name, d.name AS department_name, e.salary
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.name;`,
    expectedColumns: ['employee_name', 'department_name', 'salary'],
  },
  {
    id: 9,
    title: 'Orders with Customer Names',
    difficulty: 'INTERMEDIATE',
    category: 'JOIN',
    description: 'Show each order\'s ID, the customer\'s name, total_amount, and status. Only include delivered orders.',
    tables: ['orders', 'customers'],
    hint: 'JOIN on customer_id, then filter WHERE status = \'delivered\'.',
    solution: `SELECT o.id, c.name AS customer_name, o.total_amount, o.status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'delivered'
ORDER BY o.total_amount DESC;`,
    expectedColumns: ['id', 'customer_name', 'total_amount', 'status'],
  },
  {
    id: 10,
    title: 'Departments with No Pending Orders',
    difficulty: 'INTERMEDIATE',
    category: 'JOIN',
    description: 'Find departments where none of the employees have placed a pending order. Return the department name.',
    tables: ['departments', 'employees', 'orders'],
    hint: 'Think LEFT JOIN + WHERE IS NULL, or use NOT IN / NOT EXISTS.',
    solution: `SELECT d.name AS department_name
FROM departments d
WHERE d.id NOT IN (
  SELECT DISTINCT e.department_id
  FROM employees e
  INNER JOIN orders o ON e.id = o.employee_id
  WHERE o.status = 'pending'
    AND e.department_id IS NOT NULL
);`,
    expectedColumns: ['department_name'],
  },
  {
    id: 11,
    title: 'Top Customer per Country',
    difficulty: 'INTERMEDIATE',
    category: 'JOIN',
    description: 'For each country, find the customer with the highest total order amount. Show country, customer name, and total spent.',
    tables: ['customers', 'orders'],
    hint: 'Aggregate orders by customer, then find the max per country using a subquery or CTE.',
    solution: `WITH customer_totals AS (
  SELECT c.id, c.name, c.country,
         SUM(o.total_amount) AS total_spent
  FROM customers c
  INNER JOIN orders o ON c.id = o.customer_id
  GROUP BY c.id, c.name, c.country
),
ranked AS (
  SELECT *, RANK() OVER (PARTITION BY country ORDER BY total_spent DESC) AS rnk
  FROM customer_totals
)
SELECT country, name AS customer_name, total_spent
FROM ranked
WHERE rnk = 1
ORDER BY total_spent DESC;`,
    expectedColumns: ['country', 'customer_name', 'total_spent'],
  },

  // ── INTERMEDIATE: SUBQUERY ────────────────────
  {
    id: 12,
    title: 'Employees Above Avg Salary',
    difficulty: 'INTERMEDIATE',
    category: 'SUBQUERY',
    description: 'Find all employees whose salary is above the company-wide average salary. Show name, salary, and department_id.',
    tables: ['employees'],
    hint: 'Use a scalar subquery in the WHERE clause: WHERE salary > (SELECT AVG(salary) FROM employees).',
    solution: `SELECT name, salary, department_id
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;`,
    expectedColumns: ['name', 'salary', 'department_id'],
  },
  {
    id: 13,
    title: 'Customers Who Never Ordered',
    difficulty: 'INTERMEDIATE',
    category: 'SUBQUERY',
    description: 'List customers who have never placed an order. Return their name and email.',
    tables: ['customers', 'orders'],
    hint: 'Use NOT EXISTS or NOT IN with a subquery on orders.',
    solution: `SELECT name, email
FROM customers
WHERE id NOT IN (
  SELECT DISTINCT customer_id FROM orders
);`,
    expectedColumns: ['name', 'email'],
  },
  {
    id: 14,
    title: 'Products More Expensive Than Category Avg',
    difficulty: 'INTERMEDIATE',
    category: 'SUBQUERY',
    description: 'Find products priced above the average price of their own category. Show product name, category, price, and the category average.',
    tables: ['products'],
    hint: 'Use a correlated subquery in the WHERE clause referencing the outer query\'s category.',
    solution: `SELECT p.name, p.category, p.price,
       ROUND((SELECT AVG(p2.price) FROM products p2 WHERE p2.category = p.category), 2) AS category_avg
FROM products p
WHERE p.price > (SELECT AVG(p2.price) FROM products p2 WHERE p2.category = p.category)
ORDER BY p.category, p.price DESC;`,
    expectedColumns: ['name', 'category', 'price', 'category_avg'],
  },

  // ── INTERMEDIATE: CTE ─────────────────────────
  {
    id: 15,
    title: 'Department Budget vs Payroll',
    difficulty: 'INTERMEDIATE',
    category: 'CTE',
    description: 'Using a CTE, calculate total payroll per department and compare it against the department\'s budget. Show department name, total_payroll, budget, and the difference (budget - payroll).',
    tables: ['departments', 'employees'],
    hint: 'CTE calculates SUM(salary) per dept, then JOIN to departments.',
    solution: `WITH dept_payroll AS (
  SELECT department_id, SUM(salary) AS total_payroll
  FROM employees
  GROUP BY department_id
)
SELECT d.name AS department,
       dp.total_payroll,
       d.budget,
       d.budget - dp.total_payroll AS remaining_budget
FROM departments d
INNER JOIN dept_payroll dp ON d.id = dp.department_id
ORDER BY remaining_budget DESC;`,
    expectedColumns: ['department', 'total_payroll', 'budget', 'remaining_budget'],
  },
  {
    id: 16,
    title: 'Monthly Order Revenue CTE',
    difficulty: 'INTERMEDIATE',
    category: 'CTE',
    description: 'Write a CTE that extracts the year and month from order_date, then compute total revenue and order count per month.',
    tables: ['orders'],
    hint: 'Use EXTRACT(YEAR FROM order_date) and EXTRACT(MONTH FROM order_date) inside the CTE.',
    solution: `WITH monthly AS (
  SELECT
    EXTRACT(YEAR  FROM order_date)::INT AS yr,
    EXTRACT(MONTH FROM order_date)::INT AS mo,
    COUNT(*) AS order_count,
    SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY yr, mo
)
SELECT yr, mo, order_count, total_revenue
FROM monthly
ORDER BY yr, mo;`,
    expectedColumns: ['yr', 'mo', 'order_count', 'total_revenue'],
  },

  // ── ADVANCED: WINDOW FUNCTIONS ────────────────
  {
    id: 17,
    title: 'Salary Rank Within Department',
    difficulty: 'ADVANCED',
    category: 'WINDOW',
    description: 'Rank each employee by salary within their department (highest = rank 1). Show employee name, department_id, salary, and their rank.',
    tables: ['employees'],
    hint: 'RANK() OVER (PARTITION BY department_id ORDER BY salary DESC).',
    solution: `SELECT name, department_id, salary,
       RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank
FROM employees
ORDER BY department_id, salary_rank;`,
    expectedColumns: ['name', 'department_id', 'salary', 'salary_rank'],
  },
  {
    id: 18,
    title: 'Running Total of Orders',
    difficulty: 'ADVANCED',
    category: 'WINDOW',
    description: 'Calculate a running total of total_amount ordered by order_date. Show order id, order_date, total_amount, and the cumulative total.',
    tables: ['orders'],
    hint: 'SUM() OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).',
    solution: `SELECT id, order_date, total_amount,
       SUM(total_amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders
ORDER BY order_date;`,
    expectedColumns: ['id', 'order_date', 'total_amount', 'running_total'],
  },
  {
    id: 19,
    title: 'Lead & Lag: Order Gaps',
    difficulty: 'ADVANCED',
    category: 'WINDOW',
    description: 'For each order (ordered by order_date), show the previous order\'s total_amount (lag) and the next order\'s total_amount (lead). Include order id, total_amount, prev_amount, next_amount.',
    tables: ['orders'],
    hint: 'LAG(total_amount) OVER (ORDER BY order_date) and LEAD(total_amount) OVER (ORDER BY order_date).',
    solution: `SELECT id, total_amount, order_date,
       LAG(total_amount)  OVER (ORDER BY order_date) AS prev_amount,
       LEAD(total_amount) OVER (ORDER BY order_date) AS next_amount
FROM orders
ORDER BY order_date;`,
    expectedColumns: ['id', 'total_amount', 'order_date', 'prev_amount', 'next_amount'],
  },
  {
    id: 20,
    title: 'NTILE Salary Quartiles',
    difficulty: 'ADVANCED',
    category: 'WINDOW',
    description: 'Divide employees into 4 salary quartiles company-wide. Show name, salary, and quartile (1 = lowest, 4 = highest).',
    tables: ['employees'],
    hint: 'NTILE(4) OVER (ORDER BY salary ASC).',
    solution: `SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary ASC) AS salary_quartile
FROM employees
ORDER BY salary_quartile, salary;`,
    expectedColumns: ['name', 'salary', 'salary_quartile'],
  },
  {
    id: 21,
    title: 'First Order Per Customer',
    difficulty: 'ADVANCED',
    category: 'WINDOW',
    description: 'Find each customer\'s very first order. Show customer_id, order_id, total_amount, and order_date.',
    tables: ['orders'],
    hint: 'ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) = 1.',
    solution: `WITH numbered AS (
  SELECT *,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date ASC) AS rn
  FROM orders
)
SELECT customer_id, id AS order_id, total_amount, order_date
FROM numbered
WHERE rn = 1
ORDER BY order_date;`,
    expectedColumns: ['customer_id', 'order_id', 'total_amount', 'order_date'],
  },

  // ── EXPERT ────────────────────────────────────
  {
    id: 22,
    title: 'Percentile Salary by Dept',
    difficulty: 'EXPERT',
    category: 'WINDOW',
    description: 'For each department, compute the 25th, 50th (median), and 75th salary percentiles. Use PERCENTILE_CONT. Show department_id and each percentile.',
    tables: ['employees'],
    hint: 'PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY salary) ... GROUP BY department_id.',
    solution: `SELECT department_id,
       PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY salary) AS p25,
       PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY salary) AS median,
       PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY salary) AS p75
FROM employees
GROUP BY department_id
ORDER BY department_id;`,
    expectedColumns: ['department_id', 'p25', 'median', 'p75'],
  },
  {
    id: 23,
    title: 'Employee Tenure in Years',
    difficulty: 'INTERMEDIATE',
    category: 'DATE',
    description: 'Calculate each employee\'s tenure in full years from hire_date to today. Show name, hire_date, and tenure_years. Order by longest tenure first.',
    tables: ['employees'],
    hint: 'Use EXTRACT(YEAR FROM AGE(NOW(), hire_date)) or DATE_PART.',
    solution: `SELECT name, hire_date,
       EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date))::INT AS tenure_years
FROM employees
ORDER BY tenure_years DESC;`,
    expectedColumns: ['name', 'hire_date', 'tenure_years'],
  },
  {
    id: 24,
    title: 'Shipping Delay Analysis',
    difficulty: 'INTERMEDIATE',
    category: 'DATE',
    description: 'For delivered orders, calculate the number of days between order_date and shipped_date. Show order id, customer_id, and days_to_ship. Order by slowest first.',
    tables: ['orders'],
    hint: 'EXTRACT(DAY FROM (shipped_date - order_date)) or use DATE_PART.',
    solution: `SELECT id, customer_id,
       ROUND(EXTRACT(EPOCH FROM (shipped_date - order_date)) / 86400, 1) AS days_to_ship
FROM orders
WHERE status = 'delivered'
  AND shipped_date IS NOT NULL
ORDER BY days_to_ship DESC;`,
    expectedColumns: ['id', 'customer_id', 'days_to_ship'],
  },
  {
    id: 25,
    title: 'Employee Name Initials',
    difficulty: 'BEGINNER',
    category: 'STRING',
    description: 'Extract initials from each employee\'s full name (e.g., "Alice Chen" → "A.C."). Show the employee name and their initials.',
    tables: ['employees'],
    hint: 'Use SPLIT_PART, LEFT, or string functions to extract first letters. You can use SUBSTRING and POSITION.',
    solution: `SELECT name,
       LEFT(name, 1) || '.' || LEFT(SPLIT_PART(name, ' ', 2), 1) || '.' AS initials
FROM employees
ORDER BY name;`,
    expectedColumns: ['name', 'initials'],
  },
  {
    id: 26,
    title: 'Email Domain Analysis',
    difficulty: 'INTERMEDIATE',
    category: 'STRING',
    description: 'Extract the domain from each employee\'s email. Count how many employees share each domain. Show domain and employee_count.',
    tables: ['employees'],
    hint: 'SPLIT_PART(email, \'@\', 2) extracts the domain. GROUP BY domain.',
    solution: `SELECT SPLIT_PART(email, '@', 2) AS domain,
       COUNT(*) AS employee_count
FROM employees
GROUP BY domain
ORDER BY employee_count DESC;`,
    expectedColumns: ['domain', 'employee_count'],
  },
  {
    id: 27,
    title: 'Self-Join: Manager Names',
    difficulty: 'ADVANCED',
    category: 'JOIN',
    description: 'Show each employee\'s name alongside their manager\'s name. Employees without a manager should still appear (use LEFT JOIN). Show employee_name and manager_name.',
    tables: ['employees'],
    hint: 'Self-join: FROM employees e LEFT JOIN employees m ON e.manager_id = m.id.',
    solution: `SELECT e.name AS employee_name,
       m.name AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;`,
    expectedColumns: ['employee_name', 'manager_name'],
  },
  {
    id: 28,
    title: 'CASE: Salary Bands',
    difficulty: 'INTERMEDIATE',
    category: 'SELECT',
    description: 'Classify each employee into a salary band: "Junior" (<80k), "Mid" (80k–110k), "Senior" (>110k). Show name, salary, and band.',
    tables: ['employees'],
    hint: 'Use a CASE WHEN expression.',
    solution: `SELECT name, salary,
       CASE
         WHEN salary < 80000  THEN 'Junior'
         WHEN salary <= 110000 THEN 'Mid'
         ELSE 'Senior'
       END AS salary_band
FROM employees
ORDER BY salary;`,
    expectedColumns: ['name', 'salary', 'salary_band'],
  },
  {
    id: 29,
    title: 'HAVING: Dept Avg Above 90k',
    difficulty: 'INTERMEDIATE',
    category: 'GROUP BY',
    description: 'Find departments where the average salary exceeds $90,000. Show department_id and avg_salary.',
    tables: ['employees'],
    hint: 'Use GROUP BY + HAVING AVG(salary) > 90000.',
    solution: `SELECT department_id, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 90000
ORDER BY avg_salary DESC;`,
    expectedColumns: ['department_id', 'avg_salary'],
  },
  {
    id: 30,
    title: 'Dense Rank: Order Amounts',
    difficulty: 'ADVANCED',
    category: 'WINDOW',
    description: 'Using DENSE_RANK, rank all orders by total_amount descending. Show order id, customer_id, total_amount, and dense_rank.',
    tables: ['orders'],
    hint: 'DENSE_RANK() OVER (ORDER BY total_amount DESC).',
    solution: `SELECT id, customer_id, total_amount,
       DENSE_RANK() OVER (ORDER BY total_amount DESC) AS amount_rank
FROM orders
ORDER BY amount_rank;`,
    expectedColumns: ['id', 'customer_id', 'total_amount', 'amount_rank'],
  },
]

// Deterministic daily problem selection based on date
export function getDailyProblem(dateStr: string): Problem {
  // Use date as seed for reproducible daily selection
  const seed = dateStr.split('-').reduce((acc, n) => acc + parseInt(n), 0)
  const index = seed % PROBLEMS.length
  return PROBLEMS[index]
}

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  BEGINNER:     'text-dojo-green  border-dojo-green/30  bg-dojo-green/10',
  INTERMEDIATE: 'text-dojo-yellow border-dojo-yellow/30 bg-dojo-yellow/10',
  ADVANCED:     'text-dojo-orange border-dojo-orange/30 bg-dojo-orange/10',
  EXPERT:       'text-dojo-red    border-dojo-red/30    bg-dojo-red/10',
}

export const CATEGORY_COLOR: Record<Category, string> = {
  SELECT:    'text-dojo-blue',
  WHERE:     'text-dojo-blue',
  JOIN:      'text-dojo-purple',
  'GROUP BY':'text-dojo-yellow',
  SUBQUERY:  'text-dojo-orange',
  CTE:       'text-dojo-orange',
  WINDOW:    'text-dojo-red',
  AGGREGATE: 'text-dojo-yellow',
  DATE:      'text-dojo-green',
  STRING:    'text-dojo-green',
}
