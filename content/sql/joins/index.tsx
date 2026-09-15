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

function InnerJoinSection() {
  return (
    <section>
      <h2 id="inner-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        INNER JOIN: only the rows that match on both sides
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Every time you called <IC>Employee.objects.select_related(&apos;department&apos;)</IC> in Django,
        the ORM wrote a JOIN. Now you are writing it yourself. The default join is <IC>INNER JOIN</IC>,
        and it keeps a row only when both tables have a matching value on the join condition.
      </p>
      <Box label="joining employees to departments">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name, d.name AS department, d.location
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.is_active = true
ORDER BY e.name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>JOIN</IC> without a qualifier means <IC>INNER JOIN</IC>. The <IC>ON</IC> clause is the
        matching condition: one row from <IC>employees</IC> is paired with the one row from{" "}
        <IC>departments</IC> whose <IC>id</IC> matches the employee&apos;s <IC>department_id</IC>.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The gotcha: if a row on either side has no match, it disappears silently. This dataset has
        six departments. Marketing and Legal have no employees. An INNER JOIN from{" "}
        <IC>departments</IC> to <IC>employees</IC> returns four departments, not six. No error, just
        missing rows. When your count is off, a missing match is usually why.
      </p>
    </section>
  );
}

function LeftJoinSection() {
  return (
    <section>
      <h2 id="left-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        LEFT JOIN: keep every row from the left table
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        LEFT JOIN changes one rule: every row from the left table survives the join, matched or not.
        When there is no matching row on the right, those columns are filled with{" "}
        <IC>NULL</IC>.
      </p>
      <Box label="all departments, even those with no employees">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT d.name, COUNT(e.id) AS headcount
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id
GROUP BY d.name;
-- Marketing: 0, Legal: 0 -- they appear now`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A pattern worth memorising: LEFT JOIN to find rows with <em>no</em> match. After the join,
        rows that had no partner on the right will have <IC>NULL</IC> in the right-side columns.
        Filter on that <IC>NULL</IC> and you isolate the unmatched rows.
      </p>
      <Box label="employees not assigned to any project">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name, d.name AS department
FROM employees e
JOIN departments d ON e.department_id = d.id
LEFT JOIN employee_projects ep ON e.id = ep.employee_id
WHERE ep.project_id IS NULL
ORDER BY e.name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        This works because employees with no project get <IC>NULL</IC> in every{" "}
        <IC>ep</IC> column. The <IC>WHERE ep.project_id IS NULL</IC> keeps only those.
        An INNER JOIN on <IC>employee_projects</IC> would have dropped them before the{" "}
        <IC>WHERE</IC> even ran.
      </p>
    </section>
  );
}

function SelfJoinSection() {
  return (
    <section>
      <h2 id="self-join" className="text-xl font-semibold text-brand-text mt-10 mb-4 scroll-mt-24">
        Self-join: when a table references itself
      </h2>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        A table can join to itself. The <IC>employees</IC> table has a <IC>manager_id</IC> column
        that points back to <IC>employees.id</IC>. To show each employee alongside their
        manager&apos;s name, you need the table twice under two different aliases.
      </p>
      <Box label="employee paired with their manager">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id
ORDER BY m.name, e.name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        <IC>e</IC> is the employee. <IC>m</IC> is the manager. Same table, two roles, two aliases.
        This INNER JOIN drops Alice Chen, Carol Thompson, Eve Nakamura, and Grace Kim because their{" "}
        <IC>manager_id</IC> is <IC>NULL</IC>. No match means no row.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        If you want all 15 employees with <IC>NULL</IC> in the manager column for top-level staff,
        switch to LEFT JOIN.
      </p>
      <Box label="all employees, manager column is NULL for top-level staff">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;`}
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
        You are not limited to two tables. Each JOIN adds one more, building up columns in the
        result. The result grows in columns, not in rows (assuming a many-to-one relationship on
        each join).
      </p>
      <Box label="employee, department, and project in one query">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`SELECT e.name AS employee,
       d.name AS department,
       d.location,
       p.name AS project,
       ep.role
FROM employees e
JOIN departments d        ON e.department_id = d.id
JOIN employee_projects ep ON e.id = ep.employee_id
JOIN projects p           ON ep.project_id = p.id
ORDER BY e.name;`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Read it left to right: start with <IC>employees</IC>, attach their department,
        attach their project assignment row, attach the project details. Each{" "}
        <IC>ON</IC> clause connects the new table to what is already in the result.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        Watch the join conditions. A missing or wrong <IC>ON</IC> clause does not
        error. It produces a cartesian product: every row from the left paired with every
        row from the right. If your result has far more rows than expected, a bad join
        condition is the likely cause.
      </p>
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
        <IC>NULL</IC> represents the absence of a value. Any comparison involving{" "}
        <IC>NULL</IC>, including <IC>NULL = m.id</IC>, evaluates to{" "}
        <IC>UNKNOWN</IC>, not <IC>TRUE</IC>. INNER JOIN requires <IC>TRUE</IC> to keep
        a row. So any row where the join key is <IC>NULL</IC> is silently dropped.
      </p>
      <Box label="NULL = anything is UNKNOWN, not TRUE">
        <CodeBlock
          language="SQL"
          showLineNumbers={false}
          code={`-- manager_id is NULL for 4 employees
-- INNER JOIN: those 4 rows disappear
SELECT e.name, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;  -- 11 rows, not 15

-- LEFT JOIN: they survive with NULL in the manager column
SELECT e.name, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;  -- 15 rows`}
        />
      </Box>
      <p className="text-[15px] leading-relaxed text-brand-text/90 mb-4">
        The same rule applies to <IC>WHERE</IC> clauses. You cannot write{" "}
        <IC>WHERE manager_id = NULL</IC> to find rows with no manager.{" "}
        <IC>NULL = NULL</IC> is never <IC>TRUE</IC>. Use{" "}
        <IC>IS NULL</IC> or <IC>IS NOT NULL</IC> instead.
      </p>
      <p className="text-[15px] leading-relaxed text-brand-text/90">
        Rule: if you expect a row in the output but it is missing, check whether the join
        key could be <IC>NULL</IC> for that row. If it can, switch to LEFT JOIN.
      </p>
    </section>
  );
}

export const toc = [
  { id: "inner-join",     title: "INNER JOIN: only the rows that match on both sides" },
  { id: "left-join",      title: "LEFT JOIN: keep every row from the left table" },
  { id: "self-join",      title: "Self-join: when a table references itself" },
  { id: "chaining-joins", title: "Chaining JOINs: three or more tables" },
  { id: "null-in-join",   title: "NULL in a JOIN key is always a miss" },
];

export default function SqlJoinsGuide() {
  return (
    <>
      <InnerJoinSection />
      <LeftJoinSection />
      <SelfJoinSection />
      <ChainingJoinsSection />
      <NullInJoinSection />
    </>
  );
}
