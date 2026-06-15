'use client';

import { useUIStore } from '@/store/useUIStore';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Play, Square } from 'lucide-react';

export default function PhysicsControls() {
  const { 
    physicsEnabled, setPhysicsEnabled,
    chargeStrength, setChargeStrength,
    linkDistance, setLinkDistance,
    gravityStrength, setGravityStrength,
    centralForceStrength, setCentralForceStrength
  } = useUIStore();

  return (
    <div className="w-full text-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-neutral-100 flex items-center gap-2">
          {physicsEnabled ? <Play className="w-4 h-4 text-green-400" /> : <Square className="w-4 h-4 text-neutral-500" />}
          Graph Physics
        </h3>
        <Switch 
          checked={physicsEnabled}
          onCheckedChange={setPhysicsEnabled}
        />
      </div>

      <div className={`space-y-4 transition-opacity duration-200 ${physicsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-neutral-400">Repel Force</Label>
            <span className="text-xs font-mono">{Math.abs(chargeStrength)}</span>
          </div>
          <Slider
            value={[Math.abs(chargeStrength)]}
            min={100}
            max={2000}
            step={50}
            onValueChange={(val) => {
              const newStrength = Array.isArray(val) || typeof val !== 'number' ? (val as readonly number[])[0] : val;
              setChargeStrength(-newStrength);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-neutral-400">Link Distance</Label>
            <span className="text-xs font-mono">{linkDistance}</span>
          </div>
          <Slider
            value={[linkDistance]}
            min={50}
            max={500}
            step={10}
            onValueChange={(val) => {
              const newDistance = Array.isArray(val) || typeof val !== 'number' ? (val as readonly number[])[0] : val;
              setLinkDistance(newDistance);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-neutral-400">Universal Gravity</Label>
            <span className="text-xs font-mono">{gravityStrength}</span>
          </div>
          <Slider
            value={[gravityStrength]}
            min={0}
            max={200}
            step={5}
            onValueChange={(val) => {
              const newStrength = Array.isArray(val) || typeof val !== 'number' ? (val as readonly number[])[0] : val;
              setGravityStrength(newStrength);
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-neutral-400">Central Attraction</Label>
            <span className="text-xs font-mono">{centralForceStrength}</span>
          </div>
          <Slider
            value={[centralForceStrength]}
            min={0}
            max={0.2}
            step={0.01}
            onValueChange={(val) => {
              const newStrength = Array.isArray(val) || typeof val !== 'number' ? (val as readonly number[])[0] : val;
              setCentralForceStrength(newStrength);
            }}
          />
        </div>
      </div>
    </div>
  );
}
