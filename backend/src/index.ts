import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { objects } from './routes/objects.js'

const PORT = 3001

const app = new Hono()

app.route('/objects', objects)

// Anything that goes wrong inside a route (e.g. the storage cannot be read) ends up here.
app.onError((error, c) => {
  console.error(error)
  return c.json({ error: 'internal server error' }, 500)
})

serve({ fetch: app.fetch, port: PORT }, () => console.log(`Backend running on http://localhost:${PORT}`))
