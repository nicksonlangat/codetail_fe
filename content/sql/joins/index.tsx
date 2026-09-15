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

function WhatIsAJoinSection() {
  return (
    <section>
      <h2 id="what-is-a-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        What a JOIN actually is
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Here is the trick databases play on you. They split information across multiple tables
        on purpose. The <IC>employees</IC> table stores people. The <IC>departments</IC> table
        stores departments. An employee row does not repeat the department name everywhere it appears.
        It stores a single number, <IC>department_id</IC>, that points to the matching row in{" "}
        <IC>departments</IC>.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That pointer is called a <strong>foreign key</strong>. It keeps data consistent and compact.
        But it means that when you want both the employee name and the department name in the same
        result, you have to follow the pointer yourself. That is exactly what a JOIN does: it
        follows the pointer and stitches two tables into one.
      </p>
      <Callout>
        A JOIN combines rows from two tables by matching a value in one table to a value in the
        other. Without a JOIN you see one flat table. With a JOIN you get a wider result that pulls
        columns from both.
      </Callout>
      <Box label="the difference one JOIN makes">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- Without a JOIN: you get numbers, not meaning
SELECT name, department_id FROM employees;
-- name          | department_id
-- Alice Chen    | NULL
-- Bob Martinez  | 1
-- Carol Torres  | 2

-- With a JOIN: the number becomes a name
SELECT e.name, d.name AS department
FROM employees e
JOIN departments d ON e.department_id = d.id;
-- name          | department
-- Bob Martinez  | Engineering
-- Carol Torres  | Marketing`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Notice Alice disappeared. She has <IC>NULL</IC> in <IC>department_id</IC>, so no row in{" "}
        <IC>departments</IC> matches her. The default JOIN dropped her without saying a word.
        That is the first thing to lock in: the type of JOIN you choose decides who makes the cut.
      </p>
    </section>
  );
}

function JoinAnatomySection() {
  return (
    <section>
      <h2 id="join-anatomy" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        The anatomy: left table, right table, qualifier, ON
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every JOIN has four parts. Learn these four names and you can read any JOIN you will ever
        encounter, no matter how long or deeply chained.
      </p>
      <Box label="the four parts, labeled">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`  FROM employees e          -- left table  (your starting point)
  LEFT JOIN departments d   -- qualifier + right table  (what you attach)
  ON e.department_id = d.id -- ON clause  (how they connect)`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-3">
        <strong>Left table.</strong> The table after <IC>FROM</IC>. This is where the query
        starts. Every row begins its life here.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-3">
        <strong>Right table.</strong> The table after <IC>JOIN</IC>. This is the table you are
        pulling extra columns from.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-3">
        <strong>Qualifier.</strong> The word before <IC>JOIN</IC>: <IC>INNER</IC>,{" "}
        <IC>LEFT</IC>, <IC>RIGHT</IC>, or nothing at all. It is the policy: what happens to rows
        that have no match on the other side? Writing bare <IC>JOIN</IC> with no qualifier is
        identical to writing <IC>INNER JOIN</IC>.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-6">
        <strong>ON clause.</strong> The condition that links the two tables. Usually it is a foreign
        key on one side matching a primary key on the other. When this condition is true for a pair
        of rows, those rows are merged into one result row.
      </p>
      <Callout>
        Left and right are not about screen position. They are about which table was written first
        (after <IC>FROM</IC>) and which was written second (after <IC>JOIN</IC>). The distinction
        only matters for LEFT JOIN and RIGHT JOIN, which treat the two sides differently.
      </Callout>
    </section>
  );
}

function InnerJoinSection() {
  return (
    <section>
      <h2 id="inner-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        INNER JOIN: both sides have to show up
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        INNER JOIN is the strictest deal. A row from the left table only makes it into the result if
        the right table has a row that satisfies the <IC>ON</IC> condition. No match on either side
        means both sides are excluded. It is mutual: both rows have to show up or neither does.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Think of it as an intersection. You only get what exists meaningfully in both tables.
      </p>
      <Box label="only employees who belong to a department">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name, e.salary, d.name AS department, d.location
FROM employees e
INNER JOIN departments d ON e.department_id = d.id
ORDER BY e.name;

-- Employees with department_id = NULL: gone.
-- Departments with no employees: gone.
-- Only matched pairs survive.`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The dangerous part: INNER JOIN drops rows without a word. If you expect 20 employees and
        get 18, two of them have a <IC>NULL</IC> or a <IC>department_id</IC> that matches nothing.
        The database does not tell you. The rows just vanish. When your count is off, start here.
      </p>
      <Callout>
        Use INNER JOIN when you only want rows that have a valid match on both sides, and a missing
        row is acceptable. When you need every row from one table regardless of whether it has a
        match, you want LEFT JOIN.
      </Callout>
    </section>
  );
}

