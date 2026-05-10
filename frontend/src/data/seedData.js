import { categories, foodItems, fallbackFoodImageUrl } from "./foodData";

const imageFor = (query, id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

export const categoryImages = {
  chicken: imageFor("chicken", "1604908176997-125f25cc6f3d"),
  mutton: imageFor("mutton", "1544025162-d76694265947"),
  "veg-meals": imageFor("veg meals", "1543353071-873f17a7a088"),
  biryani: imageFor("biryani", "1631515242808-497c3fbd3972"),
  noodles: imageFor("noodles", "1569718212165-3a8278d5f624"),
  "fried-rice": imageFor("fried rice", "1603133872878-684f208fb84b"),
  breakfast: imageFor("breakfast", "1533089860892-a7c6f0a88666"),
  snacks: imageFor("snacks", "1621939514649-280e2ee25f60"),
  "soft-drinks": imageFor("soft drinks", "1581006852262-e4307cf6283a"),
  "cool-drinks": imageFor("cool drinks", "1513558161293-cdaf765ed2fd"),
  "ice-creams": imageFor("ice cream", "1567206563064-6f60f40a2b57"),
  juices: imageFor("juice", "1600271886742-f049cd451bba"),
  "tea-coffee": imageFor("coffee", "1495474472287-4d71bcdd2085"),
  burgers: imageFor("burger", "1568901346375-23c9450c58cd"),
  sandwiches: imageFor("sandwich", "1528735602780-2552fd46c7af"),
  rolls: imageFor("roll", "1601050690597-df0568f70950"),
  "south-indian": imageFor("dosa", "1668236543090-82eba5ee5976"),
  "north-indian": imageFor("paneer", "1585937421612-70a008356fbe"),
  desserts: imageFor("dessert", "1488477181946-6428a0291777"),
  "combo-offers": imageFor("combo", "1540189549336-e6e99c3679fe"),
};

const legacyCategories = [
  ["Chicken", "Spicy campus favorites with crispy, saucy, and biryani picks."],
  ["Mutton", "Rich slow-cooked plates for serious lunch breaks."],
  ["Veg Meals", "Balanced vegetarian thalis and comfort meals."],
  ["Biryani", "Aromatic rice bowls built for hungry study sessions."],
  ["Noodles", "Hot wok noodles with fast prep and bold sauces."],
  ["Fried Rice", "Smoky fried rice bowls with veg, egg, and chicken options."],
  ["Breakfast", "Morning fuel before labs, lectures, and exams."],
  ["Snacks", "Quick bites, crispy sides, and evening cravings."],
  ["Soft Drinks", "Classic bottled refreshers chilled for delivery."],
  ["Cool Drinks", "Cold campus coolers, shakes, and mocktails."],
  ["Ice Creams", "Scoops, sundaes, and late-night dessert breaks."],
  ["Juices", "Fresh fruit juices for a lighter recharge."],
  ["Tea & Coffee", "Hot sips for assignments, breaks, and all-nighters."],
  ["Burgers", "Stacked buns with crisp patties and creamy sauces."],
  ["Sandwiches", "Grilled and fresh sandwiches for quick meals."],
  ["Rolls", "Wrapped meals with spicy fillings and soft parathas."],
  ["South Indian", "Dosa, idli, vada, and sambar classics."],
  ["North Indian", "Paneer, dal, roti, and curry comfort plates."],
  ["Desserts", "Sweet finishes from cakes to gulab jamun."],
  ["Combo Offers", "Value bundles for groups, roommates, and big appetites."],
].map(([name, description]) => {
  const slug = name.toLowerCase().replace(/&/g, "").replace(/\s+/g, "-");
  return { id: slug, slug, name, description, image: categoryImages[slug] };
});

const names = {
  Chicken: ["Chicken Manchurian", "Chicken Noodles", "Chicken Fried Rice", "Chicken Biryani", "Chicken Roll", "Chicken 65"],
  Mutton: ["Mutton Curry", "Mutton Biryani", "Mutton Pepper Fry", "Mutton Keema Roll", "Mutton Fried Rice", "Mutton Soup"],
  "Veg Meals": ["Mini Veg Meals", "Full Veg Thali", "Curd Rice", "Sambar Rice", "Lemon Rice", "Veg Pulao"],
  Biryani: ["Veg Biryani", "Egg Biryani", "Chicken Dum Biryani", "Mutton Dum Biryani", "Paneer Biryani", "Family Biryani Bowl"],
  Noodles: ["Veg Noodles", "Egg Noodles", "Schezwan Noodles", "Chicken Noodles", "Paneer Noodles", "Triple Noodles"],
  "Fried Rice": ["Veg Fried Rice", "Egg Fried Rice", "Chicken Fried Rice", "Schezwan Fried Rice", "Paneer Fried Rice", "Mixed Fried Rice"],
  Breakfast: ["Idli Sambar", "Masala Dosa", "Poori Masala", "Aloo Paratha", "Bread Omelette", "Upma Bowl"],
  Snacks: ["Samosa", "Puffs", "French Fries", "Chilli Potato", "Paneer Pakoda", "Masala Maggi"],
  "Soft Drinks": ["Coke", "Pepsi", "Sprite", "Thums Up", "Fanta", "Soda Lime"],
  "Cool Drinks": ["Cold Coffee", "Lassi", "Rose Milk", "Lemon Mint Cooler", "Chocolate Shake", "Mango Shake"],
  "Ice Creams": ["Vanilla Scoop", "Chocolate Scoop", "Butterscotch Cup", "Strawberry Sundae", "Brownie Ice Cream", "Kulfi Stick"],
  Juices: ["Orange Juice", "Watermelon Juice", "Pineapple Juice", "Mango Juice", "Apple Juice", "Mixed Fruit Juice"],
  "Tea & Coffee": ["Masala Tea", "Ginger Tea", "Filter Coffee", "Cappuccino", "Black Coffee", "Hot Chocolate"],
  Burgers: ["Veg Burger", "Cheese Burger", "Chicken Burger", "Paneer Burger", "Double Patty Burger", "Crispy Burger"],
  Sandwiches: ["Veg Grilled Sandwich", "Cheese Corn Sandwich", "Chicken Sandwich", "Paneer Tikka Sandwich", "Club Sandwich", "Chocolate Sandwich"],
  Rolls: ["Veg Roll", "Egg Roll", "Chicken Roll", "Paneer Roll", "Double Egg Roll", "Cheese Chicken Roll"],
  "South Indian": ["Plain Dosa", "Onion Dosa", "Medu Vada", "Ghee Podi Idli", "Uttapam", "Pongal"],
  "North Indian": ["Paneer Butter Masala", "Dal Tadka", "Chole Bhature", "Butter Naan", "Rajma Chawal", "Aloo Jeera"],
  Desserts: ["Gulab Jamun", "Rasmalai", "Chocolate Brownie", "Cheesecake Cup", "Fruit Custard", "Caramel Pudding"],
  "Combo Offers": ["Burger Fries Combo", "Biryani Coke Combo", "Dosa Coffee Combo", "Noodles Manchurian Combo", "Thali Sweet Combo", "Roommates Mega Combo"],
};

const legacyFoodItems = legacyCategories.flatMap((category, cIndex) =>
  names[category.name].map((name, index) => ({
    id: `${category.id}-${index + 1}`,
    categoryId: category.id,
    categorySlug: category.slug,
    name,
    description: `${name} prepared fresh at the campus canteen with RoomBites priority packing.`,
    image: category.image,
    price: 45 + cIndex * 8 + index * 12,
    rating: (4.2 + ((cIndex + index) % 7) / 10).toFixed(1),
    prepTime: `${8 + ((cIndex + index) % 8)} min`,
  }))
);

export const speedOptions = [
  { id: "5-min", label: "5 Minutes Delivery", charge: 30, minutes: 5 },
  { id: "10-min", label: "10 Minutes Delivery", charge: 20, minutes: 10 },
  { id: "15-min", label: "15 Minutes Delivery", charge: 10, minutes: 15 },
  { id: "20-min", label: "20 Minutes Delivery", charge: 0, minutes: 20 },
];

export const seedUsers = [];

export { categories, foodItems, fallbackFoodImageUrl };
