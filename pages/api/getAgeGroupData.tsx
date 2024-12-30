// pages/api/getAgeGroupData.js
export default async function handler(req, res) {
  const { prefCode, year } = req.query;

  if (!prefCode || !year) {
    return res
      .status(400)
      .json({ error: "Prefecture code and year are required." });
  }
  if (!process.env.REPAS_API_KEY) {
    return res.status(500).json({ error: "API key is not configured." });
  }
  try {
    // RESAS APIから年齢層別人口データを取得
    const response = await fetch(
      `https://opendata.resas-portal.go.jp/api/v1/population/composition/pyramid?prefCode=${prefCode}&cityCode=-&yearLeft=${year}&yearRight=${year}`,
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
    console.error("Error fetching age group data:", error);
    res.status(500).json({
      error: "Failed to fetch age group data.",
      details: error.message, // 追加: エラー詳細をレスポンスに含める
    });
  }
}
