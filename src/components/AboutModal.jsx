import { Anchor, Modal, Stack, Text } from '@mantine/core'

const REPO_URL = 'https://github.com/Nineafterten/dinner-menu'

const builtOn = new Date(__APP_BUILT_AT__).toLocaleDateString(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

/** The app's version and build, and where its data lives. */
export function AboutModal({ opened, onClose }) {
  return (
    <Modal opened={opened} onClose={onClose} title="About Dinner Menu" centered size="sm">
      <Stack gap="sm">
        <Text size="sm">The meals we know how to make.</Text>
        <dl className="about-facts">
          <dt>Version</dt>
          <dd>{__APP_VERSION__}</dd>
          <dt>Build</dt>
          <dd>
            {__APP_COMMIT__ ? (
              <Anchor href={`${REPO_URL}/commit/${__APP_COMMIT__}`} target="_blank" rel="noreferrer">
                {__APP_COMMIT__}
              </Anchor>
            ) : (
              'local'
            )}
            {' · '}
            {builtOn}
          </dd>
        </dl>
        <Text size="sm" c="dimmed">
          Meals live on this device. Every device starts from the menu published with the site.
        </Text>
      </Stack>
    </Modal>
  )
}
