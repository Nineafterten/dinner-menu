import { useId, useState } from 'react'
import {
  Burger,
  Divider,
  Popover,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  useMantineColorScheme,
} from '@mantine/core'

/**
 * The header's menu: the Ready now filter, Entry mode and the theme, plus room for
 * settings that don't need a spot on the page. A dot on the button says a filter is on.
 */
export function AppMenu({ readyOnly, readyCount, onReadyOnlyChange, editMode, onEditModeChange }) {
  const [opened, setOpened] = useState(false)

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
          aria-label={readyOnly ? 'Menu, showing ready meals only' : 'Menu'}
        >
          {readyOnly && <span className="app-menu__dot" aria-hidden />}
        </Burger>
      </Popover.Target>
      <Popover.Dropdown className="app-menu" aria-label="Menu">
        <Stack gap="md">
          <Switch
            color="herb"
            size="md"
            checked={readyOnly}
            onChange={(e) => onReadyOnlyChange(e.currentTarget.checked)}
            label={`Ready now${readyCount ? ` (${readyCount})` : ''}`}
            description="Only meals you have everything for"
          />
          <Switch
            size="md"
            checked={editMode}
            onChange={(e) => onEditModeChange(e.currentTarget.checked)}
            label="Entry mode"
            description="Add, edit and publish meals"
          />
          <Divider color="var(--dm-line)" />
          <ThemeChoice />
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
