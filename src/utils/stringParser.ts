export interface ParsedCommand {
  type: 'ADD_NODE' | 'ADD_EDGE';
  source?: string;
  target?: string;
  nodeName?: string;
}

/**
 * Parses simple text commands:
 * "Mine Diamonds" -> Adds a node named "Mine Diamonds"
 * "Make Pickaxe -> Mine Diamonds" -> Adds two nodes and a directed edge
 * "Gather Wood <- Build House" -> Adds two nodes and a directed edge from Gather Wood to Build House
 */
export function parseCommand(input: string): ParsedCommand[] {
  const commands: ParsedCommand[] = [];
  const trimmed = input.trim();

  if (!trimmed) return commands;

  // Check for -> or <-
  const forwardMatch = trimmed.split('->');
  const backwardMatch = trimmed.split('<-');

  if (forwardMatch.length > 1) {
    const source = forwardMatch[0].trim();
    const target = forwardMatch[1].trim();
    if (source && target) {
      commands.push({ type: 'ADD_NODE', nodeName: source });
      commands.push({ type: 'ADD_NODE', nodeName: target });
      commands.push({ type: 'ADD_EDGE', source, target });
    }
  } else if (backwardMatch.length > 1) {
    const target = backwardMatch[0].trim();
    const source = backwardMatch[1].trim();
    if (source && target) {
      commands.push({ type: 'ADD_NODE', nodeName: source });
      commands.push({ type: 'ADD_NODE', nodeName: target });
      commands.push({ type: 'ADD_EDGE', source, target });
    }
  } else {
    // Just a single node
    commands.push({ type: 'ADD_NODE', nodeName: trimmed });
  }

  return commands;
}

export function generateId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}
