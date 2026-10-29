import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { categoryIcon } from '../lib/categories'
import { Ingredients } from './Ingredients'

/** Shows the randomly picked meal, with a way to pick again. */
export function PickDinnerModal({ meal, poolSize, onPickAgain, onClose }) {
  const Icon = categoryIcon(meal?.category)

  return (
    <Modal opened={Boolean(meal)} onClose={onClose} title="Tonight's dinner" centered>
      {meal && (
        <Stack gap="sm">
          <Group gap="xs" wrap="nowrap" align="flex-start">
            <Icon size={30} strokeWidth={1.75} className="pick-dinner__icon" aria-hidden />
            <Text fw={700} fz="xl">
              {meal.name}
            </Text>
          </Group>

          <Ingredients meal={meal} />

          {meal.notes && (
            <Text size="sm" c="dimmed" className="meal-card__notes">
              {meal.notes}
            </Text>
          )}

          <Group justify="space-between" mt="sm">
            <Text size="xs" c="dimmed">
              Picked from {poolSize} ready meal{poolSize === 1 ? '' : 's'}
            </Text>
            <Group gap="xs">
              {poolSize > 1 && (
                <Button variant="default" onClick={onPickAgain}>
                  Pick again
                </Button>
              )}
              <Button onClick={onClose}>Sounds good</Button>
            </Group>
          </Group>
        </Stack>
      )}
    </Modal>
  )
}
