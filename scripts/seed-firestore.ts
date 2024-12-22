import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateRefrigeratorProducts = () => {
  const manufacturers = ["パナソニック", "日立", "三菱電機", "シャープ", "東芝"];
  const features = [
    "自動製氷", "野菜室強化", "省エネ設計", "真空チルド", "除菌機能",
    "スマート制御", "急速冷凍", "大容量収納", "フレックス温度帯", "音声操作"
  ];
  
  return Array.from({ length: 10 }, (_, i) => ({
      name: `スマート冷蔵庫 ${String.fromCharCode(65 + i)}${1000 + i * 100}`,
      manufacturer: manufacturers[i % manufacturers.length],
      price: 180000 + (i * 20000),
      category: "refrigerator",
      specifications: {
        "容量": `${450 + i * 10}L`,
        "年間電気代": `${16000 + i * 1000}円`,
        "省エネ性能": `A${"+" .repeat(Math.min(3, Math.floor(i / 3)))}`,
        "製氷機能": i % 2 ? "自動製氷" : "急速製氷"
      },
      features: features.slice(i, i + 3),
      amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${manufacturers[i % manufacturers.length]} 冷蔵庫`)}`
    }));
};

const generateAirConditionerProducts = () => {
  const manufacturers = ["ダイキン", "三菱電機", "パナソニック", "日立", "シャープ"];
  const features = [
    "AI温度制御", "除湿機能", "空気清浄", "プラズマ除菌", "高速冷暖房",
    "省エネ運転", "静音設計", "スマートホーム連携", "加湿機能", "自動掃除"
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    name: `エアロスマート ${String.fromCharCode(65 + i)}${2000 + i * 100}`,
    manufacturer: manufacturers[i % manufacturers.length],
    price: 140000 + (i * 15000),
    category: "air-conditioner",
    specifications: {
      "適用畳数": `${6 + i * 2}畳`,
      "暖房能力": `${2.2 + i * 0.2}kW`,
      "冷房能力": `${2.0 + i * 0.2}kW`,
      "省エネ性能": `A${"+" .repeat(Math.min(3, Math.floor(i / 3)))}`
    },
    features: features.slice(i, i + 3),
    amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${manufacturers[i % manufacturers.length]} エアコン`)}`
  }));
};

const generateVacuumProducts = () => {
  const manufacturers = ["ダイソン", "パナソニック", "日立", "シャープ", "マキタ"];
  const features = [
    "強力サイクロン", "HEPA濾過", "充電式", "自動ゴミ収集", "スマートナビ",
    "UV除菌", "センサー感知", "静音設計", "長時間稼働", "ハンディ変形"
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    name: `サイクロン掃除機 ${String.fromCharCode(65 + i)}${3000 + i * 100}`,
    manufacturer: manufacturers[i % manufacturers.length],
    price: 60000 + (i * 10000),
    category: "vacuum",
    specifications: {
      "吸引力": `${140 + i * 10}AW`,
      "運転音": `${65 - i}dB`,
      "集塵容量": `${0.6 + i * 0.1}L`,
      "バッテリー持続時間": `${40 + i * 10}分`
    },
    features: features.slice(i, i + 3),
    amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${manufacturers[i % manufacturers.length]} 掃除機`)}`
  }));
};

const generateWashingMachineProducts = () => {
  const manufacturers = ["パナソニック", "日立", "シャープ", "東芝", "アクア"];
  const features = [
    "温水洗浄", "自動投入", "ナノイーX", "ビッグドラム", "抗菌槽",
    "スマート制御", "ダブルシャワー", "eco節水", "防カビ", "静音設計"
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    name: `ドラム式洗濯機 ${String.fromCharCode(65 + i)}${4000 + i * 100}`,
    manufacturer: manufacturers[i % manufacturers.length],
    price: 120000 + (i * 18000),
    category: "washing-machine",
    specifications: {
      "洗濯容量": `${8 + i}kg`,
      "脱水性能": `${1000 + i * 100}回転`,
      "騒音レベル": `${40 - i}dB`,
      "乾燥機能": i % 2 ? "ヒートポンプ乾燥" : "温風乾燥"
    },
    features: features.slice(i, i + 3),
    amazonUrl: `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${manufacturers[i % manufacturers.length]} 洗濯機`)}`
  }));
};

const sampleProducts = [
  ...generateRefrigeratorProducts(),
  ...generateAirConditionerProducts(),
  ...generateVacuumProducts(),
  ...generateWashingMachineProducts()
];

async function clearCollection(collectionPath: string) {
  const collectionRef = collection(db, collectionPath);
  const snapshot = await getDocs(collectionRef);
  
  console.log(`Deleting ${snapshot.size} documents from ${collectionPath}...`);
  
  const deletePromises = snapshot.docs.map(document => 
    deleteDoc(doc(db, collectionPath, document.id))
  );
  await Promise.all(deletePromises);
  
  console.log(`Cleared collection: ${collectionPath}`);
}

async function seedProducts() {
  console.log("Starting seeding process...");
  
  // Clear existing products
  await clearCollection("products");
  
  const productsRef = collection(db, "products");
  let count = 0;
  
  for (const product of sampleProducts) {
    try {
      await addDoc(productsRef, product);
      count++;
      console.log(`Added product (${count}/${sampleProducts.length}): ${product.name}`);
    } catch (error) {
      console.error(`Error adding product ${product.name}:`, error);
    }
  }
  
  console.log(`Seeding completed! Added ${count} products.`);
}

seedProducts().then(() => {
  console.log("Seeding completed!");
}).catch((error) => {
  console.error("Error during seeding:", error);
});