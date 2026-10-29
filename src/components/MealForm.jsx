import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Button, Modal, Switch, Textarea, UnstyledButton, VisuallyHidden } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { CATEGORIES } from '../lib/categories'

let rowKey = 0
const toRows = (items) => {
  const rows = (items || []).map((text) => ({ key: ++rowKey, text }))
  return rows.length ? rows : [{ key: ++rowKey, text: '' }]
}
const fromRows = (rows) => rows.map((r) => r.text.trim()).filter(Boolean)

function toForm(meal) {
  return {
    name: meal?.name || '',
    category: meal?.category || '',
    ingredients: toRows(meal?.ingredients),
    optionalIngredients: toRows(meal?.optionalIngredients),
    notes: meal?.notes || '',
    ready: Boolean(meal?.ready),
  }
}

/**
 * One editable line per ingredient. Enter starts the next line, Backspace on an
 * empty line removes it, and pasting several lines splits them into rows.
 */
function IngredientRows({ heading, itemLabel, addLabel, rows, onChange }) {
  const headingId = useId()
  const inputs = useRef(new Map())
  const [focusKey, setFocusKey] = useState(null)

  useEffect(() => {
    if (focusKey === null) return
    inputs.current.get(focusKey)?.focus()
    setFocusKey(null)
  }, [focusKey])

  const setText = (key, text) =>
    onChange(rows.map((r) => (r.key === key ? { ...r, text } : r)))

  const insertAfter = (index, texts = ['']) => {
    const added = texts.map((text) => ({ key: ++rowKey, text }))
    onChange([...rows.slice(0, index + 1), ...added, ...rows.slice(index + 1)])
    setFocusKey(added.at(-1).key)
  }

  const remove = (index) => {
    const next = rows.filter((_, i) => i !== index)
    if (!next.length) next.push({ key: ++rowKey, text: '' })
    onChange(next)
    setFocusKey((next[index - 1] ?? next[0]).key)
  }

  function handleKeyDown(e, index, row) {
    if (e.key === 'Enter') {
      e.preventDefault()
      insertAfter(index)
    } else if (e.key === 'Backspace' && row.text === '' && rows.length > 1) {
      e.preventDefault()
      remove(index)
    }
  }

  function handlePaste(e, index, row) {
    const lines = e.clipboardData.getData('text').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    if (lines.length < 2) return
    e.preventDefault()
    const [first, ...rest] = lines
    const merged = rows.map((r) => (r.key === row.key ? { ...r, text: r.text + first } : r))
    const added = rest.map((text) => ({ key: ++rowKey, text }))
    onChange([...merged.slice(0, index + 1), ...added, ...merged.slice(index + 1)])
    setFocusKey(added.at(-1).key)
  }

  return (
    <section className="menu-entry__group" aria-labelledby={headingId}>
      <h3 id={headingId} className="menu-entry__heading">
        {heading}
      </h3>
      <ul className="menu-entry__rows">
        {rows.map((row, index) => (
          <li key={row.key} className="menu-entry__row">
            <input
              ref={(el) => (el ? inputs.current.set(row.key, el) : inputs.current.delete(row.key))}
              className="menu-entry__row-input"
              aria-label={`${itemLabel} ${index + 1}`}
              autoComplete="off"
              enterKeyHint="next"
              value={row.text}
              onChange={(e) => setText(row.key, e.currentTarget.value)}
              onKeyDown={(e) => handleKeyDown(e, index, row)}
              onPaste={(e) => handlePaste(e, index, row)}
            />
            <UnstyledButton
              className="menu-entry__remove"
              aria-label={`Remove ${row.text.trim() || `${itemLabel.toLowerCase()} ${index + 1}`}`}
              onClick={() => remove(index)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </UnstyledButton>
          </li>
        ))}
      </ul>
      <UnstyledButton className="menu-entry__add" onClick={() => insertAfter(rows.length - 1)}>
        + {addLabel}
      </UnstyledButton>
    </section>
  )
}

/**
 * Add or edit a meal, laid out like the menu entry it becomes. A draft prefills a
 * new meal, as Duplicate does.
 */
export function MealForm({ opened, meal, draft, onClose, onSave, onDelete, onDuplicate }) {
  const [form, setForm] = useState(() => toForm(meal ?? draft))
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(meal)
  const isPhone = useMediaQuery('(max-width: 47.99em)')
  const nameId = useId()
  const categoryId = useId()
  const formRef = useRef(null)
  const [nameEl, setNameEl] = useState(null)

  useEffect(() => {
    if (opened) setForm(toForm(meal ?? draft))
  }, [opened, meal, draft])

  // A duplicate keeps the form open, so select its name, ready to rename, once the
  // copied name has rendered.
  const selectName = useRef(false)
  useEffect(() => {
    if (draft) selectName.current = true
  }, [draft])
  useEffect(() => {
    if (!selectName.current || !nameEl) return
    selectName.current = false
    nameEl.focus()
    nameEl.select()
  }, [form.name, nameEl])

  // The name wraps instead of clipping, so its box grows to fit each line. It
  // re-fits when its width changes too: the modal opens mid-animation, and
  // phones rotate.
  useLayoutEffect(() => {
    const el = nameEl
    if (!el) return
    const fit = () => {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
    fit()
    let width = el.clientWidth
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return
      width = el.clientWidth
      fit()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [nameEl, form.name])

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const canSave = form.name.trim() !== ''

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true)
    try {
      await onSave({
        name: form.name.trim(),
        category: form.category || null,
        ingredients: fromRows(form.ingredients),
        optionalIngredients: fromRows(form.optionalIngredients),
        notes: form.notes.trim(),
        ready: form.ready,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  // Enter in the name moves on to the ingredients rather than saving a bare meal.
  function handleNameKeyDown(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    formRef.current?.querySelector('.menu-entry__row-input')?.focus()
  }

  return (
    <Modal.Root opened={opened} onClose={onClose} fullScreen={isPhone} size="lg" centered>
      <Modal.Overlay />
      <Modal.Content className="entry-modal">
        <form ref={formRef} className="entry-form" onSubmit={handleSubmit}>
          <div className="entry-bar">
            <Button variant="subtle" color="dark" onClick={onClose}>
              Cancel
            </Button>
            <Modal.Title className="entry-bar__title">{isEdit ? 'Edit dish' : 'New dish'}</Modal.Title>
            <Button type="submit" loading={saving} disabled={!canSave}>
              {isEdit ? 'Save' : 'Add'}
            </Button>
          </div>

          <Modal.Body className="entry-body">
            <div className="menu-entry">
              <div className="menu-entry__rule">
                <VisuallyHidden component="label" htmlFor={categoryId}>
                  Category
                </VisuallyHidden>
                <select
                  id={categoryId}
                  className="menu-entry__category"
                  value={form.category}
                  onChange={(e) => set('category')(e.currentTarget.value)}
                >
                  <option value="">No category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="menu-entry__name-field">
                <label htmlFor={nameId} className="menu-entry__name-label">
                  Meal
                </label>
                <textarea
                  ref={setNameEl}
                  id={nameId}
                  className="menu-entry__name"
                  name="meal-title"
                  rows={1}
                  autoComplete="off"
                  enterKeyHint="next"
                  placeholder="Sheet-pan chicken thighs"
                  required
                  value={form.name}
                  onChange={(e) => set('name')(e.currentTarget.value.replace(/\s*\n\s*/g, ' '))}
                  onKeyDown={handleNameKeyDown}
                  data-autofocus
                />
              </div>

              <IngredientRows
                heading="You’ll need"
                itemLabel="Ingredient"
                addLabel="Add an ingredient"
                rows={form.ingredients}
                onChange={set('ingredients')}
              />
              <IngredientRows
                heading="Nice to have"
                itemLabel="Optional ingredient"
                addLabel="Add an optional one"
                rows={form.optionalIngredients}
                onChange={set('optionalIngredients')}
              />
            </div>

            <Textarea
              label="Kitchen notes"
              placeholder="425°F for 35 min, flip halfway…"
              autosize
              minRows={3}
              value={form.notes}
              onChange={(e) => set('notes')(e.currentTarget.value)}
            />

            <Switch
              color="herb"
              label="I have everything to make this now"
              checked={form.ready}
              onChange={(e) => set('ready')(e.currentTarget.checked)}
            />

            {isEdit && (
              <div className="entry-actions">
                <Button variant="subtle" color="dark" onClick={() => onDuplicate(meal)}>
                  Duplicate this meal
                </Button>
                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    onDelete(meal.id)
                    onClose()
                  }}
                >
                  Delete this meal
                </Button>
              </div>
            )}
          </Modal.Body>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}
