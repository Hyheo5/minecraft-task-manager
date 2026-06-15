'use client';

import { useState, useEffect } from 'react';
import { useMultiplayerStore } from '@/store/useMultiplayerStore';

const COLORS = [
  '#4ADE80', '#3B82F6', '#F87171', '#FBBF24', '#A78BFA', '#F472B6', '#34D399', '#60A5FA'
];

export default function LoginModal() {
  const { localUser, setLocalUser } = useMultiplayerStore();
  const [name, setName] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('minecraft_task_user');
    if (savedUser) {
      setLocalUser(JSON.parse(savedUser));
    }
  }, [setLocalUser]);

  if (!isMounted) return null;
  if (localUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newUser = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      flag_color: COLORS[Math.floor(Math.random() * COLORS.length)],
      created_at: new Date().toISOString(),
    };

    localStorage.setItem('minecraft_task_user', JSON.stringify(newUser));
    setLocalUser(newUser);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-2">Welcome to the Workspace</h2>
        <p className="text-sm text-neutral-400 mb-6">Please enter your name to join the team.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-neutral-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
