import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Overpass query to get restaurants in Copenhagen
  const query = `
  [out:json][timeout:25];
  (
    node
      ["amenity"="restaurant"]
      (55.6800,12.5300,55.7050,12.5750);
    node
      ["name"~"kebab",i]
      (55.6800,12.5300,55.7050,12.5750);
  );
  out;
`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse nodes into simpler format
    const restaurants = data.elements.map((r: any) => ({
      id: r.id,
      name: r.tags?.name || 'Unnamed',
      cuisine: r.tags?.cuisine || 'unknown',
      lat: r.lat,
      lon: r.lon,
    }));

    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching Overpass data:', error);
    res.status(500).json({ error: 'Failed to fetch restaurant data' });
  }
}
