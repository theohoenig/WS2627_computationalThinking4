const TYPES = ['sticky-note', 'text', 'circle']
const RECT_FIELDS = ['x', 'y', 'width', 'height']

type Body = Record<string, unknown>

// Each check returns an error message for a 400 response, or null if the body is fine.

export function validateCreate(body: Body): string | null {
  if ('id' in body) return 'id is assigned by the server'
  if (!TYPES.includes(body.type as string)) return `type must be one of: ${TYPES.join(', ')}`
  for (const field of RECT_FIELDS) {
    if (typeof body[field] !== 'number') return `${field} must be a number`
  }
  return null
}

export function validatePatch(body: Body): string | null {
  if ('id' in body) return 'id cannot be changed'
  for (const field of RECT_FIELDS) {
    if (field in body && typeof body[field] !== 'number') return `${field} must be a number`
  }
  return null
}