function LeftJoinSection() {
  return (
    <section>
      <h2 id="left-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        LEFT JOIN: the left table always makes it out
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        LEFT JOIN changes one rule: the left table is protected. Every single row from it survives
        into the result, matched or not. When there is no matching row on the right, SQL fills the
        right-side columns with <IC>NULL</IC>. The row still appears. It just has empty values where
        the right table would have contributed.
      </p>
      <Box label="all departments, even those with zero employees">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT d.name AS department, COUNT(e.id) AS headcount
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.name
ORDER BY headcount DESC;

-- Every department row survives.
-- Departments with no employees show headcount = 0.
-- INNER JOIN would have silently removed them.`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        That is the power of LEFT JOIN: it makes the invisible visible. Any department with zero
        employees was invisible to an INNER JOIN. LEFT JOIN forces it into the result.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        There is a pattern you will use constantly. LEFT JOIN followed by{" "}
        <IC>WHERE right_column IS NULL</IC> finds every row on the left that has absolutely no match
        on the right.
      </p>
      <Box label="employees not assigned to any project">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name, d.name AS department
FROM employees e
JOIN departments d ON e.department_id = d.id     -- INNER: must have a department
LEFT JOIN employee_projects ep ON e.id = ep.employee_id  -- LEFT: fine with no project
WHERE ep.employee_id IS NULL                     -- keep only the unassigned ones
ORDER BY e.name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Employees with no project assignment get <IC>NULL</IC> in every <IC>ep</IC> column.
        The <IC>WHERE</IC> filters to exactly those. Clean, readable, no subquery needed.
      </p>
      <Callout>
        Direction matters. <IC>FROM A LEFT JOIN B</IC> protects every row in A.{" "}
        <IC>FROM B LEFT JOIN A</IC> protects every row in B. Swap the table order and you swap
        which side is guaranteed to survive.
      </Callout>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <strong>What about RIGHT JOIN?</strong> It is the mirror: every row from the right is
        guaranteed to appear, and the left fills with <IC>NULL</IC> when there is no match.
        Most teams do not use it. You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the
        table order. Sticking to LEFT JOIN keeps the direction consistent and easier to scan.
      </p>
    </section>
  );
}

function SelfJoinSection() {
  return (
    <section>
      <h2 id="self-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        Self-join: when a table points to itself
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Some tables have a column that points back to themselves. The <IC>employees</IC> table has a{" "}
        <IC>manager_id</IC> column whose values are <IC>employees.id</IC> values. An employee&apos;s
        manager is another employee in the same table.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        To show an employee next to their manager&apos;s name, you need the table twice in the same
        query: once playing the employee role, once playing the manager role. SQL handles this by
        letting you alias the same table under two different names.
      </p>
      <Box label="each employee paired with their manager">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name AS employee,
       m.name AS manager
FROM employees e       -- e is playing the employee
JOIN employees m       -- m is the same table, playing the manager
  ON e.manager_id = m.id
ORDER BY m.name, e.name;

-- Employees whose manager_id is NULL disappear (INNER JOIN).
-- Switch to LEFT JOIN to keep them with NULL in the manager column.`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The alias is what makes it work. <IC>e</IC> and <IC>m</IC> point to the same physical
        table, but SQL treats them as two independent copies for this query. Without aliases, the
        database would not know which <IC>id</IC> or <IC>name</IC> you were referring to.
      </p>
      <Box label="all employees, NULL shown for those with no manager">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name AS employee,
       m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;

-- Every employee appears.
-- Top-level employees show NULL in the manager column.`}
        />
      </Box>
    </section>
  );
}

function ChainingJoinsSection() {
  return (
    <section>
      <h2 id="chaining-joins" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        Chaining JOINs: three or more tables
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You are not limited to two tables. Each JOIN adds one more. After every JOIN, the result
        grows wider by the columns from the new table. The next JOIN can reference any column
        already in the result so far.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The mental model: read the query from top to bottom like a recipe. Start with the left
        table. Attach the next table using its <IC>ON</IC> condition. Then the next. By the last
        line you have a single wide result drawing from all of them.
      </p>
      <Box label="employee, department, and project combined">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name        AS employee,
       d.name        AS department,
       d.location,
       p.name        AS project,
       ep.role
FROM employees e
JOIN departments d        ON e.department_id = d.id  -- step 1: attach dept
JOIN employee_projects ep ON e.id = ep.employee_id   -- step 2: attach assignment
JOIN projects p           ON ep.project_id = p.id    -- step 3: attach project
ORDER BY e.name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        You can mix qualifiers freely. If you want employees with no project to still appear in the
        result, make the third JOIN a LEFT JOIN. The first two can stay INNER.
      </p>
      <Callout>
        Warning: a missing or wrong <IC>ON</IC> clause does not cause an error. It creates a
        cartesian product: every row from the left paired with every row from the right. A table
        with 100 rows joined without a condition to another table with 50 rows gives you 5,000 rows.
        If your result count feels impossibly large, a broken <IC>ON</IC> clause is the first place
        to look.
      </Callout>
    </section>
  );
}

function NullInJoinSection() {
  return (
    <section>
      <h2 id="null-in-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        NULL in a JOIN key is always a miss
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>NULL</IC> means the absence of a value. Not zero. Not an empty string. Nothing at all.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        SQL has a strict rule about <IC>NULL</IC>: any comparison that involves it evaluates to{" "}
        <IC>UNKNOWN</IC>, not <IC>TRUE</IC> or <IC>FALSE</IC>. So{" "}
        <IC>NULL = 5</IC> is <IC>UNKNOWN</IC>. <IC>NULL = NULL</IC> is also <IC>UNKNOWN</IC>.
        INNER JOIN requires <IC>TRUE</IC> to keep a row. <IC>UNKNOWN</IC> does not qualify, so the
        row is silently dropped.
      </p>
      <Box label="what NULL in a join key does to your result">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- 4 employees have manager_id = NULL
-- INNER JOIN drops them: NULL = m.id evaluates to UNKNOWN, not TRUE
SELECT e.name, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
-- returns 11 rows, not 15

-- LEFT JOIN keeps them: NULL on the join key still survives the left table
SELECT e.name, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
-- returns 15 rows, manager column is NULL for the 4 top-level employees`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The same rule bites you in <IC>WHERE</IC> clauses. Writing{" "}
        <IC>WHERE manager_id = NULL</IC> returns zero rows, every time, no matter what the data
        looks like. <IC>NULL = NULL</IC> is <IC>UNKNOWN</IC>, which is never <IC>TRUE</IC>, so no
        row passes the filter. Use <IC>IS NULL</IC> instead.
      </p>
      <Box label="the correct way to filter on NULL">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- WRONG: always returns 0 rows
SELECT name FROM employees WHERE manager_id = NULL;

-- CORRECT: returns the employees with no manager
SELECT name FROM employees WHERE manager_id IS NULL;`}
        />
      </Box>
      <Callout>
        If a row you expect is missing from a JOIN result, check whether its join key could be NULL.
        If it can, INNER JOIN dropped it. Switch to LEFT JOIN and the row comes back.
      </Callout>
    </section>
  );
}

export const toc = [
  { id: "what-is-a-join",  title: "What a JOIN actually is" },
  { id: "join-anatomy",    title: "The anatomy: left, right, qualifier, ON" },
  { id: "inner-join",      title: "INNER JOIN: both sides have to show up" },
  { id: "left-join",       title: "LEFT JOIN: the left table always makes it out" },
  { id: "self-join",       title: "Self-join: when a table points to itself" },
  { id: "chaining-joins",  title: "Chaining JOINs: three or more tables" },
  { id: "null-in-join",    title: "NULL in a JOIN key is always a miss" },
];

export default function SqlJoinsGuide() {
  return (
    <>
      <WhatIsAJoinSection />
      <JoinAnatomySection />
      <InnerJoinSection />
      <LeftJoinSection />
      <SelfJoinSection />
      <ChainingJoinsSection />
      <NullInJoinSection />
    </>
  );
}
