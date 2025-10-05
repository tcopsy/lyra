"use client";
import React, { useMemo, useState, useEffect } from "react";

// LYRA — Unified Education OS (Previewable MVP Wireframe)
// v0.3 — THEME SWITCHER (incl. Dark), Direct Messages w/ recipients, Notifications drawer,
//        minor UX upgrades (editable gradebook cells, simple course sections)
// Design: clean + minimal (Apple/Notion), serious productivity + community.
// Single-file, no external deps (Tailwind utilities assumed). Plain JS React.

// ===================== Utilities =====================
const cls = (...xs) => xs.filter(Boolean).join(" ");

// ===================== Icons (inline SVG) =====================
const Icon = {
  menu: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18"/></svg>),
  bell: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/><path strokeWidth="2" strokeLinecap="round" d="M13.73 21a2 2 0 01-3.46 0"/></svg>),
  search: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><circle cx="11" cy="11" r="7" strokeWidth="2"/><path strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>),
  chevronDown: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M6 9l6 6 6-6"/></svg>),
  chevronRight: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M9 6l6 6-6 6"/></svg>),
  grid: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>),
  user: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M12 12a5 5 0 100-10 5 5 0 000 10z"/><path strokeWidth="2" d="M3 22a9 9 0 1118 0H3z"/></svg>),
  shield: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/></svg>),
  book: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path strokeWidth="2" d="M6.5 2H20v17H6.5A2.5 2.5 0 014 16.5v-12A2.5 2.5 0 016.5 2z"/></svg>),
  chat: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4v8z"/></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>),
  x: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>),
  userPlus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4" strokeWidth="2"/><path strokeWidth="2" d="M20 8v6M23 11h-6"/></svg>),
};

// ===================== Role & Nav =====================
const ROLES = ["Admin", "Teacher", "Student", "Parent"];

const NAV = {
  Admin: [
    { label: "Dashboard", icon: Icon.grid },
    { label: "Announcements", icon: Icon.bolt },
    { label: "Scheduling", icon: Icon.book },
    { label: "Analytics", icon: Icon.shield },
    { label: "People", icon: Icon.user },
    { label: "Messages", icon: Icon.chat },
    { label: "Settings", icon: Icon.shield },
  ],
  Teacher: [
    { label: "Dashboard", icon: Icon.grid },
    { label: "Courses", icon: Icon.book },
    { label: "Gradebook", icon: Icon.check },
    { label: "Assessments", icon: Icon.bolt },
    { label: "Messages", icon: Icon.chat },
    { label: "Settings", icon: Icon.shield },
  ],
  Student: [
    { label: "Dashboard", icon: Icon.grid },
    { label: "My Classes", icon: Icon.book },
    { label: "Assignments", icon: Icon.check },
    { label: "Study", icon: Icon.bolt },
    { label: "Messages", icon: Icon.chat },
    { label: "Settings", icon: Icon.shield },
  ],
  Parent: [
    { label: "Dashboard", icon: Icon.grid },
    { label: "Overview", icon: Icon.book },
    { label: "Alerts", icon: Icon.bell },
    { label: "Payments", icon: Icon.bolt },
    { label: "Messages", icon: Icon.chat },
    { label: "Settings", icon: Icon.shield },
  ],
};

