export const fallbackFoodImageUrl = "https://tse1.mm.bing.net/th?q=food%20meal%20plate&w=900&h=650&c=7&rs=1&p=0&o=5&pid=1.7";

const foodImage = (query, variant = 0) =>
  `https://tse${(variant % 4) + 1}.mm.bing.net/th?q=${encodeURIComponent(`${query} food dish`)}&w=900&h=650&c=7&rs=1&p=0&o=5&pid=1.7`;

const categoryData = [
  ["Chicken", "chicken", "Spicy campus favorites with crispy, saucy, and biryani picks.", "spicy chicken curry chicken 65"],
  ["Mutton", "mutton", "Rich slow-cooked plates for serious lunch breaks.", "mutton curry lamb curry"],
  ["Veg Meals", "veg-meals", "Balanced vegetarian thalis and comfort meals.", "vegetarian thali indian meal"],
  ["Biryani", "biryani", "Aromatic rice bowls built for hungry study sessions.", "hyderabadi biryani"],
  ["Noodles", "noodles", "Hot wok noodles with fast prep and bold sauces.", "spicy noodles"],
  ["Fried Rice", "fried-rice", "Smoky fried rice bowls with veg, egg, and chicken options.", "fried rice bowl"],
  ["Breakfast", "breakfast", "Morning fuel before labs, lectures, and exams.", "south indian breakfast dosa idli"],
  ["Snacks", "snacks", "Quick bites, crispy sides, and evening cravings.", "samosa indian snacks"],
  ["Soft Drinks", "soft-drinks", "Classic bottled refreshers chilled for delivery.", "soft drink bottles soda"],
  ["Cool Drinks", "cool-drinks", "Cold campus coolers, shakes, and mocktails.", "cold coffee milkshake"],
  ["Ice Creams", "ice-creams", "Scoops, sundaes, and late-night dessert breaks.", "ice cream sundae"],
  ["Juices", "juices", "Fresh fruit juices for a lighter recharge.", "fresh fruit juice glasses"],
  ["Tea & Coffee", "tea-coffee", "Hot sips for assignments, breaks, and all-nighters.", "masala tea filter coffee"],
  ["Burgers", "burgers", "Stacked buns with crisp patties and creamy sauces.", "burger with fries"],
  ["Sandwiches", "sandwiches", "Grilled and fresh sandwiches for quick meals.", "grilled sandwich"],
  ["Rolls", "rolls", "Wrapped meals with spicy fillings and soft parathas.", "kathi roll wrap"],
  ["South Indian", "south-indian", "Dosa, idli, vada, and sambar classics.", "masala dosa idli vada"],
  ["North Indian", "north-indian", "Paneer, dal, roti, and curry comfort plates.", "paneer butter masala naan"],
  ["Desserts", "desserts", "Sweet finishes from cakes to gulab jamun.", "indian dessert gulab jamun cake"],
  ["Combo Offers", "combo-offers", "Value bundles for groups, roommates, and big appetites.", "combo meal burger fries drink"],
];

export const categories = categoryData.map(([name, slug, description, query], index) => ({
  id: slug,
  slug,
  name,
  description,
  image: foodImage(query, index),
}));

