export const SPEED_CHARGES = {
  "5min": 30,
  "10min": 20,
  "15min": 10,
  "20min": 0,
};

export const DELIVERY_CHARGE = 15;

export function calculateOrderTotal(items, speedOption) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const speedCharge = SPEED_CHARGES[speedOption];
  if (speedCharge === undefined) throw new Error("Invalid speed option");
  const totalAmount = subtotal + DELIVERY_CHARGE + speedCharge;
  return { subtotal, deliveryCharge: DELIVERY_CHARGE, speedCharge, totalAmount };
}
