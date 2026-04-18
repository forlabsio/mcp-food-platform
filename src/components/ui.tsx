'use client';

import React from 'react';
import { Dot, StarFill } from './icons';

// ── Logo (minimal serif glyph) ───────────────────────────────
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9,
        background: 'linear-gradient(135deg, var(--or-500) 0%, var(--or-700) 100%)',
        color: '#1a0e05',
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 500,
        fontSize: size * 0.55,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px var(--or-glow)',
      }}
    >
      S
    </div>
  );
}

// ── Card (the workhorse widget container) ────────────────────
interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  padding?: string | number;
  style?: React.CSSProperties;
  accent?: boolean;
  noPad?: boolean;
}

export function Card({ title, subtitle, eyebrow, action, children, padding, style, accent, noPad }: CardProps) {
  return (
    <section
      style={{
        background: 'var(--bg-1)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--line)',
        padding: noPad ? 0 : (padding ?? 'var(--pad-card)'),
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {accent && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at top right, var(--or-glow), transparent 60%)',
            opacity: 0.4,
          }}
        />
      )}
      {(title || action || eyebrow) && (
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: subtitle ? 4 : 16,
            gap: 12,
            padding: noPad ? 'var(--pad-card) var(--pad-card) 0' : 0,
            position: 'relative',
          }}
        >
          <div>
            {eyebrow && (
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--tx-2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h3
                className="display"
                style={{ fontSize: 22, margin: 0, color: 'var(--tx-0)', lineHeight: 1.1 }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <div style={{ fontSize: 12, color: 'var(--tx-2)', marginTop: 6 }}>{subtitle}</div>
            )}
          </div>
          {action && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{action}</div>
          )}
        </header>
      )}
      {(title || subtitle || eyebrow) && !noPad && <div style={{ height: 16 }} />}
      {children}
    </section>
  );
}

// ── Button ────────────────────────────────────────────────────
interface BtnProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  title?: string;
  active?: boolean;
}

export function Btn({ children, variant = 'ghost', size = 'md', icon, iconRight, onClick, style, title, active }: BtnProps) {
  const sizes = {
    xs: { h: 24, px: 8, fs: 11, gap: 5, r: 6 },
    sm: { h: 30, px: 11, fs: 12, gap: 6, r: 8 },
    md: { h: 36, px: 14, fs: 13, gap: 8, r: 10 },
    lg: { h: 44, px: 18, fs: 14, gap: 10, r: 12 },
  };
  const s = sizes[size];
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--or-500)',
      color: '#1a0e05',
      border: '1px solid var(--or-600)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 18px var(--or-glow)',
    },
    secondary: {
      background: 'var(--bg-2)',
      color: 'var(--tx-0)',
      border: '1px solid var(--line-2)',
    },
    ghost: {
      background: active ? 'var(--bg-2)' : 'transparent',
      color: active ? 'var(--tx-0)' : 'var(--tx-1)',
      border: '1px solid transparent',
    },
    outline: {
      background: 'transparent',
      color: 'var(--tx-1)',
      border: '1px solid var(--line-2)',
    },
  };
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.h,
        padding: `0 ${s.px}px`,
        borderRadius: s.r,
        fontSize: s.fs,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        transition: 'all 0.12s ease',
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (variant === 'ghost' && !active) e.currentTarget.style.background = 'var(--bg-2)';
        if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--line-3)';
      }}
      onMouseLeave={(e) => {
        if (variant === 'ghost' && !active) e.currentTarget.style.background = 'transparent';
        if (variant === 'secondary') e.currentTarget.style.borderColor = 'var(--line-2)';
      }}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

// ── Pill / Tag ────────────────────────────────────────────────
interface PillProps {
  children?: React.ReactNode;
  tone?: 'default' | 'accent' | 'green' | 'red' | 'yellow' | 'blue' | 'solid' | 'dark';
  style?: React.CSSProperties;
  soft?: boolean;
  dot?: boolean;
}

