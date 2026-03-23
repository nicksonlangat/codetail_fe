import type { ChallengeContent } from "@/types/challenge";

export const sqlChallenges: Record<string, ChallengeContent> = {
  "sql-1": {
    problemId: "sql-1",
    title: "Filtering & Sorting Results",
    type: "mcq",
    description: "You have a `products` table with columns: `id`, `name`, `price`, `category`, `created_at`.\n\nYou want to find all products in the 'Electronics' category that cost more than $100, sorted by price descending.\n\nWhich query is correct?",
    requirements: [
      "Filter by category AND price condition",
      "Sort results by price in descending order",
      "Use proper SQL syntax and clause ordering",
    ],
    hints: [
      "WHERE comes before ORDER BY",
      "AND combines multiple conditions in a WHERE clause",
      "DESC keyword reverses the default ascending sort",
    ],
    starterCode: "",
    options: [
      { id: "a", label: "Option A", code: "SELECT * FROM products ORDER BY price DESC WHERE category = 'Electronics' AND price > 100;" },
      { id: "b", label: "Option B", code: "SELECT * FROM products WHERE category = 'Electronics' AND price > 100 ORDER BY price DESC;" },
      { id: "c", label: "Option C", code: "SELECT * FROM products WHERE category = 'Electronics' OR price > 100 ORDER BY price DESC;" },
      { id: "d", label: "Option D", code: "SELECT * FROM products HAVING category = 'Electronics' AND price > 100 ORDER BY price DESC;" },
    ],
    correctOptionId: "b",
    explanation: "The correct clause order is SELECT → FROM → WHERE → ORDER BY. Option A puts ORDER BY before WHERE (syntax error). Option C uses OR instead of AND, returning products that match either condition. Option D uses HAVING without GROUP BY — HAVING is for filtering aggregate results, not row-level conditions.",
  },

  "sql-2": {
    problemId: "sql-2",
    title: "Write a JOIN Query",
    type: "code",
    description: "Given two tables — `orders` and `customers` — write a query that returns each order alongside the customer's name and email.\n\n**Schema:**\n```sql\ncustomers(id, name, email, created_at)\norders(id, customer_id, total, status, placed_at)\n```\n\nYour query should also include orders from the last 30 days only, sorted by most recent first.",
    requirements: [
      "Use an INNER JOIN between orders and customers on customer_id",
      "Select order id, total, status, customer name, and customer email",
      "Filter to orders placed within the last 30 days",
      "Order by placed_at descending",
    ],
    hints: [
      "JOIN ... ON connects the foreign key to the primary key",
      "Use NOW() - INTERVAL '30 days' for PostgreSQL date arithmetic",
      "Table aliases (o, c) make the query more readable",
    ],
    starterCode: `-- Write your query below
SELECT
    ___
FROM orders o
    ___ customers c ON ___
WHERE ___
ORDER BY ___;`,
    exampleOutput: `-- Expected output columns:
-- order_id | total | status | customer_name | customer_email
-- 142      | 89.99 | shipped | Alice Chen   | alice@example.com
-- 139      | 24.50 | pending | Bob Park     | bob@example.com`,
  },

  "sql-3": {
    problemId: "sql-3",
    title: "Aggregation & GROUP BY",
    type: "code",
    description: "You're analysing sales data. Write a query that shows total revenue and order count per category for the current year, but only for categories with more than $1,000 in revenue.\n\n**Schema:**\n```sql\nproducts(id, name, category, price)\norder_items(id, order_id, product_id, quantity)\norders(id, placed_at, status)\n```",
    requirements: [
      "JOIN order_items with products to get category and price",
      "JOIN with orders to filter by date",
      "Use SUM(price * quantity) for revenue and COUNT(DISTINCT order_id) for order count",
      "GROUP BY category",
      "Use HAVING to filter categories with revenue > 1000",
      "Order by revenue descending",
    ],
    hints: [
      "HAVING filters after aggregation — WHERE filters before",
      "COUNT(DISTINCT ...) avoids double-counting orders with multiple items",
      "EXTRACT(YEAR FROM placed_at) = EXTRACT(YEAR FROM NOW()) filters current year",
    ],
    starterCode: `-- Revenue & order count per category (current year, > $1000 revenue)
SELECT
    ___,
    ___ AS total_revenue,
    ___ AS order_count
FROM order_items oi
    JOIN ___ ON ___
    JOIN ___ ON ___
WHERE ___
GROUP BY ___
HAVING ___
ORDER BY ___;`,
    exampleOutput: `-- category    | total_revenue | order_count
-- Electronics | 45230.00      | 312
-- Clothing    | 12840.50      | 198
-- Books       | 3210.75       | 89`,
  },

  "sql-4": {
    problemId: "sql-4",
    title: "Subqueries vs CTEs",
    type: "mcq",
    description: "You want to find customers whose total spending is above the average total spending across all customers.\n\nWhich approach is considered the most readable and maintainable?",
    requirements: [
      "Understand the difference between subqueries and CTEs",
      "Consider readability and reusability",
      "Think about how each approach composes in complex queries",
    ],
    hints: [
      "CTEs (WITH clause) let you name intermediate results",
      "Subqueries can be nested but become hard to read when deep",
      "CTEs can reference each other, subqueries cannot",
    ],
    starterCode: "",
    options: [
      {
        id: "a",
        label: "Nested subquery",
        code: "SELECT * FROM customers WHERE id IN (SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(total) > (SELECT AVG(total_spend) FROM (SELECT SUM(total) AS total_spend FROM orders GROUP BY customer_id) t));",
      },
      {
        id: "b",
        label: "CTE approach",
        code: "WITH customer_totals AS (\n  SELECT customer_id, SUM(total) AS total_spend\n  FROM orders GROUP BY customer_id\n),\navg_spend AS (\n  SELECT AVG(total_spend) AS avg_total FROM customer_totals\n)\nSELECT c.* FROM customers c\nJOIN customer_totals ct ON c.id = ct.customer_id\nWHERE ct.total_spend > (SELECT avg_total FROM avg_spend);",
      },
      {
        id: "c",
        label: "Correlated subquery",
        code: "SELECT * FROM customers c WHERE (SELECT SUM(total) FROM orders WHERE customer_id = c.id) > (SELECT AVG(total) FROM orders);",
      },
      {
        id: "d",
        label: "HAVING only",
        code: "SELECT customer_id FROM orders GROUP BY customer_id HAVING SUM(total) > AVG(total);",
      },
    ],
    correctOptionId: "b",
    explanation: "CTEs (Common Table Expressions) break complex queries into named, readable steps. The nested subquery (A) works but is hard to debug and maintain. The correlated subquery (C) re-executes per row — slow on large tables. Option D compares each customer's total against the per-group average, not the global average — logically wrong. CTEs are the standard for production SQL readability.",
  },

  "sql-5": {
    problemId: "sql-5",
    title: "Window Functions for Ranking",
    type: "code",
    description: "Write a query that ranks employees by salary within each department, and also shows the difference between each employee's salary and their department's average.\n\n**Schema:**\n```sql\nemployees(id, name, department, salary, hire_date)\n```\n\nThis is a classic analytics query pattern used in dashboards and reporting.",
    requirements: [
      "Use ROW_NUMBER() or RANK() to rank employees by salary within each department",
      "Use AVG() as a window function to compute per-department average",
      "Calculate the difference between each employee's salary and department average",
      "Include employee name, department, salary, rank, and salary difference",
      "Order output by department, then by rank",
    ],
    hints: [
      "PARTITION BY defines the window (group) for window functions",
      "ROW_NUMBER() gives unique ranks; RANK() gives ties the same rank",
      "AVG(salary) OVER (PARTITION BY department) computes per-department average without GROUP BY",
      "You can use multiple window functions in the same SELECT",
    ],
    starterCode: `-- Rank employees by salary within department + show salary vs avg
SELECT
    name,
    department,
    salary,
    ___ AS dept_rank,
    ___ AS dept_avg_salary,
    ___ AS diff_from_avg
FROM employees
ORDER BY ___;`,
    exampleOutput: `-- name       | department  | salary | dept_rank | dept_avg_salary | diff_from_avg
-- Alice      | Engineering | 145000 | 1         | 120000.00       | 25000.00
-- Bob        | Engineering | 130000 | 2         | 120000.00       | 10000.00
-- Charlie    | Engineering | 85000  | 3         | 120000.00       | -35000.00
-- Diana      | Marketing   | 95000  | 1         | 82500.00        | 12500.00
-- Eve        | Marketing   | 70000  | 2         | 82500.00        | -12500.00`,
  },
};
