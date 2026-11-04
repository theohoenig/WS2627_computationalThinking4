import type { Shortcut, ShortcutContext } from '~/shortcuts'

// Keys typed into text, or pressed inside an open popover, belong there and not to the board.
function isHandledElsewhere(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || target instanceof HTMLInputElement || target.closest('[role="dialog"]') !== null
}

// Runs the matching shortcut from the list.
export function useShortcuts(shortcuts: Shortcut[], context: ShortcutContext) {
  function onKeyDown(event: KeyboardEvent) {
    if (isHandledElsewhere(event.target)) return
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
    const mod = event.metaKey || event.ctrlKey
    const shortcut = shortcuts.find(s => s.keys.includes(key) && !!s.mod === mod)
    if (!shortcut) return
    event.preventDefault()
    shortcut.run(context)
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}
