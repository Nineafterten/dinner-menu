import { useEffect, useState } from 'react'
import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  TextInput,
  Textarea,
} from '@mantine/core'
import { CATEGORIES } from '../lib/categories'

const EMPTY = { name: '', category: '', ingredientsText: '', notes: '', ready: false }

// Ingredients are stored as a text[] but edited as one-per-line text — simplest
// UX for quick manual entry.
function toForm(meal) {
  if (!meal) return EMPTY
  return {
    name: meal.name || '',
    category: meal.category || '',
    ingredientsText: (meal.ingredients || []).join('\n'),
    notes: meal.notes || '',
    ready: Boolean(meal.ready),
  }
}

export function MealForm({ opened, meal, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(meal)

  useEffect(() => {
    if (opened) setForm(toForm(meal))
  }, [opened, meal])

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  async function handleSave() {
    const name = form.name.trim()
    if (!name) return
    const payload = {
      name,
      category: form.category || null,
      ingredients: form.ingredientsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      notes: form.notes.trim(),
      ready: form.ready,
    }
    setSaving(true)
    try {
      await onSave(payload)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Edit meal' : 'Add a meal'}
      centered
      size="lg"
    >
      <Stack>
        <TextInput
          label="Name"
          placeholder="e.g. Sheet-pan chicken thighs"
          required
          value={form.name}
          onChange={(e) => set('name')(e.currentTarget.value)}
          data-autofocus
        />
        <Select
          label="Category"
          placeholder="Optional"
          clearable
          value={form.category}
          onChange={(v) => set('category')(v || '')}
          data={CATEGORIES.map((c) => ({
            value: c.value,
            label: `${c.icon}  ${c.label}`,
          }))}
        />
        <Textarea
          label="Ingredients"
          description="One per line"
          placeholder={'chicken thighs\npotatoes\nolive oil\nrosemary'}
          autosize
          minRows={4}
          value={form.ingredientsText}
          onChange={(e) => set('ingredientsText')(e.currentTarget.value)}
        />
        <Textarea
          label="Prep / cook notes"
          placeholder="425°F for 35 min, flip halfway…"
          autosize
          minRows={3}
          value={form.notes}
          onChange={(e) => set('notes')(e.currentTarget.value)}
        />
        <Switch
          label="I have everything to make this right now"
          checked={form.ready}
          onChange={(e) => set('ready')(e.currentTarget.checked)}
        />
        <Group justify="space-between" mt="sm">
          {isEdit ? (
            <Button
              variant="subtle"
              color="red"
              onClick={() => {
                onDelete(meal.id)
                onClose()
              }}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Group>
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.name.trim()}>
              {isEdit ? 'Save' : 'Add meal'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}
