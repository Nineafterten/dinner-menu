import { Beef, Carrot, Drumstick, EggFried, Fish, Ham, Salad, Soup, Utensils } from 'lucide-react'
import { NoodleBowl } from './icons'

// Optional meal categories, each with a line icon (no photos, per the product
// decision). Category is optional on a meal.
export const CATEGORIES = [
  { value: 'chicken', label: 'Chicken', Icon: Drumstick },
  { value: 'beef', label: 'Beef', Icon: Beef },
  { value: 'pork', label: 'Pork', Icon: Ham },
  { value: 'seafood', label: 'Seafood', Icon: Fish },
  { value: 'pasta', label: 'Pasta', Icon: NoodleBowl },
  { value: 'soup', label: 'Soup & Stew', Icon: Soup },
  { value: 'salad', label: 'Salad', Icon: Salad },
  { value: 'veggie', label: 'Vegetarian', Icon: Carrot },
  { value: 'breakfast', label: 'Breakfast-for-dinner', Icon: EggFried },
  { value: 'other', label: 'Other', Icon: Utensils },
]

const BY_VALUE = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]))

export function categoryMeta(value) {
  return BY_VALUE[value] || null
}

/** The icon for a meal's category; meals with none get the fork and knife. */
export function categoryIcon(value) {
  return categoryMeta(value)?.Icon ?? Utensils
}
