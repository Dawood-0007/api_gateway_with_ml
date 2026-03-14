"use client"

import { useState, useMemo } from "react";
import { mlMetrics, anomalyScoreTimeline, modelDecisionDistribution } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Slider } from "@/components/ui/slider";
import { StatCard } from "@/components/statCard";
import { Brain, Target, Crosshair, Activity, Database, GitBranch } from "lucide-react";

const MLMonitoring = () => {
  const [threshold, setThreshold] = useState(mlMetrics.threshold);
  const timeline = useMemo(() => anomalyScoreTimeline(), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ML Monitoring</h1>
        <p className="text-sm text-muted-foreground mt-1">Model performance and anomaly detection metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Model Version" value={mlMetrics.modelVersion} icon={GitBranch} />
        <StatCard title="Accuracy" value={`${mlMetrics.accuracy}%`} icon={Target} variant="success" />
        <StatCard title="Precision" value={`${mlMetrics.precision}%`} icon={Crosshair} variant="success" />
        <StatCard title="Recall" value={`${mlMetrics.recall}%`} icon={Activity} />
        <StatCard title="F1 Score" value={`${mlMetrics.f1Score}%`} icon={Brain} variant="success" />
        <StatCard title="Requests Evaluated" value={mlMetrics.totalEvaluated.toLocaleString()} icon={Database} />
      </div>

      <div className="bg-card border rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Detection Threshold</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Sensitivity:</span>
            <Slider value={[threshold]} onValueChange={(v) => setThreshold(v[0])} min={0.1} max={0.95} step={0.05} className="w-40" />
            <span className="text-sm font-mono font-bold">{threshold.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Scores above <span className="font-semibold">{threshold.toFixed(2)}</span> will be flagged as malicious.
          {threshold < 0.5 ? " ⚠️ Low threshold — may increase false positives." : threshold > 0.8 ? " High threshold — may miss some threats." : " Balanced setting."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Anomaly Score Over Time</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 90%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" domain={[0, 1]} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="avgScore" stroke="hsl(152, 60%, 45%)" strokeWidth={2} name="Avg Score" dot={false} />
              <Line type="monotone" dataKey="maxScore" stroke="hsl(0, 72%, 51%)" strokeWidth={2} name="Max Score" dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-5">
          <h3 className="text-sm font-semibold mb-4">Model Decisions</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={modelDecisionDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count" strokeWidth={2} stroke="hsl(0, 0%, 100%)">
                {modelDecisionDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2">
            {modelDecisionDistribution.map((entry) => (
              <div key={entry.decision} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.fill }} />
                {entry.decision}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLMonitoring;
