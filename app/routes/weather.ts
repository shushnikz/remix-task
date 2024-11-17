import { LoaderFunction } from "@remix-run/node";

const apiKey = process.env.WEATHER_API_KEY;

export let loader: LoaderFunction = async ({ request }) => {
  const city = new URL(request.url).searchParams.get("city");

  if (!city) {
    return new Response(JSON.stringify({ error: "City not provided" }), {
      status: 400,
    });
  }

  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
  );

  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch weather data" }),
      { status: response.status }
    );
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
