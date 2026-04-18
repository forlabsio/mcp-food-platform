// dashboard.jsx — Main dashboard page (widget grid)
const { useState: useStateD, useMemo: useMemoD } = React;

// ── Tracking List Widget (left column) ───────────────────────
function TrackingListWidget({ orders, onSelect, selectedId }) {
  return (
    <Card noPad style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 22px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 6 }}>내 주문</div>
          <h3 className="display" style={{ fontSize: 24, margin: 0, lineHeight: 1.05, whiteSpace: "nowrap" }}>주문 현황</h3>
        </div>
        <IconBtn icon={<Icons.Filter size={14}/>} size={32}/>
      </div>
      <div style={{ padding: "0 22px 14px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8, height: 34,
          background: "var(--bg-2)", border: "1px solid var(--line)",
          borderRadius: 10, padding: "0 12px", color: "var(--tx-2)", fontSize: 12,
        }}>
          <Icons.Search size={13}/>
          2026 · 성수점
          <div style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 10, color: "var(--tx-3)", border: "1px solid var(--line-2)", padding: "1px 5px", borderRadius: 4 }}>⌘K</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map(o => (
          <TrackingCard key={o.id} order={o}
            selected={selectedId === o.id}
            onClick={() => onSelect(o)}/>
        ))}
      </div>
    </Card>
  );
}

function statusPill(status) {
  const map = {
    new:        { label: "신규",     tone: "accent" },
    accepted:   { label: "수락",     tone: "blue" },
    cooking:    { label: "조리 중",   tone: "yellow" },
    ready:      { label: "준비 완료", tone: "green" },
    delivering: { label: "배달 중",   tone: "accent" },
    completed:  { label: "완료",     tone: "default" },
  };
  return map[status];
}

