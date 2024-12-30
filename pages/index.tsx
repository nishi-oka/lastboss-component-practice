import React, { useState, useEffect } from "react";
import { PrefecturesList } from "./components/PrefecturesList";
import { PopulationType } from "./components/PopulationType";
import { Graph } from "./components/Graph";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type HomeProps = {
  initialPrefectures: Prefecture[];
};

export async function getServerSideProps() {
  const response = await fetch(
    "https://opendata.resas-portal.go.jp/api/v1/prefectures",
    {
      headers: {
        "X-API-KEY": process.env.REPAS_API_KEY || "",
      },
    }
  );
  const data = await response.json();

  return {
    props: {
      initialPrefectures: data.result || [],
    },
  };
}

export default function Home({ initialPrefectures }: HomeProps) {
  const [prefectures, setPrefectures] = useState<Prefecture[]>(initialPrefectures);
  const [selectedPrefectures, setSelectedPrefectures] = useState([]);
  const [populationType, setPopulationType] = useState("total");
  const [populationData, setPopulationData] = useState({});
  const [prefectureColors, setPrefectureColors] = useState({});

  useEffect(() => {
    assignColors(initialPrefectures); // 初期都道府県のカラーを割り当て
  }, [initialPrefectures]);

  const assignColors = (prefectures: Prefecture[]): void => {
    const colors: Record<number, string> = {};
    prefectures.forEach((pref) => {
      colors[pref.prefCode] =
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
    });
    setPrefectureColors(colors); // カラーを state に保存
  };

  const handlePrefectureChange = async (prefCode: number) => {
    if (selectedPrefectures.includes(prefCode)) {
      setSelectedPrefectures(
        selectedPrefectures.filter((code) => code !== prefCode)
      );
      setPopulationData((prevData) => {
        const newData = { ...prevData };
        delete newData[prefCode];
        return newData;
      });
    } else {
      setSelectedPrefectures([...selectedPrefectures, prefCode]);
      await fetchPopulationData(prefCode);
    }
  };

  const fetchPopulationData = async (prefCode: number) => {
    if (populationData[prefCode]) {
      return; // Use cached data if available
    }
    try {
      const responseTotal = await fetch(
        `/api/getPopulationData?prefCode=${prefCode}`
      );
      console.log("responseTotal", responseTotal);
      const dataTotal = await responseTotal.json();
      const yearDataTotal = dataTotal?.result?.data;

      if (Array.isArray(yearDataTotal) && yearDataTotal.length > 0) {
        const yearTotal = yearDataTotal[0].data
          .filter((item) => item.year >= 1960)
          .map((item) => ({
            year: item.year,
            total: item.value,
          }));

          const ageGroupData = await fetchAgeGroupData(prefCode);
          const combinedData = yearTotal.map((yearItem) => {
            const ageData =
              ageGroupData.find((age) => age.year === yearItem.year) || {
                youth: 0,
                working: 0,
                elderly: 0,
              };
            return {
              year: yearItem.year,
              total: yearItem.total,
              youth: ageData.youth || 0,
              working: ageData.working || 0,
              elderly: ageData.elderly || 0,
            };
          });

          setPopulationData((prevData) => ({
            ...prevData,
            [prefCode]: combinedData,
          }));
        } else {
          setPopulationData((prevData) => ({
            ...prevData,
            [prefCode]: [],
          }));
        }
      } catch (error) {
        console.error("Error fetching population data:", error);
        alert("人口データの取得に失敗しました。");
        setPopulationData((prevData) => ({
          ...prevData,
          [prefCode]: [],
        }));
      }
    };

    const fetchAgeGroupData = async (
      prefCode: number
    ): Promise<{ year: number; youth: number; working: number; elderly: number }[]> => {
      const yearRange = Array.from(
        { length: (2045 - 1980) / 5 + 1 },
        (_, i) => 1980 + i * 5
      );
      const ageGroupData = await Promise.all(
        yearRange.map(async (year) => {
          const response = await fetch(
            `/api/getAgeGroupData?prefCode=${prefCode}&year=${year}`
          );
          const data = await response.json();
          const yearLeftData = data?.result?.yearLeft;

          return yearLeftData
            ? {
                year,
                youth: yearLeftData.newAgeCount || 0,
                working: yearLeftData.middleAgeCount || 0,
                elderly: yearLeftData.oldAgeCount || 0,
              }
            : { year, youth: 0, working: 0, elderly: 0 };
        })
      );

      return ageGroupData;
    };

    const handlePopulationTypeChange = (type: string) => {
      setPopulationType(type);
    };

  const datasets = selectedPrefectures
    .map((prefCode) => {
      const color = prefectureColors[prefCode];
      const data = populationData[prefCode] || [];

      return {
        label: `${prefectures.find((pref) => pref.prefCode === prefCode)?.prefName}の${
          populationType === "total"
            ? "総人口"
            : populationType === "youth"
              ? "年少人口"
              : populationType === "working"
                ? "生産年齢人口"
                : "老年人口"
        }`,
        data: data.map((item) => {
          if (populationType === "total") return item.total;
          if (populationType === "youth") return item.youth;
          if (populationType === "working") return item.working;
          return item.elderly;
        }),
        borderColor: color,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      };
    })
    .filter((dataset) => dataset.data.length > 0);

  return (
    <div>
      <h1>都道府県別人口構成</h1>
      <h2>都道府県一覧</h2>
      <PrefecturesList
        prefectures={prefectures}
        selectedPrefectures={selectedPrefectures}
        onChange={handlePrefectureChange}
        onReset={() => setSelectedPrefectures([])}
      />

      <h2>人口タイプを選択</h2>
      <PopulationType
        populationType={populationType}
        handlePopulationTypeChange={handlePopulationTypeChange}
      />

      <h2>人口構成グラフ</h2>
      <Graph
        selectedPrefectures={selectedPrefectures}
        populationType={populationType}
        populationData={populationData}
        datasets={datasets}
      />
    </div>
  );
}
