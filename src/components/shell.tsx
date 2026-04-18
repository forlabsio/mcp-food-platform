'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from './icons';
import { Logo, Avatar, IconBtn, Btn } from './ui';

// ── Navigation config ────────────────────────────────────────
const NAV = [
  { id: 'dashboard', href: '/admin/dashboard', icon: Icons.Home, label: '대시보드' },
  { id: 'orders', href: '/admin/orders', icon: Icons.Orders, label: '주문' },
  { id: 'agent', href: '/admin/agent', icon: Icons.Chat, label: 'AI 에이전트' },
  { id: 'menu', href: '/admin/menu', icon: Icons.Menu, label: '메뉴' },
  { id: 'sales', href: '/admin/sales', icon: Icons.Sales, label: '매출' },
  { id: 'reviews', href: '/admin/reviews', icon: Icons.Reviews, label: '리뷰' },
];

function iconBtnStyle(active?: boolean): React.CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    color: active ? 'var(--or-500)' : 'var(--tx-3)',
    background: active ? 'var(--bg-2)' : 'transparent',
  };
}

// ── Sidebar ──────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();

  const getActiveId = () => {
    if (pathname === '/admin/settings') return 'settings';
    for (const n of NAV) {
      if (n.id === 'dashboard' && pathname === '/admin/dashboard') return 'dashboard';
      if (n.id !== 'dashboard' && pathname.startsWith(`/admin/${n.id}`)) return n.id;
    }
    return 'dashboard';
  };

  const active = getActiveId();

  return (
    <aside
      style={{
        width: 64,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '18px 0',
        gap: 8,
        background: 'var(--bg-0)',
        borderRight: '1px solid var(--line)',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <Logo size={36} />
      <div style={{ height: 18 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.map((n) => {
          const Ic = n.icon;
          const isAct = active === n.id;
          return (
            <Link
              key={n.id}
              href={n.href}
              title={n.label}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                color: isAct ? 'var(--or-500)' : 'var(--tx-2)',
                background: isAct ? 'var(--bg-2)' : 'transparent',
                position: 'relative',
                transition: 'all 0.14s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isAct) {
                  e.currentTarget.style.color = 'var(--tx-0)';
                  e.currentTarget.style.background = 'var(--bg-1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isAct) {
                  e.currentTarget.style.color = 'var(--tx-2)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {isAct && (
                <span
                  style={{
                    position: 'absolute',
                    left: -18,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 22,
                    borderRadius: 999,
                    background: 'var(--or-500)',
                    boxShadow: '0 0 12px var(--or-glow)',
                  }}
                />
              )}
              <Ic size={18} />
            </Link>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button title="도움말" style={iconBtnStyle()}>
          <Icons.Help size={18} />
        </button>
        <Link href="/admin/settings" title="설정" style={{ ...iconBtnStyle(active === 'settings'), textDecoration: 'none' }}>
          <Icons.Settings size={18} />
        </Link>
        <button title="로그아웃" style={iconBtnStyle()}>
          <Icons.Logout size={18} />
        </button>
      </div>
    </aside>
  );
}

// ── Store Status Button ──────────────────────────────────────
type StoreStatus = 'open' | 'paused' | 'closed';

function StatusOption({
  status,
  current,
  label,
  sub,
  dotC,
  onClick,
  warn,
}: {
  status: StoreStatus;
  current: StoreStatus;
  label: string;
  sub: string;
  dotC: string;
  onClick: () => void;
  warn?: boolean;
}) {
  const active = status === current;
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 10,
        background: active ? 'var(--bg-3)' : 'transparent',
        textAlign: 'left',
        transition: 'background 0.12s ease',
        color: warn ? 'var(--rd-500)' : 'var(--tx-0)',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--bg-2)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotC, flexShrink: 0 }} />
      <span style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--tx-2)', marginTop: 2 }}>{sub}</div>
      </span>
      {active && <Icons.Check size={13} style={{ color: 'var(--or-500)' }} />}
    </button>
  );
}

function CloseConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 200,
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        className="fade"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          background: 'var(--bg-1)',
          borderRadius: 18,
          border: '1px solid var(--line-2)',
          padding: 26,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(226,86,62,0.12)',
            color: 'var(--rd-500)',
            display: 'grid',
            placeItems: 'center',
            marginBottom: 16,
          }}
        >
          <Icons.Power size={20} />
        </div>
        <h3 className="display" style={{ fontSize: 22, margin: 0, color: 'var(--tx-0)' }}>
          영업을 종료하시겠어요?
        </h3>
        <p style={{ fontSize: 12.5, color: 'var(--tx-1)', lineHeight: 1.65, margin: '10px 0 20px' }}>
          지금 진행 중인 주문은 그대로 처리되지만, <b style={{ color: 'var(--tx-0)' }}>신규 주문은 차단</b>돼요.
          AI 에이전트도 즉시 안내를 중단합니다.
        </p>
        <div
          style={{
            padding: '12px 14px',
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--tx-2)' }}>처리 중인 주문</span>
            <span style={{ color: 'var(--tx-0)' }}>4건</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 6 }}>
            <span style={{ color: 'var(--tx-2)' }}>수락 대기 중</span>
            <span style={{ color: 'var(--or-500)' }}>2건 → 자동 거절</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="outline" size="md" style={{ flex: 1 }} onClick={onClose}>
            취소
          </Btn>
          <Btn
            variant="primary"
            size="md"
            style={{
              flex: 1.4,
              background: 'var(--rd-500)',
              border: '1px solid var(--rd-500)',
              color: '#fff',
              boxShadow: '0 6px 18px rgba(226,86,62,0.3)',
            }}
            icon={<Icons.Power size={14} />}
            onClick={onConfirm}
          >
            영업 종료
          </Btn>
        </div>
      </div>
    </div>
  );
}