function TrackingCard({ order, selected, onClick }) {
  const sp = statusPill(order.status);
  const pct = order.status === "completed" ? 1 :
              order.status === "delivering" ? 0.85 :
              order.status === "ready" ? 0.6 :
              order.status === "cooking" ? 0.4 :
              order.status === "accepted" ? 0.2 : 0.05;
  return (
    <div onClick={onClick} className="fade"
      style={{
        background: selected ? "var(--bg-2)" : "var(--bg-1)",
        border: `1px solid ${selected ? "var(--or-500)" : "var(--line)"}`,
        boxShadow: selected ? "0 0 0 3px var(--or-glow)" : "none",
        borderRadius: 14, padding: 14, cursor: "pointer",
        transition: "all 0.14s ease",
      }}
      onMouseEnter={e => !selected && (e.currentTarget.style.borderColor = "var(--line-2)")}
      onMouseLeave={e => !selected && (e.currentTarget.style.borderColor = "var(--line)")}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 13, color: "var(--tx-0)", fontWeight: 500 }}>#{order.shortId}</span>
        <Pill tone={sp.tone}>{sp.label}</Pill>
      </div>
      <div style={{ fontSize: 11, color: "var(--tx-3)", marginBottom: 12 }}>
        {order.channel === "agent"
          ? <span style={{ color: "var(--or-500)" }}>◆ {order.agentName}</span>
          : <span>직접 주문</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--tx-0)", fontWeight: 500 }}>{order.customer.name}</div>
          <div style={{ fontSize: 10, color: "var(--tx-2)", marginTop: 2 }}>
            {order.type === "delivery" ? "배달" : order.type === "pickup" ? "픽업" : "매장"} · {order.distance}
          </div>
          <div style={{ fontSize: 10, color: "var(--tx-2)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
            {order.placedAt}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="display" style={{ fontSize: 16, color: "var(--tx-0)" }}>
            {order.total.toLocaleString()}원
          </div>
          <div style={{ fontSize: 10, color: "var(--tx-2)", marginTop: 2 }}>
            {order.items.length}개 메뉴
          </div>
          <div style={{ fontSize: 10, color: "var(--tx-2)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
            예상 {order.etaMin}분
          </div>
        </div>
      </div>

      {/* progress: dot, line, dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <Icons.Bag size={11} style={{ color: "var(--tx-2)" }}/>
        <div style={{ flex: 1, height: 3, background: "var(--bg-3)", borderRadius: 999, margin: "0 6px", position: "relative" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: `${pct * 100}%`,
            background: "linear-gradient(90deg, var(--or-700), var(--or-500))",
            borderRadius: 999,
          }}/>
          <div style={{
            position: "absolute", top: "50%", left: `${pct * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: "var(--or-500)",
            boxShadow: "0 0 0 3px var(--bg-1), 0 0 12px var(--or-glow)",
          }}/>
        </div>
        <Icons.Pin size={11} style={{ color: "var(--tx-2)" }}/>
      </div>
    </div>
  );
}

// ── Live Order Map / focus widget ────────────────────────────
function LiveOrderMap({ order }) {
  return (
    <Card noPad style={{ height: 380, position: "relative", overflow: "hidden" }}>
      {/* Header overlay */}
      <div style={{
        position: "absolute", top: 16, left: 16, right: 16, zIndex: 5,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 4 }}>진행 중인 배달</div>
          <h3 className="display" style={{ fontSize: 22, margin: 0, whiteSpace: "nowrap" }}>
            활성 주문 <span style={{ color: "var(--or-500)" }}>· 5건</span>
          </h3>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <IconBtn icon={<Icons.Layers size={14}/>} size={32} style={{ background: "var(--bg-2)", border: "1px solid var(--line-2)" }}/>
          <IconBtn icon={<Icons.Plus size={14}/>} size={32} style={{ background: "var(--bg-2)", border: "1px solid var(--line-2)" }}/>
          <IconBtn icon={<Icons.Maximize size={14}/>} size={32} style={{ background: "var(--bg-2)", border: "1px solid var(--line-2)" }}/>
        </div>
      </div>

      {/* Map */}
      <MapBg/>

      {/* Active route ETA card */}
      {order && order.status === "delivering" && (
        <div style={{
          position: "absolute", bottom: 16, left: 16,
          background: "rgba(20,20,22,0.92)", backdropFilter: "blur(12px)",
          border: "1px solid var(--line-2)", borderRadius: 12,
          padding: "10px 14px",
        }}>
          <div style={{ fontSize: 10, color: "var(--tx-2)" }}>도착 예정 · {new Date(Date.now() + order.etaMin*60000).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })}</div>
          <div style={{ fontSize: 13, color: "var(--tx-0)", fontWeight: 500, marginTop: 2 }}>{order.address}</div>
        </div>
      )}
    </Card>
  );
}