const DEFAULT_WIDGETS = {
  Admin: [
    { id: "announcements", title: "District Announcements", size: "lg", body: "Compose or schedule school-wide announcements.", kind: "composer" },
    { id: "attendance", title: "Attendance Heatmap", size: "md", body: "Preview of attendance by grade/school.", kind: "chart" },
    { id: "subfinder", title: "Substitute Manager", size: "md", body: "Open absences: 4 • Filled: 3 • Pending: 1", kind: "stat" },
    { id: "risk", title: "Early-Risk Indicators", size: "md", body: "3 students flagged for follow-up.", kind: "stat" },
  ],
  Teacher: [
    { id: "to-grade", title: "To Grade Queue", size: "lg", body: "ENG201: 12 submissions • BIO101: 6 submissions", kind: "list" },
    { id: "today", title: "Today’s Schedule", size: "md", body: "8:00 BIO101 • 10:00 ENG201 • 1:30 Office Hours", kind: "stat" },
    { id: "builder", title: "Smart Assessment Builder", size: "md", body: "Generate quiz from Chapter 5 notes.", kind: "action" },
    { id: "messages", title: "Recent Messages", size: "md", body: "Parent Q&A, Student clarifications", kind: "list" },
  ],
  Student: [
    { id: "due", title: "Upcoming & Due", size: "lg", body: "BIO101 Lab due Tue • ENG201 Essay draft Fri", kind: "list" },
    { id: "classes", title: "My Classes", size: "md", body: "BIO101 • ENG201 • MATH150 • HIST210", kind: "list" },
    { id: "study", title: "Lyra Study Assistant", size: "md", body: "Auto flashcards ready for Chapter 3.", kind: "action" },
    { id: "community", title: "Campus Community", size: "md", body: "Clubs • Events • Study groups", kind: "list" },
  ],
  Parent: [
    { id: "overview", title: "Child Overview", size: "lg", body: "Attendance 98% • GPA 3.6 • 1 teacher note", kind: "stat" },
    { id: "alerts", title: "Alerts & Notifications", size: "md", body: "Field trip form pending • Payment due 10/15", kind: "list" },
    { id: "messages", title: "Messages", size: "md", body: "Mrs. Carter: Reminder about reading logs.", kind: "list" },
    { id: "payments", title: "Payments & Permissions", size: "md", body: "Pay fees • Sign forms • History", kind: "action" },
  ],
};

// ===================== THEME SYSTEM =====================
const THEMES = {
  lightBlue: {
    name: "Light Blue",
    bg: "bg-blue-50",
    panel: "bg-white",
    border: "border-blue-100",
    subtle: "bg-blue-100 text-blue-700",
    hover: "hover:bg-blue-50",
    chip: "bg-blue-100 text-blue-700",
    btn: "border border-blue-200",
    cta: "bg-blue-600 text-white hover:bg-blue-700",
    textMuted: "text-blue-800/70",
    text: "text-blue-950",
    alt: "text-blue-700/70",
  },
lavender: {
  name: "Lavender",
  bg: "bg-purple-50",
  panel: "bg-white",
  border: "border-purple-200",
  subtle: "bg-purple-100 text-purple-700",
  hover: "hover:bg-purple-50",
  chip: "bg-purple-100 text-purple-700",
  btn: "border border-purple-200",
  cta: "bg-purple-600 text-white hover:bg-purple-700",
  textMuted: "text-purple-800/70",
  text: "text-purple-950",
  alt: "text-purple-600",
},
  dark: {
    name: "Dark",
    bg: "bg-neutral-900",
    panel: "bg-neutral-900",
    border: "border-neutral-800",
    subtle: "bg-neutral-800 text-neutral-200",
    hover: "hover:bg-neutral-800",
    chip: "bg-neutral-800 text-neutral-200",
    btn: "border border-neutral-700",
    cta: "bg-blue-500 text-white hover:bg-blue-600",
    textMuted: "text-neutral-300/80",
    text: "text-neutral-100",
    alt: "text-neutral-400",
  },
  slate: {
    name: "Gray",
    bg: "bg-slate-50",
    panel: "bg-white",
    border: "border-slate-200",
    subtle: "bg-slate-100 text-slate-700",
    hover: "hover:bg-slate-50",
    chip: "bg-slate-100 text-slate-700",
    btn: "border border-slate-200",
    cta: "bg-slate-900 text-white hover:bg-slate-800",
    textMuted: "text-slate-700",
    text: "text-slate-950",
    alt: "text-slate-500",
  },
  emerald: {
    name: "Emerald",
    bg: "bg-emerald-50",
    panel: "bg-white",
    border: "border-emerald-200",
    subtle: "bg-emerald-100 text-emerald-700",
    hover: "hover:bg-emerald-50",
    chip: "bg-emerald-100 text-emerald-700",
    btn: "border border-emerald-200",
    cta: "bg-emerald-600 text-white hover:bg-emerald-700",
    textMuted: "text-emerald-800/70",
    text: "text-emerald-950",
    alt: "text-emerald-600",
  },
};

