'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useGraphStore } from '@/store/useGraphStore';
import { useUIStore } from '@/store/useUIStore';
import PropertyRow from './PropertyRow';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function NodeModal() {
  const { selectedNodeId, setSelectedNodeId } = useUIStore();
  const { nodes, updateNode, properties } = useGraphStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Local state for debounced updates
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title);
      setDescription(selectedNode.data.description || '');
      setProgress(selectedNode.data.progress);
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateNode(selectedNode.id, { title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    updateNode(selectedNode.id, { description: e.target.value });
  };

  const handleProgressChange = (val: number | readonly number[]) => {
    const newProgress = Array.isArray(val) || typeof val !== 'number' ? val[0] : val;
    setProgress(newProgress);
    updateNode(selectedNode.id, { progress: newProgress });
  };

  const handlePropertyChange = (propertyId: string, value: string | number | boolean) => {
    updateNode(selectedNode.id, {
      properties: {
        ...selectedNode.data.properties,
        [propertyId]: value,
      },
    });
  };

  return (
    <Sheet open={!!selectedNodeId} onOpenChange={(open) => !open && setSelectedNodeId(null)}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-neutral-950 text-neutral-50 border-l border-neutral-800 p-0 flex flex-col">
        <div className="p-6 overflow-y-auto flex-1">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-transparent">Edit Task</SheetTitle>
          </SheetHeader>

          {/* Title Input */}
          <input
            className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-neutral-600 mb-4"
            placeholder="Untitled Task"
            value={title}
            onChange={handleTitleChange}
          />

          {/* Progress Slider */}
          <div className="mb-8 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-neutral-400">Progress</Label>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full"
            />
          </div>

          {/* Properties List */}
          <div className="space-y-4 mb-8">
            {properties.map((prop) => (
              <PropertyRow
                key={prop.id}
                property={prop}
                value={selectedNode.data.properties[prop.id]}
                onChange={(val) => handlePropertyChange(prop.id, val)}
              />
            ))}
          </div>

          <hr className="border-neutral-800 my-6" />

          {/* Description / Notes */}
          <textarea
            className="w-full h-48 bg-transparent border-none outline-none resize-none placeholder:text-neutral-600"
            placeholder="Add description or notes..."
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
