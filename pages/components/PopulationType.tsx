import React from "react";

type PopulationTypeProps = {
  populationType: string;
  handlePopulationTypeChange: (type: string) => void;
};

export const PopulationType = ({ populationType, handlePopulationTypeChange }: PopulationTypeProps) => {
  return (
    <div>
      <div className="population-type-container">
        <div>
          <label className="total">
            <input
              type="radio"
              value="total"
              checked={populationType === "total"}
              onChange={() => handlePopulationTypeChange("total")}
            />
            総人口
          </label>
          <label className="youth">
            <input
              type="radio"
              value="youth"
              checked={populationType === "youth"}
              onChange={() => handlePopulationTypeChange("youth")}
            />
            年少人口(0歳～14歳)
          </label>
          <label className="working">
            <input
              type="radio"
              value="working"
              checked={populationType === "working"}
              onChange={() => handlePopulationTypeChange("working")}
            />
            生産年齢人口(15歳～64歳)
          </label>
          <label className="elderly">
            <input
              type="radio"
              value="elderly"
              checked={populationType === "elderly"}
              onChange={() => handlePopulationTypeChange("elderly")}
            />
            老年人口(65歳以上)
          </label>
        </div>
      </div>
    </div>
  );
};
