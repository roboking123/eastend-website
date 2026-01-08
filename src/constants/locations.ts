// 城市類型
export type CityType = "city" | "region" | "sea";

// 主題配色 (金色=地神/人類系, 銀色=月神/吸血鬼系)
export type ThemeColor = "gold" | "silver";

// 地點資料 - 基於 Universe_DB 設定檔
export const locations = [
    {
        id: "eastend",
        name: "East End City",
        nameTW: "東末城",
        type: "city" as CityType,
        theme: "silver" as ThemeColor, // 吸血鬼/黑王統治
        position: { x: 76.5, y: 61.8 }, // 右下方
        faction: "獨立城邦",
        ruler: "東末城主",
        description: "在帝國滅亡後建立的庇護所型城市，唯一允許人類與吸血鬼平等待遇的城市。位於世界最東端，背靠虛無之海，是退無可退的最後堡壘。",
        image: "/images/regions/Frame 1.png",
        details: [
            "滅國元年由黑王建立，收容大量難民後裔",
            "實行獨特的「血稅制度」維持兩族共存",
        ],
        landmarks: [
            { name: "黑王城堡", description: "東末的至高權力象徵" },
            { name: "貴族區別館", description: "黑王的私人別館，薇妮雅的住所。" },
            { name: "小教堂", description: "由老神父建立，現由約翰繼承。教廷傳統風格，充滿植物繪與自然光。" }
        ],
        systems: {
            bloodTax: {
                title: "血稅制度",
                humanDuty: "每季繳納定量鮮血。在指定小房間內等候，由配對的吸血鬼來吸血。可申請更換配對人選。",
                vampireDuty: "每月繳納金錢給官方，作為血液交易的對價。",
                rules: ["嚴禁私下取血進食", "嚴禁私下交易血液", "所有管道由官方控管", "血稅法只在城內有效"]
            }
        },
        issues: [
            "兩族表面平等，實際存在隱形歧視",
            "城主 vs 長老的權力角力持續進行",
            "部分吸血鬼想離開東末，回歸北都城傳統派"
        ]
    },
    {
        id: "north",
        name: "North Capital",
        nameTW: "北都城",
        type: "city" as CityType,
        theme: "gold" as ThemeColor, // 人類/薪王統治，吸血鬼僅為躲藏客居
        position: { x: 52.2, y: 24 }, // 上方偏中
        faction: "北郡",
        ruler: "薪王",
        description: "原帝國「北郡城」，帝國滅亡後由薪王統治。吸血鬼的傳統躲藏地之一，與東末城有頻繁貿易往來。",
        image: "/images/regions/Frame 4.png",
        details: [
            "帝國時期為北郡城，現由薪王自封統治",
            "吸血鬼傳統上在此躲藏客居，非統治者",
            "北方人種黑髮黑眼比例高，吸血鬼容易混入",
            "氣候嚴寒，以煤鐵工業聞名"
        ],
        landmarks: [
            { name: "王城", description: "薪王的統治中心，原北郡主府邸。" },
            { name: "煤鐵礦區", description: "北都城的經濟命脈，嚴寒環境下的生存根基。" }
        ],
        funFacts: [
            "薪王透過與黑王交易取得王權證明，自封為王",
            "「薪王」與「新王」同音，取薪火相傳之意",
            "其他城市未跟進承認其王位，多稱為「郡主」"
        ]
    },
    {
        id: "west",
        name: "Western Holy See",
        nameTW: "西教廷",
        type: "city" as CityType,
        theme: "gold" as ThemeColor, // 人類/聖樹信仰
        position: { x: 25.3, y: 49.5 }, // 左側中間
        faction: "聖樹教廷",
        ruler: "大祭司",
        description: "琉華/聖樹的勢力範圍，激進主張滅絕吸血鬼的宗教城邦。原為火之國的封地，帝國滅亡後成為獨立的宗教勢力。",
        image: "/images/regions/Frame 2.png",
        details: [
            "聖樹大精靈「琉華」的庇護之地",
            "激進主張主動滅絕吸血鬼",
            "擁有祭司階級與魔法戰力",
            "與東末城處於未簽和約的戰爭狀態"
        ],
        landmarks: [
            { name: "聖樹神殿", description: "琉華顯現之處，教廷的信仰核心。" },
            { name: "祭司學院", description: "培養吸血鬼殺手的訓練場，受聖樹魔法強化。" }
        ],
        funFacts: [
            "帝國後期教廷激進化，迫使吸血鬼組織劍士反擊",
            "首都炎災改變地形後，追殺被迫終止而非和談"
        ]
    },
    {
        id: "capital",
        name: "Capital Ruins",
        nameTW: "首都遺址",
        type: "region" as CityType,
        theme: "gold" as ThemeColor, // 人類帝國遺產
        position: { x: 52, y: 41 }, // 中央
        faction: "無",
        description: "昔日人類帝國的榮耀中心，百年前在「炎災」中毀滅。如今是危險的魔物盤據之地，傳說中仍埋藏著帝國時代的寶藏與秘密。",
        image: "/images/regions/Frame 5.png",
        details: [
            "曾是橫跨大陸的人類帝國首都",
            "火蛇「炎山」隕落之處",
            "炎災後成為廢墟，魔物橫行"
        ]
    },
    {
        id: "wilderness",
        name: "Central Wilderness",
        nameTW: "荒野地帶",
        type: "region" as CityType,
        theme: "silver" as ThemeColor, // 危險無人區
        position: { x: 45, y: 45 }, // 中央偏左下
        faction: "無",
        description: "炎災後形成的廣闘荒地，魔物橫行，是各城之間的危險緩衝區。旅行者必須結伴而行，或雇用護衛。",
        image: "/images/regions/Frame 3.png",
        details: [
            "炎災徹底改變了這片土地的生態",
            "吸血鬼劍士會在此巡邏，保護往來商隊，同時也可能強徵血液",
            "城外走私血液交易盛行之地",
            "約 30% 的劍士戰力部署於此監視教廷"
        ]
    },
    {
        id: "innersea",
        name: "Inner Sea",
        nameTW: "內海",
        type: "sea" as CityType,
        theme: "gold" as ThemeColor, // 中立貿易通道
        position: { x: 46, y: 67 }, // 下方中央
        faction: "無",
        description: "首都南部的內陸海，勉強可看見中央有一小島。",
        image: "/images/regions/Frame 7.png",
        details: [
            "即使並非虛無之海，因海之名，亦無正常人想靠近",
            "因此儘管鄰近中央腹地，但自古以來就並非帝國屬地",
            "人煙稀少之處，小心附近的吸血鬼。"
        ]
    },
    {
        id: "voidsea",
        name: "Void Sea",
        nameTW: "虛無之海",
        type: "sea" as CityType,
        theme: "silver" as ThemeColor, // 神秘未知/月神造物
        position: { x: 12, y: 63 }, // 左下角（代表整個外圍）
        faction: "無",
        description: "包圍整個大陸的致命區域。",
        image: "/images/regions/Frame 6.png",
        details: [
            "觸碰即溶解消失，當事人疑似無痛覺",
            "無論生物或物體皆無法倖存",
            "無需多做解釋，不想死就別靠近。"
        ]
    },
];

// 只取城市類型的地點
export const cities = locations.filter(loc => loc.type === "city");

export type Location = typeof locations[0];
