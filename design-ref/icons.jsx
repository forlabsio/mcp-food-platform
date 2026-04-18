// icons.jsx — Minimal stroked icons (1.4 stroke, 24x24)
const Ic = ({ size = 16, sw = 1.4, children, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
       style={{ flexShrink: 0, display: "block", ...style }}>{children}</svg>
);

const Icons = {
  Home:      (p) => <Ic {...p}><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/></Ic>,
  Orders:    (p) => <Ic {...p}><path d="M5 4h14l-1 16H6zM9 4V2h6v2M9 10h6M9 14h6"/></Ic>,
  Chat:      (p) => <Ic {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ic>,
  Menu:      (p) => <Ic {...p}><path d="M4 5h16M4 12h16M4 19h10"/></Ic>,
  Sales:     (p) => <Ic {...p}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></Ic>,
  Agent:     (p) => <Ic {...p}><path d="M12 2l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM19 14l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM5 14l.7 1.5L7.2 16l-1.5.5L5 18l-.7-1.5L2.8 16l1.5-.5z"/></Ic>,
  Reviews:   (p) => <Ic {...p}><path d="M21 12a8 8 0 1 1-3.5-6.6L21 4v5h-5"/><path d="M8 13l2.5 2.5L16 10"/></Ic>,
  Settings:  (p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Ic>,
  Help:      (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-1 .4-1 1.2-1 1.7M12 17h.01"/></Ic>,
  Logout:    (p) => <Ic {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></Ic>,

  Search:    (p) => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Ic>,
  Bell:      (p) => <Ic {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></Ic>,
  Calendar:  (p) => <Ic {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Ic>,
  Clock:     (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Ic>,
  Filter:    (p) => <Ic {...p}><path d="M4 4h16l-6 8v6l-4 2v-8z"/></Ic>,
  Plus:      (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>,
  Check:     (p) => <Ic {...p}><path d="M5 12l5 5L20 7"/></Ic>,
  X:         (p) => <Ic {...p}><path d="M6 6l12 12M18 6L6 18"/></Ic>,
  ChR:       (p) => <Ic {...p}><path d="M9 6l6 6-6 6"/></Ic>,
  ChL:       (p) => <Ic {...p}><path d="M15 6l-6 6 6 6"/></Ic>,
  ChD:       (p) => <Ic {...p}><path d="M6 9l6 6 6-6"/></Ic>,
  Arrow:     (p) => <Ic {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Ic>,
  ArrowUp:   (p) => <Ic {...p}><path d="M12 19V5M5 12l7-7 7 7"/></Ic>,
  Phone:     (p) => <Ic {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.8a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2.1z"/></Ic>,
  Pin:       (p) => <Ic {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ic>,
  Bike:      (p) => <Ic {...p}><circle cx="5.5" cy="17.5" r="3"/><circle cx="17.5" cy="17.5" r="3"/><path d="M8 17h6l4-9h-4M5 14V9h4M15 4h4v4"/></Ic>,
  Bag:       (p) => <Ic {...p}><path d="M6 2l1.5 4M18 2l-1.5 4M3 6h18l-1.5 14H4.5zM9 10a3 3 0 0 0 6 0"/></Ic>,
  Store:     (p) => <Ic {...p}><path d="M3 9l1-5h16l1 5M5 9v11h14V9M22 6a3 3 0 0 1-6 0M16 6a3 3 0 0 1-6 0M10 6a3 3 0 0 1-6 0"/></Ic>,
  Star:      (p) => <Ic {...p}><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z"/></Ic>,
  StarFill:  (p) => <svg width={p?.size ?? 12} height={p?.size ?? 12} viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0,display:"block",...(p?.style||{})}}><path d="M12 2l3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z"/></svg>,
  Flame:     (p) => <Ic {...p}><path d="M8.5 14.5A3.5 3.5 0 0 0 12 18c3 0 5-2 5-5 0-1-1-2-1-3 0-4-4-7-4-7s1 3-1 5-4 3-4 6a4 4 0 0 0 2 3.5"/></Ic>,
  Spark:     (p) => <Ic {...p}><path d="M12 3l1.5 5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1L12 3zM18 15l.7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7z"/></Ic>,
  Sun:       (p) => <Ic {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></Ic>,
  Moon:      (p) => <Ic {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></Ic>,
  Grid:      (p) => <Ic {...p}><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/></Ic>,
  List:      (p) => <Ic {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Ic>,
  Kanban:    (p) => <Ic {...p}><path d="M3 4h6v16H3zM11 4h6v10h-6zM19 4h2v7h-2z"/></Ic>,
  Sliders:   (p) => <Ic {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></Ic>,
  Layers:    (p) => <Ic {...p}><path d="M12 2L2 8l10 6 10-6zM2 16l10 6 10-6M2 12l10 6 10-6"/></Ic>,
  Edit:      (p) => <Ic {...p}><path d="M11 4H4v16h16v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></Ic>,
  Power:     (p) => <Ic {...p}><path d="M18.4 6.6a9 9 0 1 1-12.8 0M12 2v10"/></Ic>,
  Wifi:      (p) => <Ic {...p}><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 9a15 15 0 0 1 20 0"/><circle cx="12" cy="20" r="0.5" fill="currentColor"/></Ic>,
  Maximize:  (p) => <Ic {...p}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></Ic>,
  More:      (p) => <Ic {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></Ic>,
  Dot:       (p) => <svg width={p?.size ?? 6} height={p?.size ?? 6} viewBox="0 0 8 8" fill="currentColor" style={{flexShrink:0,display:"block"}}><circle cx="4" cy="4" r="4"/></svg>,
  Eye:       (p) => <Ic {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Ic>,
  Mic:       (p) => <Ic {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></Ic>,
};

Object.assign(window, { Icons });
