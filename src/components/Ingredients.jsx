import { List, Stack, Text } from '@mantine/core'

/** A meal's ingredients: the ones it needs, then a quieter list of optional ones. */
export function Ingredients({ meal }) {
  const required = meal.ingredients || []
  const optional = meal.optionalIngredients || []
  if (!required.length && !optional.length) return null

  return (
    <Stack gap={6}>
      {required.length > 0 && (
        <List size="sm" spacing={2}>
          {required.map((ing, i) => (
            <List.Item key={i}>{ing}</List.Item>
          ))}
        </List>
      )}
      {optional.length > 0 && (
        <div>
          <Text size="xs" c="dimmed" fs="italic" ff="heading">
            Nice to have
          </Text>
          <Text size="sm" c="dimmed">
            {optional.join(' · ')}
          </Text>
        </div>
      )}
    </Stack>
  )
}

export function hasIngredients(meal) {
  return Boolean(meal.ingredients?.length || meal.optionalIngredients?.length)
}
