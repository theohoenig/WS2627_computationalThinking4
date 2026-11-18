import { Hono, type Context } from 'hono'
import { readObjects, writeObjects, type BoardObject } from '../storage.js'
import { validateCreate, validatePatch } from '../validate.js'

export const objects = new Hono()

// Returns the parsed body, or null if it is not a JSON object.
async function readBody(c: Context): Promise<Record<string, unknown> | null> {
  const body = await c.req.json().catch(() => null)
  return body && typeof body === 'object' && !Array.isArray(body) ? body : null
}

objects.get('/', async c => c.json(await readObjects(), 200))

objects.post('/', async c => {
  const body = await readBody(c)
  if (!body) return c.json({ error: 'body must be a JSON object' }, 400)
  const error = validateCreate(body)
  if (error) return c.json({ error }, 400)

  const object = { ...body, id: crypto.randomUUID() } as BoardObject
  await writeObjects([...(await readObjects()), object])
  return c.json(object, 201)
})

objects.patch('/:id', async c => {
  const body = await readBody(c)
  if (!body) return c.json({ error: 'body must be a JSON object' }, 400)
  const error = validatePatch(body)
  if (error) return c.json({ error }, 400)

  const all = await readObjects()
  const existing = all.find(object => object.id === c.req.param('id'))
  if (!existing) return c.json({ error: 'object not found' }, 404)

  const updated = { ...existing, ...body }
  await writeObjects(all.map(object => (object === existing ? updated : object)))
  return c.json(updated, 200)
})

objects.delete('/:id', async c => {
  const all = await readObjects()
  const remaining = all.filter(object => object.id !== c.req.param('id'))
  if (remaining.length === all.length) return c.json({ error: 'object not found' }, 404)

  await writeObjects(remaining)
  return c.body(null, 204)
})
