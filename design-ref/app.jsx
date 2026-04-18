// app.jsx — Root app
const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const [page, setPage] = useStateA(() => localStorage.getItem("sodam.page") || "dashboard");
  const [tweaksOpen, setTweaksOpen] = useStateA(false);
  const [tweaks, setTweaks] = useStateA(window.DEFAULT_TWEAKS);
  const [storeStatus, setStoreStatus] = useStateA(() => localStorage.getItem("sodam.storeStatus") || "open");
  useEffectA(() => { localStorage.setItem("sodam.storeStatus", storeStatus); }, [storeStatus]);

  useEffectA(() => { localStorage.setItem("sodam.page", page); }, [page]);

  useEffectA(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    document.documentElement.setAttribute("data-accent", tweaks.accent);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks]);

  useEffectA(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode")   setTweaksOpen(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const PageComponent = {
    dashboard: DashboardPage,
    orders:    () => <OrdersPage tweaks={tweaks}/>,
    agent:     AgentPage,
    menu:      MenuPage,
    sales:     SalesPage,
    reviews:   ReviewsPage,
    settings:  SettingsPage,
  }[page];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-0)" }}>
      <Sidebar active={page} onNav={setPage}/>
      <main style={{ flex: 1, minWidth: 0 }}>
        <Topbar page={page} onTweaks={() => setTweaksOpen(v => !v)}
          storeStatus={storeStatus} setStoreStatus={setStoreStatus}/>
        <div key={page} className="fade" data-screen-label={page}>
          {PageComponent && <PageComponent/>}
        </div>
      </main>
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} tweaks={tweaks} setTweaks={setTweaks}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