export function Pill({ children, tone = 'default', style, dot }: PillProps) {
  const tones: Record<string, { bg: string; fg: string; bd: string }> = {
    default: { bg: 'var(--bg-3)', fg: 'var(--tx-1)', bd: 'var(--line-2)' },
    accent: { bg: 'rgba(255,138,61,0.12)', fg: 'var(--or-500)', bd: 'rgba(255,138,61,0.30)' },
    green: { bg: 'rgba(111,191,115,0.12)', fg: 'var(--gn-500)', bd: 'rgba(111,191,115,0.30)' },
    red: { bg: 'rgba(226,86,62,0.12)', fg: 'var(--rd-500)', bd: 'rgba(226,86,62,0.30)' },
    yellow: { bg: 'rgba(229,181,71,0.12)', fg: 'var(--yl-500)', bd: 'rgba(229,181,71,0.30)' },
    blue: { bg: 'rgba(107,168,201,0.12)', fg: 'var(--bl-500)', bd: 'rgba(107,168,201,0.30)' },
    solid: { bg: 'var(--or-500)', fg: '#1a0e05', bd: 'var(--or-500)' },
    dark: { bg: 'var(--bg-0)', fg: 'var(--tx-0)', bd: 'var(--line-2)' },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        padding: '0 9px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.005em',
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && <Dot size={5} />}
      {children}
    </span>
  );
}

// ── Status dot with pulse ─────────────────────────────────────
interface LiveProps {
  label: string;
  tone?: 'accent' | 'green' | 'red';
}

export function Live({ label, tone = 'accent' }: LiveProps) {
  const colors: Record<string, string> = {
    accent: 'var(--or-500)',
    green: 'var(--gn-500)',
    red: 'var(--rd-500)',
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '5px 11px 5px 9px',
        borderRadius: 999,
        background: 'var(--bg-2)',
        border: '1px solid var(--line-2)',
        fontSize: 11,
        color: 'var(--tx-1)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: colors[tone],
          boxShadow: `0 0 0 0 ${colors[tone]}`,
          animation: 'pulseGlow 1.6s infinite',
        }}
      />
      {label}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────
interface AvatarProps {
  name?: string;
  size?: number;
  tone?: 'default' | 'accent' | 'green';
}

export function Avatar({ name, size = 32, tone = 'default' }: AvatarProps) {
  const colors: Record<string, { bg: string; fg: string }> = {
    default: { bg: '#3A3835', fg: '#E5E2DD' },
    accent: { bg: 'rgba(255,138,61,0.18)', fg: 'var(--or-300)' },
    green: { bg: 'rgba(111,191,115,0.18)', fg: 'var(--gn-500)' },
  };
  const c = colors[tone];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: c.bg,
        color: c.fg,
        display: 'grid',
        placeItems: 'center',
        fontFamily: 'var(--font-display)',
        fontSize: size * 0.4,
        fontWeight: 500,
        flexShrink: 0,
        border: '1px solid var(--line)',
      }}
    >
      {name?.[0] ?? '?'}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────
interface BarProps {
  value: number;
  height?: number;
  color?: string;
  track?: string;
}

export function Bar({ value, height = 4, color = 'var(--or-500)', track = 'var(--bg-3)' }: BarProps) {
  return (
    <div style={{ height, background: track, borderRadius: 999, overflow: 'hidden' }}>
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value * 100))}%`,
          height: '100%',
          background: color,
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}

// ── Rating ────────────────────────────────────────────────────
export function Rating({ value, size = 11 }: { value: number; size?: number }) {
  return (
    <div style={{ display: 'inline-flex', gap: 1, color: 'var(--or-500)' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(value) ? 'var(--or-500)' : 'var(--bg-4)' }}>
          <StarFill size={size} />
        </span>
      ))}
    </div>
  );
}

// ── IconBtn ───────────────────────────────────────────────────
interface IconBtnProps {
  icon: React.ReactNode;
  onClick?: () => void;
  title?: string;
  active?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export function IconBtn({ icon, onClick, title, active, size = 36, style }: IconBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: 10,
        display: 'grid',
        placeItems: 'center',
        background: active ? 'var(--bg-2)' : 'transparent',
        color: active ? 'var(--or-500)' : 'var(--tx-2)',
        border: '1px solid transparent',
        transition: 'all 0.12s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--tx-0)';
          e.currentTarget.style.background = 'var(--bg-2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--tx-2)';
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      {icon}
    </button>
  );
}
