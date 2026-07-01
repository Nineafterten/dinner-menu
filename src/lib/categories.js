// Optional meal categories. Each has an emoji glyph used as a lightweight icon
// (no photos, per the product decision). Category is optional on a meal.
export const CATEGORIES = [
  { value: 'chicken', label: 'Chicken', icon: '🍗' },
  { value: 'beef', label: 'Beef', icon: '🥩' },
  { value: 'pork', label: 'Pork', icon: '🥓' },
  { value: 'seafood', label: 'Seafood', icon: '🐟' },
  { value: 'pasta', label: 'Pasta', icon: '🍝' },
  { value: 'soup', label: 'Soup & Stew', icon: '🍲' },
  { value: 'salad', label: 'Salad', icon: '🥗' },
  { value: 'veggie', label: 'Vegetarian', icon: '🥦' },
  { value: 'breakfast', label: 'Breakfast-for-dinner', icon: '🍳' },
  { value: 'other', label: 'Other', icon: '🍽️' },
]

const BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]))

export function categoryMeta(value) {
  return BY_VALUE[value] || null
}
