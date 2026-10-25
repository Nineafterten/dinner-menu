import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'

/** Flips between the paper and candlelit themes; the choice is remembered on this device. */
export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const scheme = useComputedColorScheme('light', { getInitialValueInEffect: false })
  const next = scheme === 'dark' ? 'light' : 'dark'

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      size="md"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setColorScheme(next)}
    >
      <span aria-hidden>{scheme === 'dark' ? '☀️' : '🌙'}</span>
    </ActionIcon>
  )
}
