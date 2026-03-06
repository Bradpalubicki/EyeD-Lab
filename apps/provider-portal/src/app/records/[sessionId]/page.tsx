const recordSections = [
  {
    title: "Allergies",
    icon: "\u26A0\uFE0F",
    items: ["No known allergies recorded"],
  },
  {
    title: "Medications",
    icon: "\uD83D\uDC8A",
    items: ["No active medications"],
  },
  {
    title: "Conditions",
    icon: "\uD83E\uDE7A",
    items: ["No conditions on file"],
  },
  {
    title: "Labs",
    icon: "\uD83E\uDDEA",
    items: ["No recent lab results"],
  },
];

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <div className="relative">
      {/* Watermark overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
        <span className="rotate-[-30deg] select-none text-6xl font-bold uppercase tracking-widest text-gray-200/60">
          CONFIDENTIAL
        </span>
      </div>

      <h1 className="mb-1 text-3xl font-bold text-gray-900">
        Patient Records
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Session:{" "}
        <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-teal-700">
          {sessionId}
        </code>
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {recordSections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-gray-500">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
