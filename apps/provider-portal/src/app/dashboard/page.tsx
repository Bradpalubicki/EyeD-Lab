import Link from "next/link";

const trainingPatients = [
  { name: "Robert Mitchell", pin: "111111", label: "TRT Injection · Hypogonadism" },
  { name: "James Crawford", label: "TRT + T2DM · Complex", pin: "222222" },
  { name: "David Holbrook", label: "TRT + Shockwave Therapy", pin: "333333" },
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

      {/* Primary action */}
      <div className="mb-8 rounded-xl border-2 border-teal-200 bg-teal-50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-teal-800">Scan Patient QR Code</h2>
            <p className="mt-1 text-sm text-teal-700">
              Scan a patient&apos;s QR code to access their medical records securely.
            </p>
          </div>
          <Link
            href="/scan"
            className="ml-6 flex-shrink-0 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Open Scanner
          </Link>
        </div>
      </div>

      {/* Training patients */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Training Patients</h2>
        <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700">
          DEMO DATA ONLY
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-500">
        Use these patients to explore the full portal experience during training and demos.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {trainingPatients.map((p) => (
          <div
            key={p.pin}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-1 text-2xl">👤</div>
            <h3 className="mb-0.5 text-base font-semibold text-gray-900">{p.name}</h3>
            <p className="mb-3 text-xs text-gray-500">{p.label}</p>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs text-gray-400">PIN</span>
              <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-sm font-medium text-teal-700">
                {p.pin}
              </code>
            </div>
            <Link
              href={`/records/${p.pin}`}
              className="inline-block rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-700"
            >
              View Records
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
