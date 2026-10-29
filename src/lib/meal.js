// Older meals kept one `notes` field; it reads as the cook steps.
export function mealSteps(meal) {
  return { prep: meal?.prep || '', cook: meal?.cook ?? meal?.notes ?? '' }
}

/** Every distinct value across meals, matched without regard to case, sorted. */
export function distinctValues(meals, pick) {
  const seen = new Map()
  for (const meal of meals) {
    for (const value of pick(meal) || []) {
      const text = value.trim()
      if (text && !seen.has(text.toLowerCase())) seen.set(text.toLowerCase(), text)
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b))
}
