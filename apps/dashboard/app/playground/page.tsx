import ApiPlaygroundPage from "./PlaygroundPage";

export default async function ApiPlayground() {
  const baseUrl = process.env.BACKEND_SERVER || process.env.NEXT_PUBLIC_BACKEND_CLIENT;

  const result = await fetch(`${baseUrl}/api/stat/hourlyData`, { method: "GET" });
  const response = await fetch(`${baseUrl}/api/stat/checkIp`, { method: "GET" });
  const data = await result.json();
  const data2 = await response.json();

  return (
    <ApiPlaygroundPage initialData={data} contain={data2.contain ?? false} />
  );
};

