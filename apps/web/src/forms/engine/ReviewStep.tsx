'use client';

export function ReviewStep({ data }) {
  return (
    <div className="space-y-4">
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
