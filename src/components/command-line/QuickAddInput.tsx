'use client';

import { useState } from 'react';
import { useGraphStore } from '@/store/useGraphStore';
import { parseCommand, generateId } from '@/utils/stringParser';
import { useReactFlow } from '@xyflow/react';
import { Input } from '@/components/ui/input';

export default function QuickAddInput() {
  const [input, setInput] = useState('');
  const { nodes, addNode, edges, onConnect } = useGraphStore();
  const { screenToFlowPosition } = useReactFlow();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      executeCommand(input);
      setInput('');
    }
  };

  const executeCommand = (cmdStr: string) => {
    const commands = parseCommand(cmdStr);
    
    // Add Nodes
    commands.filter(c => c.type === 'ADD_NODE').forEach(cmd => {
      if (cmd.nodeName) {
        const id = generateId(cmd.nodeName);
        // Don't add if already exists
        if (!nodes.find(n => n.id === id)) {
          // Calculate center of screen
          const center = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
          };
          
          // Add some jitter so they don't spawn exactly on top of each other
          const jitterX = (Math.random() - 0.5) * 50;
          const jitterY = (Math.random() - 0.5) * 50;
          
          const position = screenToFlowPosition({
            x: center.x + jitterX,
            y: center.y + jitterY,
          });

          addNode({
            id,
            type: 'pieChart',
            position,
            data: {
              title: cmd.nodeName,
              progress: 0,
              properties: {}
            }
          });
        }
      }
    });

    // Add Edges
    commands.filter(c => c.type === 'ADD_EDGE').forEach(cmd => {
      if (cmd.source && cmd.target) {
        const sourceId = generateId(cmd.source);
        const targetId = generateId(cmd.target);
        
        // Check if edge exists
        const edgeId = `e_${sourceId}-${targetId}`;
        if (!edges.find(e => e.id === edgeId)) {
          // React Flow's onConnect expects a connection object
          // We can just add it directly using useGraphStore's onConnect wrapper or direct state
          // For simplicity, we bypass onConnect and use addEdge if we had it, 
          // but we only exposed onConnect. Let's just mock a Connection object.
          onConnect({
            source: sourceId,
            target: targetId,
            sourceHandle: null,
            targetHandle: null,
          });
        }
      }
    });
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50">
      <div className="bg-neutral-900/80 backdrop-blur-md rounded-full shadow-2xl p-2 flex items-center border border-neutral-700">
        <span className="text-neutral-500 font-mono ml-4 mr-2">{'>'}</span>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none shadow-none text-white focus-visible:ring-0 text-lg placeholder:text-neutral-600 h-10"
          placeholder="e.g. Gather Wood -> Build House"
          autoFocus
        />
      </div>
    </div>
  );
}
