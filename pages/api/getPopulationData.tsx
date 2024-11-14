// pages/api/getPopulationData.js
export default async function handler(req, res) {
  const { prefCode } = req.query;

  if (!prefCode) {
    return res.status(400).json({ error: "Prefecture code is required." });
  }

  try {
    // RESAS APIから総人口データを取得
    const response = await fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${prefCode}`,
      {
        headers: {
          "X-API-KEY": process.env.REPAS_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching population data:", error);
    res.status(500).json({ error: "Failed to fetch population data." });
  }
}
