import type { LegalSection } from "@/features/auth/types/legalContent";

interface LegalContentProps {
  sections: LegalSection[];
}

function LegalTable({ table }: { table: NonNullable<LegalSection["table"]> }) {
  return (
    <div className="border-border-neutral-muted overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-bg-layer-basement">
            {table.headers.map((header) => (
              <th
                key={header}
                className="border-border-neutral-muted body-2-semibold text-text-neutral-primary border-b px-3 py-2 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:last-child>td]:border-b-0">
          {table.rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, cellIndex) => (
                <td
                  key={table.headers[cellIndex]}
                  className="border-border-neutral-muted body-2-regular text-text-neutral-secondary border-b px-3 py-2 align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalContent({ sections }: LegalContentProps) {
  return (
    <div className="bg-bg-layer-default divide-border-neutral-muted flex flex-col divide-y rounded-2xl p-4">
      {sections.map((section) => (
        <section
          key={section.heading}
          className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
        >
          <span className="body-1-bold">{section.heading}</span>
          <p className="body-2-regular text-text-neutral-secondary">
            {section.body}
          </p>

          {section.items && (
            <ol className="marker:text-text-neutral-tertiary flex list-decimal flex-col gap-1 pl-5">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="body-2-regular text-text-neutral-secondary pl-0.5"
                >
                  {item}
                </li>
              ))}
            </ol>
          )}

          {section.table && <LegalTable table={section.table} />}
        </section>
      ))}
    </div>
  );
}
