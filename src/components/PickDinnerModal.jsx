import { Button, Group, List, Modal, Stack, Text } from '@mantine/core'
import { categoryMeta } from '../lib/categories'

/** Shows the randomly picked meal, with a way to pick again. */
export function PickDinnerModal({ meal, poolSize, onPickAgain, onClose }) {
  const cat = meal ? categoryMeta(meal.category) : null

  return (
    <Modal opened={Boolean(meal)} onClose={onClose} title="Tonight's dinner" centered>
      {meal && (
        <Stack gap="sm">
          <Group gap="xs" wrap="nowrap" align="flex-start">
            <Text fz={32} aria-hidden>
              {cat ? cat.icon : '🍽️'}
            </Text>
            <Text fw={700} fz="xl">
              {meal.name}
            </Text>
          </Group>

          {meal.ingredients?.length > 0 && (
            <List size="sm" spacing={2} c="dimmed">
              {meal.ingredients.map((ing, i) => (
                <List.Item key={i}>{ing}</List.Item>
              ))}
            </List>
          )}

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
