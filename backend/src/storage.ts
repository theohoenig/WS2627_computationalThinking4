import { readFile, writeFile } from 'node:fs/promises'

// What every object on the board has in common. Variant-specific fields (text, color, ...) are passed through as they are.
export interface BoardObject {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  [field: string]: unknown
}

// The only place that knows where the board is stored. Everything else goes through the two functions below.
const BOARD_FILE = new URL('../data/board.json', import.meta.url)

export async function readObjects(): Promise<BoardObject[]> {
  return JSON.parse(await readFile(BOARD_FILE, 'utf-8'))
}

export async function writeObjects(objects: BoardObject[]) {
  await writeFile(BOARD_FILE, `${JSON.stringify(objects, null, 2)}\n`)
}
