"use client"

import { useState, useEffect } from "react";
import { BlockedIP } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ban, Plus, Unlock } from "lucide-react";
import { toast } from "sonner";

type BlockedPage = {
  blockedIps: {
    ip: string;
    reason: string;
    blockedAt: string;
  }[];
  ipCount: {
    ip: string;
    hit: number;
  }[];
};

const BlockedIPsPage = () => {
  const [data, setData] = useState<BlockedPage>({
    blockedIps: [],
    ipCount: []
  });

  const [newIP, setNewIP] = useState("");
  const [newReason, setNewReason] = useState("");
  const [change, setChange] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/stat/blocked", { method: "GET" })

      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, [change]);

  const handleUnblock = async (id: string) => {

    await fetch("http://localhost:5000/api/stat/unblockIp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ip: id })
    });

    toast.success("IP unblocked successfully");

    setData(prev => ({
      ...prev,
      blockedIps: prev.blockedIps.filter(item => item.ip !== id),
      ipCount: prev.ipCount.filter(item => item.ip !== id)
    }));
  };

  const handleBlock = async () => {
    if (!newIP.trim()) return;

    await fetch("http://localhost:5000/api/stat/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ip: newIP, reason: newReason })
    });
    setChange(!change);

    const entry: BlockedIP = {
      id: String(Date.now()),
      ip: newIP,
      reason: newReason || "Manual block",
      blockedAt: new Date().toISOString(),
      country: "Pakistan",
      requestCount: 0,
    };
    setNewIP("");
    setNewReason("");
    toast.success(`IP ${newIP} blocked`);
  };

  const findCount = (ip: string) => {
    const match = data.ipCount.find((i) => ip == i.ip);
    return match ? match.hit : 0;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blocked IP Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage blocked IP addresses</p>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-3">Manual Block</h3>
        <div className="flex gap-2">
          <Input placeholder="IP Address" value={newIP} onChange={(e) => setNewIP(e.target.value)} className="max-w-[200px] font-mono text-sm" />
          <Input placeholder="Reason" value={newReason} onChange={(e) => setNewReason(e.target.value)} className="max-w-[250px] text-sm" />
          <Button onClick={handleBlock} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Block
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Blocked IPs ({data.blockedIps.length})</h3>
          <Ban className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">IP Address</th>
                <th className="text-left py-2 font-medium">Country</th>
                <th className="text-left py-2 font-medium">Reason</th>
                <th className="text-left py-2 font-medium">Blocked At</th>
                <th className="text-right py-2 font-medium">Requests</th>
                <th className="text-right py-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.blockedIps.map((ip) => (
                <tr key={ip.ip} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 font-mono text-xs">{ip.ip}</td>
                  <td className="py-2.5">{"Pk"}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-[10px]">{ip.reason}</Badge>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {new Date(ip.blockedAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-mono text-xs">{findCount(ip.ip).toLocaleString()}</td>
                  <td className="py-2.5 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleUnblock(ip.ip)} className="text-destructive hover:text-destructive">
                      <Unlock className="h-3 w-3 mr-1" /> Unblock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlockedIPsPage;
