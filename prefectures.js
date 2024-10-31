import { useEffect, useState } from "react";

const Prefectures = () => {
  const [prefectures, setPrefectures] = useState([]);

  useEffect(() => {
    const fetchPrefectures = async () => {
      const response = await fetch(
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
        {
          headers: {
            "X-API-KEY": process.env.RESAS_API_KEY,
          },
        },
      );
      const data = await response.json();
      setPrefectures(data.result);
    };

    fetchPrefectures();
  }, []);

  return (
    <div>
      <h1>都道府県一覧</h1>
      <ul>
        {prefectures.map((pref) => (
          <li key={pref.prefCode}>{pref.prefName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Prefectures;
