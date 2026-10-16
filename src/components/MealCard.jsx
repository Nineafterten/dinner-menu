import { useId, useState } from 'react'
import {
  ActionIcon,
  Card,
  Collapse,
  Group,
  List,
  Stack,
  Switch,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { categoryMeta } from '../lib/categories'

export function MealCard({ meal, editMode, onToggleReady, onEdit }) {
  const cat = categoryMeta(meal.category)
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const hasDetails = Boolean(cat || meal.ingredients?.length || meal.notes)

  return (
    <Card
      withBorder
      radius="md"
      padding="sm"
      className={meal.ready ? 'meal-card meal-card--ready' : 'meal-card'}
      data-flip-id={meal.id}
    >
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <UnstyledButton
          className="meal-card__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={detailsId}
          disabled={!hasDetails}
        >
          <Group gap="xs" wrap="nowrap">
            <Text fz={22} className="meal-card__icon" aria-hidden>
              {cat ? cat.icon : '🍽️'}
            </Text>
            <Text fw={600} lineClamp={open ? undefined : 2}>
              {meal.name}
            </Text>
            {hasDetails && (
              <Text c="dimmed" className={open ? 'chevron chevron--open' : 'chevron'} aria-hidden>
                ▾
              </Text>
            )}
          </Group>
        </UnstyledButton>

        <Group gap={4} wrap="nowrap">
          {editMode && (
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`Edit ${meal.name}`}
              onClick={() => onEdit(meal)}
            >
              ✏️
            </ActionIcon>
          )}
          <Switch
            checked={Boolean(meal.ready)}
            onChange={(e) => onToggleReady(meal.id, e.currentTarget.checked)}
            color="herb"
            size="sm"
            label="Ready"
            labelPosition="left"
            aria-label={`${meal.name}: I have everything to make this right now`}
          />
        </Group>
      </Group>

      <Collapse in={open} id={detailsId}>
        <Stack gap="xs" pt="sm">
          {cat && (
            <Text size="xs" c="tomato.7" tt="uppercase" fw={600}>
              {cat.label}
            </Text>
          )}

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
        </Stack>
      </Collapse>
    </Card>
  )
}
