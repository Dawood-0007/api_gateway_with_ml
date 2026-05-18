import AdminManagementPage from "./AdminPage";

export default async function AdminManagement() {
  const baseUrl = process.env.BACKEND_SERVER || process.env.NEXT_PUBLIC_BACKEND_CLIENT;

  const result = await fetch(`${baseUrl}/api/stat/allUser`, { method: "GET" });
  const data = await result.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Management</h1>
        <p className="text-sm text-muted-foreground mt-1">User roles and access control</p>
      </div>
      <AdminManagementPage initialData={data} />
    </div>
  );
};