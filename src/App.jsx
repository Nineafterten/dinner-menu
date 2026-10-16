import { useMemo, useState } from 'react'
import {
  Affix,
  Alert,
  AppShell,
  Button,
  Center,
  Chip,
  Container,
  Group,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useMeals } from './hooks/useMeals'
import { exportToFile, importFromFile, restorePublished } from './data/menuFile'
import { CATEGORIES } from './lib/categories'
import { MealCard } from './components/MealCard'
import { MealForm } from './components/MealForm'
import { MenuFilePanel } from './components/MenuFilePanel'

export default function App() {
  const { meals, publishedAt, loading, error, createMeal, updateMeal, removeMeal } =
    useMeals()

  const [editMode, setEditMode] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [readyOnly, setReadyOnly] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [notice, setNotice] = useState(null)

  // Only show category filters for categories that actually have meals.
  const usedCategories = useMemo(() => {
    const set = new Set(meals.map((m) => m.category).filter(Boolean))
    return CATEGORIES.filter((c) => set.has(c.value))
  }, [meals])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return meals.filter((m) => {
      if (readyOnly && !m.ready) return false
      if (category !== 'all' && m.category !== category) return false
      if (!q) return true
      const haystack = [m.name, m.notes, ...(m.ingredients || [])]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [meals, query, category, readyOnly])

  const readyCount = useMemo(() => meals.filter((m) => m.ready).length, [meals])

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(meal) {
    setEditing(meal)
    setFormOpen(true)
  }

  async function handleSave(payload) {
    if (editing) await updateMeal(editing.id, payload)
    else await createMeal(payload)
  }

  function handleExport() {
    const count = exportToFile()
    setNotice({ color: 'teal', message: `Exported ${mealCount(count)} to menu.json.` })
  }

  async function handleImport(file) {
    if (!file) return
    if (!window.confirm(`Replace this device's meals with ${file.name}?`)) return
    try {
      const count = await importFromFile(file)
      setNotice({ color: 'teal', message: `Imported ${mealCount(count)}.` })
    } catch (err) {
      setNotice({ color: 'red', message: err.message })
    }
  }

  async function handleRestore() {
    if (!window.confirm("Replace this device's meals with the published menu?")) return
    try {
      const count = await restorePublished()
      setNotice({ color: 'teal', message: `Loaded the published menu (${mealCount(count)}).` })
    } catch (err) {
      setNotice({ color: 'red', message: err.message })
    }
  }

  return (
    <AppShell header={{ height: 60 }} padding="md" className="app-shell">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Text fz={24}>🍽️</Text>
            <Title order={3}>Dinner Menu</Title>
          </Group>
          <Switch
            checked={editMode}
            onChange={(e) => setEditMode(e.currentTarget.checked)}
            label="Edit mode"
            size="md"
          />
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" px={0}>
          <Stack>
            {error && (
              <Alert color="red" title="Couldn't load meals">
                {String(error.message || error)}
              </Alert>
            )}

            {notice && (
              <Alert color={notice.color} withCloseButton onClose={() => setNotice(null)}>
                {notice.message}
              </Alert>
            )}

            {editMode && (
              <MenuFilePanel
                publishedAt={publishedAt}
                onExport={handleExport}
                onImport={handleImport}
                onRestore={handleRestore}
              />
            )}

            <Group justify="space-between" align="flex-end" wrap="wrap">
              <TextInput
                placeholder="Search meals, ingredients, notes…"
                value={query}
                onChange={(e) => setQuery(e.currentTarget.value)}
                w={{ base: '100%', sm: 320 }}
                leftSection={<span>🔎</span>}
              />
              <Switch
                checked={readyOnly}
                onChange={(e) => setReadyOnly(e.currentTarget.checked)}
                label={`Ready now${readyCount ? ` (${readyCount})` : ''}`}
                color="amber"
              />
            </Group>

            {usedCategories.length > 0 && (
              <Chip.Group
                multiple={false}
                value={category}
                onChange={setCategory}
              >
                <Group gap="xs">
                  <Chip value="all" variant="light">
                    All
                  </Chip>
                  {usedCategories.map((c) => (
                    <Chip key={c.value} value={c.value} variant="light">
                      {c.icon} {c.label}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            )}

            {loading ? (
              <Center py="xl">
                <Loader color="amber" />
              </Center>
            ) : filtered.length === 0 ? (
              <EmptyState
                hasMeals={meals.length > 0}
                editMode={editMode}
                onAdd={openAdd}
              />
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
                {filtered.map((meal) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    editMode={editMode}
                    onToggleReady={(id, ready) => updateMeal(id, { ready })}
                    onEdit={openEdit}
                  />
                ))}
              </SimpleGrid>
            )}
          </Stack>
        </Container>
      </AppShell.Main>

      {editMode && (
        <Affix position={{ bottom: 24, right: 24 }}>
          <Button size="md" radius="xl" onClick={openAdd}>
            + Add meal
          </Button>
        </Affix>
      )}

      <MealForm
        opened={formOpen}
        meal={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        onDelete={removeMeal}
      />
    </AppShell>
  )
}

function mealCount(count) {
  return `${count} meal${count === 1 ? '' : 's'}`
}

function EmptyState({ hasMeals, editMode, onAdd }) {
  if (hasMeals) {
    return (
      <Center py="xl">
        <Text c="dimmed">No meals match your filters.</Text>
      </Center>
    )
  }
  return (
    <Center py={60}>
      <Stack align="center" gap="sm">
        <Text fz={48}>🍳</Text>
        <Text fw={600} fz="lg">
          No meals yet
        </Text>
        <Text c="dimmed" ta="center" maw={360}>
          {editMode
            ? 'Add the first meal you know how to make.'
            : 'Turn on Edit mode to start adding meals you know how to make.'}
        </Text>
        {editMode && (
          <Button onClick={onAdd} mt="xs">
            + Add your first meal
          </Button>
        )}
      </Stack>
    </Center>
  )
}
