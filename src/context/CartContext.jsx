import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

const mongoIdPattern = /^[a-f\d]{24}$/i;
const isMongoId = (value) => typeof value === "string" && mongoIdPattern.test(value);

const readCart = () => {
  const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
  const validItems = items.filter((item) => isMongoId(item.foodItemId));
  if (validItems.length !== items.length) {
    localStorage.setItem("cartItems", JSON.stringify(validItems));
  }
  return validItems;
};
const writeCart = (items) => localStorage.setItem("cartItems", JSON.stringify(items));

const normalizeCartItem = (item) => {
  const foodItemId = item._id || item.foodItemId;
  if (!isMongoId(foodItemId)) {
    throw new Error("This cart item is missing a valid backend food item id. Please refresh the menu and add it again.");
  }
  return {
    foodItemId,
    _id: foodItemId,
    name: item.name,
    image: item.image,
    price: Number(item.price || 0),
    rating: item.rating,
    prepTime: item.prepTime,
    description: item.description,
  };
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readCart);

  const persistCart = (items) => {
    setCartItems(items);
    writeCart(items);
  };

  const addToCart = (item, quantity = 1) => {
    const normalized = normalizeCartItem(item);
    const existing = cartItems.find((entry) => entry.foodItemId === normalized.foodItemId);
    const next = existing
      ? cartItems.map((entry) => (entry.foodItemId === normalized.foodItemId ? { ...entry, quantity: entry.quantity + quantity } : entry))
      : [...cartItems, { ...normalized, quantity }];
    persistCart(next);
  };

  const changeCartQty = (itemId, delta) => {
    const next = cartItems
      .map((item) => (item.foodItemId === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
      .filter((item) => item.quantity > 0);
    persistCart(next);
  };

  const removeCartItem = (itemId) => persistCart(cartItems.filter((item) => item.foodItemId !== itemId));
  const clearCart = () => persistCart([]);

  const cartSubtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [cartItems]);
  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, cartSubtotal, cartCount, addToCart, changeCartQty, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
