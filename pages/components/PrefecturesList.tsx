import React from "react";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type PrefecturesListProps = {
  prefectures: Prefecture[];
  selectedPrefectures: number[];
  onChange: (prefCode: number) => void;
  onReset: () => void;
};

export const PrefecturesList = ({
  prefectures,
  selectedPrefectures,
  onChange,
  onReset,
}: PrefecturesListProps) => {
  return (
    <div>
			<div className="prefectures-container">
				<button onClick={onReset}>全選択解除</button>
					<ul>
						{prefectures.map((pref) => (
							<li key={pref.prefCode}>
							<label>
								<input
									type="checkbox"
									value={pref.prefCode}
									checked={selectedPrefectures.includes(pref.prefCode)}
									onChange={() => onChange(pref.prefCode)}
								/>
								{pref.prefName}
							</label>
							</li>
						))}
					</ul>
			</div>
    </div>
  );
};