function StoreStatusButton({
  status,
  setStatus,
  menuOpen,
  setMenuOpen,
  onRequestClose,
}: {
  status: StoreStatus;
  setStatus: (s: StoreStatus) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  onRequestClose: () => void;
}) {
  const cfgMap: Record<StoreStatus, { label: string; sub: string; tone: string; dotC: string }> = {
    open: { label: '영업 중', sub: '신규 주문 받는 중', tone: 'green', dotC: 'var(--gn-500)' },
    paused: { label: '주문 일시중지', sub: '기존 주문만 처리', tone: 'yellow', dotC: 'var(--yl-500)' },
    closed: { label: '영업 종료', sub: '신규 주문 차단', tone: 'red', dotC: 'var(--rd-500)' },
  };
  const cfg = cfgMap[status];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 40,
          padding: '0 14px 0 12px',
          background: 'var(--bg-1)',
          border: '1px solid var(--line-2)',
          borderRadius: 12,
          color: 'var(--tx-0)',
          transition: 'all 0.12s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--line-3)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--line-2)')}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: cfg.dotC,
            boxShadow: status === 'open' ? `0 0 0 0 ${cfg.dotC}` : 'none',
            animation: status === 'open' ? 'pulseGlow 1.6s infinite' : 'none',
          }}
        />
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.15,
            textAlign: 'left',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 500 }}>{cfg.label}</span>
          <span style={{ fontSize: 10, color: 'var(--tx-2)' }}>{cfg.sub}</span>
        </span>
        <Icons.ChD size={12} style={{ color: 'var(--tx-3)', marginLeft: 4 }} />
      </button>

      {menuOpen && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setMenuOpen(false)} />
          <div
            className="fade"
            style={{
              position: 'absolute',
              top: 48,
              left: 0,
              width: 280,
              zIndex: 50,
              background: 'var(--bg-1)',
              border: '1px solid var(--line-2)',
              borderRadius: 14,
              padding: 8,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <StatusOption
              status="open"
              current={status}
              label="영업 중"
              sub="신규 주문 자동 수락"
              dotC="var(--gn-500)"
              onClick={() => {
                setStatus('open');
                setMenuOpen(false);
              }}
            />
            <StatusOption
              status="paused"
              current={status}
              label="주문 일시중지"
              sub="10 ~ 60분 — 기존 주문만 처리"
              dotC="var(--yl-500)"
              onClick={() => {
                setStatus('paused');
                setMenuOpen(false);
              }}
            />
            <StatusOption
              status="closed"
              current={status}
              label="영업 종료"
              sub="오늘 더 이상 주문 받지 않음"
              dotC="var(--rd-500)"
              onClick={() => {
                setMenuOpen(false);
                onRequestClose();
              }}
              warn
            />
            <div
              style={{
                margin: '8px 4px 4px',
                padding: '8px 10px',
                background: 'var(--bg-2)',
                borderRadius: 8,
                fontSize: 10.5,
                color: 'var(--tx-2)',
                lineHeight: 1.5,
              }}
            >
              <Icons.Spark size={10} style={{ color: 'var(--or-500)', marginRight: 5, verticalAlign: '-1px' }} />
              AI 에이전트가 상태를 즉시 반영해요 — 차단 중에는 메뉴를 고객에게 노출하지 않아요
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Topbar ───────────────────────────────────────────────────
export function Topbar({ onTweaks }: { onTweaks?: () => void }) {
  const pathname = usePathname();
  const [now, setNow] = useState(new Date());
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('open');
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const getPageId = () => {
    if (pathname.startsWith('/admin/orders')) return 'orders';
    if (pathname.startsWith('/admin/agent')) return 'agent';
    if (pathname.startsWith('/admin/menu')) return 'menu';
    if (pathname.startsWith('/admin/sales')) return 'sales';
    if (pathname.startsWith('/admin/reviews')) return 'reviews';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    if (pathname.startsWith('/admin/dashboard')) return 'dashboard';
    return 'dashboard';
  };

  const titles: Record<string, string> = {
    dashboard: '대시보드',
    orders: '주문',
    agent: 'AI 에이전트',
    menu: '메뉴',
    sales: '매출',
    reviews: '리뷰',
    settings: '설정',
  };

  const page = getPageId();
  const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const date = now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 24px 0',
      }}
    >
      <h1
        className="display"
        style={{
          fontSize: 26,
          margin: 0,
          color: 'var(--tx-0)',
          letterSpacing: '-0.01em',
        }}
      >
        {titles[page]}
      </h1>
      <StoreStatusButton
        status={storeStatus}
        setStatus={setStoreStatus}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onRequestClose={() => setConfirmClose(true)}
      />
      <div style={{ flex: 1 }} />
      {confirmClose && (
        <CloseConfirm
          onClose={() => setConfirmClose(false)}
          onConfirm={() => {
            setStoreStatus('closed');
            setConfirmClose(false);
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '0 4px',
          height: 40,
        }}
      >
        <span
          style={{
            padding: '0 14px',
            fontSize: 12,
            color: 'var(--tx-1)',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
          }}
        >
          {time}
        </span>
        <span style={{ width: 1, height: 18, background: 'var(--line-2)' }} />
        <span
          style={{
            padding: '0 14px',
            fontSize: 12,
            color: 'var(--tx-1)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            whiteSpace: 'nowrap',
          }}
        >
          <Icons.Calendar size={12} /> {date}
        </span>
      </div>

      <IconBtn icon={<Icons.Search size={16} />} title="검색" />
      <IconBtn icon={<Icons.Bell size={16} />} title="알림" />
      <IconBtn icon={<Icons.Sliders size={16} />} title="설정 조정" onClick={onTweaks} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--bg-1)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '4px 14px 4px 4px',
          height: 40,
        }}
      >
        <Avatar name="한" size={32} tone="accent" />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>한승호</span>
          <span style={{ fontSize: 10, color: 'var(--tx-2)' }}>소담 · 성수점 매니저</span>
        </div>
      </div>
    </header>
  );
}
