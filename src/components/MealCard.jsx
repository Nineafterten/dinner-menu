import { useId, useState } from 'react'
import {
  ActionIcon,
  Card,
  Collapse,
  Group,
  Stack,
  Switch,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { ChevronDown, Pencil } from 'lucide-react'
import { categoryIcon, categoryMeta } from '../lib/categories'
import { Ingredients, hasIngredients } from './Ingredients'

export function MealCard({ meal, editMode, onToggleReady, onEdit }) {
  const cat = categoryMeta(meal.category)
  const Icon = categoryIcon(meal.category)
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const hasDetails = Boolean(cat || hasIngredients(meal) || meal.notes)

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
            <Icon size={22} strokeWidth={1.75} className="meal-card__icon" aria-hidden />
            <Text fw={600} lineClamp={open ? undefined : 2}>
              {meal.name}
            </Text>
            {hasDetails && (
              <ChevronDown
                size={16}
                className={open ? 'chevron chevron--open' : 'chevron'}
                aria-hidden
              />
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
              <Pencil size={16} aria-hidden />
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
            <Text size="xs" tt="uppercase" fw={600} className="meal-card__category">
              {cat.label}
            </Text>
          )}

          <Ingredients meal={meal} />

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
