"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError("Please enter a valid 6-digit PIN");
      return;
    }
    setError("");
    router.push(`/records/${pin}`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        Scan Patient QR Code
      </h1>
      <p className="mb-8 text-gray-500">
        Point your camera at the patient&apos;s QR code to begin a secure session.
      </p>

      {/* Camera preview placeholder */}
      <div className="mb-8 flex h-72 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-100">
        <span className="text-lg font-medium text-gray-400">
          Camera preview
        </span>
      </div>

      {/* PIN verification */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Verify Patient PIN
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-lg tracking-widest focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Verify
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <p className="mt-3 text-xs text-gray-400">Demo PINs: 123456 (James Thornton) · 654321 (Sarah Chen)</p>
      </div>
    </div>
  );
}
