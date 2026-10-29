import { Stack, Text } from '@mantine/core'
import { mealSteps } from '../lib/meal'

/** A meal's prep and cook steps, each under its own small heading. */
export function Steps({ meal }) {
  const { prep, cook } = mealSteps(meal)
  if (!prep && !cook) return null

  return (
    <Stack gap={6}>
      {prep && <Step label="Prep" text={prep} />}
      {cook && <Step label="Cook" text={cook} />}
    </Stack>
  )
}

function Step({ label, text }) {
  return (
    <div>
      <Text size="xs" c="dimmed" fs="italic" ff="heading">
        {label}
      </Text>
      <Text size="sm" c="dimmed" className="meal-card__notes">
        {text}
      </Text>
    </div>
  )
}

export function hasSteps(meal) {
  const { prep, cook } = mealSteps(meal)
  return Boolean(prep || cook)
}
