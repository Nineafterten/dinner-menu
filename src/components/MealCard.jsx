import {
  ActionIcon,
  Badge,
  Card,
  Group,
  List,
  Stack,
  Switch,
  Text,
} from '@mantine/core'
import { categoryMeta } from '../lib/categories'

export function MealCard({ meal, editMode, onToggleReady, onEdit }) {
  const cat = categoryMeta(meal.category)

  return (
    <Card
      withBorder
      radius="md"
      padding="md"
      style={{
        borderColor: meal.ready ? 'var(--mantine-color-amber-6)' : undefined,
        borderWidth: meal.ready ? 2 : 1,
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Group gap="xs" wrap="nowrap">
            {cat && <Text fz={22}>{cat.icon}</Text>}
            <Text fw={600} fz="lg" lineClamp={2}>
              {meal.name}
            </Text>
          </Group>
          {editMode && (
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label="Edit meal"
              onClick={() => onEdit(meal)}
            >
              ✏️
            </ActionIcon>
          )}
        </Group>

        {cat && (
          <Badge variant="light" color="amber" w="fit-content">
            {cat.label}
          </Badge>
        )}

        {meal.ingredients?.length > 0 && (
          <List size="sm" spacing={2} c="dimmed">
            {meal.ingredients.map((ing, i) => (
              <List.Item key={i}>{ing}</List.Item>
            ))}
          </List>
        )}

        {meal.notes && (
          <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
            {meal.notes}
          </Text>
        )}

        <Switch
          mt="xs"
          checked={Boolean(meal.ready)}
          onChange={(e) => onToggleReady(meal.id, e.currentTarget.checked)}
          color="amber"
          label={
            meal.ready ? 'Ready to make right now' : 'Not stocked right now'
          }
        />
      </Stack>
    </Card>
  )
}
