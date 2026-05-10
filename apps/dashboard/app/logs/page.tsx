import RequestLogsPage from "./LogsTable";

export default async function RequestLogs() {
      const response = await fetch("http://localhost:5000/api/stat/logs", { method: "GET" });
      const data = await response.json();

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

