interface EngraveProps {
  Value: number;
  Text: string;
  Class?: string;
}

// 경매장 response 인터페이스
interface AuctionApiResponse {
  PageNo: number;
  PageSize: number;
  TotalCount: number;
  Items: Array<{
    Name: string;
    Grade: string;
    Tier: number;
    Level: number | null;
    Icon: string;
    GradeQuality: number | null;
    AuctionInfo: {
      StartPrice: number;
      BuyPrice: number | null;
      BidPrice: number;
      EndDate: string;
      BidCount: number;
      BidStartPrice: number;
      IsCompetitive: boolean;
      TradeAllowCount: number;
    };
    Options: Array<{
      Type:
        | "None"
        | "SKILL"
        | "STAT"
        | "ABILITY_ENGRAVE"
        | "BRACELET_SPECIAL_EFFECTS"
        | "GEM_SKILL_COOLDOWN_REDUCTION"
        | "GEM_SKILL_COOLDOWN_REDUCTION_IDENTITY"
        | "GEM_SKILL_DAMAGE"
        | "GEM_SKILL_DAMAGE_IDENTITY"
        | "BRACELET_RANDOM_SLOT";
      OptionName: string;
      OptionNameTripod: string;
      Value: number;
      IsPenalty: boolean;
      ClassName: string;
    }>;
  }>;
}

export type { EngraveProps, AuctionApiResponse };
