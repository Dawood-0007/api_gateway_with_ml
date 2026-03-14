"use client"

import { Activity, ShieldAlert, Ban, Zap, TrendingUp, Gauge } from "lucide-react";
import { StatCard } from "@/components/statCard";
import { generateTimeSeriesData } from "@/data/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useMemo, useEffect, useState } from "react";

interface dashboardData {
  malicious: number,
  normal: number,
  totalReq: number,
  avgAnomaly: number,
  totalIpBlocked: number,
  hourlyReq: [{
    hour: string,
    request_count: number,
  }];
};

const Overview = () => {
  const timeData = useMemo(() => generateTimeSeriesData(1, 2), []);
  const [data, setData] = useState<dashboardData>({
    malicious: 0,
    normal: 0,
    totalReq: 0,
    avgAnomaly: 0,
    totalIpBlocked: 0,
    hourlyReq: [{
      hour: "",
      request_count: 0
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("http://localhost:5000/api/stat/dash", {
        method: "GET"
      });
      const data = await result.json();
      setData(data);
    }
    fetchData();
  }, [])

  const maliciousVsNormal = [
    { name: 'Normal', value: data.normal, fill: 'hsl(152, 60%, 45%)' },
    { name: 'Malicious', value: data.malicious, fill: 'hsl(0, 72%, 51%)' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time WAF monitoring dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Requests" value={(data.malicious + data.normal).toLocaleString()} icon={Activity} variant="success" />
        <StatCard title="Malicious Requests" value={data.malicious.toLocaleString()} subtitle={`${(data.malicious * 100)/(data.malicious + data.normal)}% of total`} icon={ShieldAlert} variant="danger" />
        <StatCard title="Blocked IPs" value={data.totalIpBlocked} icon={Ban} variant="warning" />
        <StatCard title="Requests / Hour" value={data.hourlyReq[0] ? data.hourlyReq[0].request_count?.toLocaleString() : "0"} subtitle="Live" icon={Zap} variant="success" />
        <StatCard title="Avg Anomaly Score" value={data.avgAnomaly ? data.avgAnomaly.toFixed(2) : 0} icon={Gauge} />
        <StatCard title="Detection Rate" value="97.3%" subtitle="ML Model v2.4.1" icon={TrendingUp} variant="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Requests Per Hour</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.hourlyReq}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 90%)" />

              <XAxis
                dataKey="hour"
                tick={{ fontSize: 10 }}
                stroke="hsl(160, 10%, 45%)"
              />

              <YAxis
                tick={{ fontSize: 10 }}
                stroke="hsl(160, 10%, 45%)"
              />

              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(145, 20%, 90%)"
                }}
              />

              <Area
                type="monotone"
                dataKey="request_count"
                stroke="hsl(152, 60%, 45%)"
                fill="url(#greenGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Malicious vs Normal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={maliciousVsNormal} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2} stroke="hsl(0, 0%, 100%)">
                {maliciousVsNormal.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {maliciousVsNormal.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.fill }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
