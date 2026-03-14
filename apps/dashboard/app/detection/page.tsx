"use client"

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

interface DetectionPage {

    "0-0.2": number,
    "0.3-0.4": number,
    "0.5-0.6": number,
    "0.7-0.8": number,
    "0.9-1.0": number

}

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


const ThreatDetection = () => {
  const [logs, setLogs] = useState<Logs[]>([{
      id: 0,
      ip: "",
      endpoint: "",
      method: "",
      requestCount: 0,
      anomalyScore: 0,
      statusCode: 0,
      country: "",
      responseTime: 0,
      isMalicious: false,
      createdAt: ""
    }])
  const [requsets, setRequests] = useState<DetectionPage>({
      "0-0.2": 0,
      "0.3-0.4": 0,
      "0.5-0.6": 0,
      "0.7-0.8": 0,
      "0.9-1.0": 0
  })
  const [threshold, setThreshold] = useState(0.5);
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/stat/detection", { method: "GET" });
      const data = await response.json();

      setRequests(data.distribution);
      setLogs(data.requests);
    }
    fetchData();
  }, [])


  const f = logs.filter((r) => r.anomalyScore >= threshold);
  let filtered =  sortAsc ? [...f].sort((a, b) => a.anomalyScore - b.anomalyScore) : [...f].sort((a, b) => b.anomalyScore - a.anomalyScore);

  useEffect(() => {
    const f = logs.filter((r) => r.anomalyScore >= threshold);
    filtered =  sortAsc ? [...f].sort((a, b) => a.anomalyScore - b.anomalyScore) : [...f].sort((a, b) => b.anomalyScore - a.anomalyScore);
  }, [threshold, sortAsc]);

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "bg-destructive text-destructive-foreground";
    if (score >= 0.75) return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  const anomalyDistribution = [
    { range: '0.0-0.2', count: requsets["0-0.2"] },
    { range: '0.2-0.4', count: requsets["0.3-0.4"] },
    { range: '0.4-0.6', count: requsets["0.5-0.6"]},
    { range: '0.6-0.8', count: requsets["0.7-0.8"]},
    { range: '0.8-1.0', count: requsets["0.9-1.0"] }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Threat Detection</h1>
        <p className="text-sm text-muted-foreground mt-1">ML-powered anomaly detection results</p>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Anomaly Score Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={anomalyDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 90%)" />
            <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="count" fill="hsl(152, 60%, 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Malicious Requests</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Threshold:</span>
              <Slider value={[threshold]} onValueChange={(v) => setThreshold(v[0])} min={0} max={1} step={0.05} className="w-32" />
              <span className="text-xs font-mono font-semibold w-8">{threshold.toFixed(2)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{filtered.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">IP</th>
                <th className="text-left py-2 font-medium">Endpoint</th>
                <th className="text-left py-2 font-medium">Method</th>
                <th className="text-left py-2 font-medium cursor-pointer" onClick={() => setSortAsc(!sortAsc)}>
                  <span className="flex items-center gap-1">Score <ArrowUpDown className="h-3 w-3" /></span>
                </th>
                <th className="text-left py-2 font-medium">Status</th>
                <th className="text-left py-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="py-2.5 font-mono text-xs">{r.ip}</td>
                  <td className="py-2.5 font-mono text-xs">{r.endpoint}</td>
                  <td className="py-2.5">
                    <Badge variant="outline" className="text-[10px]">{r.method}</Badge>
                  </td>
                  <td className="py-2.5">
                    <Badge className={`text-[10px] ${getScoreColor(r.anomalyScore)}`}>
                      {r.anomalyScore.toFixed(2)}
                    </Badge>
                  </td>
                  <td className="py-2.5 font-mono text-xs">{r.statusCode}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleTimeString()}
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

export default ThreatDetection;
