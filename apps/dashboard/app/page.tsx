import OverviewPage from "@/components/DashboardPage";

export default async function Overview() {
 
      const result = await fetch("http://localhost:5000/api/stat/dash", {
        method: "GET"
      });
      const data = await result.json();


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time WAF monitoring dashboard</p>
      </div>

    <OverviewPage initialData={data} />
    </div>
  );
};

