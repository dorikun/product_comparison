export const categories = [
  {
    id: "refrigerator",
    name: "冷蔵庫",
    description: "省エネで大容量な冷蔵庫を比較",
    image: "https://images.unsplash.com/photo-1674143941110-f7ef253ea1f4",
  },
  {
    id: "air-conditioner",
    name: "エアコン",
    description: "快適な室温管理を実現するエアコン",
    image: "https://images.unsplash.com/photo-1499937479142-61a6ce103b26",
  },
  {
    id: "vacuum",
    name: "掃除機",
    description: "お掃除を効率的にする掃除機",
    image: "https://images.unsplash.com/photo-1647940990395-967898eb0d65",
  },
  {
    id: "washing-machine",
    name: "洗濯機",
    description: "洗濯から乾燥までこなす洗濯機",
    image: "https://images.unsplash.com/photo-1626274890657-e28d5b65b04b",
  },
];

export const products: Record<string, any[]> = {
  "refrigerator": [
    {
      id: 1,
      name: "スマート冷蔵庫 X1000",
      manufacturer: "パナソニック",
      price: 248000,
      capacity: "501L",
      features: ["自動製氷", "野菜室強化", "省エネ設計"],
      energyRating: "★★★★★",
      dimensions: "W685×H1828×D699mm",
    },
    // Add more refrigerator products...
  ],
  "air-conditioner": [
    {
      id: 1,
      name: "エアロ スマート",
      manufacturer: "ダイキン",
      price: 158000,
      capacity: "6畳～8畳",
      features: ["AI温度制御", "除湿機能", "空気清浄"],
      energyRating: "★★★★☆",
      dimensions: "W798×H295×D375mm",
    },
    // Add more air conditioner products...
  ],
  // Add other categories...
};

export const getSpecificationsForCategory = (category: string) => {
  const specMap: Record<string, string[]> = {
    "refrigerator": ["容量"],
    "air-conditioner": ["適用畳数", "暖房能力", "冷房能力", "省エネ性能"],
    "vacuum": ["吸引力", "運転音", "集塵容量", "バッテリー持続時間"],
    "washing-machine": ["洗濯容量", "脱水性能", "騒音レベル", "乾燥機能"],
  };
  return specMap[category] || [];
};