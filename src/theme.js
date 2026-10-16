import { createTheme } from '@mantine/core'

// A printed-menu palette: cream paper and ink, a tomato-red accent, and herb green
// for meals that are ready to make. Paper and ink tokens live in index.css.
export const theme = createTheme({
  primaryColor: 'tomato',
  primaryShade: 6,
  colors: {
    // Warm grays in place of Mantine's cool, blue-tinted default.
    gray: [
      '#faf7f1',
      '#f2ede3',
      '#e8e0d1',
      '#d9cfbc',
      '#b9ac94',
      '#968a74',
      '#776c59',
      '#5c5344',
      '#433c31',
      '#2d2821',
    ],
    tomato: [
      '#fdf0ed',
      '#f9dcd5',
      '#f1b5a8',
      '#e98c79',
      '#de6650',
      '#cf5039',
      '#b03f2b',
      '#933222',
      '#76271a',
      '#5a1d13',
    ],
    herb: [
      '#f1f5ea',
      '#dfe8cf',
      '#c0d3a1',
      '#a0bc73',
      '#82a64c',
      '#6b8c3b',
      '#55702f',
      '#445a26',
      '#34451d',
      '#253115',
    ],
  },
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  headings: { fontFamily: 'Georgia, "Times New Roman", serif' },
  defaultRadius: 'md',
})
