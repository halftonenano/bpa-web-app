export default function CourseCompletionBar({
  complete,
  total,
  loading,
}: {
  complete: number;
  total: number;
  loading?: boolean;
}) {
  return (
    <div className="flex h-9 w-full items-center gap-3 rounded-full border px-4 text-sm shadow-sm bg-white">
      {loading ? (
        'loading...'
      ) : (
        <>
          <div className="flex-shrink-0">
            Progress: {complete} / {total}
          </div>
          <div className="w-full">
            <div
              className="streak-bold h-1.5 rounded-full shadow-sm"
              style={{
                width: `${(complete / total) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex-shrink-0">
            {Math.round((complete / total) * 100)}%
          </div>
        </>
      )}
    </div>
  );
}
