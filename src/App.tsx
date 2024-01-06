// App.tsx

// 필수 라이브러리
import React, { useEffect, useState } from "react";
import axios, { AxiosPromise, AxiosResponse } from "axios";

// CSS
import "./css/App.css";
import "./css/rockItem.css";

// 컴포넌트
import EngraveSelect from "./components/EngraveSelect";

// 인터페이스
import { EngraveProps, AuctionApiResponse } from "./interfaces/APIInterface";

const postDataRaw = {
  ItemLevelMin: 0,
  ItemLevelMax: 1700,
  EtcOptions: [
    {
      FirstOption: 3,
      SecondOption: 0,
    },
    {
      FirstOption: 3,
      SecondOption: 0,
    },
  ],
  Sort: "BUY_PRICE",
  CategoryCode: 30000,
  ItemTier: 3,
  ItemGrade: "유물",
  PageNo: 0,
  SortCondition: "ASC",
};

// 가능한 각인 조합 찾기
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
  const [possibleCombi, setPossibleCombi] = useState<EngraveProps[][]>([]);
  const [caseAmount, setCaseAmount] = useState<number>(0);
  const [caseDisplayNode, setCaseDisplayNode] = useState<React.ReactElement[]>([]);
  const [itemDisplayNode, setItemDisplayNode] = useState<React.ReactElement[]>([]);

  // 경매장 API 검색
  const fetchData = async (requestList: AxiosPromise[]) => {
    try {
      const responses: AxiosResponse[] = await axios.all(requestList);
      let averagePrices: number[] = [];
      let lowestPrice = 10000000;
      setItemDisplayNode([]);

      responses.forEach((response, index) => {
        const itemData: AuctionApiResponse = response.data;
        let averagePrice = 0;
        itemData.Items.forEach((eachItem) => {
          averagePrice += eachItem.AuctionInfo.BuyPrice || 0;
        });
        const itemAveragePrice = Math.round(averagePrice / itemData.Items.length);
        averagePrices.push(itemAveragePrice);
        if (lowestPrice > itemAveragePrice) {
          lowestPrice = itemAveragePrice;
        }
      });

      responses.forEach((response, index) => {
        const itemData: AuctionApiResponse = response.data;

        setItemDisplayNode((prevElements) => [
          ...prevElements,
          <div className={`rock-item ${lowestPrice == averagePrices[index] ? "lowest" : ""}`} key={index}>
            <span className="rock-item-title">{itemData.Items[0].Name}</span>
            <span className="rock-item-price-label">최저가 10개 평균</span>
            <span className="rock-item-price">
              {averagePrices[index].toLocaleString()}
              <span className="gold-coin" />
            </span>
            <span className="rock-item-engrave">{possibleCombi[index][0].Text}</span>
            <span className="rock-item-engrave">{possibleCombi[index][1].Text}</span>
          </div>,
        ]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 검색버튼
  const searchSubmit = () => {
    const engraveListRaw = selectedEngrave.filter((el) => el);
    setSelectedEngrave(engraveListRaw);

    if (engraveListRaw.length > 2) {
      setCaseAmount(possibleCombi.length);
      setPossibleCombi(getCombinations(engraveListRaw));
    } else {
      alert("각인을 3개 이상 선택해야합니다.");
    }
  };

  // 가능한 조합 업데이트 됐을 때
  useEffect(() => {
    let requestList: AxiosPromise[] = [];

    possibleCombi.forEach((element, index) => {
      let postData = postDataRaw;
      postData.EtcOptions[0].SecondOption = element[0].Value;
      postData.EtcOptions[1].SecondOption = element[1].Value;

      const request = axios.post("https://developer-lostark.game.onstove.com/auctions/items", postData, {
        headers: {
          accept: "application/json",
          authorization: `bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      requestList.push(request);
    });
    fetchData(requestList);
  }, [possibleCombi]);

  useEffect(() => {
    setCaseDisplayNode([]);
    selectedEngrave.forEach((element, index) => {
      if (element) {
        setCaseDisplayNode((prevElements) => [
          ...prevElements,
          <span className="engrave-item" key={index}>
            {element?.Text}
          </span>,
        ]);
      }
    });
  }, [selectedEngrave]);

  // 각인 데이터 가져오기
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
      } catch (e) {
        console.error(e);
      }
    };
    fetchItemOptions();
  }, []);

  return (
    <div className="App">
      <div className="container header">심씨의 돌 검색기</div>
      <div className="container select-wrap">
        <div className="select-inner-wrap">
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
        </div>
        <span className="search-btn" onClick={searchSubmit}>
          찾기!
        </span>
      </div>
      <div className="container case-display-wrap">
        <div className="case-display">{caseDisplayNode}</div>
      </div>
      <div className="container rock-display-wrap">{itemDisplayNode}</div>
    </div>
  );
}

export default App;
