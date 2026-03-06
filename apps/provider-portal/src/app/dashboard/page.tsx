const cards = [
  {
    title: "Scan Patient QR",
    description: "Scan a patient\u2019s QR code to access their medical records securely.",
    icon: "\uD83D\uDCF7",
    href: "/scan",
  },
  {
    title: "Active Sessions",
    description: "View and manage your currently active patient sessions.",
    icon: "\uD83D\uDD52",
    count: 0,
  },
  {
    title: "Recent Patients",
    description: "Review records from patients you\u2019ve recently accessed.",
    icon: "\uD83D\uDCCB",
    count: 0,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Welcome, Provider
      </h1>
      <p className="mb-8 text-gray-500">
        Manage patient records and sessions from your dashboard.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 text-3xl">{card.icon}</div>
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              {card.title}
            </h2>
            <p className="mb-4 text-sm text-gray-500">{card.description}</p>
            {card.count !== undefined && (
              <span className="inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                {card.count} active
              </span>
            )}
            {card.href && (
              <a
                href={card.href}
                className="inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                Open Scanner
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
