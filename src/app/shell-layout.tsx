'use client';

import React, { useState } from 'react';
import { Sidebar, Topbar } from '@/components/shell';
import { TweaksPanel, DEFAULT_TWEAKS, TweaksState } from '@/components/tweaks';

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState<TweaksState>(DEFAULT_TWEAKS);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar onTweaks={() => setTweaksOpen((v) => !v)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>
          {children}
        </main>
      </div>
      <TweaksPanel
        open={tweaksOpen}
        onClose={() => setTweaksOpen(false)}
        tweaks={tweaks}
        setTweaks={setTweaks}
      />
    </div>
  );
}