// ===================== Components =====================
function TopBar({ role, onToggleSidebar, onOpenMessages, onOpenNotifications, theme, themeKey, setThemeKey }) {
  return (
    <div className={cls("sticky top-0 z-20", theme.border, "border-b", theme.panel, "backdrop-blur supports-[backdrop-filter]:bg-white/70")}> 
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={onToggleSidebar} className={cls("p-2 rounded", theme.hover)} aria-label="Toggle sidebar">
          <Icon.menu className="w-5 h-5" />
        </button>
        <div className="font-semibold tracking-tight">Lyra</div>
        <div className={cls("text-xs px-2 py-1 rounded", theme.chip)}>{role}</div>

        <div className="flex-1" />
        <div className="relative max-w-xl flex-1 hidden md:block">
          <div className={cls("flex items-center gap-2 px-3 py-2 rounded-xl", theme.border, "border", theme.panel)}>
            <Icon.search className="w-4 h-4" />
            <input className="w-full outline-none text-sm bg-transparent" placeholder="Search courses, people, files…" />
          </div>
        </div>

        {/* Theme picker */}
        <div className="hidden sm:flex items-center gap-2">
          <label className={cls("text-xs", theme.alt)}>Theme</label>
          <div className="relative">
            <select
              value={themeKey}
              onChange={(e)=> setThemeKey(e.target.value)}
              className={cls("appearance-none px-3 py-2 pr-8 rounded-lg", theme.border, "border", theme.panel, "text-sm")}
            >
              {Object.keys(THEMES).map((k) => (
                <option key={k} value={k}>{THEMES[k].name}</option>
              ))}
            </select>
            <Icon.chevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"/>
          </div>
        </div>

        {/* Direct Messages */}
        <button onClick={onOpenMessages} className={cls("p-2 rounded", theme.hover)} aria-label="Open messages">
          <Icon.chat className="w-5 h-5" />
        </button>
        {/* Notifications (class/course updates, system) */}
        <button onClick={onOpenNotifications} className={cls("p-2 rounded", theme.hover)} aria-label="Notifications">
          <Icon.bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-300/50 to-neutral-500/50" />
      </div>
    </div>
  );
}

function Sidebar({ role, collapsed, setCollapsed, current, setCurrent, theme }) {
  const items = NAV[role];
  return (
    <aside className={cls(
      "transition-all h-[calc(100dvh-56px)] sticky top-[56px] overflow-y-auto",
      theme.border,
      "border-r",
      theme.panel,
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="px-3 py-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cls("w-full text-xs py-1.5 rounded-lg", theme.btn, theme.hover)}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      <nav className="px-2 pb-4 flex flex-col gap-1">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => setCurrent(it.label)}
            className={cls(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-left",
              theme.hover,
              current === it.label ? theme.subtle : ""
            )}
          >
            <it.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate text-sm">{it.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Card({ title, children, actions, size, theme }) {
  const sz = size === "lg" ? "col-span-12 lg:col-span-8" : size === "md" ? "col-span-12 sm:col-span-6 lg:col-span-4" : "col-span-12 sm:col-span-4 lg:col-span-3";
  return (
    <section className={cls("rounded-2xl", theme.border, "border", theme.panel, sz)}>
      <header className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b") }>
        <h3 className="font-medium tracking-tight">{title}</h3>
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </header>
      <div className={cls("p-4 text-sm", theme.textMuted)}>{children}</div>
    </section>
  );
}

function WidgetChrome({ onMoveUp, onMoveDown, onRemove, theme }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onMoveUp} className={cls("px-2 py-1 text-xs rounded", theme.btn, theme.hover)}>Up</button>
      <button onClick={onMoveDown} className={cls("px-2 py-1 text-xs rounded", theme.btn, theme.hover)}>Down</button>
      <button onClick={onRemove} className={cls("px-2 py-1 text-xs rounded text-red-600", theme.btn, "hover:bg-red-50")}>Remove</button>
    </div>
  );
}

function Composer({ theme }) {
  const [text, setText] = useState("");
  const [items, setItems] = useState(["Welcome back! Quarter begins Monday."]); 
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
          placeholder="Write an announcement…"
        />
        <button
          onClick={() => {
            if (!text.trim()) return;
            setItems([text.trim(), ...items]);
            setText("");
          }}
          className={cls("px-3 py-2 rounded-lg", theme.cta)}
        >Post</button>
      </div>
      <ul className="space-y-2">
        {items.map((m, i) => (
          <li key={i} className={cls("p-3 rounded-lg", theme.border, "border")}>{m}</li>
        ))}
      </ul>
    </div>
  );
}