function MapBg() {
  // hand-rolled stylised map: glow + roads + markers
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `
        radial-gradient(ellipse at 70% 40%, rgba(255,138,61,0.10) 0%, transparent 50%),
        radial-gradient(ellipse at 30% 70%, rgba(107,168,201,0.06) 0%, transparent 50%),
        var(--map-bg)
      `,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="route" x1="0" x2="1">
            <stop offset="0" stopColor="#FF8A3D" stopOpacity="0.2"/>
            <stop offset="0.6" stopColor="#FF8A3D" stopOpacity="1"/>
            <stop offset="1" stopColor="#FFB079" stopOpacity="1"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
        {/* Roads */}
        <path d="M 0 220 Q 100 200 200 230 T 400 200 T 600 180" stroke="rgba(255,255,255,0.07)" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M 80 0 Q 100 100 60 200 T 140 380" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 460 0 Q 480 80 500 180 T 540 380" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d="M 280 0 Q 260 80 320 160 T 380 380" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" strokeLinecap="round"/>
        {/* Active route */}
        <path d="M 100 240 Q 200 200 300 220 T 480 140" stroke="url(#route)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="0,0"/>
        {/* Store marker */}
        <g transform="translate(100,240)">
          <circle r="12" fill="rgba(20,20,22,0.9)" stroke="#FF8A3D" strokeWidth="1.5"/>
          <circle r="4" fill="#FF8A3D"/>
          <text y="28" textAnchor="middle" fill="#C9C5BD" fontSize="9" fontFamily="var(--font-mono)">소담 매장</text>
        </g>
        {/* Courier */}
        <g transform="translate(330,210)">
          <circle r="14" fill="rgba(255,138,61,0.18)"/>
          <circle r="9" fill="#FF8A3D"/>
          <path d="M -4 -1 L 4 -1 L 2 3 L -2 3 Z" fill="#1a0e05"/>
          <text y="-22" textAnchor="middle" fill="#FFB079" fontSize="10" fontFamily="var(--font-mono)" fontWeight="500">기사 · 8분</text>
        </g>
        {/* Other markers */}
        <g transform="translate(480,140)">
          <circle r="9" fill="rgba(20,20,22,0.9)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/>
          <circle r="3" fill="#C9C5BD"/>
        </g>
        <g transform="translate(180,300)">
          <circle r="6" fill="rgba(20,20,22,0.7)" stroke="rgba(255,255,255,0.2)"/>
        </g>
        <g transform="translate(420,270)">
          <circle r="6" fill="rgba(20,20,22,0.7)" stroke="rgba(255,255,255,0.2)"/>
        </g>
        {/* Address labels */}
        <g transform="translate(330,210)">
          <rect x="20" y="-14" width="120" height="28" rx="6" fill="rgba(20,20,22,0.92)" stroke="rgba(255,255,255,0.1)"/>
          <text x="28" y="-2" fill="#8C8881" fontSize="8" fontFamily="var(--font-mono)">도착지</text>
          <text x="28" y="9" fill="#F5F2ED" fontSize="9" fontWeight="500">서울숲길 37</text>
        </g>
      </svg>
    </div>
  );
}

// ── Today's Overview ─────────────────────────────────────────
function TodaysOverview({ counts }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <h3 className="display" style={{ fontSize: 20, margin: 0, whiteSpace: "nowrap" }}>오늘 현황</h3>
        <IconBtn icon={<Icons.More size={14}/>} size={26}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <Stat label="신규 주문" value={counts.new} delta="+12"/>
        <Stat label="완료" value={counts.done} delta="+8" alt/>
        <Stat label="조리 중" value={counts.cooking}/>
        <Stat label="평균 조리" value="14분" alt/>
        <Stat label="배달 중" value={counts.delivering}/>
        <Stat label="평균 배달" value="22분" alt/>
        <Stat label="AI 주문" value={`${counts.aiPct}%`} accent/>
        <Stat label="가용 기사" value="3" alt/>
      </div>
    </Card>
  );
}
function Stat({ label, value, delta, accent, alt }) {
  return (
    <div style={{
      padding: "10px 0",
      borderBottom: "1px solid var(--line)",
      paddingLeft: alt ? 14 : 0,
      borderLeft: alt ? "1px solid var(--line)" : "none",
    }}>
      <div style={{ fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4, whiteSpace: "nowrap" }}>
        <span className="display" style={{ fontSize: 18, color: accent ? "var(--or-500)" : "var(--tx-0)" }}>{value}</span>
        {delta && <span style={{ fontSize: 10, color: "var(--gn-500)", fontFamily: "var(--font-mono)" }}>{delta}</span>}
      </div>
    </div>
  );
}

// ── Agent Efficiency chart ───────────────────────────────────
function AgentEfficiency() {
  const data = [3, 2.5, 3.5, 3.2, 4.2, 5.1, 4.8, 5.8, 6.4, 5.9, 6.8];
  const max = Math.max(...data);
  const w = 260, h = 70;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h - (v/max)*h}`).join(" ");
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <h3 className="display" style={{ fontSize: 20, margin: 0, whiteSpace: "nowrap" }}>에이전트 효율</h3>
        <Pill tone="green">+18% ↑</Pill>
      </div>
      <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 12 }}>주문 전환율 · MCP 도입 후</div>
      <svg width="100%" height={h+12} viewBox={`0 0 ${w} ${h+12}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="ae" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polyline points={`0,${h} ${pts} ${w},${h}`} fill="url(#ae)"/>
        <polyline points={pts} fill="none" stroke="#FF8A3D" strokeWidth="1.5"/>
        {data.map((v, i) => i === data.length - 1 && (
          <circle key={i} cx={(i/(data.length-1))*w} cy={h - (v/max)*h} r="3" fill="#FF8A3D" stroke="#161618" strokeWidth="1.5"/>
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10, color: "var(--tx-3)", whiteSpace: "nowrap" }}>
        <span>● 이번 주</span>
        <span style={{ color: "var(--tx-3)" }}>○ 지난 주</span>
      </div>
    </Card>
  );
}

