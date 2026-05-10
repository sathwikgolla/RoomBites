export const fallbackFoodImage = "/images/food/fallback-food.jpg";

export function getImageUrl(image) {
  if (!image) return fallbackFoodImage;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/images")) return image;
  return `/images/food/items/${image}`;
}

export function handleImageError(event) {
  if (event.currentTarget.src.endsWith(fallbackFoodImage)) return;
  event.currentTarget.src = fallbackFoodImage;
}
