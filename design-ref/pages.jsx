// pages.jsx — Non-dashboard pages (simplified, dark-themed)
const { useState: useStateP, useMemo: useMemoP } = React;

// ── ORDERS PAGE (Kanban) ─────────────────────────────────────
function OrdersPage({ tweaks }) {
  const [selected, setSelected] = useStateP(null);
  const [layout, setLayout] = useStateP(tweaks?.queueLayout || "kanban");
  const columns = [
    { id: "new",        label: "신규",     status: ["new"] },
    { id: "accepted",   label: "수락",     status: ["accepted"] },
    { id: "cooking",    label: "조리 중",   status: ["cooking"] },
    { id: "ready",      label: "준비 완료", status: ["ready", "delivering"] },
    { id: "completed",  label: "완료",     status: ["completed"] },
  ];
  const orders = window.MOCK_ORDERS;

  return (
    <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Btn variant="secondary" size="sm" icon={<Icons.Filter size={13}/>}>필터</Btn>
        <Pill tone="accent" dot>신규 2</Pill>
        <Pill tone="yellow" dot>조리 중 2</Pill>
        <Pill tone="green" dot>준비 완료 1</Pill>
        <div style={{ flex: 1 }}/>
        <div style={{ display: "flex", background: "var(--bg-1)", border: "1px solid var(--line)", borderRadius: 10, padding: 3 }}>
          {[
            { id: "kanban", icon: <Icons.Kanban size={13}/>, label: "칸반" },
            { id: "list",   icon: <Icons.List size={13}/>,   label: "리스트" },
            { id: "card",   icon: <Icons.Grid size={13}/>,   label: "카드" },
          ].map(o => (
            <button key={o.id} onClick={() => setLayout(o.id)}
              style={{
                height: 28, padding: "0 12px", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 11,
                background: layout === o.id ? "var(--bg-3)" : "transparent",
                color: layout === o.id ? "var(--tx-0)" : "var(--tx-2)",
              }}>
              {o.icon}{o.label}
            </button>
          ))}
        </div>
      </div>

      {layout === "kanban" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {columns.map(col => {
            const colOrders = orders.filter(o => col.status.includes(o.status));
            return (
              <div key={col.id} style={{
                background: "var(--bg-1)", border: "1px solid var(--line)",
                borderRadius: 16, padding: 12, minHeight: 420,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px 12px" }}>
                  <span style={{ fontSize: 12, color: "var(--tx-0)", fontWeight: 500, whiteSpace: "nowrap" }}>{col.label}</span>
                  <Pill tone="default">{colOrders.length}</Pill>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {colOrders.map(o => <MiniOrderCard key={o.id} order={o} onClick={() => setSelected(o)}/>)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {layout === "list" && (
        <Card noPad>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-2)" }}>
                {["주문", "고객", "메뉴", "채널", "상태", "금액", "ETA"].map(h =>
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, borderBottom: "1px solid var(--line)" }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => {
                const sp = statusPill(o.status);
                return (
                  <tr key={o.id} onClick={() => setSelected(o)} style={{ cursor: "pointer", borderBottom: "1px solid var(--line)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--tx-0)" }}>#{o.shortId}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12 }}>{o.customer.name}<div style={{ fontSize: 10, color: "var(--tx-3)" }}>{o.customer.tier}</div></td>
                    <td style={{ padding: "14px 16px", fontSize: 11, color: "var(--tx-1)" }}>{o.items[0].name}{o.items.length > 1 && <span style={{ color: "var(--tx-3)" }}> +{o.items.length - 1}</span>}</td>
                    <td style={{ padding: "14px 16px" }}>{o.channel === "agent" ? <Pill tone="accent">AI · {o.agentName}</Pill> : <Pill tone="default">직접</Pill>}</td>
                    <td style={{ padding: "14px 16px" }}><Pill tone={sp.tone}>{sp.label}</Pill></td>
                    <td style={{ padding: "14px 16px", fontFamily: "var(--font-mono)", fontSize: 12 }}>{o.total.toLocaleString()}원</td>
                    <td style={{ padding: "14px 16px", fontSize: 11, color: "var(--tx-2)" }}>{o.etaMin > 0 ? `${o.etaMin}분` : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {layout === "card" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {orders.map(o => <TrackingCard key={o.id} order={o} selected={selected?.id === o.id} onClick={() => setSelected(o)}/>)}
        </div>
      )}

      {selected && <OrderDetailDrawer order={selected} onClose={() => setSelected(null)}/>}
    </div>
  );
}

function MiniOrderCard({ order, onClick }) {
  const sp = statusPill(order.status);
  return (
    <div onClick={onClick} className="fade" style={{
      background: "var(--bg-2)", border: "1px solid var(--line)",
      borderRadius: 10, padding: 11, cursor: "pointer",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--tx-0)", whiteSpace: "nowrap" }}>#{order.shortId}</span>
        {order.channel === "agent" && <Pill tone="accent">AI</Pill>}
      </div>
      <div style={{ fontSize: 11, color: "var(--tx-0)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{order.customer.name}</div>
      <div style={{ fontSize: 10, color: "var(--tx-2)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{order.items[0].name}{order.items.length > 1 && ` +${order.items.length - 1}`}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--or-500)", whiteSpace: "nowrap" }}>{order.total.toLocaleString()}원</span>
        <span style={{ fontSize: 9, color: "var(--tx-3)", whiteSpace: "nowrap" }}>{order.placedAt}</span>
      </div>
    </div>
  );
}

function OrderDetailDrawer({ order, onClose }) {
  const sp = statusPill(order.status);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 50,
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <aside onClick={e => e.stopPropagation()} style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: 520, background: "var(--bg-0)",
        borderLeft: "1px solid var(--line-2)",
        overflowY: "auto", animation: "slideRight 0.2s ease-out",
      }}>
        <div style={{ padding: "22px 26px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 4 }}>Order</div>
              <h2 className="display mono" style={{ fontSize: 28, margin: 0, color: "var(--tx-0)" }}>#{order.shortId}</h2>
            </div>
            <IconBtn icon={<Icons.X size={16}/>} onClick={onClose}/>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Pill tone={sp.tone} dot>{sp.label}</Pill>
            {order.channel === "agent" && <Pill tone="accent"><Icons.Spark size={10} style={{ marginRight: 3 }}/>{order.agentName}</Pill>}
            <Pill tone="default">{order.type === "delivery" ? "배달" : order.type === "pickup" ? "픽업" : "매장"}</Pill>
          </div>
        </div>

        <div style={{ padding: 26 }}>
          {/* Customer */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>고객</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: "var(--bg-1)", borderRadius: 12, border: "1px solid var(--line)" }}>
              <Avatar name={order.customer.name} size={40} tone="accent"/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "var(--tx-0)", fontWeight: 500 }}>{order.customer.name}</div>
                <div style={{ fontSize: 11, color: "var(--tx-2)", marginTop: 2 }}>{order.customer.tier} · {order.customer.phone}</div>
              </div>
              <IconBtn icon={<Icons.Phone size={14}/>}/>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>주문 메뉴</div>
            <div style={{ background: "var(--bg-1)", borderRadius: 12, border: "1px solid var(--line)", overflow: "hidden" }}>
              {order.items.map((it, i) => (
                <div key={i} style={{ padding: "12px 14px", borderBottom: i < order.items.length-1 ? "1px solid var(--line)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ color: "var(--or-500)", fontFamily: "var(--font-mono)", fontSize: 11, marginRight: 8 }}>×{it.qty}</span>
                      <span style={{ fontSize: 13, color: "var(--tx-0)" }}>{it.name}</span>
                    </div>
                    <span className="mono" style={{ fontSize: 12, color: "var(--tx-1)" }}>{(it.price * it.qty).toLocaleString()}원</span>
                  </div>
                  {it.options.length > 0 && (
                    <div style={{ marginTop: 6, marginLeft: 26, display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {it.options.map(o => <Pill key={o} tone="default">{o}</Pill>)}
                    </div>
                  )}
                </div>
              ))}
              <div style={{ padding: "14px 14px", borderTop: "1px solid var(--line-2)", display: "flex", justifyContent: "space-between", background: "var(--bg-2)" }}>
                <span style={{ fontSize: 12, color: "var(--tx-1)" }}>합계</span>
                <span className="display" style={{ fontSize: 20, color: "var(--or-500)" }}>{order.total.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* Agent log */}
          {order.agentChat.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
                <span>AI 에이전트 대화 · {order.agentName}</span>
                <span style={{ color: "var(--or-500)" }}>MCP</span>
              </div>
              <div style={{ background: "var(--bg-1)", borderRadius: 12, border: "1px solid var(--line)", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {order.agentChat.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "agent" ? "row" : "row-reverse" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                      background: m.role === "agent" ? "var(--or-500)" : "var(--bg-3)",
                      color: m.role === "agent" ? "#1a0e05" : "var(--tx-1)",
                      display: "grid", placeItems: "center", fontSize: 10, fontWeight: 500,
                    }}>{m.role === "agent" ? "AI" : "고"}</div>
                    <div style={{
                      background: m.role === "agent" ? "var(--bg-2)" : "rgba(255,138,61,0.10)",
                      border: m.role === "agent" ? "1px solid var(--line)" : "1px solid rgba(255,138,61,0.20)",
                      padding: "9px 12px", borderRadius: 10, fontSize: 12, lineHeight: 1.5,
                      color: "var(--tx-0)", maxWidth: "80%",
                    }}>
                      <div style={{ fontSize: 10, color: "var(--tx-3)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>{m.time}</div>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              {order.agentRationale && (
                <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(255,138,61,0.06)", border: "1px solid rgba(255,138,61,0.18)", borderRadius: 10, fontSize: 11, color: "var(--tx-1)", lineHeight: 1.55 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Icons.Spark size={11} style={{ color: "var(--or-500)" }}/>
                    <span style={{ color: "var(--or-500)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>추천 근거</span>
                  </div>
                  {order.agentRationale}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {order.status === "new" && (
              <>
                <Btn variant="primary" size="lg" style={{ flex: 2 }} icon={<Icons.Check size={15}/>}>주문 수락</Btn>
                <Btn variant="outline" size="lg" style={{ flex: 1 }} icon={<Icons.X size={14}/>}>거절</Btn>
              </>
            )}
            {order.status === "cooking" && <Btn variant="primary" size="lg" style={{ flex: 1 }} icon={<Icons.Bag size={14}/>}>준비 완료로 이동</Btn>}
            {order.status === "ready" && <Btn variant="primary" size="lg" style={{ flex: 1 }} icon={<Icons.Bike size={14}/>}>기사 배차</Btn>}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ── AGENT PAGE ───────────────────────────────────────────────
function AgentPage() {
  const conns = window.MCP_CONNECTIONS;
  const tools = window.AGENT_TOOLS;
  return (
    <div style={{ padding: "16px 24px 24px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="MCP 연결" eyebrow="Model Context Protocol" action={<Btn variant="secondary" size="sm" icon={<Icons.Plus size={12}/>}>새 클라이언트</Btn>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {conns.map(c => (
              <div key={c.name} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", background: "var(--bg-2)",
                borderRadius: 10, border: "1px solid var(--line)",
              }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "var(--bg-3)", display: "grid", placeItems: "center",
                  fontFamily: "var(--font-display)", fontSize: 16, color: "var(--tx-0)",
                }}>{c.name[0]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--tx-0)", fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "var(--tx-3)", marginTop: 2 }}>{c.vendor} · 마지막 호출 {c.lastCall}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--tx-0)", fontFamily: "var(--font-mono)" }}>{c.ordersToday} 주문</div>
                  <div style={{ fontSize: 9, color: "var(--tx-3)", marginTop: 2, fontFamily: "var(--font-mono)" }}>{c.latency ? `${c.latency}ms` : "—"}</div>
                </div>
                <Pill tone={c.status === "connected" ? "green" : c.status === "error" ? "red" : "default"} dot>
                  {c.status === "connected" ? "연결됨" : c.status === "error" ? "오류" : "대기"}
                </Pill>
              </div>
            ))}
          </div>
        </Card>

        <Card title="공개된 Tools" subtitle="AI 에이전트가 호출할 수 있는 함수 목록">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {tools.map(t => (
              <div key={t.name} style={{
                padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--line)",
                borderRadius: 10, display: "flex", alignItems: "center", gap: 12,
              }}>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--or-500)", width: 140 }}>{t.name}</code>
                <span style={{ flex: 1, fontSize: 11, color: "var(--tx-1)" }}>{t.desc}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--tx-3)" }}>{t.calls}회</span>
                <Toggle on={t.enabled}/>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card title="실시간 대화" eyebrow="Live session" accent>
          <LiveConversation/>
        </Card>

        <Card title="에이전트 정책" subtitle="매장이 설정한 운영 정책 — 에이전트가 자동으로 따릅니다">
          <Policy label="품절 메뉴 자동 숨김" on/>
          <Policy label="알러지 경고 필수 안내" on/>
          <Policy label="객단가 30,000원 이하 자동 수락" on/>
          <Policy label="VIP 고객 우선 조리" on/>
          <Policy label="이벤트 메뉴 우선 추천"/>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ on: onInit = false }) {
  const [on, setOn] = useStateP(onInit);
  return (
    <button onClick={() => setOn(v => !v)} style={{
      width: 34, height: 20, borderRadius: 999,
      background: on ? "var(--or-500)" : "var(--bg-4)",
      position: "relative", transition: "all 0.15s ease",
      border: "1px solid var(--line-2)",
    }}>
      <span style={{
        position: "absolute", top: 1, left: on ? 15 : 1,
        width: 16, height: 16, borderRadius: "50%",
        background: on ? "#1a0e05" : "var(--tx-1)",
        transition: "left 0.15s ease",
      }}/>
    </button>
  );
}

function Policy({ label, on: onInit }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 14px", borderBottom: "1px solid var(--line)",
    }}>
      <span style={{ flex: 1, fontSize: 12, color: "var(--tx-1)" }}>{label}</span>
      <Toggle on={onInit}/>
    </div>
  );
}

function LiveConversation() {
  const order = window.MOCK_ORDERS.find(o => o.agentChat?.length);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Live label="Claude Desktop" tone="accent"/>
        <span style={{ fontSize: 11, color: "var(--tx-3)" }}>세션 시작 2분 전</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {order.agentChat.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "agent" ? "row" : "row-reverse" }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: m.role === "agent" ? "var(--or-500)" : "var(--bg-3)",
              color: m.role === "agent" ? "#1a0e05" : "var(--tx-1)",
              display: "grid", placeItems: "center", fontSize: 10, fontWeight: 500,
            }}>{m.role === "agent" ? "AI" : "고"}</div>
            <div style={{
              background: m.role === "agent" ? "var(--bg-2)" : "rgba(255,138,61,0.10)",
              border: "1px solid " + (m.role === "agent" ? "var(--line)" : "rgba(255,138,61,0.20)"),
              padding: "8px 11px", borderRadius: 10, fontSize: 11.5, lineHeight: 1.5,
              color: "var(--tx-0)", maxWidth: "85%",
            }}>{m.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MENU PAGE ────────────────────────────────────────────────
function MenuPage() {
  const [cat, setCat] = useStateP("pasta");
  const cats = window.MENU_CATEGORIES;
  const items = window.MENU_ITEMS;
  return (
    <div style={{ padding: "16px 24px 24px" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {cats.map(c => (
          <Btn key={c.id} variant={cat === c.id ? "primary" : "secondary"} size="sm" onClick={() => setCat(c.id)}>
            {c.name} <span style={{ opacity: 0.6, marginLeft: 4, fontSize: 10 }}>{c.count}</span>
          </Btn>
        ))}
        <div style={{ flex: 1 }}/>
        <Btn variant="primary" size="sm" icon={<Icons.Plus size={13}/>}>메뉴 추가</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {items.map(item => (
          <Card key={item.id} noPad style={{ overflow: "hidden" }}>
            <div style={{
              height: 140, position: "relative",
              background: `repeating-linear-gradient(135deg, var(--bg-2) 0, var(--bg-2) 8px, var(--bg-3) 8px, var(--bg-3) 16px)`,
              display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--tx-3)" }}>[ {item.img} ]</span>
              <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 4, flexWrap: "wrap" }}>
                {item.popular && <Pill tone="solid"><Icons.Flame size={9} style={{ marginRight: 3 }}/>인기</Pill>}
                {item.aiFeatured && <Pill tone="accent"><Icons.Spark size={9} style={{ marginRight: 3 }}/>AI 추천</Pill>}
              </div>
              {item.stock === "sold_out" && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--rd-500)" }}>품절</span>
                </div>
              )}
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h4 style={{ fontSize: 14, margin: 0, color: "var(--tx-0)", fontWeight: 500 }}>{item.name}</h4>
                <span className="display" style={{ fontSize: 18, color: "var(--or-500)" }}>{item.price.toLocaleString()}원</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--tx-2)", lineHeight: 1.5, margin: "4px 0 12px" }}>{item.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Rating value={item.rating}/>
                  <span className="mono" style={{ fontSize: 10, color: "var(--tx-2)" }}>{item.rating} · {item.orders}건</span>
                </div>
                {item.stock === "low" ? <Pill tone="yellow">재고 {item.stockCount}</Pill>
                : item.stock === "sold_out" ? <Pill tone="red">품절</Pill>
                : <Toggle on/>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SALES PAGE ───────────────────────────────────────────────
function SalesPage() {
  const hourly = window.HOURLY_SALES;
  const traffic = window.AGENT_TRAFFIC;
  const maxH = Math.max(...hourly.map(h => h.v));
  const maxT = Math.max(...traffic.map(t => t.agent + t.direct));
  return (
    <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <BigStat label="오늘 매출" value="1,248,000원" delta="+18.4%" sparkline/>
        <BigStat label="완료 주문" value="47" delta="+12"/>
        <BigStat label="평균 객단가" value="26,553원" delta="+4.2%"/>
        <BigStat label="AI 주문 비중" value="68%" delta="+23pt" accent/>
      </div>

      <Card title="시간대별 매출" subtitle="오늘 11:00 — 22:00">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, padding: "12px 0" }}>
          {hourly.map(h => (
            <div key={h.h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: "100%", height: `${(h.v / maxH) * 140}px`,
                background: h.v === Math.max(...hourly.map(x => x.v)) ? "var(--or-500)" : "var(--bg-4)",
                borderRadius: 6,
                boxShadow: h.v === Math.max(...hourly.map(x => x.v)) ? "0 0 20px var(--or-glow)" : "none",
              }}/>
              <span className="mono" style={{ fontSize: 10, color: "var(--tx-3)" }}>{h.h}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title="AI vs 직접 주문 비교" subtitle="지난 7일">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 200, padding: "12px 0" }}>
          {traffic.map(t => (
            <div key={t.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 10, color: "var(--tx-2)", fontFamily: "var(--font-mono)" }}>{t.agent + t.direct}</div>
              <div style={{ width: "70%", display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ height: `${(t.agent / maxT) * 140}px`, background: "var(--or-500)", borderRadius: "6px 6px 0 0" }}/>
                <div style={{ height: `${(t.direct / maxT) * 140}px`, background: "var(--bg-4)", borderRadius: "0 0 6px 6px" }}/>
              </div>
              <span className="mono" style={{ fontSize: 10, color: "var(--tx-3)" }}>{t.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <Legend color="var(--or-500)" label="AI 에이전트"/>
          <Legend color="var(--bg-4)" label="직접 주문"/>
        </div>
      </Card>
    </div>
  );
}

function BigStat({ label, value, delta, accent, sparkline }) {
  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>
      {accent && <div style={{
        position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%",
        background: "radial-gradient(circle, var(--or-glow), transparent 70%)", pointerEvents: "none",
      }}/>}
      <div style={{ fontSize: 11, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div className="display" style={{ fontSize: 28, color: accent ? "var(--or-500)" : "var(--tx-0)", lineHeight: 1, marginBottom: 6 }}>{value}</div>
      {delta && <div style={{ fontSize: 11, color: "var(--gn-500)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: 4 }}>
        <Icons.ArrowUp size={10}/>{delta}
      </div>}
      {sparkline && (
        <svg width="100%" height="28" viewBox="0 0 100 28" style={{ marginTop: 10, display: "block" }}>
          <polyline points="0,22 15,18 30,20 45,12 60,15 75,8 90,10 100,4" fill="none" stroke="var(--or-500)" strokeWidth="1.5"/>
        </svg>
      )}
    </Card>
  );
}
function Legend({ color, label }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--tx-2)" }}>
    <span style={{ width: 10, height: 10, background: color, borderRadius: 2 }}/>{label}
  </div>;
}

// ── REVIEWS PAGE ─────────────────────────────────────────────
function ReviewsPage() {
  const reviews = window.REVIEWS;
  return (
    <div style={{ padding: "16px 24px 24px", display: "grid", gridTemplateColumns: "280px 1fr", gap: 14 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div className="display" style={{ fontSize: 56, color: "var(--or-500)", lineHeight: 1 }}>4.8</div>
            <div style={{ marginTop: 8 }}><Rating value={4.8} size={16}/></div>
            <div style={{ fontSize: 11, color: "var(--tx-2)", marginTop: 8 }}>총 312개 리뷰</div>
          </div>
          <div>
            {[5,4,3,2,1].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
                <span className="mono" style={{ fontSize: 10, color: "var(--tx-2)", width: 16 }}>{n}★</span>
                <div style={{ flex: 1 }}><Bar value={n === 5 ? 0.78 : n === 4 ? 0.16 : n === 3 ? 0.04 : 0.01}/></div>
                <span className="mono" style={{ fontSize: 10, color: "var(--tx-3)", width: 26 }}>{n === 5 ? 243 : n === 4 ? 50 : n === 3 ? 12 : n === 2 ? 5 : 2}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card title="AI 요약" eyebrow="Claude analysis" accent>
          <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "var(--tx-1)", lineHeight: 1.6 }}>
            <li>트러플 파스타 — 풍미·양 호평</li>
            <li>봉골레 국물 — 깊다는 평가 반복</li>
            <li style={{ color: "var(--rd-500)" }}>라구 — 짜다는 의견 3건 ↑</li>
            <li>에이전트 추천 정확도 — 긍정적</li>
          </ul>
        </Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {reviews.map(r => (
          <Card key={r.id}>
            <div style={{ display: "flex", gap: 12 }}>
              <Avatar name={r.author} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--tx-0)", fontWeight: 500 }}>{r.author}</span>
                  <Rating value={r.rating}/>
                  <span style={{ fontSize: 10, color: "var(--tx-3)" }}>{r.time}</span>
                  {r.via === "agent" && <Pill tone="accent"><Icons.Spark size={9} style={{ marginRight: 3 }}/>{r.tag}</Pill>}
                </div>
                <p style={{ fontSize: 12, color: "var(--tx-1)", margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                {r.reply && (
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "var(--bg-2)", borderRadius: 8, border: "1px solid var(--line)", fontSize: 11, color: "var(--tx-1)" }}>
                    <span style={{ color: "var(--or-500)", fontWeight: 500 }}>사장님 답글</span> — {r.reply}
                  </div>
                )}
                {!r.reply && <Btn variant="outline" size="xs" style={{ marginTop: 10 }}>답글 작성</Btn>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS (simple) ───────────────────────────────────────
function SettingsPage() {
  return (
    <div style={{ padding: "16px 24px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Card title="매장 정보">
        <Field label="매장명" value="소담 · 성수점"/>
        <Field label="주소" value="서울 성동구 성수이로 24"/>
        <Field label="영업 시간" value="11:30 — 22:00"/>
        <Field label="브레이크 타임" value="15:00 — 17:00"/>
        <Field label="연락처" value="02-•••-1234"/>
      </Card>
      <Card title="영업 상태" eyebrow="Live" accent>
        <Policy label="신규 주문 받기" on/>
        <Policy label="배달 주문 받기" on/>
        <Policy label="픽업 주문 받기" on/>
        <Policy label="예약 주문 받기"/>
        <div style={{ marginTop: 14, padding: 14, background: "var(--bg-2)", borderRadius: 10, border: "1px solid var(--line)" }}>
          <div style={{ fontSize: 11, color: "var(--tx-2)", marginBottom: 6 }}>브레이크 타임 알림</div>
          <div style={{ fontSize: 12, color: "var(--tx-1)" }}>AI 에이전트가 브레이크 타임 동안 자동으로 주문을 보류합니다.</div>
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div style={{ padding: "12px 0", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between" }}>
      <span style={{ fontSize: 11, color: "var(--tx-2)" }}>{label}</span>
      <span style={{ fontSize: 12, color: "var(--tx-0)" }}>{value}</span>
    </div>
  );
}

Object.assign(window, { OrdersPage, AgentPage, MenuPage, SalesPage, ReviewsPage, SettingsPage });
