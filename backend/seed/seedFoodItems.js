import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import FoodCategory from "../models/FoodCategory.js";
import FoodItem from "../models/FoodItem.js";
import { slugify } from "../utils/slugify.js";
import { foodNames } from "./data.js";

dotenv.config();

const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const itemImageOverrides = {
  "cold-coffee": photo("1495474472287-4d71bcdd2085"),
  lassi: photo("1623065422902-30a2d299bbe4"),
  "rose-milk": photo("1572490122747-3968b75cc699"),
  "lemon-mint-cooler": photo("1497534446932-c925b458314e"),
  "chocolate-shake": photo("1572490122747-3968b75cc699"),
  "mango-shake": photo("1622597467836-f3285f2131b8"),
  "chicken-manchurian": photo("1604908176997-125f25cc6f3d"),
  "chicken-noodles": photo("1569718212165-3a8278d5f624"),
  "chicken-fried-rice": photo("1603133872878-684f208fb84b"),
  "chicken-biryani": photo("1631515242808-497c3fbd3972"),
  "chicken-roll": photo("1626700051175-6818013e1d4f"),
  "chicken-65": photo("1626645738196-c2a7c87a8f58"),
  "mutton-curry": photo("1544025162-d76694265947"),
  "mutton-biryani": photo("1631515242808-497c3fbd3972"),
  "mutton-fry": photo("1544025162-d76694265947"),
  "mutton-keema": photo("1585937421612-70a008356fbe"),
  "mutton-soup": photo("1547592166-23ac45744acd"),
  "mutton-fried-rice": photo("1603133872878-684f208fb84b"),
};

const categoryImagePools = {
  chicken: [photo("1604908176997-125f25cc6f3d"), photo("1626645738196-c2a7c87a8f58"), photo("1632778149955-e80f8ceca2e8")],
  mutton: [photo("1544025162-d76694265947"), photo("1585937421612-70a008356fbe"), photo("1631452180519-c014fe946bc7")],
  "veg-meals": [photo("1543353071-873f17a7a088"), photo("1585937421612-70a008356fbe"), photo("1505253716362-afaea1d3d1af")],
  biryani: [photo("1631515242808-497c3fbd3972"), photo("1596797038530-2c107229654b"), photo("1563379091339-03246963d96c")],
  noodles: [photo("1569718212165-3a8278d5f624"), photo("1612929633738-8fe44f7ec841"), photo("1585032226651-759b368d7246")],
  "fried-rice": [photo("1603133872878-684f208fb84b"), photo("1512058564366-18510be2db19"), photo("1604908176997-125f25cc6f3d")],
  breakfast: [photo("1533089860892-a7c6f0a88666"), photo("1525351484163-7529414344d8"), photo("1484723091739-30a097e8f929")],
  snacks: [photo("1601050690597-df0568f70950"), photo("1621939514649-280e2ee25f60"), photo("1541592106381-b31e9677c0e5")],
  "soft-drinks": [photo("1581006852262-e4307cf6283a"), photo("1527960471264-932f39eb5846"), photo("1629203851122-3726ecdf080e")],
  "cool-drinks": [photo("1513558161293-cdaf765ed2fd"), photo("1495474472287-4d71bcdd2085"), photo("1572490122747-3968b75cc699"), photo("1622597467836-f3285f2131b8")],
  "ice-creams": [photo("1567206563064-6f60f40a2b57"), photo("1501443762994-82bd5dace89a"), photo("1488900128323-21503983a07e")],
  juices: [photo("1600271886742-f049cd451bba"), photo("1622597467836-f3285f2131b8"), photo("1613478223719-2ab802602423")],
  "tea-coffee": [photo("1495474472287-4d71bcdd2085"), photo("1509042239860-f550ce710b93"), photo("1511920170033-f8396924c348")],
  burgers: [photo("1568901346375-23c9450c58cd"), photo("1550547660-d9450f859349"), photo("1594212699903-ec8a3eca50f5")],
  sandwiches: [photo("1528735602780-2552fd46c7af"), photo("1553909489-cd47e0907980"), photo("1509722747041-616f39b57569")],
  rolls: [photo("1626700051175-6818013e1d4f"), photo("1601050690597-df0568f70950"), photo("1544025162-d76694265947")],
  "south-indian": [photo("1668236543090-82eba5ee5976"), photo("1630383249896-424e482df921"), photo("1589302168068-964664d93dc0")],
  "north-indian": [photo("1585937421612-70a008356fbe"), photo("1631452180519-c014fe946bc7"), photo("1565557623262-b51c2513a641")],
  desserts: [photo("1488477181946-6428a0291777"), photo("1551024506-0bccd828d307"), photo("1565958011703-44f9829ba187")],
  "combo-offers": [photo("1540189549336-e6e99c3679fe"), photo("1565299624946-b28f40a0ae38"), photo("1568901346375-23c9450c58cd")],
};

function imageForItem(categorySlug, slug, index) {
  if (itemImageOverrides[slug]) return itemImageOverrides[slug];
  const pool = categoryImagePools[categorySlug] || categoryImagePools["combo-offers"];
  return pool[index % pool.length];
}

export async function seedFoodItems() {
  await FoodItem.deleteMany({});
  const categories = await FoodCategory.find({});
  const docs = [];

  for (const [cIndex, category] of categories.entries()) {
    const names = foodNames[category.slug] || [];
    names.forEach((name, index) => {
      const slug = slugify(name);
      docs.push({
        categoryId: category._id,
        name,
        slug,
        description: `${name} prepared fresh at the campus canteen with RoomBites priority packing.`,
        price: 45 + cIndex * 8 + index * 12,
        image: imageForItem(category.slug, slug, index),
        rating: 4.2 + ((cIndex + index) % 7) / 10,
        prepTime: `${8 + ((cIndex + index) % 8)} min`,
      });
    });
  }

  const inserted = await FoodItem.insertMany(docs);
  console.log(`Seeded ${inserted.length} food items`);
  return inserted;
}

if (process.argv[1].endsWith("seedFoodItems.js")) {
  await connectDB();
  await seedFoodItems();
  process.exit(0);
}
