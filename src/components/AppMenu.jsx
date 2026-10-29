import { useState } from 'react'
import { Burger, Popover, Stack, Switch } from '@mantine/core'

/**
 * The header's menu: the Ready now filter and Entry mode, plus room for settings
 * that don't need a spot on the page. A dot on the button says a filter is on.
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
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}
