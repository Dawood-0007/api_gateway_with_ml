import BlockedIPsTable from "./BlockedIpsTable";

export default async function BlockedIPsPage() {
  const res = await fetch("http://localhost:5000/api/stat/blocked", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blocked IP Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage blocked IP addresses</p>
      </div>
      <BlockedIPsTable initialData={data} />
    </div>
  );
}