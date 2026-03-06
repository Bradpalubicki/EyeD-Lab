export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 rounded-xl border-2 border-red-200 bg-red-50 p-4">
        <h1 className="mb-1 text-3xl font-bold text-red-700">
          Emergency Access
        </h1>
        <p className="text-sm text-red-600">
          This requires dual healthcare worker authorization. All emergency
          access attempts are logged and audited.
        </p>
      </div>

      <form className="space-y-8">
        {/* First healthcare worker */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Healthcare Worker 1
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="hw1-id"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Provider ID
              </label>
              <input
                id="hw1-id"
                type="text"
                placeholder="Enter provider ID"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="hw1-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="hw1-password"
                type="password"
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>
        </div>

        {/* Second healthcare worker */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Healthcare Worker 2
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="hw2-id"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Provider ID
              </label>
              <input
                id="hw2-id"
                type="text"
                placeholder="Enter provider ID"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="hw2-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="hw2-password"
                type="password"
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>
        </div>

        {/* Patient identifier */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Patient Identifier
          </h2>
          <div>
            <label
              htmlFor="patient-id"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Patient ID or MRN
            </label>
            <input
              id="patient-id"
              type="text"
              placeholder="Enter patient ID or medical record number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Request Emergency Access
        </button>
      </form>
    </div>
  );
}
