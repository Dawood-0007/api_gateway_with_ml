import ThreatPage from "./DetectionPage";

export default async function ThreatDetection() {
  
      const response = await fetch("http://localhost:5000/api/stat/detection", { method: "GET", cache: "no-store" });
      const data = await response.json();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Threat Detection</h1>
        <p className="text-sm text-muted-foreground mt-1">ML-powered anomaly detection results</p>
      </div>
      <ThreatPage initialData={data} />
    </div>
  )
};
