import { useCallback, useEffect, useMemo, useState } from "react";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { Tickets } from "./pages/Tickets";
import { Customers } from "./pages/Customers";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { HelpCenter } from "./pages/HelpCenter";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import { TicketDetails } from "./tickets/TicketDetails";
import { CreateTicketModal } from "./tickets/CreateTicketModal";
import { Button } from "./components/common/Button";
import { addTicketMessage, analyzeTicket, createTicket, getTickets, updateTicket } from "./api/ticket";
import { getCurrentUser } from "./api/auth";
import "./App.css";

function readUser() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
}

export default function App() {
  const [session, setSession] = useState(() => ({ token: localStorage.getItem("token"), user: readUser() }));
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(Boolean(session.token));
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [toast, setToast] = useState("");
  const canManage = ["admin", "agent"].includes(session.user?.role);
  const isCustomer = session.user?.role === "customer";
  const customerPages = ["Overview", "My Tickets", "Help Center", "Notifications", "Profile", "Settings"];
  const staffPages = ["Overview", "All Tickets", "Customers", "Analytics", "Settings"];
  const allowedPages = isCustomer ? customerPages : staffPages;
  const visibleNav = allowedPages.includes(activeNav) ? activeNav : "Overview";

  const updateSessionUser = useCallback((user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setSession((current) => ({ ...current, user }));
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession({ token: null, user: null });
    setTickets([]);
    setSelectedTicket(null);
  }, []);

  const refreshTickets = useCallback(async (quiet = false) => {
    if (!session.token) return;
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      setTickets(await getTickets());
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load tickets. Check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session.token]);

  useEffect(() => {
    if (!session.token) return undefined;
    let cancelled = false;
    getTickets().then((data) => {
      if (!cancelled) setTickets(data);
    }).catch((requestError) => {
      if (!cancelled) setError(requestError.response?.data?.message || "Could not load tickets. Check your connection and try again.");
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [session.token]);

  useEffect(() => {
    if (!session.token) return undefined;
    let cancelled = false;
    getCurrentUser().then((user) => {
      if (!cancelled) updateSessionUser(user);
    }).catch((requestError) => {
      if (!cancelled && requestError.response?.status !== 401) {
        setError(requestError.response?.data?.message || "Could not refresh your account profile.");
      }
    });
    return () => { cancelled = true; };
  }, [session.token, updateSessionUser]);

  useEffect(() => {
    const expireSession = () => { signOut(); setToast("Your session expired. Please sign in again."); };
    window.addEventListener("supportai:session-expired", expireSession);
    return () => window.removeEventListener("supportai:session-expired", expireSession);
  }, [signOut]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const onAuthenticated = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setSession({ token, user });
    setLoading(true);
    setError("");
    setToast(`Signed in as ${user.name}.`);
  };

  const handleCreateTicket = async (ticketData) => {
    setSaving(true);
    setModalError("");
    try {
      const ticket = await createTicket(ticketData);
      setTickets((current) => [ticket, ...current]);
      setToast("Ticket created.");
      return true;
    } catch (requestError) {
      setModalError(requestError.response?.data?.message || "Could not create ticket. Please try again.");
      return false;
    } finally { setSaving(false); }
  };

  const handleUpdateTicket = async (id, updates) => {
    setSaving(true);
    try {
      const ticket = await updateTicket(id, updates);
      setTickets((current) => current.map((item) => item.id === ticket.id ? ticket : item));
      setSelectedTicket(ticket);
      setToast("Ticket updated.");
      return true;
    } catch (requestError) {
      setToast(requestError.response?.data?.message || "Could not update this ticket.");
      return false;
    } finally { setSaving(false); }
  };

  const handleSendReply = async (id, body) => {
    try {
      const ticket = await addTicketMessage(id, body);
      setTickets((current) => current.map((item) => item.id === ticket.id ? ticket : item));
      setSelectedTicket(ticket);
      setToast("Reply sent.");
      return true;
    } catch (requestError) {
      setToast(requestError.response?.data?.message || "Could not send the reply.");
      return false;
    }
  };

  const handleAnalyze = async (ticket) => {
    if (!ticket) return;
    setAnalyzing(true);
    try {
      const analyzed = await analyzeTicket(ticket.id);
      setTickets((current) => current.map((item) => item.id === analyzed.id ? analyzed : item));
      setSelectedTicket(analyzed);
      setToast("AI analysis is ready.");
    } catch (requestError) {
      setToast(requestError.response?.data?.message || "AI analysis failed. Please retry.");
    } finally { setAnalyzing(false); }
  };

  const openTicketsCount = tickets.filter((ticket) => ticket.status === "Open").length;
  const filteredTickets = useMemo(() => tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [ticket.subject, ticket.customer, ticket.customerEmail, ticket.id].some((value) => value?.toLowerCase().includes(query));
    return matchesSearch && (filter === "All" || ticket.status === filter);
  }), [tickets, search, filter]);

  if (!session.token || !session.user) return <><AuthPage onAuthenticated={onAuthenticated} />{toast && <div className="toast" role="status">{toast}</div>}</>;

  return (
    <>
      <MainLayout activeNav={visibleNav} setActiveNav={setActiveNav} search={search} setSearch={setSearch} totalTickets={tickets.length} openTicketsCount={openTicketsCount} user={session.user} onLogout={signOut} onRefresh={() => refreshTickets(true)} refreshing={refreshing}>
        {error ? <div className="page-state page-error"><h2>We couldn’t load your workspace</h2><p>{error}</p><Button onClick={() => refreshTickets()}>Try again</Button></div> : loading ? <div className="page-state"><span className="loader" /><p>Loading your support workspace…</p></div> : <>
          {visibleNav === "Overview" && <Dashboard tickets={filteredTickets} allTickets={tickets} filter={filter} setFilter={setFilter} onSelectTicket={setSelectedTicket} onOpenCreate={() => { setModalError(""); setIsCreateOpen(true); }} onTryAI={() => { const target = tickets.find((ticket) => ticket.status === "Open") || tickets[0]; if (target) setSelectedTicket(target); }} canUseAI={canManage} />}
          {visibleNav === "All Tickets" && canManage && <Tickets tickets={filteredTickets} filter={filter} setFilter={setFilter} onSelectTicket={setSelectedTicket} onOpenCreate={() => { setModalError(""); setIsCreateOpen(true); }} />}
          {visibleNav === "My Tickets" && isCustomer && <Tickets customerView tickets={filteredTickets} filter={filter} setFilter={setFilter} onSelectTicket={setSelectedTicket} onOpenCreate={() => { setModalError(""); setIsCreateOpen(true); }} />}
          {visibleNav === "Help Center" && isCustomer && <HelpCenter onCreateTicket={() => { setModalError(""); setIsCreateOpen(true); }} />}
          {visibleNav === "Notifications" && isCustomer && <Notifications tickets={tickets} preferences={session.user.notificationPreferences} onSelectTicket={setSelectedTicket} />}
          {visibleNav === "Profile" && isCustomer && <Profile user={session.user} onUserUpdated={updateSessionUser} />}
          {visibleNav === "Customers" && canManage && <Customers tickets={tickets} />}
          {visibleNav === "Analytics" && canManage && <Analytics tickets={tickets} />}
          {visibleNav === "Settings" && <Settings user={session.user} onUserUpdated={updateSessionUser} />}
        </>}
        <TicketDetails ticket={selectedTicket} user={session.user} onClose={() => setSelectedTicket(null)} onUpdateTicket={handleUpdateTicket} onAnalyze={handleAnalyze} onSendReply={handleSendReply} analyzing={analyzing} canManage={canManage} saving={saving} />
        <CreateTicketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreateTicket} saving={saving} error={modalError} />
      </MainLayout>
      {toast && <div className="toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={() => setToast("")}>×</button></div>}
    </>
  );
}
