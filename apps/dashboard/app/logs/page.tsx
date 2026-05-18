import RequestLogsPage from "./LogsTable";

export default async function RequestLogs() {
  const baseUrl = process.env.BACKEND_SERVER || process.env.NEXT_PUBLIC_BACKEND_CLIENT;

  const result = await fetch(`${baseUrl}/api/stat/logs`, { method: "GET" });
      const data = await result.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Request Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Searchable request log history</p>
      </div>

      <RequestLogsPage initialData={data} />
    </div>
  );
};

