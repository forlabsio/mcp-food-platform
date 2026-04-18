'use client';

import React from 'react';
import * as Icons from './icons';
import { IconBtn } from './ui';

export interface TweaksState {
  theme: string;
  accent: string;
  density: string;
  queueLayout: string;
  navStyle: string;
  agentLog: string;
}

export const DEFAULT_TWEAKS: TweaksState = {
  theme: 'dark',
  accent: 'orange',
  density: 'comfortable',
  queueLayout: 'kanban',
  navStyle: 'sidebar',
  agentLog: 'prominent',
};

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 10,
          color: 'var(--tx-2)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Seg({
  val,
  set,
  opts,
}: {
  val: string;
  set: (v: string) => void;
  opts: { id: string; label: string; icon?: React.ReactNode }[];
}) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 8,
        padding: 3,
      }}
    >
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => set(o.id)}
          style={{
            flex: 1,
            height: 28,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            fontSize: 11,
            background: val === o.id ? 'var(--or-500)' : 'transparent',
            color: val === o.id ? '#1a0e05' : 'var(--tx-1)',
            fontWeight: val === o.id ? 500 : 400,
          }}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface TweaksPanelProps {
  open: boolean;
  onClose: () => void;
  tweaks: TweaksState;
  setTweaks: (t: TweaksState) => void;
}

export function TweaksPanel({ open, onClose, tweaks, setTweaks }: TweaksPanelProps) {
  if (!open) return null;

  const set = (k: keyof TweaksState, v: string) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    // Apply theme/accent/density to document
    if (k === 'theme') document.documentElement.setAttribute('data-theme', v);
    if (k === 'accent') document.documentElement.setAttribute('data-accent', v);
    if (k === 'density') document.documentElement.setAttribute('data-density', v);
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        bottom: 20,
        width: 300,
        background: 'var(--bg-1)',
        border: '1px solid var(--line-2)',
        borderRadius: 18,
        boxShadow: 'var(--shadow-lg)',
        padding: 20,
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 20, margin: 0 }}>
          Tweaks
        </h3>
        <IconBtn icon={<Icons.X size={14} />} onClick={onClose} size={28} />
      </div>

      <Group label="테마">
        <Seg
          val={tweaks.theme}
          set={(v) => set('theme', v)}
          opts={[
            { id: 'dark', label: 'Dark', icon: <Icons.Moon size={11} /> },
            { id: 'light', label: 'Light', icon: <Icons.Sun size={11} /> },
          ]}
        />
      </Group>

      <Group label="포인트 컬러">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { id: 'orange', c: '#FF8A3D' },
            { id: 'lime', c: '#BCE15A' },
            { id: 'violet', c: '#A88BF6' },
            { id: 'amber', c: '#E6B341' },
          ].map((o) => (
            <button
              key={o.id}
              onClick={() => set('accent', o.id)}
              style={{
                height: 36,
                borderRadius: 8,
                background: o.c,
                border: tweaks.accent === o.id ? '2px solid #fff' : '2px solid transparent',
                boxShadow: tweaks.accent === o.id ? `0 0 0 1px ${o.c}` : 'none',
              }}
            />
          ))}
        </div>
      </Group>

      <Group label="정보 밀도">
        <Seg
          val={tweaks.density}
          set={(v) => set('density', v)}
          opts={[
            { id: 'compact', label: 'Compact' },
            { id: 'comfortable', label: '편안' },
            { id: 'spacious', label: '여유' },
          ]}
        />
      </Group>

      <Group label="주문 레이아웃 (주문 탭)">
        <Seg
          val={tweaks.queueLayout}
          set={(v) => set('queueLayout', v)}
          opts={[
            { id: 'kanban', label: '칸반' },
            { id: 'list', label: '리스트' },
            { id: 'card', label: '카드' },
          ]}
        />
      </Group>

      <Group label="AI 로그 표시">
        <Seg
          val={tweaks.agentLog}
          set={(v) => set('agentLog', v)}
          opts={[
            { id: 'prominent', label: '강조' },
            { id: 'inline', label: '인라인' },
            { id: 'minimal', label: '최소' },
          ]}
        />
      </Group>
    </aside>
  );
}
