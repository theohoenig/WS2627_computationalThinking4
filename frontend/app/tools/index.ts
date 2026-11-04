import { noteTool } from './note'
import { textTool } from './text'
import { shapeTool } from './shape'
import type { ToolDefinition, ToolSettings } from './types'

// Toolbar order. Add new tools here.
export const TOOLS: ToolDefinition[] = [noteTool, textTool, shapeTool]

export function findTool(id: string) {
  return TOOLS.find(tool => tool.id === id)!
}

export function defaultSettings(): Record<string, ToolSettings> {
  return Object.fromEntries(TOOLS.map(tool => [
    tool.id,
    Object.fromEntries(tool.attributes.map(attribute => [attribute.key, attribute.default])),
  ]))
}
