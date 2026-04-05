"use client"

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Flame, CloudLightning, Bug, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "warning" | "danger" | "success";
}

const ApiPlayground = () => {
  const [chartData, setChartData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: i, normal: Math.floor(Math.random() * 30 + 20), malicious: 0 }))
  );
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: LogEntry["type"]) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, message, type }]);
    setTimeout(() => logRef.current?.scrollTo(0, logRef.current.scrollHeight), 50);
  }, []);

  const passswordPattern = () => {
    let patternArray = [];
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    for (let i = 0; i < 500; i++) {
      let password = "";
      for (let j = 0; j < 8; j++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
      }
      patternArray.push(password);
    }

    return patternArray;
  };

  const simulate = useCallback(async (type: string) => {
    setLoading(type);
    addLog(`Starting ${type} simulation...`, "info");

    if (type === "normal") {
      addLog("Sending 10 normal GET requests to /api/data", "success");

      for (let i = 0; i < 10; i++) {
        const data = await fetch("http://localhost:5000/api/data");
      }

      addLog("Sent and all request pass anomaly threshold", "success");

      setChartData((prev) => [...prev.slice(-19), { t: prev.length, normal: Math.floor(Math.random() * 20 + 50), malicious: 0 }]);
    } else if (type === "brute") {
      addLog("Sending 50 POST requests to /api/login...", "warning");

      try {
        const passwords = passswordPattern();
        for (let pass in passwords) {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: "email@email.com", password: pass })
          });

          if (res.status == 403) {
            addLog("ML detected brute force pattern", "danger");
            addLog("IP blocked automatically", "danger");
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }


      setChartData((prev) => [...prev.slice(-19), { t: prev.length, normal: 10, malicious: 50 }]);
    } else if (type === "ddos") {
      addLog("Simulating DDoS flood — 500 req/s...", "warning");

      try {
        for (let i = 0; i < 500; i++) {
          const data = await fetch("http://localhost:5000/api/data");

          if (!data.ok) {
            addLog("Traffic spike detected by anomaly model", "danger");
            addLog("Traffic normalized", "success");
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }

      setChartData((prev) => [...prev.slice(-19), { t: prev.length, normal: 15, malicious: 120 }]);
    } else if (type === "payload") {
      addLog("Sending SQL injection payload: ' OR 1=1 --", "warning");

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email: "email@email.com' OR 1=1", password: "123456" })
        });

        if (!response.ok) {
          addLog("ML flagged payload (anomaly score: -0.01)", "danger");
          addLog("Request blocked, IP flagged for review", "danger");
        }
      } catch (err) {
        console.log(err);
      }



      setChartData((prev) => [...prev.slice(-19), { t: prev.length, normal: 25, malicious: 8 }]);
    }

    setLoading(null);
  }, [addLog]);

  const logColors = { info: "text-muted-foreground", warning: "text-warning", danger: "text-destructive", success: "text-primary" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">Simulate attacks and watch the WAF respond in real-time</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { type: "normal", label: "Normal Traffic", icon: Send, desc: "Send safe requests" },
          { type: "brute", label: "Brute Force", icon: Flame, desc: "Login attack sim" },
          { type: "ddos", label: "DDoS Flood", icon: CloudLightning, desc: "Traffic spike" },
          { type: "payload", label: "SQL Injection", icon: Bug, desc: "Malicious payload" },
        ].map(({ type, label, icon: Icon, desc }) => (
          <Button
            key={type}
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 hover:border-primary/50 hover:bg-accent"
            onClick={() => simulate(type)}
            disabled={loading !== null}
          >
            {loading === type ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
            <span className="text-xs font-semibold">{label}</span>
            <span className="text-[10px] text-muted-foreground">{desc}</span>
          </Button>
        ))}
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Live Traffic Monitor</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="pgGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(152, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pgRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(145, 20%, 90%)" />
            <XAxis dataKey="t" tick={false} stroke="hsl(160, 10%, 45%)" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(160, 10%, 45%)" />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Area type="monotone" dataKey="normal" stroke="hsl(152, 60%, 45%)" fill="url(#pgGreen)" strokeWidth={2} />
            <Area type="monotone" dataKey="malicious" stroke="hsl(0, 72%, 51%)" fill="url(#pgRed)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-3">Event Log</h3>
        <div ref={logRef} className="h-48 overflow-y-auto font-mono text-xs space-y-1 bg-muted/50 rounded-md p-3">
          {logs.length === 0 && <p className="text-muted-foreground">Click a simulation button to start...</p>}
          {logs.map((log, i) => (
            <div key={i} className={logColors[log.type]}>
              <span className="text-muted-foreground">[{log.time}]</span> {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiPlayground;
