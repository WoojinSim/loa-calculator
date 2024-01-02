import React, { useEffect, useState } from "react";
import "./css/App.css";
import axios from "axios";

import EngraveSelect from "./components/EngraveSelect";

interface EngraveProps {
  Value: number;
  Text: string;
  Class?: string;
}

const postData = {
  ItemLevelMin: 0,
  ItemLevelMax: 1700,
  EtcOptions: [
    {
      FirstOption: 3,
      SecondOption: 118,
    },
    {
      FirstOption: 3,
      SecondOption: 247,
    },
  ],
  Sort: "BUY_PRICE",
  CategoryCode: 30000,
  ItemTier: 3,
  ItemGrade: "유물",
  PageNo: 0,
  SortCondition: "ASC",
};

const getCombinations = (arr: (EngraveProps | null)[]): EngraveProps[][] => {
  const result: EngraveProps[][] = [];
  const nonNullArr = arr as EngraveProps[];
  for (let i = 0; i < nonNullArr.length - 1; i++) {
    for (let j = i + 1; j < nonNullArr.length; j++) {
      result.push([nonNullArr[i], nonNullArr[j]]);
    }
  }
  return result;
};

function App() {
  const [selectedEngrave, setSelectedEngrave] = useState<(EngraveProps | null)[]>(Array(5).fill(null));
  const [engraveList, setEngraveList] = useState<[] | undefined>();

  const searchSubmit = () => {
    const selectedEngraveList = selectedEngrave.filter((el) => el);
    if (selectedEngraveList.length > 0) {
      const resultCombi = getCombinations(selectedEngraveList);
      for (let i = 0; i < resultCombi.length; i++) {
        for (let j = 0; j < resultCombi[i].length; j++) {
          console.log(`${resultCombi[i][j].Text}`);
        }
        console.log("");
      }
    }
  };

  useEffect(() => {
    const fetchItemOptions = async () => {
      try {
        const response = await axios.get("https://developer-lostark.game.onstove.com/auctions/options", {
          headers: {
            accept: "application/json",
            authorization: `bearer ${process.env.REACT_APP_API_KEY}`,
          },
        });
        let engraveListRaw = response.data.EtcOptions[1].EtcSubs;
        engraveListRaw = engraveListRaw.filter(
          (element: { Value: string; Text: string; Class: string }) => element.Class === ""
        );
        setEngraveList(engraveListRaw);

        /*
        const response2 = await axios.post("https://developer-lostark.game.onstove.com/auctions/items", postData, {
          headers: {
            accept: "application/json",
            authorization: `bearer ${process.env.REACT_APP_API_KEY}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response2.data);
        */
      } catch (e) {
        console.error(e);
      }
    };
    fetchItemOptions();
  }, []);

  return (
    <div className="App">
      <div className="select-wrap">
        <EngraveSelect
          index={0}
          engraveList={engraveList}
          selectedEngrave={selectedEngrave}
          setSelectedEngrave={setSelectedEngrave}
        />
        <EngraveSelect
          index={1}
          engraveList={engraveList}
          selectedEngrave={selectedEngrave}
          setSelectedEngrave={setSelectedEngrave}
        />
        <EngraveSelect
          index={2}
          engraveList={engraveList}
          selectedEngrave={selectedEngrave}
          setSelectedEngrave={setSelectedEngrave}
        />
        <EngraveSelect
          index={3}
          engraveList={engraveList}
          selectedEngrave={selectedEngrave}
          setSelectedEngrave={setSelectedEngrave}
        />
        <EngraveSelect
          index={4}
          engraveList={engraveList}
          selectedEngrave={selectedEngrave}
          setSelectedEngrave={setSelectedEngrave}
        />
        <span className="search-btn" onClick={searchSubmit}>
          결과
        </span>
      </div>
    </div>
  );
}

export default App;
