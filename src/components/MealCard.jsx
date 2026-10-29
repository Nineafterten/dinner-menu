import { useId, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Card,
  Collapse,
  Group,
  Stack,
  Switch,
  Text,
  UnstyledButton,
} from '@mantine/core'
import { ChevronDown, Heart, Pencil } from 'lucide-react'
import { categoryIcon, categoryMeta } from '../lib/categories'
import { Ingredients, hasIngredients } from './Ingredients'
import { Steps, hasSteps } from './Steps'

export function MealCard({ meal, editMode, favorite, onToggleFavorite, onToggleReady, onEdit }) {
  const cat = categoryMeta(meal.category)
  const Icon = categoryIcon(meal.category)
  const [open, setOpen] = useState(false)
  const detailsId = useId()
  const tags = meal.tags || []
  const hasDetails = Boolean(cat || tags.length || hasIngredients(meal) || hasSteps(meal))

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
          <ActionIcon
            variant="subtle"
            color="gray"
            className={favorite ? 'meal-card__heart meal-card__heart--on' : 'meal-card__heart'}
            aria-label={`Favorite ${meal.name}`}
            aria-pressed={favorite}
            onClick={() => onToggleFavorite(meal.id)}
          >
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} aria-hidden />
          </ActionIcon>
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
          {(cat || tags.length > 0) && (
            <Group gap={6}>
              {cat && (
                <Text size="xs" tt="uppercase" fw={600} className="meal-card__category">
                  {cat.label}
                </Text>
              )}
              {tags.map((tag) => (
                <Badge key={tag} size="sm" variant="outline" color="gray" className="meal-card__tag">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}

          <Ingredients meal={meal} />
          <Steps meal={meal} />
        </Stack>
      </Collapse>
    </Card>
  )
}
