import { createTheme } from '@mantine/core'

// Warm, kitchen-ish palette. Amber primary against a dark background.
export const theme = createTheme({
  primaryColor: 'amber',
  colors: {
    amber: [
      '#fff8e1',
      '#ffecb3',
      '#ffe082',
      '#ffd54f',
      '#ffca28',
      '#ffc107',
      '#ffb300',
      '#ffa000',
      '#ff8f00',
      '#ff6f00',
    ],
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  defaultRadius: 'md',
})
