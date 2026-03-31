import { Suspense } from "react";
import AiBriefCard from "@/components/AiBriefCard";
import AiBriefSkeleton from "@/components/AiBriefSkeleton";
import { getPatientByPin } from "@/lib/get-patient";

export default async function RecordsPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const { patient } = await getPatientByPin(sessionId);

  return (
    <div className="relative">
      {/* Watermark overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center">
        <span className="rotate-[-30deg] select-none text-6xl font-bold uppercase tracking-widest text-gray-200/60">
          CONFIDENTIAL
        </span>
      </div>

      <h1 className="mb-1 text-3xl font-bold text-gray-900">Patient Records</h1>
      <p className="mb-4 text-sm text-gray-500">
        Session:{" "}
        <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-teal-700">
          {sessionId}
        </code>
        {" · "}
        <span className="text-gray-400">{patient.name} · MRN: {patient.mrn}</span>
      </p>

      {/* AI Brief — Suspense boundary */}
      <div className="mb-8">
        <Suspense fallback={<AiBriefSkeleton />}>
          <AiBriefCard sessionId={sessionId} />
        </Suspense>
      </div>

      {/* Record sections — populated from mock data */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Allergies */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span>⚠️</span> Allergies
          </h2>
          <ul className="space-y-2">
            {patient.allergies.length === 0 ? (
              <li className="text-sm text-gray-500">No known allergies recorded</li>
            ) : (
              patient.allergies.map((a, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium text-gray-900">{a.substance}</span>
                  <span className="text-gray-500"> — {a.reaction}</span>
                  <span className={`ml-2 text-xs font-medium ${
                    a.severity === "severe" ? "text-red-600" :
                    a.severity === "moderate" ? "text-orange-600" : "text-yellow-600"
                  }`}>({a.severity})</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Medications */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span>💊</span> Medications
          </h2>
          <ul className="space-y-2">
            {patient.medications.length === 0 ? (
              <li className="text-sm text-gray-500">No active medications</li>
            ) : (
              patient.medications.map((m, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium text-gray-900">{m.name}</span>
                  <span className="text-gray-500"> {m.dosage} · {m.indication}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Conditions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span>🩺</span> Conditions
          </h2>
          <ul className="space-y-2">
            {patient.conditions.length === 0 ? (
              <li className="text-sm text-gray-500">No conditions on file</li>
            ) : (
              patient.conditions.map((c, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                    c.status === "active" ? "bg-teal-500" : "bg-gray-300"
                  }`} />
                  <span className="font-medium text-gray-900">{c.name}</span>
                  {c.onsetYear && <span className="text-gray-400">since {c.onsetYear}</span>}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Labs */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span>🧪</span> Labs
          </h2>
          <ul className="space-y-2">
            {patient.labs.length === 0 ? (
              <li className="text-sm text-gray-500">No recent lab results</li>
            ) : (
              patient.labs.map((l, i) => (
                <li key={i} className="text-sm flex items-start justify-between gap-2">
                  <span className="text-gray-700">{l.name}</span>
                  <span className={`font-medium whitespace-nowrap ${
                    l.status === "critical" ? "text-red-600" :
                    l.status === "abnormal" ? "text-orange-600" : "text-green-700"
                  }`}>{l.value}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Treatment Sessions — TRT patients only */}
      {patient.treatmentSessions && patient.treatmentSessions.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span>💉</span> Treatment Sessions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Type</th>
                  <th className="pb-2 pr-4">Dose</th>
                  <th className="pb-2 pr-4">Provider</th>
                  <th className="pb-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patient.treatmentSessions.map((s, i) => (
                  <tr key={i} className="py-2">
                    <td className="py-2 pr-4 text-gray-700 whitespace-nowrap">
                      {new Date(s.sessionDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2 pr-4">
                      <span className="inline-block rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                        {s.sessionType}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-gray-700">
                      {s.dosageMg != null ? `${s.dosageMg} mg` : "—"}
                    </td>
                    <td className="py-2 pr-4 text-gray-700 whitespace-nowrap">
                      {s.providerName ?? "—"}
                    </td>
                    <td className="py-2 text-gray-500 max-w-xs">
                      {s.notes ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
