import { Button, Card, FileButton, Group, Stack, Text } from '@mantine/core'

const DATE = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function MenuFilePanel({ publishedAt, onExport, onImport, onRestore }) {
  return (
    <Card withBorder radius="md" padding="md">
      <Stack gap="xs">
        <Text fw={600}>Publish the menu</Text>
        <Text size="sm" c="dimmed">
          Everyone sees the menu published with the site. To publish your changes, export
          menu.json, replace public/menu.json in the repo with it, and push. The site
          redeploys in about a minute.
        </Text>
        <Text size="sm" c="dimmed">
          {publishedAt
            ? `This device follows the published menu (last taken from the one published ${DATE.format(new Date(publishedAt))}).`
            : 'This device keeps its own copy and doesn’t pick up the published menu.'}
        </Text>
        <Group gap="xs" mt="xs">
          <Button onClick={onExport}>Export menu.json</Button>
          <FileButton accept="application/json,.json" onChange={onImport}>
            {(props) => (
              <Button variant="default" {...props}>
                Import a file…
              </Button>
            )}
          </FileButton>
          <Button variant="subtle" onClick={onRestore}>
            Use the published menu
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
