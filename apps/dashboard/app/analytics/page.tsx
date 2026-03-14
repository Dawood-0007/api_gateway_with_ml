"use client"

import { useMemo, useState, useEffect } from "react";
import { generateTimeSeriesData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalyticsPage {
  endpointsCount: [{ endpoint: string, hit: number }],
  methodCount: [{ method: string, hit: number }],
  ipCount: [{ ip: string, hit: number }],
  hourlyReq: [{
    time: string,
    total: number,
    malicious: number
  }];
}

const TrafficAnalytics = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [timeData, setTimeData] = useState([{
      time: "",
      total: 0,
      malicious: 0
    }]);
  const [data, setData] = useState<AnalyticsPage>({
    endpointsCount: [{ endpoint: "", hit: 0 }],
    methodCount: [{ method: "", hit: 0 }],
    ipCount: [{ ip: "", hit: 0 }],
    hourlyReq: [{
      time: "",
      total: 0,
      malicious: 0
    }]
  });
  const ti = useMemo(() => {
    const hours = timeRange === "1h" ? 1 : timeRange === "24h" ? 24 : 168;
    return generateTimeSeriesData(hours, timeRange === "1h" ? 2 : timeRange === "24h" ? 30 : 360);
  }, [timeRange]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/stat/analytics", { method: "GET" });
      const data = await response.json();

      setData(data);
      setTimeData(data.hourlyReq)
    }
    fetchData();
  }, []);

  const fillColors = ['hsl(152, 60%, 45%)', 'hsl(210, 70%, 50%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)'];

  const topEndpoints =
    data.endpointsCount.map((e) => {
      return { endpoint: e.endpoint, hits: e.hit }
    });

  const httpMethods =
    data.methodCount.map((e, i) => {
      return { method: e.method, count: e.hit, fill: fillColors[i] }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Traffic Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep traffic insights and patterns</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Requests Over Time</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 90%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />

            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(152, 60%, 45%)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="malicious"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Top Endpoints</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topEndpoints} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 90%)" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
              <YAxis type="category" dataKey="endpoint" tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="hits" fill="hsl(152, 60%, 45%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">HTTP Methods</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={httpMethods} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={({ method, percent }) => `${method} ${percent ? (percent * 100).toFixed(0) : "0%"}%`} labelLine={false}>
                {httpMethods.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Requests by IP</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left py-2 font-medium">IP Address</th>
                <th className="text-left py-2 font-medium">Country</th>
                <th className="text-right py-2 font-medium">Requests</th>
              </tr>
            </thead>
            <tbody>
              {data.ipCount.map((row) => (
                <tr key={row.ip} className="border-b last:border-0">
                  <td className="py-2.5 font-mono text-xs">{row.ip}</td>
                  <td className="py-2.5">{"Pakistan"}</td>
                  <td className="py-2.5 text-right font-semibold">{row.hit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalytics;
