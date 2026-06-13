// Skeleton loader shown while Gemini is processing
export default function SkeletonLoader() {
  return (
    <div className="space-y-3 py-2">
      <div className="skeleton-line w-3/4" />
      <div className="skeleton-line w-full" />
      <div className="skeleton-line w-5/6" />
      <div className="skeleton-line w-full" />
      <div className="skeleton-line w-2/3" />
      <div className="skeleton-line w-full mt-4" />
      <div className="skeleton-line w-4/5" />
      <div className="skeleton-line w-full" />
    </div>
  );
}
