"use client"

import { adminUsers } from "@/data/mockData";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye } from "lucide-react";

interface AdminPage {
  id: number,
  name : string,
  email: string,
  role: string,
  lastLogin: string
}

const AdminManagement = () => {
  const [user, setUsers] = useState<AdminPage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/stat/allUser", { method: "GET" });
      const data = await response.json();

      setUsers(data);
    };  
    fetchData();
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Management</h1>
        <p className="text-sm text-muted-foreground mt-1">User roles and access control</p>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Authentication</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">JWT-based authentication with role-based access control. Admin and viewer roles supported.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-4 bg-accent/50">
            <p className="text-xs text-muted-foreground">Auth Method</p>
            <p className="text-sm font-semibold mt-1">JWT Token</p>
          </div>
          <div className="rounded-lg border p-4 bg-accent/50">
            <p className="text-xs text-muted-foreground">Session Expiry</p>
            <p className="text-sm font-semibold mt-1">24 hours</p>
          </div>
          <div className="rounded-lg border p-4 bg-accent/50">
            <p className="text-xs text-muted-foreground">Secure Routes</p>
            <p className="text-sm font-semibold mt-1">All endpoints</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-left py-2 font-medium">Email</th>
                <th className="text-left py-2 font-medium">Role</th>
                <th className="text-left py-2 font-medium">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {user.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 font-medium">{user.name}</td>
                  <td className="py-2.5 text-muted-foreground font-mono text-xs">{user.email}</td>
                  <td className="py-2.5">
                    <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-[10px]">
                      {user.role === "admin" ? <Shield className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">{new Date(user.lastLogin).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
