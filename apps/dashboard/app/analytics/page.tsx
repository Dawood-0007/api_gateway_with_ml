import TrafficAnalyticsPage from "./AnalyticsPage";

export default async function TrafficAnalytics()  {
  
      const response = await fetch("http://localhost:5000/api/stat/analytics", { method: "GET", cache: "no-store"});
      const data = await response.json();

  return (
    <TrafficAnalyticsPage initialData={data} />
  );
};