// ── Daily revenue summary ────────────────────────────────────
function DailyRevenue({ orders }) {
  const total = orders.reduce((s, o) => s + o.total, 0);
  const aiOrders = orders.filter(o => o.channel === "agent");
  const aiRevenue = aiOrders.reduce((s, o) => s + o.total, 0);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <h3 className="display" style={{ fontSize: 20, margin: 0, whiteSpace: "nowrap" }}>오늘 매출</h3>
        <Pill tone="default">오늘</Pill>
      </div>
      <Row label="총 매출"      value={`${total.toLocaleString()}원`} highlight/>
      <Row label="평균 객단가"   value={`${Math.round(total / orders.length).toLocaleString()}원`}/>
      <Row label="AI 매출 비중"  value={`${aiRevenue.toLocaleString()}원`} sub={`${Math.round(aiRevenue/total*100)}%`}/>
      <Row label="배달비"        value="28,400원"/>
      <Row label="플랫폼 수수료" value={<span style={{ color: "var(--rd-500)" }}>−42,840원</span>}/>
      <Row label="순매출"        value={`${(total - 71240).toLocaleString()}원`} highlight/>
    </Card>
  );
}
function Row({ label, value, highlight, sub }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      padding: "10px 0", borderBottom: "1px solid var(--line)",
    }}>
      <span style={{ fontSize: 12, color: "var(--tx-1)", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 8, whiteSpace: "nowrap" }}>
        {sub && <span style={{ fontSize: 10, color: "var(--tx-3)", fontFamily: "var(--font-mono)" }}>{sub}</span>}
        <span className={highlight ? "display" : ""} style={{
          fontSize: highlight ? 16 : 13,
          color: highlight ? "var(--or-500)" : "var(--tx-0)",
          fontFamily: highlight ? "var(--font-display)" : "var(--font-mono)",
          fontWeight: highlight ? 400 : 500,
        }}>{value}</span>
      </span>
    </div>
  );
}

