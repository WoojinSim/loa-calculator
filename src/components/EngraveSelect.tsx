// RegionCard.jsx

import React, { useEffect } from "react";

interface EngraveProps {
  Value: number;
  Text: string;
  Class?: string;
}
interface EngraveSelectProps {
  index: number;
  engraveList: EngraveProps[] | undefined;
  selectedEngrave: (EngraveProps | null)[];
  setSelectedEngrave: React.Dispatch<React.SetStateAction<(EngraveProps | null)[]>>;
}

const EngraveSelect: React.FC<EngraveSelectProps> = (props) => {
  const handleComboBoxChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newArray = [...props.selectedEngrave];
    const splitString = e.target.value.split("|");
    const tmpObj = { Value: Number(splitString[0]), Text: splitString[1] };
    newArray[props.index] = tmpObj;
    props.setSelectedEngrave(newArray);
  };

  return (
    <select className="select-box" onChange={handleComboBoxChange}>
      <option key="" value="">
        없음
      </option>
      {props.engraveList?.map((element) => (
        <option key={element.Value} value={`${element.Value}|${element.Text}`}>
          {element.Text}
        </option>
      ))}
    </select>
  );
};

export default EngraveSelect;
