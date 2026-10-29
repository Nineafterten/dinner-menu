import { useId, useState } from 'react'
import {
  Burger,
  Button,
  Chip,
  Divider,
  Group,
  Popover,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  useMantineColorScheme,
} from '@mantine/core'

/**
 * The header's menu: the Ready now, Favorites and tag filters, Entry mode, the theme
 * and About, plus room for settings that don't need a spot on the page. A dot on the
 * button says a filter is on.
 */
export function AppMenu({
  filters,
  onFiltersChange,
  readyCount,
  favoriteCount,
  tags,
  editMode,
  onEditModeChange,
  onAbout,
}) {
  const [opened, setOpened] = useState(false)
  const tagLabelId = useId()
  const filtering = filters.readyOnly || filters.favoritesOnly || Boolean(filters.tag)

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-end"
      offset={6}
      shadow="md"
      radius="md"
      trapFocus
      returnFocus
    >
      <Popover.Target>
        <Burger
          className="app-menu__button"
          size="sm"
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          aria-label={filtering ? 'Menu, filters on' : 'Menu'}
        >
          {filtering && <span className="app-menu__dot" aria-hidden />}
        </Burger>
      </Popover.Target>
      <Popover.Dropdown className="app-menu" aria-label="Menu">
        <Stack gap="md">
          <Switch
            color="herb"
            size="md"
            checked={filters.readyOnly}
            onChange={(e) => onFiltersChange({ readyOnly: e.currentTarget.checked })}
            label={`Ready now${readyCount ? ` (${readyCount})` : ''}`}
            description="Only meals you have everything for"
          />
          <Switch
            size="md"
            checked={filters.favoritesOnly}
            onChange={(e) => onFiltersChange({ favoritesOnly: e.currentTarget.checked })}
            label={`Favorites${favoriteCount ? ` (${favoriteCount})` : ''}`}
            description="The meals you've hearted on this device"
          />
          {tags.length > 0 && (
            <div>
              <Text id={tagLabelId} size="sm" mb={6}>
                Tag
              </Text>
              <Chip.Group
                multiple={false}
                value={filters.tag ?? ''}
                onChange={(value) => onFiltersChange({ tag: value || null })}
              >
                <Group gap={6} className="app-menu__tags" role="radiogroup" aria-labelledby={tagLabelId}>
                  <Chip value="" size="sm" variant="light">
                    Any
                  </Chip>
                  {tags.map((tag) => (
                    <Chip key={tag} value={tag} size="sm" variant="light">
                      {tag}
                    </Chip>
                  ))}
                </Group>
              </Chip.Group>
            </div>
          )}
          <Divider color="var(--dm-line)" />
          <Switch
            size="md"
            checked={editMode}
            onChange={(e) => onEditModeChange(e.currentTarget.checked)}
            label="Entry mode"
            description="Add, edit and publish meals"
          />
          <Divider color="var(--dm-line)" />
          <ThemeChoice />
          <Divider color="var(--dm-line)" />
          <Button
            className="app-menu__about"
            variant="subtle"
            color="dark"
            fw={400}
            justify="space-between"
            rightSection={<span className="app-menu__version">v{__APP_VERSION__}</span>}
            onClick={() => {
              setOpened(false)
              onAbout()
            }}
          >
            About Dinner Menu
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

const THEMES = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

/** Paper or candlelit, or follow the device; the choice is remembered on this device. */
function ThemeChoice() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const labelId = useId()

  return (
    <div>
      <Text id={labelId} size="sm" mb={6}>
        Theme
      </Text>
      <SegmentedControl
        fullWidth
        role="radiogroup"
        aria-labelledby={labelId}
        data={THEMES}
        value={colorScheme}
        onChange={setColorScheme}
      />
    </div>
  )
}
