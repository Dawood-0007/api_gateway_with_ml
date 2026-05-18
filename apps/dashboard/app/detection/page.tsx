import ThreatPage from "./DetectionPage";

export default async function ThreatDetection() {
  const baseUrl = process.env.BACKEND_SERVER || process.env.NEXT_PUBLIC_BACKEND_CLIENT;

  const result = await fetch(`${baseUrl}/api/stat/detection`, { method: "GET", cache: "no-store" });
  const data = await result.json();

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