// --------- Drawers ---------
function MessagesDrawer({ open, onClose, theme }) {
  const directory = ["Ava Carter","Leo Kim","M. Patel","Registrar","BIO101","ENG201"];
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState([]); // single-recipient DM for now
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { from: "Ava Carter", text: "Can we shift lab groups?" },
    { from: "You", text: "Sure, send me the list." },
  ]);
  if (!open) return null;
  const addRecipient = () => {
    const name = to.trim();
    if (!name) return;
    if (!directory.includes(name)) return;
    setSelected([name]);
    setTo("");
  };
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={onClose} />
      <div className={cls("w-[480px] h-full flex flex-col", theme.panel, theme.border, "border-l") }>
        <div className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b") }>
          <h3 className="font-medium tracking-tight">Direct Messages</h3>
          <button onClick={onClose} className={cls("ml-auto p-2 rounded", theme.hover)} aria-label="Close">
            <Icon.x className="w-5 h-5" />
          </button>
        </div>
        {/* Recipient picker */}
        <div className={cls("px-4 py-3 flex items-center gap-2", theme.border, "border-b") }>
          <input value={to} onChange={(e)=> setTo(e.target.value)} list="dm-directory" placeholder="Type a name…" className={cls("flex-1 px-3 py-2 rounded-lg bg-transparent outline-none", theme.border, "border")} />
          <datalist id="dm-directory">
            {directory.map((n,i)=> <option key={i} value={n} />)}
          </datalist>
          <button onClick={addRecipient} className={cls("px-3 py-2 rounded-lg flex items-center gap-2", theme.btn, theme.hover)}><Icon.userPlus className="w-4 h-4"/>Add</button>
          {selected.length>0 && <span className={cls("text-xs px-2 py-1 rounded", theme.chip)}>{selected[0]}</span>}
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={cls("p-3 rounded-xl", theme.border, "border", theme.panel)}>
              <div className="text-xs opacity-70 mb-1">{m.from}</div>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
        </div>
        <div className={cls("p-3 flex items-center gap-2", theme.border, "border-t") }>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
            placeholder={selected.length?`Message ${selected[0]}…`:"Select a recipient to send a message…"}
            disabled={!selected.length}
          />
          <button
            className={cls("px-3 py-2 rounded-lg", theme.cta)}
            onClick={() => {
              if (!input.trim() || !selected.length) return;
              setMsgs([...msgs, { from: "You", text: input.trim() }]);
              setInput("");
            }}
          >Send</button>
        </div>
      </div>
    </div>
  );
}