const itemNames = {
  chicken: ["Chicken Manchurian", "Chicken Noodles", "Chicken Fried Rice", "Chicken Biryani", "Chicken Roll", "Chicken 65"],
  mutton: ["Mutton Curry", "Mutton Biryani", "Mutton Fry", "Mutton Keema", "Mutton Fried Rice", "Mutton Soup"],
  "veg-meals": ["Veg Thali", "Curd Rice", "Lemon Rice", "Tomato Rice", "Chapati Curry", "Veg Pulao"],
  biryani: ["Veg Biryani", "Egg Biryani", "Chicken Dum Biryani", "Mutton Dum Biryani", "Paneer Biryani", "Family Biryani Bowl"],
  noodles: ["Veg Noodles", "Egg Noodles", "Schezwan Noodles", "Chicken Noodles", "Paneer Noodles", "Triple Noodles"],
  "fried-rice": ["Veg Fried Rice", "Egg Fried Rice", "Chicken Fried Rice", "Schezwan Fried Rice", "Paneer Fried Rice", "Mixed Fried Rice"],
  breakfast: ["Idli Sambar", "Masala Dosa", "Poori Masala", "Aloo Paratha", "Bread Omelette", "Upma Bowl"],
  snacks: ["Samosa", "Puffs", "French Fries", "Chilli Potato", "Paneer Pakoda", "Masala Maggi"],
  "soft-drinks": ["Coke", "Pepsi", "Sprite", "Thums Up", "Fanta", "Soda Lime"],
  "cool-drinks": ["Cold Coffee", "Lassi", "Rose Milk", "Lemon Mint Cooler", "Chocolate Shake", "Mango Shake"],
  "ice-creams": ["Vanilla Scoop", "Chocolate Scoop", "Butterscotch Cup", "Strawberry Sundae", "Brownie Ice Cream", "Kulfi Stick"],
  juices: ["Orange Juice", "Watermelon Juice", "Pineapple Juice", "Mango Juice", "Apple Juice", "Mixed Fruit Juice"],
  "tea-coffee": ["Masala Tea", "Ginger Tea", "Filter Coffee", "Cappuccino", "Black Coffee", "Hot Chocolate"],
  burgers: ["Veg Burger", "Cheese Burger", "Chicken Burger", "Paneer Burger", "Double Patty Burger", "Crispy Burger"],
  sandwiches: ["Veg Grilled Sandwich", "Cheese Corn Sandwich", "Chicken Sandwich", "Paneer Tikka Sandwich", "Club Sandwich", "Chocolate Sandwich"],
  rolls: ["Veg Roll", "Egg Roll", "Chicken Roll", "Paneer Roll", "Double Egg Roll", "Cheese Chicken Roll"],
  "south-indian": ["Plain Dosa", "Onion Dosa", "Medu Vada", "Ghee Podi Idli", "Uttapam", "Pongal"],
  "north-indian": ["Paneer Butter Masala", "Dal Tadka", "Chole Bhature", "Butter Naan", "Rajma Chawal", "Aloo Jeera"],
  desserts: ["Gulab Jamun", "Rasmalai", "Chocolate Brownie", "Cheesecake Cup", "Fruit Custard", "Caramel Pudding"],
  "combo-offers": ["Burger Fries Combo", "Biryani Coke Combo", "Dosa Coffee Combo", "Noodles Manchurian Combo", "Thali Sweet Combo", "Roommates Mega Combo"],
};

const itemFileNames = {
  "Chicken Manchurian": "chicken-manchurian",
  "Chicken Noodles": "chicken-noodles",
  "Chicken Fried Rice": "chicken-fried-rice",
  "Chicken Biryani": "chicken-biryani",
  "Chicken Roll": "chicken-roll",
  "Chicken 65": "chicken-65",
  "Mutton Curry": "mutton-curry",
  "Mutton Biryani": "mutton-biryani",
  "Mutton Fry": "mutton-fry",
  "Mutton Keema": "mutton-keema",
  "Mutton Fried Rice": "mutton-fried-rice",
  "Mutton Soup": "mutton-soup",
  "Veg Thali": "veg-thali",
  "Curd Rice": "curd-rice",
  "Lemon Rice": "lemon-rice",
  "Tomato Rice": "tomato-rice",
  "Chapati Curry": "chapati-curry",
};

const itemImageQueries = {
  "Chicken Manchurian": "chicken manchurian",
  "Chicken Noodles": "chicken noodles",
  "Chicken Fried Rice": "chicken fried rice",
  "Chicken Biryani": "chicken biryani",
  "Chicken Roll": "chicken roll wrap",
  "Chicken 65": "chicken 65 fried chicken",
  "Mutton Curry": "mutton curry",
  "Mutton Biryani": "mutton biryani",
  "Mutton Fry": "mutton pepper fry",
  "Mutton Keema": "mutton keema",
  "Mutton Fried Rice": "mutton fried rice",
  "Mutton Soup": "mutton soup",
  "Veg Thali": "vegetarian thali",
  "Curd Rice": "curd rice",
  "Lemon Rice": "lemon rice",
  "Tomato Rice": "tomato rice",
  "Chapati Curry": "chapati curry",
};

const slugify = (value) =>
  itemFileNames[value] ||
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const foodItems = categories.flatMap((category, cIndex) =>
  itemNames[category.slug].map((name, index) => ({
    id: `${category.slug}-${index + 1}`,
    categorySlug: category.slug,
    categoryId: category.slug,
    name,
    description: `${name} prepared fresh at the campus canteen with RoomBites priority packing.`,
    price: 45 + cIndex * 8 + index * 12,
    rating: (4.2 + ((cIndex + index) % 7) / 10).toFixed(1),
    prepTime: `${8 + ((cIndex + index) % 8)} min`,
    image: foodImage(itemImageQueries[name] || name, cIndex * 20 + index),
  }))
);

export const allFoodImageFiles = [
  ...categories.map((category) => category.slug),
  ...foodItems.map((item) => item.image.replace("/images/food/", "").replace(".jpg", "")),
  "fallback-food",
];
