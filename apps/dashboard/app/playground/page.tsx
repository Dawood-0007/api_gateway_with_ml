import ApiPlaygroundPage from "./PlaygroundPage";

export default async function ApiPlayground() {

  const response = await fetch("http://localhost:5000/api/stat/hourlyData", { method: "GET" });
  const response2 = await fetch("http://localhost:5000/api/stat/checkIp", { method: "GET" });
  const data = await response.json();
  const data2 = await response2.json();

  return (
    <ApiPlaygroundPage initialData={data} contain={data2.contain ?? false} />
  );
};

