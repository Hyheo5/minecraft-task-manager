'use client';

import { useState } from 'react';
import { Settings, X } from 'lucide-react';
import PhysicsControls from '../graph/PhysicsControls';

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-6 right-6 p-2 bg-neutral-900/90 backdrop-blur-md border border-neutral-700 rounded-full shadow-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-all z-50"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-6 right-6 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700 p-6 rounded-2xl shadow-2xl w-80 z-[60] text-neutral-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Physics Settings Section */}
            <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800">
              <PhysicsControls />
            </div>

            {/* Placeholder for future general settings */}
            <div className="p-4 bg-neutral-950/50 rounded-xl border border-neutral-800">
              <h3 className="font-semibold text-sm text-neutral-300 mb-2">General</h3>
              <p className="text-xs text-neutral-500">More settings coming soon.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
