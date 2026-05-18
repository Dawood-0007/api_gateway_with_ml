import TrafficAnalyticsPage from "./AnalyticsPage";

export default async function TrafficAnalytics() {
  const baseUrl = process.env.BACKEND_SERVER || process.env.NEXT_PUBLIC_BACKEND_CLIENT;

  const result = await fetch(`${baseUrl}/api/stat/analytics`, { method: "GET", cache: "no-store"});
      const data = await result.json();

  return (
    <TrafficAnalyticsPage initialData={data} />
  );
};

