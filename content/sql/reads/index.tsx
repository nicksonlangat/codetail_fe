import type { ReactNode } from "react";
import { CodeBlock } from "@/components/blog/interactive/code-block";

const IC = ({ children }: { children: string }) => (
  <code className="font-mono text-[13px] bg-brand-surface px-1.5 py-0.5 rounded">{children}</code>
);

const Box = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="bg-white border border-brand-border rounded-xl p-4 mb-6">
    <p className="text-[9px] uppercase tracking-wider text-brand-text-subtle mb-3">{label}</p>
    {children}
  </div>
);

const Callout = ({ children }: { children: ReactNode }) => (
  <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3 mb-6 text-[14px] leading-relaxed text-brand-text/90">
    {children}
  </div>
);

function SelectSection() {
  return (
    <section>
      <h2 id="select" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        SELECT: choosing what to see
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every SQL query starts with <IC>SELECT</IC>. It is the simplest instruction you can give a
        database: here is what I want, go find it. The database reads the table you name, takes the
        columns you asked for, and hands them back.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The table we will use throughout this unit is <IC>employees</IC>, with 28 rows and seven
        columns: <IC>id</IC>, <IC>name</IC>, <IC>department</IC>, <IC>salary</IC>,{" "}
        <IC>hire_date</IC>, <IC>manager_id</IC>, and <IC>is_active</IC>.
      </p>
      <Box label="two ways to select from a table">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- The lazy way: grab every column
SELECT * FROM employees;

-- The deliberate way: name exactly what you need
SELECT name, department, salary
FROM employees;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>SELECT *</IC> is fine for exploration at a terminal. In production code, name your
        columns. When someone adds a new column to the table six months from now, <IC>SELECT *</IC>{" "}
        silently starts returning it and breaks any code that assumed a fixed column count or order.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You can rename a column in the output using <IC>AS</IC>. The original column in the table
        is unchanged. The alias only exists for this result.
      </p>
      <Box label="aliases make output readable">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT name,
       salary,
       is_active AS active
FROM employees;`}
        />
      </Box>
      <Callout>
        Rule: SELECT does not modify the table. It only reads. Nothing you write in a SELECT query
        can change or delete data. It is safe to experiment.
      </Callout>
    </section>
  );
}

function WhereSection() {
  return (
    <section>
      <h2 id="where" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        WHERE: keeping only the rows you care about
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Without a <IC>WHERE</IC> clause, <IC>SELECT</IC> returns every row in the table. That is
        rarely what you want. <IC>WHERE</IC> is the filter. It evaluates a condition for each row,
        and only the rows where the condition is <IC>TRUE</IC> make it into the result.
      </p>
      <Box label="filter to a specific department">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT name, salary
FROM employees
WHERE department = 'Engineering';

-- Returns 8 rows: only the Engineering employees`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The comparison operators you can use in a <IC>WHERE</IC> clause: <IC>=</IC> (equal),{" "}
        <IC>!=</IC> or <IC>&lt;&gt;</IC> (not equal), <IC>&lt;</IC>, <IC>&gt;</IC>,{" "}
        <IC>&lt;=</IC>, <IC>&gt;=</IC>. Numbers compare as you expect. Text comparison is
        case-sensitive in most databases.
      </p>
      <Box label="salary above a threshold">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT name, department, salary
FROM employees
WHERE salary > 100000
ORDER BY salary DESC;

-- Alice Chen: 120000
-- Tom Walsh: 115000
-- Henry Osei: 110000
-- Priya Singh: 108000`}
        />
      </Box>
      <Callout>
        The order of clauses matters. It is always: <IC>SELECT</IC> ... <IC>FROM</IC> ...{" "}
        <IC>WHERE</IC> ... <IC>ORDER BY</IC> ... <IC>LIMIT</IC>. Writing them in the wrong order
        is a syntax error.
      </Callout>
    </section>
  );
}

function AndOrSection() {
  return (
    <section>
      <h2 id="and-or" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        AND / OR: combining conditions
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A single condition is rarely enough. <IC>AND</IC> and <IC>OR</IC> let you stack conditions
        together.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>AND</IC> is strict: both conditions must be true for the row to survive.{" "}
        <IC>OR</IC> is generous: if either condition is true, the row makes it through.
      </p>
      <Box label="AND: both conditions must hold">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Active engineers earning at least 100k
SELECT name, salary
FROM employees
WHERE department = 'Engineering'
  AND salary >= 100000
  AND is_active = 1;

-- Returns: Alice Chen, Henry Osei, Priya Singh, Tom Walsh`}
        />
      </Box>
      <Box label="OR: either condition is enough">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Everyone in Design or Operations
SELECT name, department
FROM employees
WHERE department = 'Design'
   OR department = 'Operations'
ORDER BY department, name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you mix <IC>AND</IC> and <IC>OR</IC> in the same condition, <IC>AND</IC> is evaluated
        first, like multiplication before addition in maths. Use parentheses to be explicit and
        avoid surprises.
      </p>
      <Box label="parentheses make intent clear">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- WRONG: AND binds tighter, so this reads as:
-- active Engineers, OR anyone in Sales regardless of active status
WHERE is_active = 1 AND department = 'Engineering' OR department = 'Sales'

-- CORRECT: group the OR first with parentheses
WHERE is_active = 1
  AND (department = 'Engineering' OR department = 'Sales')`}
        />
      </Box>
    </section>
  );
}

function IsNullSection() {
  return (
    <section>
      <h2 id="is-null" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        IS NULL: finding the absent values
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>NULL</IC> means no value at all. Not zero, not an empty string. Nothing. In the
        employees table, <IC>manager_id</IC> is <IC>NULL</IC> for top-level staff who report to
        nobody.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The trap: you cannot compare <IC>NULL</IC> with <IC>=</IC>. Writing{" "}
        <IC>WHERE manager_id = NULL</IC> always returns zero rows. SQL evaluates any comparison
        involving <IC>NULL</IC> as <IC>UNKNOWN</IC>, never <IC>TRUE</IC>. Use{" "}
        <IC>IS NULL</IC> or <IC>IS NOT NULL</IC> instead.
      </p>
      <Box label="the right way to filter on NULL">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- WRONG: always 0 rows
SELECT name FROM employees WHERE manager_id = NULL;

-- CORRECT: returns the 4 top-level employees
SELECT name, department
FROM employees
WHERE manager_id IS NULL
ORDER BY name;
-- Alice Chen, Carol Thompson, Eve Nakamura, Grace Kim`}
        />
      </Box>
      <Box label="the inverse: everyone who has a manager">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT name, manager_id
