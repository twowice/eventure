const WALK_COLOR = "#D9D9D9";

const SUBWAY_LINE_COLOR: Record<number, string> = {
    1: "#0032A0",
    2: "#00B140",
    3: "#FC4C02",
    4: "#00A9E0",
    5: "#A05EB5",
    6: "#A9431E",
    7: "#67823A",
    8: "#E31C79",
    9: "#8C8279",
};

const BUS_TYPE_COLOR: Record<number, string> = {
    3: "#00A55D",  // 마을버스
    11: "#0050A4", // 간선(시내)
    12: "#52AA48", // 지선(시내)
    14: "#D60C1F", // 광역
    4: "#60287C",  // 직행좌석
    15: "#F7941C", // 급행
    5: "#00A8CB",  // 공항버스
    20: "#9DCB3C", // 농어촌버스
    22: "#00A3DA", // 경기도 시외형버스
    13: "#FFD400", // 순환
    1: "#52AA48",  // 일반(도시/지역에 따라 시내 취급)
    2: "#0067B9",  // 좌석
    6: "#0A3F7F",  // 간선급행
    26: "#008299",  // 급행간선
    30: "#00BCD4",  // 한강버스
};

export function getBusColor(sub: any) {
    const t = sub.lane?.[0]?.type;
    return BUS_TYPE_COLOR[t] ?? "";
}

export function getSegmentColor(sub: any) {
    if (sub.trafficType === 3) return WALK_COLOR;

    if (sub.trafficType === 1) {
        const subwayCode = sub.lane?.[0]?.subwayCode;
        return SUBWAY_LINE_COLOR[subwayCode] ?? "#6B7280";
    }

    if (sub.trafficType === 2) {
        const busType = sub.lane?.[0]?.type;
        return BUS_TYPE_COLOR[busType] ?? "#6B7280";
    }

    return "#6B7280";
}