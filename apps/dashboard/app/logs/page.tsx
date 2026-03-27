"use client"

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface Logs {
  id: number,
  ip: string,
  endpoint: string,
  method: string,
  requestCount: number,
  anomalyScore: number,
  statusCode: number,
  country: string,
  responseTime: number,
  isMalicious: boolean,
  createdAt: string
}

const RequestLogs = () => {
  const [page, setPage] = useState(10);
  const loaderRef = useRef(null);

  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState<Logs[]>([{
    id: 0,
    ip: "",
    endpoint: "None",
    method: "",
    requestCount: 0,
    anomalyScore: 0,
    statusCode: 0,
    country: "",
    responseTime: 0,
    isMalicious: false,
    createdAt: ""
  }])
  const [maliciousOnly, setMaliciousOnly] = useState(false);
  const [endpointFilter, setEndpointFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/stat/logs", { method: "GET" });
      const data = await response.json();

      setLogs(data);
    };
    fetchData();
  }, []);

  const endpoints = [...new Set(logs.map((r) => r.endpoint))];
  let f = logs.slice(0, page);

  let filtered = f.filter((r) => {
    if (maliciousOnly && !r.isMalicious) return false;
    if (endpointFilter !== "all" && r.endpoint !== endpointFilter) return false;
    if (search && !r.ip.includes(search) && !r.endpoint.includes(search)) return false;
    return true;
  });

  useEffect(() => {
    filtered = f.filter((r) => {
      if (maliciousOnly && !r.isMalicious) return false;
      if (endpointFilter !== "all" && r.endpoint !== endpointFilter) return false;
      if (search && !r.ip.includes(search) && !r.endpoint.includes(search)) return false;
      return true;
    });
  }, [maliciousOnly, endpointFilter, search])

  const statusColor = (status: number) => {
    if (status === 200) return "bg-primary/10 text-primary";
    if (status === 403) return "bg-destructive/10 text-destructive";
    return "bg-warning/10 text-warning";
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 10);
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  // if (logs[0].id == 0) {
  //   return <p>Loading ...</p>
  // }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Request Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">Searchable request log history</p>
      </div>

      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search IP or endpoint..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9 text-sm w-64" />
          </div>
          <Select value={endpointFilter} onValueChange={setEndpointFilter}>
            <SelectTrigger className="w-44 h-9">
              <SelectValue placeholder="Endpoint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Endpoints</SelectItem>
              {endpoints.map((ep) => (
                <SelectItem key={ep} value={ep}>{ep}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch id="mal" checked={maliciousOnly} onCheckedChange={setMaliciousOnly} />
            <Label htmlFor="mal" className="text-xs">Malicious only</Label>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} records</span>
        </div>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30 text-muted-foreground">
                <th className="text-left py-2.5 px-4 font-medium">IP</th>
                <th className="text-left py-2.5 px-4 font-medium">Endpoint</th>
                <th className="text-left py-2.5 px-4 font-medium">Method</th>
                <th className="text-left py-2.5 px-4 font-medium">Status</th>
                <th className="text-left py-2.5 px-4 font-medium">Score</th>
                <th className="text-left py-2.5 px-4 font-medium">Response</th>
                <th className="text-left py-2.5 px-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className={`border-b last:border-0 hover:bg-muted/50 transition-colors ${r.isMalicious ? "bg-destructive/[0.02]" : ""}`}>
                  <td className="py-2 px-4 font-mono text-xs">{r.ip}</td>
                  <td className="py-2 px-4 font-mono text-xs">{r.endpoint}</td>
                  <td className="py-2 px-4">
                    <Badge variant="outline" className="text-[10px]">{r.method}</Badge>
                  </td>
                  <td className="py-2 px-4">
                    <Badge className={`text-[10px] ${statusColor(r.statusCode)}`}>{r.statusCode}</Badge>
                  </td>
                  <td className="py-2 px-4 font-mono text-xs">{r.anomalyScore.toFixed(2)}</td>
                  <td className="py-2 px-4 text-xs text-muted-foreground">{r.responseTime}ms</td>
                  <td className="py-2 px-4 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div ref={loaderRef} style={{ height: '40px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RequestLogs;