FROM employees
WHERE manager_id IS NOT NULL
ORDER BY manager_id, name;`}
        />
      </Box>
      <Callout>
        Rule: any time you see unexpected empty results from a filter on a column that could contain
        NULL, switch from <IC>= NULL</IC> to <IC>IS NULL</IC>. This is one of the most common
        beginner mistakes in SQL.
      </Callout>
    </section>
  );
}

function InLikeBetweenSection() {
  return (
    <section>
      <h2 id="in-like-between" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        IN, LIKE, BETWEEN: shorthand for common filters
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Three operators exist purely to replace long chains of <IC>AND</IC>/<IC>OR</IC> with
        something readable. You could write every one of them the long way. You will be glad you did
        not.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-3">
        <strong>IN</strong> checks whether a value appears in a fixed list. It replaces a stack of{" "}
        <IC>OR</IC> conditions on the same column.
      </p>
      <Box label="IN: match any value in the list">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Without IN: verbose and easy to typo
WHERE department = 'Engineering' OR department = 'Design'

-- With IN: clean
SELECT name, department
FROM employees
WHERE department IN ('Engineering', 'Design')
ORDER BY department, name;`}
        />
      </Box>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-3">
        <strong>LIKE</strong> matches text patterns. The two wildcards are <IC>%</IC> (any number
        of characters, including zero) and <IC>_</IC> (exactly one character). Use it when you
        know part of a value but not all of it.
      </p>
      <Box label="LIKE: pattern matching in text">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Names that start with a vowel
SELECT name FROM employees WHERE name LIKE 'A%'
                              OR name LIKE 'E%'
                              OR name LIKE 'I%'
                              OR name LIKE 'O%';

-- Names that contain 'Chen' anywhere
SELECT name FROM employees WHERE name LIKE '%Chen%';
-- Alice Chen, Mike Chen, Zoe Chen

-- Exactly 8 characters in the name
SELECT name FROM employees WHERE name LIKE '________';`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Most databases make <IC>LIKE</IC> case-insensitive by default for text. SQLite is
        case-insensitive for ASCII letters. When in doubt, test both cases or use a lowercase
        function like <IC>lower(name) LIKE '%chen%'</IC>.
      </p>

      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-3">
        <strong>BETWEEN</strong> checks whether a value falls within a range, inclusive on both
        ends. It works on numbers, dates, and text.
      </p>
      <Box label="BETWEEN: inclusive range filter">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Salary between 70k and 90k (inclusive)
SELECT name, salary
FROM employees
WHERE salary BETWEEN 70000 AND 90000
ORDER BY salary;

-- Hired in 2022 (date strings compare lexicographically in SQLite)
SELECT name, hire_date
FROM employees
WHERE hire_date BETWEEN '2022-01-01' AND '2022-12-31'
ORDER BY hire_date;`}
        />
      </Box>
      <Callout>
        <IC>BETWEEN a AND b</IC> is exactly the same as <IC>&gt;= a AND &lt;= b</IC>. Both
        endpoints are included. If you want to exclude an endpoint, write the explicit comparison
        instead.
      </Callout>
    </section>
  );
}

function OrderBySection() {
  return (
    <section>
      <h2 id="order-by" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        ORDER BY: controlling the sort
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Without <IC>ORDER BY</IC>, the database returns rows in whatever order it finds them.
        That order is not guaranteed and can change between queries. If the order of results matters
        to you at all, specify it explicitly.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>ASC</IC> sorts smallest to largest, A to Z, earliest to latest. <IC>DESC</IC> reverses
        it. <IC>ASC</IC> is the default, so you only need to write it when clarity matters.
      </p>
      <Box label="single column sort">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Highest paid first
SELECT name, salary
FROM employees
ORDER BY salary DESC;

-- Alphabetical by name
SELECT name FROM employees ORDER BY name ASC;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You can sort by multiple columns. The database sorts by the first column, then breaks ties
        using the second column, and so on.
      </p>
      <Box label="sort by department first, then by salary within each department">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT name, department, salary
FROM employees
WHERE is_active = 1
ORDER BY department ASC,
         salary DESC;

-- Engineering rows appear first, sorted high to low salary.
-- Then Design, then Operations, then Sales.`}
        />
      </Box>
    </section>
  );
}

function DistinctSection() {
  return (
    <section>
      <h2 id="distinct" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        DISTINCT: removing duplicates
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Sometimes a column contains the same value repeated across many rows and you only want to
        know the unique values. <IC>DISTINCT</IC> collapses duplicates so each distinct value
        appears exactly once.
      </p>
      <Box label="which departments exist?">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Without DISTINCT: 28 rows, one per employee
SELECT department FROM employees;

-- With DISTINCT: 4 rows, one per unique department
SELECT DISTINCT department
FROM employees
ORDER BY department;
-- Design
-- Engineering
-- Operations
-- Sales`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        When you select multiple columns, <IC>DISTINCT</IC> deduplicates on the combination of all
        selected columns, not just the first one.
      </p>
      <Box label="distinct combinations of department and active status">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT DISTINCT department, is_active
FROM employees
ORDER BY department, is_active;

-- Each department appears twice: once for active (1), once for inactive (0)
-- because every department has at least one of each`}
        />
      </Box>
    </section>
  );
}

function LimitOffsetSection() {
  return (
    <section>
      <h2 id="limit-offset" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        LIMIT and OFFSET: paging through results
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>LIMIT</IC> caps how many rows come back. This is how you ask for the top 5, the
        bottom 10, or any fixed slice of a result. Without <IC>LIMIT</IC>, every matching row
        is returned, which on a large table is slow and expensive.
      </p>
      <Box label="top 5 highest earners">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT name, salary
FROM employees
WHERE is_active = 1
ORDER BY salary DESC
LIMIT 5;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>OFFSET</IC> skips rows before starting to return results. Used with <IC>LIMIT</IC>, it
        lets you page through a large result set. Page 1 is rows 1-10. Page 2 is rows 11-20. Page 3
        is rows 21-30.
      </p>
      <Box label="pagination: 10 rows per page">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Page 1: rows 1 to 10
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10 OFFSET 0;

-- Page 2: rows 11 to 20
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10 OFFSET 10;

-- Page 3: rows 21 to 28
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10 OFFSET 20;`}
        />
      </Box>
      <Callout>
        Always pair <IC>LIMIT</IC> with <IC>ORDER BY</IC>. Without a sort, the database picks rows
        in an unpredictable order. You could get different rows each time you run the same query.
        An ordered result is the only stable foundation for pagination.
      </Callout>
    </section>
  );
}

export const toc = [
  { id: "select",         title: "SELECT: choosing what to see" },
  { id: "where",          title: "WHERE: keeping only the rows you care about" },
  { id: "and-or",         title: "AND / OR: combining conditions" },
  { id: "is-null",        title: "IS NULL: finding the absent values" },
  { id: "in-like-between", title: "IN, LIKE, BETWEEN: shorthand filters" },
  { id: "order-by",       title: "ORDER BY: controlling the sort" },
  { id: "distinct",       title: "DISTINCT: removing duplicates" },
  { id: "limit-offset",   title: "LIMIT and OFFSET: paging through results" },
];

export default function SqlReadsGuide() {
  return (
    <>
      <SelectSection />
      <WhereSection />
      <AndOrSection />
      <IsNullSection />
      <InLikeBetweenSection />
      <OrderBySection />
      <DistinctSection />
      <LimitOffsetSection />
    </>
  );
}
