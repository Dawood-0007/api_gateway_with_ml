"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Ban, Plus, Unlock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


type BlockedIp = {
  ip: string;
  reason: string;
  blockedAt: string;
};

type IpCount = {
  ip: string;
  hit: number;
};

type BlockedPageData = {
  blockedIps: BlockedIp[];
  ipCount: IpCount[];
};

type Props = {
  initialData: BlockedPageData;
};


const BlockedIPsPage = ({ initialData }: Props) => {
  const router = useRouter();

  const [data, setData] = useState<BlockedPageData>(
    initialData ?? { blockedIps: [], ipCount: [] }
  );
  const [newIP, setNewIP] = useState("");
  const [newReason, setNewReason] = useState("");
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/stat/blocked");
        if (!response.ok) throw new Error("Failed to fetch blocked IPs");
        const json: BlockedPageData = await response.json();
        setData(json);
      } catch {
        toast.error("Could not load blocked IPs.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);


  const handleUnblock = async (ip: string) => {
    setData((prev) => ({
      blockedIps: prev.blockedIps.filter((item) => item.ip !== ip),
      ipCount: prev.ipCount.filter((item) => item.ip !== ip),
    }));

    try {
      const res = await fetch("http://localhost:5000/api/stat/unblockIp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip }),
      });
      if (!res.ok) throw new Error();
      
      toast.success("IP unblocked successfully");
      router.refresh();
    } catch {
      toast.error("Failed to unblock IP. Please try again.");
      router.refresh();
    }
  };

  const handleBlock = async () => {
    const trimmedIP = newIP.trim();
    if (!trimmedIP) return;

    const reason = newReason.trim() || "Manual block";
    const newEntry: BlockedIp = {
      ip: trimmedIP,
      reason,
      blockedAt: new Date().toISOString(),
    };

    setData((prev) => ({
      ...prev,
      blockedIps: [newEntry, ...prev.blockedIps],
    }));
    setNewIP("");
    setNewReason("");

    try {
      const res = await fetch("http://localhost:5000/api/stat/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: trimmedIP, reason }),
      });
      if (!res.ok) throw new Error();
      toast.success(`IP ${trimmedIP} blocked`);
      router.refresh();
    } catch {
      toast.error("Failed to block IP. Please try again.");
      
      setData((prev) => ({
        ...prev,
        blockedIps: prev.blockedIps.filter((item) => item.ip !== trimmedIP),
      }));
    }
  };


  const findCount = (ip: string): number =>
    data.ipCount.find((i) => i.ip === ip)?.hit ?? 0;

  const blockedCount = data.blockedIps.length;


  return (
    <div className="space-y-6">

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-3">Manual Block</h3>
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="IP Address (e.g. 192.168.1.1)"
            value={newIP}
            onChange={(e) => setNewIP(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBlock()}
            className="max-w-[220px] font-mono text-sm"
          />
          <Input
            placeholder="Reason (optional)"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBlock()}
            className="max-w-[250px] text-sm"
          />
          <Button onClick={handleBlock} size="sm" disabled={!newIP.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Block
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">
            Blocked IPs ({blockedCount})
          </h3>
          <Ban className="h-4 w-4 text-muted-foreground" />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            Loading…
          </p>
        ) : blockedCount === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No blocked IPs.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 font-medium">IP Address</th>
                  <th className="text-left py-2 font-medium">Reason</th>
                  <th className="text-left py-2 font-medium">Blocked At</th>
                  <th className="text-right py-2 font-medium">Requests</th>
                  <th className="text-right py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.blockedIps.map((item) => (
                  <tr
                    key={item.ip}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-2.5 font-mono text-xs">{item.ip}</td>
                    <td className="py-2.5">
                      <Badge variant="outline" className="text-[10px]">
                        {item.reason}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {new Date(item.blockedAt).toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono text-xs">
                      {findCount(item.ip).toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnblock(item.ip)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Unlock className="h-3 w-3 mr-1" />
                        Unblock
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedIPsPage;