export default async function TreatmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-3xl font-bold text-gray-900">
        Add Treatment Record
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Session:{" "}
        <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-teal-700">
          {sessionId}
        </code>
      </p>

      <form className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Diagnosis */}
        <div>
          <label
            htmlFor="diagnosis"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Diagnosis
          </label>
          <input
            id="diagnosis"
            type="text"
            placeholder="Primary diagnosis"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Procedure type */}
        <div>
          <label
            htmlFor="procedure"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Procedure Type
          </label>
          <select
            id="procedure"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Select procedure type</option>
            <option value="consultation">Consultation</option>
            <option value="examination">Examination</option>
            <option value="procedure">Procedure</option>
            <option value="follow-up">Follow-up</option>
            <option value="referral">Referral</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            rows={5}
            placeholder="Clinical notes..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        {/* Follow-up date */}
        <div>
          <label
            htmlFor="followup"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Follow-up Date
          </label>
          <input
            id="followup"
            type="date"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
