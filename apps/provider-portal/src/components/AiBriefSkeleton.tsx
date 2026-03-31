export default function AiBriefSkeleton() {
  return (
    <div className="rounded-xl border-2 border-teal-100 bg-teal-50/50 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-36 rounded bg-teal-200/60" />
        <div className="h-5 w-14 rounded-full bg-amber-100" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-5/6 rounded bg-gray-200" />
        <div className="h-3 w-4/6 rounded bg-gray-200" />
        <div className="h-3 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="h-3 w-32 rounded bg-gray-200 mb-2" />
      <div className="h-8 w-full rounded bg-gray-100" />
    </div>
  );
}