function NotificationsDrawer({ open, onClose, theme }){
  const [items, setItems] = useState([
    { type:"Course", source:"BIO101", text:"Lab Report due Tue" },
    { type:"Course", source:"ENG201", text:"Essay draft due Fri" },
    { type:"System", source:"Registrar", text:"Schedule rolls out Friday" },
  ]);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={onClose} />
      <div className={cls("w-[420px] h-full flex flex-col", theme.panel, theme.border, "border-l") }>
        <div className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b") }>
          <h3 className="font-medium tracking-tight">Notifications</h3>
          <button onClick={onClose} className={cls("ml-auto p-2 rounded", theme.hover)} aria-label="Close">
            <Icon.x className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map((m,i)=> (
            <div key={i} className={cls("p-3 rounded-xl", theme.border, "border", theme.panel)}>
              <div className="text-xs opacity-70 mb-1">{m.type} • {m.source}</div>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
        </div>
        <div className={cls("p-3", theme.border, "border-t") }>
          <button className={cls("px-3 py-2 rounded-lg", theme.btn, theme.hover)} onClick={()=>{/* placeholder: clear */}}>Mark all read</button>
        </div>
      </div>
    </div>
  );
}

// ===================== Dashboards & Pages =====================
function RoleDashboard({ role, theme }) {
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS[role]);
  const [catalogOpen, setCatalogOpen] = useState(false);

  useEffect(() => { setWidgets(DEFAULT_WIDGETS[role]); }, [role]);

  const catalog = useMemo(() => {
    const base = [
      { id: "notes", title: "Notes / Docs", size: "md", body: "Create and organize notes.", kind: "list" },
      { id: "calendar", title: "Calendar", size: "md", body: "Classes, meetings, deadlines.", kind: "stat" },
      { id: "files", title: "Files", size: "md", body: "Recent uploads and starred.", kind: "list" },
      { id: "tasks", title: "Tasks", size: "md", body: "Your action items for this week.", kind: "list" },
    ];
    return base.filter((b) => !widgets.some((w) => w.id === b.id));
  }, [widgets]);

  function move(idx, dir) {
    const next = [...widgets];
    const ni = idx + dir;
    if (ni < 0 || ni >= next.length) return;
    const t = next[idx];
    next[idx] = next[ni];
    next[ni] = t;
    setWidgets(next);
  }
  function remove(idx) { setWidgets(widgets.filter((_, i) => i !== idx)); }
  function add(w) { setWidgets([w, ...widgets]); setCatalogOpen(false); }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button className={cls("px-3 py-2 rounded-lg flex items-center gap-2", theme.btn, theme.hover)}><Icon.plus className="w-4 h-4"/>New</button>
        <button onClick={() => setCatalogOpen(!catalogOpen)} className={cls("px-3 py-2 rounded-lg flex items-center gap-2", theme.btn, theme.hover)}>
          <Icon.grid className="w-4 h-4"/> Add Widget
        </button>
        {catalogOpen && (
          <div className="relative">
            <div className={cls("absolute z-10 mt-2 w-72 rounded-xl p-2 shadow", theme.panel, theme.border, "border") }>
              <div className={cls("text-xs", theme.alt, "px-2 pt-1 pb-2")}>Widget Catalog</div>
              {catalog.map((c) => (
                <button key={c.id} onClick={() => add(c)} className={cls("w-full text-left px-2 py-2 rounded-lg", theme.hover)}>
                  <div className="text-sm font-medium">{c.title}</div>
                  <div className={cls("text-xs", theme.alt)}>{c.body}</div>
                </button>
              ))}
              {catalog.length === 0 && <div className={cls("text-xs", theme.alt, "px-2 py-2")}>All available widgets are on your board.</div>}
            </div>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className={cls("px-2 py-1 rounded", theme.chip)}>Layout: Grid</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {widgets.map((w, i) => (
          <Card
            key={w.id}
            title={w.title}
            size={w.size}
            theme={theme}
            actions={<WidgetChrome theme={theme} onMoveUp={() => move(i, -1)} onMoveDown={() => move(i, +1)} onRemove={() => remove(i)} />}
          >
            {w.kind === "composer" && <Composer theme={theme} />}
            {w.kind !== "composer" && (
              <div className="text-sm leading-relaxed">
                {w.body}
                <div className="mt-3 flex gap-2">
                  <button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Open</button>
                  <button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Pin</button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ----- Pages -----
function AnnouncementsPage({ theme }){ return (<div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}><h2 className="font-semibold mb-3">Announcements</h2><Composer theme={theme} /></div>); }

function SchedulingPage({ theme }){
  const [items] = useState([
    { time: "08:00", title: "BIO101 - Lab", room: "B214" },
    { time: "10:00", title: "ENG201 - Seminar", room: "C105" },
    { time: "13:30", title: "Office Hours", room: "D201" },
  ]);
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold">Scheduling</h2>
      <div className={cls("rounded-xl p-4", theme.border, "border") }>
        {items.map((x, i) => (
          <div key={i} className="flex items-center gap-4 py-2 text-sm">
            <div className="w-20 font-medium">{x.time}</div>
            <div className="flex-1">{x.title}</div>
            <div className={cls(theme.alt)}>{x.room}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage({ theme }){
  const cards = [
    { k: "Attendance", v: "96%", hint: "+1.2% WoW" },
    { k: "On-time Submissions", v: "92%", hint: "+0.8%" },
    { k: "At-Risk Flags", v: "12", hint: "-3 vs last week" },
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {cards.map((c, i) => (
        <Card key={i} title={c.k} size="md" theme={theme}>
          <div className="text-2xl font-semibold">{c.v}</div>
          <div className={cls("text-xs mt-1", theme.alt)}>{c.hint}</div>
        </Card>
      ))}
      <Card title="Trends (Mock)" size="lg" theme={theme}>
        <div className={cls("h-40 rounded-xl flex items-center justify-center", theme.border, "border")}>Chart placeholder</div>
      </Card>
    </div>
  );
}

function PeoplePage({ theme }){
  const rows = [
    { name: "Ava Carter", role: "Teacher", dept: "Biology" },
    { name: "Leo Kim", role: "Student", dept: "ENG201" },
    { name: "M. Patel", role: "Admin", dept: "Registrar" },
  ];
  return (
    <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold mb-3">People</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Department/Course</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i} className={cls(i%2?"bg-black/5":"", "border-t", theme.border)}>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.role}</td>
                <td className="px-3 py-2">{r.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Teacher modules
function CoursesPage({ theme }){
  const [openIdx, setOpenIdx] = useState(null);
  const courses = [
    { code: "BIO101", title: "Intro Biology", students: 28, sections:["Week 1: Cells","Week 2: Genetics","Week 3: Evolution"] },
    { code: "ENG201", title: "Composition II", students: 24, sections:["Essay Structure","Rhetoric","Peer Review"] },
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {courses.map((c,i)=> (
        <Card key={i} title={`${c.code} — ${c.title}`} size="lg" theme={theme}
          actions={<button onClick={()=> setOpenIdx(openIdx===i?null:i)} className={cls("px-2 py-1 text-xs rounded", theme.btn, theme.hover)}>{openIdx===i?"Hide Sections":"Show Sections"}</button>}>
          <div>Enrolled: {c.students}</div>
          {openIdx===i && (
            <div className={cls("mt-3 rounded-xl p-3", theme.border, "border") }>
              <div className="text-sm font-medium mb-2">Sections</div>
              <ul className="text-sm list-disc pl-5 space-y-1">
                {c.sections.map((s,si)=> <li key={si}>{s}</li>)}
              </ul>
              <div className="mt-3 flex gap-2">
                <button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Add Lesson</button>
                <button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Upload File</button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function GradebookPage({ theme }){
  const [rows, setRows] = useState([
    { student:"A. Lopez", a1:92, a2:88, a3:100 },
    { student:"B. Nguyen", a1:84, a2:90, a3:86 },
    { student:"C. Brown", a1:77, a2:82, a3:80 },
  ]);
  const editCell = (ri, key, val)=> {
    const v = Number(val);
    if(Number.isNaN(v)) return;
    const next = rows.map((r,i)=> i===ri? { ...r, [key]: v }: r);
    setRows(next);
  };
  return (
    <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold mb-3">Gradebook</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">Student</th>
              <th className="px-3 py-2">Assignment 1</th>
              <th className="px-3 py-2">Assignment 2</th>
              <th className="px-3 py-2">Assignment 3</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i} className={cls(i%2?"bg-black/5":"", "border-t", theme.border)}>
                <td className="px-3 py-2">{r.student}</td>
                {['a1','a2','a3'].map((k,ki)=> (
                  <td key={ki} className="px-3 py-2">
                    <input defaultValue={r[k]} onBlur={(e)=> editCell(i, k, e.target.value)} className={cls("w-20 px-2 py-1 rounded bg-transparent", theme.border, "border outline-none")}/>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssessmentsPage({ theme }){
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState([]);
  const generate = () => {
    const base = [
      "Define photosynthesis.",
      "Explain the role of mitochondria.",
      "Describe the cell membrane.",
      "What is osmosis?",
      "Differentiate DNA and RNA.",
    ];
    setQuestions(base);
  };
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold">Smart Assessment Builder</h2>
      <div className="flex items-center gap-2">
        <input value={prompt} onChange={(e)=> setPrompt(e.target.value)} className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} placeholder="Paste notes or topic (e.g., Chapter 5: Cells)…"/>
        <button onClick={generate} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Generate Questions</button>
      </div>
      <ul className="list-disc pl-6 text-sm">
        {questions.map((q,i)=> <li key={i} className="py-1">{q}</li>)}
      </ul>
    </div>
  );
}

// Student modules
function MyClassesPage({ theme }){
  const classes = ["BIO101","ENG201","MATH150","HIST210"];
  return (
    <div className="grid grid-cols-12 gap-4">
      {classes.map((c,i)=> (
        <Card key={i} title={c} size="md" theme={theme}>
          <div>Latest: New materials uploaded.</div>
          <div className="mt-3"><button className={cls("px-3 py-2 rounded-lg", theme.btn, theme.hover)}>Open</button></div>
        </Card>
      ))}
    </div>
  );
}

function AssignmentsPage({ theme }){
  const items = [
    { course:"BIO101", title:"Lab Report", due:"Tue" },
    { course:"ENG201", title:"Essay Draft", due:"Fri" },
  ];
  return (
    <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold mb-3">Assignments</h2>
      <ul className="space-y-2 text-sm">
        {items.map((x,i)=> (
          <li key={i} className={cls("p-3 rounded-lg flex items-center justify-between", theme.border, "border") }>
            <span className="font-medium">{x.course}: {x.title}</span>
            <span className={cls("px-2 py-1 rounded text-xs", theme.chip)}>Due {x.due}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudyPage({ theme }){
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState([]);
  const makeCards = () => {
    const base = [
      { q: "What is photosynthesis?", a: "Process plants use to convert light to energy." },
      { q: "Function of mitochondria?", a: "Powerhouse; ATP production." },
      { q: "Define osmosis.", a: "Diffusion of water across a membrane." },
    ];
    setCards(base);
  };
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold">Lyra Study Assistant</h2>
      <div className="flex items-center gap-2">
        <input value={topic} onChange={(e)=> setTopic(e.target.value)} className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} placeholder="Topic or paste notes…"/>
        <button onClick={makeCards} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Generate Flashcards</button>
      </div>
      <div className="grid grid-cols-12 gap-3">
        {cards.map((c,i)=> (
          <div key={i} className={cls("col-span-12 sm:col-span-6 lg:col-span-4 p-4 rounded-xl", theme.border, "border") }>
            <div className="font-medium mb-2">Q: {c.q}</div>
            <div className="text-sm">A: {c.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Parent modules
function OverviewPage({ theme }){
  const items = [
    { k:"Attendance", v:"98%" },
    { k:"GPA", v:"3.6" },
    { k:"Notes", v:"1 teacher note" },
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {items.map((x,i)=> (
        <Card key={i} title={x.k} size="md" theme={theme}>
          <div className="text-2xl font-semibold">{x.v}</div>
        </Card>
      ))}
      <Card title="Overview Details" size="lg" theme={theme}>
        <div className="text-sm">Class-by-class breakdown and messages appear here.</div>
      </Card>
    </div>
  );
}

function AlertsPage({ theme }){
  const alerts = ["Field trip form pending","Payment due 10/15"];
  return (
    <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold mb-3">Alerts</h2>
      <ul className="list-disc pl-6 text-sm">
        {alerts.map((a,i)=> <li key={i} className="py-1">{a}</li>)}
      </ul>
    </div>
  );
}

function PaymentsPage({ theme }){
  const [items] = useState([
    { name:"Activity Fee", amt:"$35.00", status:"Due" },
    { name:"Lunch Balance", amt:"$12.50", status:"Low" },
  ]);
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold">Payments & Permissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((x,i)=> (
              <tr key={i} className={cls(i%2?"bg-black/5":"", "border-t", theme.border)}>
                <td className="px-3 py-2">{x.name}</td>
                <td className="px-3 py-2">{x.amt}</td>
                <td className="px-3 py-2">{x.status}</td>
                <td className="px-3 py-2 text-right"><button className={cls("px-2.5 py-1.5 rounded-lg", theme.cta)}>Pay</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={cls("p-4 rounded-xl", theme.border, "border") }>
        <div className="font-medium mb-2">Permission Forms</div>
        <button className={cls("px-3 py-2 rounded-lg", theme.btn, theme.hover)}>View / Sign</button>
      </div>
    </div>
  );
}

// ---------- Router ----------
function PageRouter({ role, current, openMessages, theme }){
  if(current === "Dashboard") return <RoleDashboard role={role} theme={theme} />;

  // Admin
  if(role === "Admin" && current === "Announcements") return <AnnouncementsPage theme={theme}/>;
  if(role === "Admin" && current === "Scheduling") return <SchedulingPage theme={theme}/>;
  if(role === "Admin" && current === "Analytics") return <AnalyticsPage theme={theme}/>;
  if(role === "Admin" && current === "People") return <PeoplePage theme={theme}/>;
  if(role === "Admin" && current === "Messages") return (
    <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>Open the Messages panel from the top bar.</div>
  );

  // Teacher
  if(role === "Teacher" && current === "Courses") return <CoursesPage theme={theme}/>;
  if(role === "Teacher" && current === "Gradebook") return <GradebookPage theme={theme}/>;
  if(role === "Teacher" && current === "Assessments") return <AssessmentsPage theme={theme}/>;

  // Student
  if(role === "Student" && current === "My Classes") return <MyClassesPage theme={theme}/>;
  if(role === "Student" && current === "Assignments") return <AssignmentsPage theme={theme}/>;
  if(role === "Student" && current === "Study") return <StudyPage theme={theme}/>;

  // Parent
  if(role === "Parent" && current === "Overview") return <OverviewPage theme={theme}/>;
  if(role === "Parent" && current === "Alerts") return <AlertsPage theme={theme}/>;
  if(role === "Parent" && current === "Payments") return <PaymentsPage theme={theme}/>;

  return (
    <div className={cls("rounded-2xl p-6 text-sm", theme.panel, theme.border, "border")}>
      <p className="mb-2">This is a placeholder page for <span className="font-medium">{current}</span>.</p>
      <p>In the full build, this route will contain the complete module.</p>
    </div>
  );
}

// ===================== Root =====================
export default function LyraOS() {
  const [role, setRole] = useState("Admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [current, setCurrent] = useState("Dashboard");
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [themeKey, setThemeKey] = useState("lightBlue");
  const theme = useMemo(()=> THEMES[themeKey] || THEMES.lightBlue, [themeKey]);

  useEffect(()=>{ setCurrent("Dashboard"); }, [role]);

  return (
    <div className={cls("min-h-dvh", theme.bg, theme.text)}>
      <TopBar
        role={role}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenMessages={() => setMessagesOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        theme={theme}
        themeKey={themeKey}
        setThemeKey={setThemeKey}
      />
      <div className="flex">
        <Sidebar role={role} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} current={current} setCurrent={setCurrent} theme={theme} />
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold tracking-tight">{current}</h1>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <label className={cls("text-xs", theme.alt)}>Role</label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={cls("appearance-none px-3 py-2 pr-8 rounded-lg", theme.border, "border", theme.panel, "text-sm")}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <Icon.chevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60"/>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-16">
            <PageRouter role={role} current={current} openMessages={() => setMessagesOpen(true)} theme={theme} />
          </div>
        </main>
      </div>

      <MessagesDrawer open={messagesOpen} onClose={() => setMessagesOpen(false)} theme={theme} />
      <NotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} theme={theme} />

      <footer className={cls("px-4 sm:px-6 lg:px-8 py-4 text-xs", theme.panel, theme.border, "border-t", theme.alt) }>
        <div className="flex items-center gap-2">
          <span>Lyra • Unified Education OS</span>
          <span className="mx-1">•</span>
          <span>Preview Wireframe (v0.3)</span>
        </div>
      </footer>
    </div>
  );
}