// ── Kitchen status ────────────────────────────────────────────
function KitchenStatus({ orders }) {
  const items = [
    { label: "조리 중인 주문", count: orders.filter(o => o.status === "cooking").length, icon: <Icons.Flame size={14}/>, tone: "yellow" },
    { label: "준비 완료 픽업 대기", count: orders.filter(o => o.status === "ready").length, icon: <Icons.Bag size={14}/>, tone: "green" },
    { label: "기사 배차 대기", count: 1, icon: <Icons.Bike size={14}/>, tone: "accent" },
  ];
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <h3 className="display" style={{ fontSize: 20, margin: 0, whiteSpace: "nowrap" }}>주방 현황</h3>
        <Pill tone="default">실시간</Pill>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          background: "var(--bg-2)", borderRadius: 12, marginBottom: 8,
          border: "1px solid var(--line)",
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: it.tone === "yellow" ? "rgba(229,181,71,0.14)"
                      : it.tone === "green" ? "rgba(111,191,115,0.14)"
                      : "rgba(255,138,61,0.14)",
            color: it.tone === "yellow" ? "var(--yl-500)"
                 : it.tone === "green" ? "var(--gn-500)"
                 : "var(--or-500)",
            display: "grid", placeItems: "center",
          }}>{it.icon}</span>
          <span style={{ flex: 1, fontSize: 12, color: "var(--tx-1)" }}>{it.label}</span>
          <span className="display" style={{ fontSize: 18, color: "var(--tx-0)" }}>{it.count}</span>
          <Icons.ChR size={12} style={{ color: "var(--tx-3)" }}/>
        </div>
      ))}
      <div style={{
        marginTop: 8, padding: "12px 14px", borderRadius: 12,
        background: "rgba(255,138,61,0.08)",
        border: "1px solid rgba(255,138,61,0.18)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Icons.Spark size={16} style={{ color: "var(--or-500)" }}/>
        <span style={{ flex: 1, fontSize: 11, color: "var(--tx-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          AI가 <b style={{ color: "var(--or-500)" }}>봉골레</b> 재고 부족 감지 — 노출 자동 조정
        </span>
      </div>
    </Card>
  );
}

// ── AI Agent Live (chat preview) ─────────────────────────────
function AIAgentLive({ orders }) {
  const aiOrder = orders.find(o => o.channel === "agent" && o.agentChat?.length > 0);
  const lastMsg = aiOrder?.agentChat?.slice(-2);
  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 160, height: 160, borderRadius: "50%",
        background: "radial-gradient(circle, var(--or-glow) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, position: "relative" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 4 }}>MCP 실시간</div>
          <h3 className="display" style={{ fontSize: 20, margin: 0, whiteSpace: "nowrap" }}>
            AI 에이전트 <span style={{ color: "var(--or-500)" }}>·</span> {aiOrder?.agentName ?? "—"}
          </h3>
        </div>
        <Live label="활성" tone="green"/>
      </div>

      {lastMsg && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {lastMsg.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 8,
              flexDirection: m.role === "agent" ? "row" : "row-reverse",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: m.role === "agent" ? "var(--or-500)" : "var(--bg-3)",
                color: m.role === "agent" ? "#1a0e05" : "var(--tx-1)",
                display: "grid", placeItems: "center",
                fontSize: 10, fontWeight: 500, flexShrink: 0,
              }}>{m.role === "agent" ? "AI" : "고"}</div>
              <div style={{
                background: m.role === "agent" ? "var(--bg-2)" : "rgba(255,138,61,0.10)",
                border: m.role === "agent" ? "1px solid var(--line)" : "1px solid rgba(255,138,61,0.20)",
                color: "var(--tx-0)", fontSize: 11.5, lineHeight: 1.5,
                padding: "8px 11px", borderRadius: 10, maxWidth: "85%",
                wordBreak: "keep-all",
              }}>{m.text}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        padding: "10px 12px", background: "var(--bg-2)", borderRadius: 10,
        border: "1px dashed var(--line-2)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icons.Spark size={13} style={{ color: "var(--or-500)" }}/>
        <span style={{ fontSize: 11, color: "var(--tx-2)", whiteSpace: "nowrap" }}>오늘 추천 적중률</span>
        <span style={{ flex: 1 }}/>
        <span className="mono" style={{ fontSize: 12, color: "var(--or-500)", whiteSpace: "nowrap" }}>87%</span>
      </div>
    </Card>
  );
}

// ── Main DashboardPage ───────────────────────────────────────
function DashboardPage() {
  const [selected, setSelected] = useStateD(window.MOCK_ORDERS[0]);
  const orders = window.MOCK_ORDERS;
  const counts = useMemoD(() => ({
    new: orders.filter(o => o.status === "new").length,
    cooking: orders.filter(o => o.status === "cooking").length,
    delivering: orders.filter(o => o.status === "delivering").length,
    done: orders.filter(o => o.status === "completed").length,
    aiPct: Math.round(orders.filter(o => o.channel === "agent").length / orders.length * 100),
  }), [orders]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "320px 1fr 320px",
      gap: "var(--gap-grid)", padding: "16px 24px 24px",
    }}>
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-grid)", height: "calc(100vh - 96px)" }}>
        <TrackingListWidget orders={orders.slice(0, 6)} onSelect={setSelected} selectedId={selected?.id}/>
      </div>

      {/* Center column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-grid)" }}>
        <LiveOrderMap order={orders.find(o => o.status === "delivering")}/>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gap-grid)" }}>
          <KitchenStatus orders={orders}/>
          <AIAgentLive orders={orders}/>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-grid)" }}>
        <TodaysOverview counts={counts}/>
        <AgentEfficiency/>
        <DailyRevenue orders={orders}/>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardPage });
