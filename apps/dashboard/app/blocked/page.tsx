import BlockedIPsTable from "./BlockedIpsTable";

export default async function BlockedIPsPage() {
  const baseUrl = process.env.BACKEND_SERVER || process.env.NEXT_PUBLIC_BACKEND_CLIENT;

  const result = await fetch(`${baseUrl}/api/stat/blocked`, {
    cache: "no-store",
  });
  const data = await result.json();

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