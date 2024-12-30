import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

type GraphProps = {
  selectedPrefectures: number[];
  populationType: string;
  populationData: Record<number, any>;
  datasets: any[];
};

export const Graph = ({ selectedPrefectures, populationType, populationData, datasets }: GraphProps) => {
  return (
    <div>
      <div className="graph-container">
        <Line
          data={{
            labels: (populationData[selectedPrefectures[0]] || [])
              .filter(
                (item) =>
                  (populationType === "total" && item.year >= 1960) ||
                  (populationType !== "total" && item.year >= 1980)
              )
              .map((item) => item.year),
            datasets:
              datasets.length > 0
                ? datasets.map((dataset) => ({
                    ...dataset,
                    data: dataset.data.filter(
                      (_, index) =>
                        (populationType === "total" &&
                          (populationData[selectedPrefectures[0]] || [])[index]
                            ?.year >= 1960) ||
                        (populationType !== "total" &&
                          (populationData[selectedPrefectures[0]] || [])[index]
                            ?.year >= 1980)
                    ),
                  }))
                : [
                    {
                      label: "総人口",
                      data: [{ year: 1960, value: 0 }],
                      borderColor: "rgba(75, 192, 192, 1)",
                      backgroundColor: "rgba(75, 192, 192, 0.2)",
                    },
                  ],
          }}
        />
      </div>
    </div>
  );
};
