import { createLucideIcon } from 'lucide-react'

// Lucide has no pasta or noodles icon. This is Tabler's bowl-chopsticks (MIT
// License, Paweł Kuna), which shares Lucide's 24px grid and 2px stroke.
export const NoodleBowl = createLucideIcon('noodle-bowl', [
  [
    'path',
    {
      d: 'M4 11h16a1 1 0 0 1 1 1v.5c0 1.5 -2.517 5.573 -4 6.5v1a1 1 0 0 1 -1 1h-8a1 1 0 0 1 -1 -1v-1c-1.687 -1.054 -4 -5 -4 -6.5v-.5a1 1 0 0 1 1 -1',
      key: 'bowl',
    },
  ],
  ['path', { d: 'M19 7l-14 1', key: 'stick-1' }],
  ['path', { d: 'M19 2l-14 3', key: 'stick-2' }],
])
