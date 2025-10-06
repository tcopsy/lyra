"use client";

import React, { useMemo, useState, useEffect } from "react";

// ================================================
// Lyra — Unified Education OS (Single file, compilable)
// - Left-aligned sidebar toggle ("-" flush to left when expanded)
// - Robust header, themes, drawers, pages
// ================================================

// ---------------- Utils ----------------
const cls = (...xs) => xs.filter(Boolean).join(" ");

// ---------------- Icons ----------------
const Icon = {
  menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18"/></svg>
  ),
    smile: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 10h.01M16 10h.01"/>
      <path strokeWidth="2" d="M8 14a4 4 0 008 0"/>
    </svg>
  ),
  palette: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M12 3a9 9 0 100 18 3 3 0 013-3h2a4 4 0 000-8 9 9 0 00-5-7z"/>
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="9.5" cy="6.5" r="1" />
      <circle cx="14.5" cy="6.5" r="1" />
      <circle cx="16.5" cy="10.5" r="1" />
    </svg>
  ),
  thumbsUp: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M14 10V4a2 2 0 00-2-2l-3 8H4a2 2 0 00-2 2v6a2 2 0 002 2h8l6-8v-2a2 2 0 00-2-2h-2z"/>
    </svg>
  ),
  roleAdmin: (p) => ( // shield
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/></svg>
  ),
  roleFaculty: (p) => ( // book
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path strokeWidth="2" d="M6.5 2H20v17H6.5A2.5 2.5 0 014 16.5v-12A2.5 2.5 0 016.5 2z"/></svg>
  ),
  roleStudent: (p) => ( // graduation cap
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 3L2 8l10 5 10-5-5-2.5"/><path strokeWidth="2" d="M7 12v4a5 5 0 0010 0v-4"/></svg>
  ),
  roleParent: (p) => ( // users
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9.5" cy="7" r="4" strokeWidth="2"/><path strokeWidth="2" d="M16 11a4 4 0 014 4v6"/></svg>
  ),
    bold: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M7 5h6a4 4 0 010 8H7zM7 13h7a4 4 0 010 8H7z"/>
    </svg>
  ),
  italic: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M10 4h9M5 20h9M14 4L10 20"/>
    </svg>
  ),
  underline: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M6 4v7a6 6 0 0012 0V4M4 20h16"/>
    </svg>
  ),
  emoji: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 10h.01M16 10h.01M8 14a4 4 0 008 0"/>
    </svg>
  ),
  font: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M4 20h4l4-16h4l4 16h-4"/>
      <path strokeWidth="2" d="M9 16h6"/>
    </svg>
  ),
  droplet: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M12 2s6 7 6 11a6 6 0 11-12 0C6 9 12 2 12 2z"/>
    </svg>
  ),
    // --- New widget icons ---
  calendar: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <rect x="3" y="5" width="18" height="16" rx="2" strokeWidth="2"/>
      <path strokeWidth="2" d="M16 3v4M8 3v4M3 9h18"/>
    </svg>
  ),
  inbox: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M3 13l3-7h12l3 7v5a3 3 0 01-3 3H6a3 3 0 01-3-3z"/>
      <path strokeWidth="2" d="M3 13h5a3 3 0 006 0h7"/>
    </svg>
  ),
  tasks: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M9 7h11M9 12h11M9 17h11"/>
      <path strokeWidth="2" d="M5 7l-2 2 1.5 1.5L7 8.5M5 12l-2 2 1.5 1.5L7 13.5M5 17l-2 2 1.5 1.5L7 18.5"/>
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M9 3l6 6-2 2 5 5-2 2-5-5-2 2-6-6z"/>
    </svg>
  ),
  file: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12V9z"/>
      <path strokeWidth="2" d="M14 3v6h6"/>
    </svg>
  ),
  note: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <rect x="4" y="3" width="16" height="18" rx="2" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 8h8M8 12h8M8 16h5"/>
    </svg>
  ),
  addressBook: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <rect x="5" y="3" width="14" height="18" rx="2" strokeWidth="2"/>
      <path strokeWidth="2" d="M9 7h6M9 11h6M9 15h4"/>
      <path strokeWidth="2" d="M3 7h2M3 11h2M3 15h2"/>
    </svg>
  ),
  progress: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M3 20h18"/>
      <path strokeWidth="2" d="M7 16v-6M12 16V8M17 16v-3"/>
    </svg>
  ),
  activity: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M3 12h4l3 8 4-16 3 8h4"/>
    </svg>
  ),
  trends: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M3 17l6-6 4 4 7-7"/>
      <path strokeWidth="2" d="M21 21H3V3"/>
    </svg>
  ),

  // already added earlier, keeping for completeness
  smile: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 10h.01M16 10h.01"/>
      <path strokeWidth="2" d="M8 14a4 4 0 008 0"/>
    </svg>
  ),
  palette: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M12 3a9 9 0 100 18 3 3 0 013-3h2a4 4 0 000-8 9 9 0 00-5-7z"/>
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="9.5" cy="6.5" r="1" />
      <circle cx="14.5" cy="6.5" r="1" />
      <circle cx="16.5" cy="10.5" r="1" />
    </svg>
  ),
  thumbsUp: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M14 10V4a2 2 0 00-2-2l-3 8H4a2 2 0 00-2 2v6a2 2 0 002 2h8l6-8v-2a2 2 0 00-2-2h-2z"/>
    </svg>
  ),
  roleAdmin: (p) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/></svg>),
  roleFaculty: (p) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path strokeWidth="2" d="M6.5 2H20v17H6.5A2.5 2.5 0 014 16.5v-12A2.5 2.5 0 016.5 2z"/></svg>),
  roleStudent: (p) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M12 3L2 8l10 5 10-5-5-2.5"/><path strokeWidth="2" d="M7 12v4a5 5 0 0010 0v-4"/></svg>),
  roleParent: (p) => (<svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor"><path strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="9.5" cy="7" r="4" strokeWidth="2"/><path strokeWidth="2" d="M16 11a4 4 0 014 4v6"/></svg>),
  home: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M3 11l9-7 9 7"/><path strokeWidth="2" strokeLinecap="round" d="M9 22V12h6v10"/></svg>
  ),
  grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/></svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M12 12a5 5 0 100-10 5 5 0 000 10z"/><path strokeWidth="2" d="M3 22a9 9 0 1118 0H3z"/></svg>
  ),
  chat: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4v8z"/></svg>
  ),
  bell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"/><path strokeWidth="2" strokeLinecap="round" d="M13.73 21a2 2 0 01-3.46 0"/></svg>
  ),
  search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><circle cx="11" cy="11" r="7" strokeWidth="2"/><path strokeWidth="2" strokeLinecap="round" d="M20 20l-3-3"/></svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/></svg>
  ),
  chevronUp: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}>
      <path strokeWidth="2" strokeLinecap="round" d="M6 15l6-6 6 6"/>
    </svg>
  ),
  trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}>
      <path strokeWidth="2" strokeLinecap="round" d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>
      <path strokeWidth="2" strokeLinecap="round" d="M10 10v8M14 10v8"/>
    </svg>
  ),
    smile: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="2"/>
      <path strokeWidth="2" d="M8 10h.01M16 10h.01"/>
      <path strokeWidth="2" d="M8 14a4 4 0 008 0"/>
    </svg>
  ),
  palette: (p) => (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M12 3a9 9 0 100 18 3 3 0 013-3h2a4 4 0 000-8 9 9 0 00-5-7z"/>
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="9.5" cy="6.5" r="1" />
      <circle cx="14.5" cy="6.5" r="1" />
      <circle cx="16.5" cy="10.5" r="1" />
    </svg>
  ),
    layout: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><rect x="3" y="3" width="8" height="8" strokeWidth="2"/><rect x="13" y="3" width="8" height="5" strokeWidth="2"/><rect x="13" y="10" width="8" height="11" strokeWidth="2"/><rect x="3" y="13" width="8" height="8" strokeWidth="2"/></svg>
  ),
  arrows: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M7 10l-4 4 4 4M17 14l4-4-4-4M14 7l-4-4-4 4M10 17l4 4 4-4"/></svg>
  ),
  aspect: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><rect x="4" y="6" width="16" height="12" rx="2" strokeWidth="2"/><path strokeWidth="2" d="M8 10h2v4H8zM14 10h2v4h-2z"/></svg>
  ),
  book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path strokeWidth="2" d="M6.5 2H20v17H6.5A2.5 2.5 0 014 16.5v-12A2.5 2.5 0 016.5 2z"/></svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M5 13l4 4L19 7"/></svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M12 5v14M5 12h14"/></svg>
  ),
  minus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M5 12h14"/></svg>
  ),
  chevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M6 9l6 6 6-6"/></svg>
  ),
  x: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
  ),
  userPlus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={p.className}><path strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4" strokeWidth="2"/><path strokeWidth="2" d="M20 8v6M23 11h-6"/></svg>
  ),
};

// ---------------- Role/Nav & Themes ----------------
const ROLES = ["Admin", "Teacher", "Student", "Parent"];

const NAV = {
  Admin: [
    { label: "Dashboard", icon: Icon.grid },
    { label: "Announcements", icon: Icon.bell },
    { label: "Scheduling", icon: Icon.book },
    { label: "Analytics", icon: Icon.shield },
    { label: "People", icon: Icon.user },
    { label: "Messages", icon: Icon.chat },
    { label: "Settings", icon: Icon.shield },
  ],
// In NAV.Teacher  (ADD the line shown)
Teacher: [
  { label: "Dashboard", icon: Icon.grid },
  { label: "Announcements", icon: Icon.bell }, // ← ADD
  { label: "Courses", icon: Icon.book },
  { label: "Gradebook", icon: Icon.check },
  { label: "Assessments", icon: Icon.shield },
  { label: "Messages", icon: Icon.chat },
  { label: "Settings", icon: Icon.shield },
],
// In NAV.Student  (ADD the line shown)
Student: [
  { label: "Dashboard", icon: Icon.grid },
  { label: "Announcements", icon: Icon.bell }, // ← ADD
  { label: "My Classes", icon: Icon.book },
  { label: "Assignments", icon: Icon.check },
  { label: "Study", icon: Icon.shield },
  { label: "Messages", icon: Icon.chat },
  { label: "Settings", icon: Icon.shield },
],
// In NAV.Parent  (ADD the line shown)
Parent: [
  { label: "Dashboard", icon: Icon.grid },
  { label: "Announcements", icon: Icon.bell }, // ← ADD
  { label: "Overview", icon: Icon.book },
  { label: "Alerts", icon: Icon.bell },
  { label: "Payments", icon: Icon.shield },
  { label: "Messages", icon: Icon.chat },
  { label: "Settings", icon: Icon.shield },
],
};

// Simple Avatar (initials fallback if no photo)
function Avatar({ name, photoUrl, className = "w-8 h-8" }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className={`${className} rounded-full object-cover`} />;
  }
  const initials = (name || "?")
    .split(" ")
    .map(s => s[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className={`${className} rounded-full grid place-items-center bg-neutral-200 text-neutral-700 text-xs font-semibold`}>
      {initials || "?"}
    </div>
  );
}

// --- Tiny UI helpers ---
function SectionTitle({ children, theme }) {
  return <div className={cls("text-xs uppercase tracking-wide font-medium mb-2", theme.alt)}>{children}</div>;
}

// Collapsible toolbar used by the Composer
function RichToolbar({ theme, open, setOpen, onBold, onItalic, onUnderline, onEmoji, onColor, onFont }) {
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v=>!v)}
        className={cls("px-2.5 py-1.5 rounded-lg text-xs", theme.btn, theme.hover)}
        aria-expanded={open}
      >
        Text tools
      </button>
      {open && (
        <div className={cls("absolute z-20 mt-2 w-[min(92vw,420px)] rounded-xl p-2 shadow grid grid-cols-2 gap-2", theme.panel, theme.border, "border")}>
          <button onClick={onBold} className={cls("px-2 py-1 rounded", theme.btn, theme.hover)}><span className="font-semibold">Bold</span></button>
          <button onClick={onItalic} className={cls("px-2 py-1 rounded italic", theme.btn, theme.hover)}>Italic</button>
          <button onClick={onUnderline} className={cls("px-2 py-1 rounded underline", theme.btn, theme.hover)}>Underline</button>
          <button onClick={onEmoji} className={cls("px-2 py-1 rounded", theme.btn, theme.hover)}>Emoji 😊</button>
          <button onClick={()=>onColor("#2563eb")} className={cls("px-2 py-1 rounded", theme.btn, theme.hover)}>Color</button>
          <button onClick={()=>onFont("serif")} className={cls("px-2 py-1 rounded", theme.btn, theme.hover)}>Font</button>
        </div>
      )}
    </div>
  );
}

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
    swatch: "bg-blue-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
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
    swatch: "bg-neutral-600",
    headerPanel: "bg-neutral-900",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-neutral-900/80",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  slate: {
    name: "Slate",
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
    swatch: "bg-slate-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
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
    swatch: "bg-emerald-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  purple: {
    name: "Purple",
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
    swatch: "bg-purple-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  red: {
    name: "Red",
    bg: "bg-red-50",
    panel: "bg-white",
    border: "border-red-200",
    subtle: "bg-red-100 text-red-700",
    hover: "hover:bg-red-50",
    chip: "bg-red-100 text-red-700",
    btn: "border border-red-200",
    cta: "bg-red-600 text-white hover:bg-red-700",
    textMuted: "text-red-800/70",
    text: "text-red-950",
    alt: "text-red-600",
    swatch: "bg-red-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  orange: {
    name: "Orange",
    bg: "bg-orange-50",
    panel: "bg-white",
    border: "border-orange-200",
    subtle: "bg-orange-100 text-orange-700",
    hover: "hover:bg-orange-50",
    chip: "bg-orange-100 text-orange-700",
    btn: "border border-orange-200",
    cta: "bg-orange-600 text-white hover:bg-orange-700",
    textMuted: "text-orange-800/70",
    text: "text-orange-950",
    alt: "text-orange-600",
    swatch: "bg-orange-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  pink: {
    name: "Pink",
    bg: "bg-pink-50",
    panel: "bg-white",
    border: "border-pink-200",
    subtle: "bg-pink-100 text-pink-700",
    hover: "hover:bg-pink-50",
    chip: "bg-pink-100 text-pink-700",
    btn: "border border-pink-200",
    cta: "bg-pink-600 text-white hover:bg-pink-700",
    textMuted: "text-pink-800/70",
    text: "text-pink-950",
    alt: "text-pink-600",
    swatch: "bg-pink-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  yellow: {
    name: "Yellow",
    bg: "bg-yellow-50",
    panel: "bg-white",
    border: "border-yellow-200",
    subtle: "bg-yellow-100 text-yellow-800",
    hover: "hover:bg-yellow-50",
    chip: "bg-yellow-100 text-yellow-800",
    btn: "border border-yellow-200",
    cta: "bg-yellow-600 text-white hover:bg-yellow-700",
    textMuted: "text-yellow-800/70",
    text: "text-yellow-950",
    alt: "text-yellow-700",
    swatch: "bg-yellow-500",
    headerPanel: "bg-white",
    headerBackdrop: "backdrop-blur supports-[backdrop-filter]:bg-white/70",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
  rainbow: {
    name: "Rainbow",
    bg: "bg-rose-50",
    panel: "bg-white",
    border: "border-pink-200",
    subtle: "bg-gradient-to-r from-pink-100 via-yellow-100 to-blue-100 text-fuchsia-700",
    hover: "hover:bg-black/5",
    chip: "bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-indigo-800",
    btn: "border border-fuchsia-200",
    cta: "bg-gradient-to-r from-fuchsia-600 via-orange-500 to-amber-500 text-white hover:brightness-110",
    textMuted: "text-fuchsia-900/70",
    text: "text-fuchsia-950",
    alt: "text-fuchsia-700/70",
    swatch: "bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500",
    headerPanel: "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600",
    headerBackdrop: "",
    cardShadow: "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.06)]",
    ringSoft: "ring-1 ring-black/5",
  },
};

// ---------------- Header ----------------
function TopBar({ role, onNavigate, onChangeRole, onOpenNotifications, theme, themeKey, setThemeKey, onStartDM }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const friends = [
    { name: "Ava Carter", role: "Student", color: "bg-pink-300" },
    { name: "Leo Kim", role: "Teacher", color: "bg-blue-300" },
    { name: "M. Patel", role: "Admin", color: "bg-emerald-300" },
    { name: "Registrar", role: "System", color: "bg-slate-300" },
  ];

  // Close popovers on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setMenuOpen(false); setRoleOpen(false); setThemeOpen(false); setDmOpen(false); setProfileOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ThemeDot = ({ k }) => (<span className={cls("inline-block w-4 h-4 rounded-full", THEMES[k].swatch, "ring-1 ring-black/10")} />);

  return (
    <div className={cls("sticky top-0 z-20", theme.border, "border-b", theme.headerPanel, theme.headerBackdrop)}>
      <div className="flex items-center gap-3 px-4 py-3 relative">
        {/* App menu (hamburger) */}
        <div className="relative">
          <button onClick={() => setMenuOpen(v=>!v)} className={cls("p-2 rounded", theme.hover)} aria-label="Open menu"><Icon.menu className="w-5 h-5" /></button>
          {menuOpen && (
            <div className={cls("absolute mt-2 w-48 rounded-xl p-1 shadow", theme.panel, theme.border, "border z-30")}> 
              {[{label:"Home", icon:Icon.home, key:"Home"},{label:"Dashboard", icon:Icon.grid, key:"Dashboard"},{label:"Profile", icon:Icon.user, key:"Profile"},{label:"Messages", icon:Icon.chat, key:"Messages"},{label:"Social", icon:Icon.shield, key:"Social"}].map(m=> (
                <button key={m.key} onClick={()=>{ setMenuOpen(false); onNavigate && onNavigate(m.key); }} className={cls("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left", theme.hover)}>
                  <m.icon className="w-4 h-4"/> <span className="text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="font-semibold tracking-tight text-lg">Lyra</div>

        {/* Search */}
        <div className="relative max-w-xl flex-1 hidden md:block">
          <div className={cls("flex items-center gap-2 px-3 py-2 rounded-xl", theme.border, "border", theme.panel)}>
            <Icon.search className="w-4 h-4" />
            <input className="w-full outline-none text-sm bg-transparent" placeholder="Search courses, people, files…" />
          </div>
        </div>
{/* Role selector — moved right next to search */}
<div className="relative ml-2">
  <button
    onClick={()=> setRoleOpen(v=>!v)}
    className={cls("px-2.5 py-1.5 rounded-full flex items-center gap-1", theme.border, "border", theme.hover)}
    aria-label="Change role"
  >
    <Icon.user className="w-4 h-4"/><span className="text-xs font-medium">{role}</span>
    <Icon.chevronDown className="w-4 h-4 opacity-70"/>
  </button>
  {roleOpen && (
    <div className={cls("absolute right-0 mt-2 w-40 rounded-xl p-1 shadow", theme.panel, theme.border, "border z-30")}>
      {ROLES.map((r)=> (
        <button
          key={r}
          onClick={()=>{ onChangeRole && onChangeRole(r); setRoleOpen(false); }}
          className={cls("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left", theme.hover)}
        >
          <Icon.user className="w-4 h-4"/> <span className="text-sm">{r}</span>
        </button>
      ))}
    </div>
  )}
</div>
        {/* Theme selector */}
        <div className="relative">
          <button onClick={()=> setThemeOpen(v=>!v)} className={cls("p-2 rounded", theme.hover)} aria-label="Change theme"><ThemeDot k={themeKey}/></button>
          {themeOpen && (
            <div className={cls("absolute right-0 mt-2 rounded-xl p-2 shadow flex gap-2", theme.panel, theme.border, "border z-30")}> 
              {Object.keys(THEMES).map((k)=> (
                <button key={k} onClick={()=>{ setThemeKey(k); setThemeOpen(false); }} className="p-1 rounded-full" aria-label={`Theme ${THEMES[k].name}`}><ThemeDot k={k}/></button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Messenger */}
        <div className="relative">
          <button onClick={()=> setDmOpen(v=>!v)} className={cls("p-2 rounded", theme.hover)} aria-label="Quick messages"><Icon.chat className="w-5 h-5" /></button>
          {dmOpen && (
            <div className={cls("absolute right-0 mt-2 w-64 rounded-xl p-2 shadow", theme.panel, theme.border, "border z-30")}> 
              <div className={cls("text-xs mb-1 px-2", theme.alt)}>Friends</div>
              <ul className="max-h-64 overflow-auto">
                {friends.map((f)=> (
                  <li key={f.name}>
                    <button onClick={()=>{ onStartDM && onStartDM(f.name); setDmOpen(false); }} className={cls("w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left", theme.hover)}>
                      <span className={cls("w-6 h-6 rounded-full", f.color)} aria-hidden="true"></span>
                      <div className="flex-1"><div className="text-sm leading-tight">{f.name}</div><div className={cls("text-[10px]", theme.alt)}>{f.role}</div></div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button onClick={onOpenNotifications} className={cls("p-2 rounded", theme.hover)} aria-label="Notifications"><Icon.bell className="w-5 h-5" /></button>

        {/* Profile avatar */}
        <div className="relative">
          <button onClick={()=> setProfileOpen(v=>!v)} className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-300/50 to-neutral-500/50" aria-label="Profile" />
          {profileOpen && (
            <div className={cls("absolute right-0 mt-2 w-48 rounded-xl p-1 shadow", theme.panel, theme.border, "border z-30")}> 
              {[{label:"Profile", icon:Icon.user},{label:"Settings", icon:Icon.shield},{label:"Logout", icon:Icon.x}].map((m)=>(
                <button key={m.label} onClick={()=> setProfileOpen(false)} className={cls("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left", theme.hover)}>
                  <m.icon className="w-4 h-4"/> <span className="text-sm">{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- Sidebar (left-aligned toggle) ----------------
function Sidebar({ role, collapsed, setCollapsed, current, setCurrent, theme }) {
  const items = NAV[role];
  return (
    <aside className={cls("transition-all duration-300 ease-in-out h-[calc(100dvh-56px)] sticky top-[56px] overflow-y-auto", theme.border, "border-r", theme.panel, collapsed ? "w-[70px]" : "w-64")}> 
      <div className="pt-3 pb-2 pl-3 flex justify-start">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cls("p-2 rounded-full transition-colors duration-200 flex items-center justify-center", theme.hover)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Icon.plus className="w-5 h-5" /> : <Icon.minus className="w-5 h-5" />}
          <span className="sr-only">{collapsed ? "Expand" : "Collapse"}</span>
        </button>
      </div>
      <nav className="px-2 pb-4 flex flex-col gap-1">
        {items.map((it) => (
          <button key={it.label} onClick={() => setCurrent(it.label)} className={cls("flex items-center gap-3 rounded-lg px-3 py-2 text-left", theme.hover, current === it.label ? theme.subtle : "")}> 
            <it.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate text-sm">{it.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ---------------- Cards/Widgets ----------------
function Card({ title, children, actions, size, theme }) {
  const sz = size === "lg" ? "col-span-12 lg:col-span-8" : size === "md" ? "col-span-12 sm:col-span-6 lg:col-span-4" : "col-span-12 sm:col-span-4 lg:col-span-3";
  return (
    <section className={cls("rounded-2xl", theme.border, "border", theme.panel, sz)}>
      <header className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b")}> 
        <h3 className="font-medium tracking-tight">{title}</h3>
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </header>
      <div className={cls("p-4 text-sm", theme.textMuted)}>{children}</div>
    </section>
  );
}

function WidgetChrome() {
  return null; // controls disabled (no move/resize/remove on locked dashboard)
}
// --- Fixed popover anchored to a trigger (accounts for scroll/resize) ---
function useFixedPopover() {
  const [pos, setPos] = useState(null); // { x, y, width } in page coords
  const [anchorEl, setAnchorEl] = useState(null);

  const compute = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    // Use page coords so 'position:fixed' lands under the trigger even if page is scrolled
    const x = Math.round(r.left + window.scrollX);
    const y = Math.round(r.bottom + window.scrollY + 6); // 6px gap
    const width = Math.round(r.width);
    return { x, y, width };
  };

  const openAt = (el) => {
    setAnchorEl(el);
    const p = compute(el);
    setPos(p);
  };

  const close = () => { setPos(null); setAnchorEl(null); };

  // Recompute on scroll/resize while open
  useEffect(() => {
    if (!pos || !anchorEl) return;
    const onUpdate = () => { const p = compute(anchorEl); p && setPos(p); };
    window.addEventListener("scroll", onUpdate, { passive: true });
    window.addEventListener("resize", onUpdate);
    return () => { window.removeEventListener("scroll", onUpdate); window.removeEventListener("resize", onUpdate); };
  }, [pos, anchorEl]);

  return { pos, openAt, close, anchorEl };
}

function FixedPopover({ pos, theme, width = 300, children }) {
  if (!pos) return null;

  // Clamp to viewport right edge with a small gutter
  const gutter = 12;
  const maxLeft = window.scrollX + window.innerWidth - width - gutter;
  const left = Math.max(window.scrollX + gutter, Math.min(pos.x, maxLeft));
  const top = pos.y;

  return (
    <div
      className={cls(
        "fixed z-[9999] rounded-xl p-2 shadow-2xl",
        theme.panel, theme.border, "border"
      )}
      style={{ left, top, width }}
    >
      {children}
    </div>
  );
}

function Tip({ label, theme }) {
  return (
    <span
      className={cls(
        "pointer-events-none absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)]",
        "whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] shadow transition-opacity duration-150",
        theme.panel, theme.border, "border", theme.text
      )}
      style={{ opacity: 0 }}
      data-tip
    >
      {label}
    </span>
  );
}

// Utility: attach to a parent with className="group relative"
// and add 'group-hover:[&>[data-tip]]:opacity-100'

// --- Helpers (place above Composer) ---
function stripHtml(html = "") {
  const tmp = typeof document !== "undefined" ? document.createElement("div") : null;
  if (!tmp) return html;
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
}
function previewText(html, max = 120) {
  const s = stripHtml(html);
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
// --- Announcements Table (index) ---
function AnnouncementsTable({ theme, items = [], onOpen }) {
  return (
    <div className={cls("rounded-2xl overflow-hidden", theme.panel, theme.border, "border")}>
      <div className={cls("px-4 py-3 font-medium tracking-tight", theme.border, "border-b")}>
        Announcements
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className={cls("text-left", theme.alt)}>
              <th className="px-3 py-2">Poster</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Views</th>
              <th className="px-3 py-2">Replies</th>
              <th className="px-3 py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className={cls("px-3 py-6 text-center", theme.alt)}>No announcements yet.</td>
              </tr>
            )}
            {items.map((m, i) => (
              <tr key={m.id} className={cls(i % 2 ? "bg-black/5" : "", "border-t", theme.border)}>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={m.fromName} photoUrl={m.fromPhoto} />
                    <a href={`#/profile/${encodeURIComponent(m.fromName)}`} className="hover:underline">
                      {m.fromName}
                    </a>
                  </div>
                </td>
                <td className="px-3 py-2">{m.fromRole}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onOpen?.(m.id)}
                    className="font-medium hover:underline"
                    title="Open post"
                  >
                    {m.subject || "(no subject)"}
                  </button>
                </td>
                <td className="px-3 py-2">{previewText(m.body, 100)}</td>
                <td className="px-3 py-2">{m.views ?? 0}</td>
                <td className="px-3 py-2">{m.replies ?? 0}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onOpen?.(m.id)}
                    className={cls("px-2.5 py-1.5 rounded-lg text-xs", theme.btn, theme.hover)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Composer({ theme, items = [], canPost = true, onPost, role, currentUser }) {
  // active state for inline styles
const [isBold, setIsBold] = useState(false);
const [isItalic, setIsItalic] = useState(false);
const [isUnderline, setIsUnderline] = useState(false);

// update toolbar active state on selection change
useEffect(() => {
  const handler = () => {
    // Only query when editor is focused; if not, clear states
    const hasFocus = document.activeElement === editorRef.current || editorRef.current?.contains(document.activeElement);
    if (!hasFocus) { setIsBold(false); setIsItalic(false); setIsUnderline(false); return; }
    try {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
    } catch {}
  };
  document.addEventListener("selectionchange", handler);
  return () => document.removeEventListener("selectionchange", handler);
}, []);
  
  // Collapsible composer + subject + WYSIWYG content
  const [open, setOpen] = useState(true);
  const [subject, setSubject] = useState("");
  const editorRef = React.useRef(null);

  // Fixed popovers (color/emoji) — not clipped by layout
  const colorPop = useFixedPopover();
  const emojiPop = useFixedPopover();

  // Click-away + Escape to close popovers
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && (colorPop.close(), emojiPop.close());
    const onClick = (e) => {
      const isColorBtn = e.target.closest?.("[data-color-btn]");
      const isEmojiBtn = e.target.closest?.("[data-emoji-btn]");
      if (!isColorBtn && !isEmojiBtn) { colorPop.close(); emojiPop.close(); }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onClick); };
  }, []);

  // Audience chips (icons)
  const [audience, setAudience] = useState(() => {
    if (role === "Teacher") return ["Students", "Parents"];
    if (role === "Admin") return ["Admin", "Faculty", "Students"];
    return [];
  });
  const AUDIENCE = [
    { k: "Admin",    icon: Icon.roleAdmin },
    { k: "Faculty",  icon: Icon.roleFaculty },
    { k: "Students", icon: Icon.roleStudent },
    { k: "Parents",  icon: Icon.roleParent },
  ];
  const ALLOWED = role === "Admin" ? ["Admin","Faculty","Students","Parents"]
                : role === "Teacher" ? ["Students","Parents"] : [];
  const toggleAudience = (k) => setAudience(prev => prev.includes(k) ? prev.filter(x=>x!==k) : [...prev, k]);

  // Editor formatting (WYSIWYG via execCommand)
  const exec = (cmd, val = null) => {
    // Ensure focus and selection inside editor
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, val);
  };

  // ROYGBIV shades (no labels in menu)
  const SWATCHES = [
    ["#fecaca","#fca5a5","#ef4444","#dc2626","#991b1b"], // R
    ["#fed7aa","#fdba74","#f97316","#ea580c","#9a3412"], // O
    ["#fef08a","#fde047","#f59e0b","#d97706","#92400e"], // Y
    ["#bbf7d0","#86efac","#22c55e","#16a34a","#166534"], // G
    ["#bfdbfe","#93c5fd","#3b82f6","#2563eb","#1e3a8a"], // B
    ["#c7d2fe","#a5b4fc","#6366f1","#4f46e5","#312e81"], // I
    ["#f5d0fe","#e9d5ff","#a855f7","#7e22ce","#4c1d95"], // V
  ];

  const EMOJIS = ["😊","👍","🎉","✨","✅","📚","📝","📅","📣","🔔","🏆","💡","🤝","🙌","👏","🔍","📎","🧪","🧠","🌟"];

  // Name dropdown (from previous step)
  const displayName = currentUser?.name || (role === "Admin" ? "Tristan Copsy" : "You");
  const [nameOpen, setNameOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setNameOpen(false);
    const onClick = (e) => { if (!e.target.closest?.("[data-name-menu-root]")) setNameOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onClick); };
  }, []);

  // Post + smooth-scroll to new post
  const post = () => {
    const el = editorRef.current;
    const subj = subject.trim();
    if (!canPost || !el || !subj) return;
    const html = el.innerHTML.trim();
    if (!html) return;
    const id = "ann-" + Math.random().toString(36).slice(2);
        onPost?.({
      id,
      subject: subj,
      fromName: displayName,
      fromRole: role,
      fromPhoto: currentUser?.photoUrl || "",
      body: html,
      audience,
      ts: new Date().toISOString(),
      votes: 0,
      views: 0,     // NEW
      replies: 0,   // NEW (wire to your reply system when ready)
    });
    // reset editor
    setSubject("");
    el.innerHTML = "";
    // smooth scroll to the new post once it's mounted
    setTimeout(() => {
      const target = document.getElementById(`post-${id}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Subject index click -> smooth scroll
  const goToPost = (id) => {
    const target = document.getElementById(`post-${id}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-5">
      {/* Composer card */}
      {canPost && (
        <div className={cls("rounded-2xl shadow-sm overflow-visible", theme.panel, theme.border, "border")}>
          {/* Header */}
          <div className={cls("px-4 py-3 flex items-center gap-3", theme.border, "border-b")}>
            {/* collapse toggle */}
            <button
              onClick={() => setOpen(o=>!o)}
              className={cls("p-2 rounded-lg", theme.btn, theme.hover)}
              title={open ? "Collapse" : "Expand"}
            >
              {open ? <Icon.minus className="w-4 h-4" /> : <Icon.plus className="w-4 h-4" />}
            </button>

            {/* Avatar left of name */}
            <Avatar name={displayName} photoUrl={currentUser?.photoUrl} />

            {/* Name dropdown */}
            <div className="relative" data-name-menu-root>
              <button
                onClick={(e)=>{ e.stopPropagation(); setNameOpen(v=>!v); }}
                className={cls("px-2 py-1 rounded-lg font-medium hover:underline", theme.hover)}
                aria-haspopup="menu"
                aria-expanded={nameOpen}
                title={displayName}
              >
                {displayName}
                <Icon.chevronDown className="w-4 h-4 inline-block ml-1 opacity-70 align-[-2px]" />
              </button>

              {nameOpen && (
                <div
                  role="menu"
                  className={cls("absolute z-30 mt-2 w-44 rounded-xl p-1 shadow-lg", theme.panel, theme.border, "border")}
                >
                  {[
                    { label: "View Profile", href: `#/profile/${encodeURIComponent(displayName)}` },
                    { label: "Edit Profile", href: "#/profile/edit" },
                    { label: "Change Photo", href: "#/profile/photo" },
                    { label: "Settings", href: "#/settings" },
                  ].map((m) => (
                    <a
                      key={m.label}
                      role="menuitem"
                      href={m.href}
                      className={cls("block px-3 py-2 rounded-lg text-sm", theme.hover)}
                      onClick={()=> setNameOpen(false)}
                    >
                      {m.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Neutral chip */}
            <span className={cls("text-xs px-2 py-0.5 rounded-full", theme.chip)}>Announcement</span>

            <div className="flex-1" />

            {/* Audience icon chips with rounded tips */}
            <div className="flex items-center gap-2">
              {AUDIENCE.filter(a => ALLOWED.includes(a.k)).map(({k, icon:RoleIcon}) => (
                <div key={k} className="group relative">
                  <button
                    onClick={() => toggleAudience(k)}
                    className={cls(
                      "px-2 py-1.5 rounded-full text-xs flex items-center gap-1",
                      audience.includes(k) ? theme.chip : theme.hover,
                      theme.btn
                    )}
                    aria-label={k}
                  >
                    <RoleIcon className="w-4 h-4" />
                  </button>
                  <Tip label={k} theme={theme} />
                  <style>{`.group:hover [data-tip]{opacity:1}`}</style>
                </div>
              ))}
            </div>
          </div>

          {open && (
            <>
              {/* Subject line */}
              <div className="px-4 pt-3">
                <input
                  value={subject}
                  onChange={(e)=>setSubject(e.target.value)}
                  placeholder="Subject (required)"
                  className={cls("w-full px-3 py-2 rounded-xl outline-none", theme.border, "border", theme.panel)}
                />
              </div>

              {/* Toolbar */}
              <div className={cls("px-4 py-3 flex items-center flex-wrap gap-2", theme.border, "border-b")}>
                <button
  className={cls("p-2 rounded-lg", isBold ? theme.subtle : theme.btn, theme.hover)}
  title="Bold"
  aria-pressed={isBold}
  onClick={() => exec("bold")}
>
  <Icon.bold className="w-4 h-4" />
</button>

<button
  className={cls("p-2 rounded-lg", isItalic ? theme.subtle : theme.btn, theme.hover)}
  title="Italic"
  aria-pressed={isItalic}
  onClick={() => exec("italic")}
>
  <Icon.italic className="w-4 h-4" />
</button>

<button
  className={cls("p-2 rounded-lg", isUnderline ? theme.subtle : theme.btn, theme.hover)}
  title="Underline"
  aria-pressed={isUnderline}
  onClick={() => exec("underline")}
>
  <Icon.underline className="w-4 h-4" />
</button>

                <span className={cls("h-5 w-px", theme.border, "border-l mx-1")} />

                {/* Color trigger (no labels in menu) */}
                <div className="relative">
                  <button
                    data-color-btn
                    className={cls("p-2 rounded-lg flex items-center gap-2", theme.btn, theme.hover)}
                    title="Text color"
                    onClick={(e)=>{ e.stopPropagation(); colorPop.openAt(e.currentTarget); emojiPop.close(); }}
                  >
                    <Icon.palette className="w-4 h-4" />
                    <Icon.chevronDown className="w-4 h-4 opacity-70" />
                  </button>
                </div>

                {/* Emoji trigger */}
                <div className="relative">
                  <button
                    data-emoji-btn
                    className={cls("p-2 rounded-lg", theme.btn, theme.hover)}
                    title="Insert emoji"
                    onClick={(e)=>{ e.stopPropagation(); emojiPop.openAt(e.currentTarget); colorPop.close(); }}
                  >
                    <Icon.smile className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Fixed-position Color Popover (swatches only) */}
              <FixedPopover pos={colorPop.pos} theme={theme} width={280}>
                <div className="space-y-2">
                  {SWATCHES.map((row, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {row.map((hex) => (
                        <button
                          key={hex}
                          className="w-6 h-6 rounded-md ring-1 ring-black/10"
                          style={{ backgroundColor: hex }}
                          onClick={() => { exec("foreColor", hex); colorPop.close(); }}
                          aria-label={`Set color ${hex}`}
                          title={hex}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </FixedPopover>

              {/* Fixed-position Emoji Popover */}
              <FixedPopover pos={emojiPop.pos} theme={theme} width={260}>
                <div className="grid grid-cols-5 gap-2 p-2">
                  {EMOJIS.map((e, i) => (
                    <button
                      key={i}
                      className={cls("text-base leading-none px-2 py-2 rounded-lg", theme.hover)}
                      onClick={() => { exec("insertText", e); emojiPop.close(); }}
                      aria-label={`Insert ${e}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </FixedPopover>

              {/* WYSIWYG editor */}
              <div className="px-4 py-3">
                <div
                  ref={editorRef}
                  contentEditable
                  className={cls("min-h-[96px] w-full px-3 py-2 rounded-xl outline-none", theme.border, "border", theme.panel)}
                  placeholder="Write your announcement…"
                  // basic contenteditable placeholder support
                  onFocus={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.empty === "true") { el.innerHTML = ""; el.dataset.empty = "false"; }
                  }}
                  onBlur={(e) => {
                    const el = e.currentTarget;
                    if (!el.innerText.trim()) { el.innerHTML = ""; el.dataset.empty = "true"; }
                  }}
                  data-empty="true"
                />
                <div className="mt-3 flex items-center justify-end">
                  <button onClick={post} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Post</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

            {/* Announcements Table (click to jump to post) */}
      <AnnouncementsTable
        theme={theme}
        items={items}
        onOpen={(id) => {
          const target = document.getElementById(`post-${id}`);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          // (Optional) If you want to record a view, pass an onView callback prop from parent and call it here.
        }}
      />

      {/* Forum-style feed (with anchors for smooth scroll) */}
      <div className="space-y-3">
        {items.map((m) => (
          <article id={`post-${m.id}`} key={m.id} className={cls("rounded-2xl shadow-sm overflow-hidden", theme.panel, theme.border, "border")}>
            <header className={cls("px-4 py-3 flex items-center gap-3", theme.border, "border-b")}>
              <a href={`#/profile/${encodeURIComponent(m.fromName)}`} className="font-medium hover:underline">{m.fromName}</a>
              <span className={cls("text-xs px-2 py-0.5 rounded-full", theme.chip)}>{m.fromRole}</span>
              <div className="flex-1" />
              <div className={cls("text-xs", theme.alt)}>{new Date(m.ts).toLocaleString()}</div>
            </header>
            <div className="px-4 py-3">
              {m.subject && (
                <button
                  onClick={() => goToPost(m.id)}
                  className="text-base font-semibold mb-2 tracking-tight hover:underline"
                  title="View post"
                >
                  {m.subject}
                </button>
              )}
              <div
                className={cls("prose prose-sm max-w-none", theme.textMuted)}
                dangerouslySetInnerHTML={{ __html: (m.body || "").replace(/\n/g, "<br/>") }}
              />
              <div className="mt-3 flex flex-wrap gap-1">
                {m.audience?.map((a) => (
                  <span key={a} className={cls("text-[11px] px-1.5 py-0.5 rounded", theme.subtle)}>{a}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
        {items.length === 0 && (
          <div className={cls("rounded-2xl p-6 text-sm text-center", theme.panel, theme.border, "border", theme.alt)}>
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Drawers ----------------
function MessagesDrawer({ open, onClose, theme, initialRecipient, conversation, onSend, contacts = [] }) {
  const directory = ["Ava Carter", "Leo Kim", "M. Patel", "Registrar", "BIO101", "ENG201", ...contacts.map(c=>c.name || "").filter(Boolean)];
  const [to, setTo] = useState(initialRecipient || "");
  const [selected, setSelected] = useState(initialRecipient ? [initialRecipient] : []);
  const [input, setInput] = useState("");

  useEffect(() => { if (initialRecipient) setSelected([initialRecipient]); }, [initialRecipient]);
  if (!open) return null;

  const addRecipient = () => {
    const name = to.trim();
    if (!name || !directory.includes(name)) return;
    setSelected([name]); setTo("");
  };

  const msgs = selected.length ? (conversation[selected[0]] || []) : [];
  const recent = Object.keys(conversation || {}).slice(-6).reverse(); // last 6 threads

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={onClose} />
      <div className={cls("w-[520px] h-full flex flex-col", theme.panel, theme.border, "border-l")}>
        <div className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b")}>
          <h3 className="font-medium tracking-tight">Messages</h3>
          <button onClick={onClose} className={cls("ml-auto p-2 rounded", theme.hover)} aria-label="Close"><Icon.x className="w-5 h-5" /></button>
        </div>

        {/* Search/Add row */}
        <div className={cls("px-4 py-3 flex items-center gap-2", theme.border, "border-b")}>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            list="dm-directory"
            placeholder="Type a name…"
            className={cls("flex-1 px-3 py-2 rounded-lg bg-transparent outline-none", theme.border, "border")}
          />
          <datalist id="dm-directory">{directory.map((n, i) => (<option key={i} value={n} />))}</datalist>
          <button onClick={addRecipient} className={cls("px-3 py-2 rounded-lg flex items-center gap-2", theme.btn, theme.hover)}>
            <Icon.userPlus className="w-4 h-4" />Add
          </button>
          {selected.length > 0 && <span className={cls("text-xs px-2 py-1 rounded", theme.chip)}>{selected[0]}</span>}
        </div>

        {/* Recents + Address Book */}
        <div className={cls("px-4 py-3 grid grid-cols-2 gap-3", theme.border, "border-b")}>
          <div>
            <div className={cls("text-xs mb-1", theme.alt)}>Recents</div>
            <ul className="max-h-40 overflow-auto">
              {recent.length === 0 && (<li className={cls("text-xs", theme.alt)}>No recent threads</li>)}
              {recent.map((name)=>(
                <li key={name}>
                  <button
                    onClick={()=> setSelected([name])}
                    className={cls("w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left", theme.hover)}
                  >
                    <Avatar name={name} />
                    <div className="flex-1">
                      <div className="text-sm leading-tight">{name}</div>
                      <div className={cls("text-[10px]", theme.alt)}>Recent</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className={cls("text-xs mb-1", theme.alt)}>Address Book</div>
            <ul className="max-h-40 overflow-auto">
              {contacts.map((c)=>(
                <li key={c.id || c.email || c.name}>
                  <button
                    onClick={()=> setSelected([c.name])}
                    className={cls("w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left", theme.hover)}
                  >
                    <Avatar name={c.name} />
                    <div className="flex-1">
                      <div className="text-sm leading-tight">{c.name}</div>
                      <div className={cls("text-[10px]", theme.alt)}>{c.role} • {c.email}</div>
                    </div>
                  </button>
                </li>
              ))}
              {contacts.length === 0 && (<li className={cls("text-xs", theme.alt)}>No contacts — add some in Address Book</li>)}
            </ul>
          </div>
        </div>

        {/* Thread body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={cls("p-3 rounded-xl", theme.border, "border", theme.panel)}>
              <div className="text-xs opacity-70 mb-1">{m.from}</div>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
          {!selected.length && <div className={cls("text-sm", theme.alt)}>Select a recipient to start messaging.</div>}
          {selected.length && msgs.length === 0 && <div className={cls("text-sm", theme.alt)}>No messages yet — say hello 👋</div>}
        </div>

        {/* Composer */}
        <div className={cls("p-3 flex items-center gap-2", theme.border, "border-t")}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
            placeholder={selected.length ? `Message ${selected[0]}…` : "Select a recipient to send a message…"}
            disabled={!selected.length}
          />
          <button
            className={cls("px-3 py-2 rounded-lg", theme.cta)}
            onClick={() => { if (!input.trim() || !selected.length) return; onSend && onSend(selected[0], { from: "You", text: input.trim() }); setInput(""); }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsDrawer({ open, onClose, theme }) {
  const [items] = useState([ { type: "Course", source: "BIO101", text: "Lab Report due Tue" }, { type: "Course", source: "ENG201", text: "Essay draft due Fri" }, { type: "System", source: "Registrar", text: "Schedule rolls out Friday" } ]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1" onClick={onClose} />
      <div className={cls("w-[420px] h-full flex flex-col", theme.panel, theme.border, "border-l")}> 
        <div className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b")}> 
          <h3 className="font-medium tracking-tight">Notifications</h3>
          <button onClick={onClose} className={cls("ml-auto p-2 rounded", theme.hover)} aria-label="Close"><Icon.x className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">{items.map((m, i) => (<div key={i} className={cls("p-3 rounded-xl", theme.border, "border", theme.panel)}><div className="text-xs opacity-70 mb-1">{m.type} • {m.source}</div><div className="text-sm">{m.text}</div></div>))}</div>
        <div className={cls("p-3", theme.border, "border-t")}> <button className={cls("px-3 py-2 rounded-lg", theme.btn, theme.hover)}>Mark all read</button> </div>
      </div>
    </div>
  );
}

// ---------------- Pages ----------------

function WidgetLayoutEditor({ open, onClose, value, onChange, theme }) {
  if (!open) return null;
  const widths = [3,4,6,8,12]; // of 12 columns
  const heights = [10,14,18,22,26]; // grid row spans
  return (
    <div className="absolute right-0 top-full mt-2 z-30">
      <div className={cls("w-64 rounded-xl p-3 shadow", theme.panel, theme.border, "border")}>
        <div className="text-sm font-medium mb-2">Widget Layout</div>
        <div className="text-xs mb-1">Width (cols /12)</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {widths.map(w=>(
            <button key={w} onClick={()=>onChange({ ...value, w })}
              className={cls("px-2 py-1 rounded text-xs", theme.btn, theme.hover, value.w===w && theme.chip)}>
              {w}
            </button>
          ))}
        </div>
        <div className="text-xs mb-1">Height (row span)</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {heights.map(h=>(
            <button key={h} onClick={()=>onChange({ ...value, h })}
              className={cls("px-2 py-1 rounded text-xs", theme.btn, theme.hover, value.h===h && theme.chip)}>
              {h}
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className={cls("px-3 py-1.5 rounded", theme.btn, theme.hover)}>Close</button>
        </div>
      </div>
    </div>
  );
}
// Collapsible table section row
function TableSection({ id, title, subtitle, open, onToggle, rightMeta, children, theme }) {
  return (
    <>
      {/* Header Row */}
      <tr className={cls(theme.border, "border-t")}>
        <td className="px-3 py-3 align-middle w-10">
          <button
            onClick={() => onToggle(id)}
            aria-expanded={open}
            className={cls("p-1 rounded", theme.hover)}
            title={open ? "Collapse" : "Expand"}
          >
            <Icon.chevronDown className={cls("w-4 h-4 transition-transform", open ? "rotate-180" : "")} />
          </button>
        </td>
        <td className="px-3 py-3 align-middle">
          <div className="flex items-center gap-3">
            <h3 className="font-medium tracking-tight">{title}</h3>
            {subtitle && <span className={cls("text-xs", theme.alt)}>{subtitle}</span>}
          </div>
        </td>
        <td className="px-3 py-3 align-middle text-right">
          {rightMeta}
        </td>
      </tr>

      {/* Content Row */}
      {open && (
        <tr className={cls(theme.border, "border-t")}>
          <td colSpan={3} className="px-3 py-4">
            {children}
          </td>
        </tr>
      )}
    </>
  );
}
function WidgetSelect({ theme, items, activeId, onChange }) {
  const [open, setOpen] = useState(false);
  const active = items.find(i => i.id === activeId) || items[0];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => { if (!e.target.closest?.("[data-select-root]")) setOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("click", onClick); };
  }, []);

  const IconEl = active?.icon || Icon.grid;

  return (
    <div data-select-root className="relative inline-block">
      {/* Selected pill — show ICON + TITLE, no description */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cls(
          "group px-3 py-2 pr-10 rounded-xl text-sm flex items-center gap-2 shadow-sm",
          theme.panel, theme.border, "border", theme.hover
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {IconEl && <IconEl className="w-4 h-4" />}
        <span className="font-medium">{active?.title}</span>
        <Icon.chevronDown className={cls("w-4 h-4 absolute right-2 transition-transform duration-200", open ? "rotate-180" : "")} />
      </button>

      {/* Menu */}
      {open && (
        <div
          role="listbox"
          className={cls(
            "absolute z-30 mt-2 w-[min(92vw,360px)] rounded-xl p-1 shadow-lg overflow-hidden",
            theme.panel, theme.border, "border"
          )}
        >
          {items.map((it) => {
            const isActive = it.id === activeId;
            const RowIcon = it.icon || Icon.grid;
            return (
              <button
                key={it.id}
                role="option"
                aria-selected={isActive}
                onClick={() => { onChange(it.id); setOpen(false); }}
                className={cls(
                  "w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors",
                  isActive ? theme.subtle : theme.hover
                )}
              >
                <RowIcon className="w-4 h-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{it.title}</div>
                  {/* descriptions allowed in menu if you want, but not required */}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
function RoleDashboard({ role, theme, announcements, onPost, currentUser, conversation, onSend }) {
// ===== Calendar state & helpers (add inside RoleDashboard, top-level) =====
const [calendarEvents, setCalendarEvents] = useState([
  // seed examples (types: "assignment" | "exam" | "assembly" | "sport" | "holiday" | "personal" | "conference" | "cancellation" | "dayoff")
  { id: "e1", title: "BIO101 Lab Report (Due)", type: "assignment", date: new Date().toISOString().slice(0,10), time: "17:00" },
  { id: "e2", title: "ENG201 Essay Draft (Due)", type: "assignment", date: new Date(Date.now()+86400000).toISOString().slice(0,10), time: "23:59" },
  { id: "e3", title: "Pep Rally Assembly", type: "assembly", date: new Date().toISOString().slice(0,10), time: "13:00" },
  { id: "e4", title: "Varsity Soccer @ Home", type: "sport", date: new Date(Date.now()+2*86400000).toISOString().slice(0,10), time: "19:00" },
  { id: "e5", title: "No School — Teacher Conference", type: "dayoff", date: new Date(Date.now()+3*86400000).toISOString().slice(0,10) },
]);

const EVENT_COLORS = {
  assignment: "bg-blue-100 text-blue-700 border-blue-200",
  exam: "bg-rose-100 text-rose-700 border-rose-200",
  assembly: "bg-amber-100 text-amber-800 border-amber-200",
  sport: "bg-emerald-100 text-emerald-700 border-emerald-200",
  holiday: "bg-lime-100 text-lime-800 border-lime-200",
  dayoff: "bg-neutral-200 text-neutral-800 border-neutral-300",
  cancellation: "bg-orange-100 text-orange-800 border-orange-200",
  conference: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  personal: "bg-slate-100 text-slate-700 border-slate-200",
};

function startOfWeek(d = new Date()) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0,0,0,0);
  return dt;
}

function endOfWeek(d = new Date()) {
  const s = startOfWeek(d);
  const e = new Date(s); e.setDate(s.getDate()+6); e.setHours(23,59,59,999);
  return e;
}

function fmtISO(d) { return d.toISOString().slice(0,10); }

  // --- Unified Dashboard Section Renderers (prefix = Dash to avoid collisions) ---
const DashAnnouncements = () => (
  <Composer
    theme={theme}
    role={role}
    items={announcements}
    canPost={isAdmin || isTeacher}
    onPost={onPost}
    currentUser={currentUser}
  />
);

// ===== Replace DashCalendar (inside RoleDashboard) =====
const DashCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "personal", date: fmtISO(new Date()), time: "" });

  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  const inWeek = calendarEvents.filter(ev => {
    const d = new Date(ev.date + "T00:00:00");
    return d >= weekStart && d <= weekEnd;
  }).sort((a,b) => (a.date + (a.time||"")).localeCompare(b.date + (b.time||"")));

  // Month grid
  const ym = { y: currentMonth.getFullYear(), m: currentMonth.getMonth() };
  const firstDow = new Date(ym.y, ym.m, 1).getDay() || 7; // 1..7 with Mon start
  const daysInMonth = new Date(ym.y, ym.m+1, 0).getDate();
  const cells = [];
  // leading blanks (Mon-start)
  for (let i=1;i<=(firstDow===0?6:firstDow-1);i++) cells.push(null);
  for (let d=1; d<=daysInMonth; d++) cells.push(new Date(ym.y, ym.m, d));

  const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth()-1, 1));
  const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth()+1, 1));
  const todayISO = fmtISO(new Date());

  const eventsByISO = calendarEvents.reduce((acc, ev) => {
    (acc[ev.date] ||= []).push(ev); return acc;
  }, {});

  const addEvent = () => {
    const t = form.title.trim();
    if (!t) return;
    setCalendarEvents(prev => [{ id: Math.random().toString(36).slice(2), ...form }, ...prev]);
    setForm({ title: "", type: "personal", date: fmtISO(new Date()), time: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      {/* This Week bar */}
      <section className={cls("rounded-2xl p-4", theme.panel, theme.border, "border")}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-base font-semibold tracking-tight">This Week</div>
          <div className={cls("text-xs", theme.alt)}>
            {weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – {weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </div>
          <div className="flex-1" />
          <button onClick={() => setShowForm(v=>!v)} className={cls("px-3 py-2 rounded-lg inline-flex items-center gap-2", theme.cta)}>
            <Icon.plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        {/* Add Event form (inline) */}
        {showForm && (
          <div className={cls("rounded-xl p-3 mb-3 grid grid-cols-1 sm:grid-cols-4 gap-3", theme.border, "border")}>
            <input
              value={form.title}
              onChange={e=>setForm({...form, title: e.target.value})}
              placeholder="Event title"
              className={cls("px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
            />
            <select
              value={form.type}
              onChange={e=>setForm({...form, type: e.target.value})}
              className={cls("px-3 py-2 rounded-lg bg-transparent", theme.border, "border")}
            >
              {["assignment","exam","assembly","sport","holiday","dayoff","cancellation","conference","personal"].map(t=>(
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={e=>setForm({...form, date: e.target.value})}
              className={cls("px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={form.time}
                onChange={e=>setForm({...form, time: e.target.value})}
                className={cls("px-3 py-2 rounded-lg outline-none bg-transparent flex-1", theme.border, "border")}
              />
              <button onClick={addEvent} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Save</button>
            </div>
          </div>
        )}

        {/* Week items — clean text styling & separation */}
        <ul className="space-y-2">
          {inWeek.length === 0 && (
            <li className={cls("text-sm", theme.alt)}>No events this week.</li>
          )}
          {inWeek.map(ev => {
            const badge = EVENT_COLORS[ev.type] || EVENT_COLORS.personal;
            const when = new Date(ev.date + "T" + (ev.time || "00:00"));
            return (
              <li key={ev.id} className={cls("p-2 rounded-lg flex items-center gap-3", theme.border, "border")}>
                <span className={cls("text-[11px] px-2 py-0.5 rounded-full border", badge)}>
                  {ev.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{ev.title}</div>
                  <div className={cls("text-xs", theme.alt)}>
                    {when.toLocaleDateString(undefined, { weekday:"short", month:"short", day:"numeric" })}
                    {ev.time ? ` • ${ev.time}` : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Custom Month Calendar */}
      <section className={cls("rounded-2xl p-4", theme.panel, theme.border, "border")}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={prevMonth} className={cls("p-2 rounded-lg", theme.btn, theme.hover)} aria-label="Prev month">‹</button>
          <div className="text-base font-semibold tracking-tight">
            {currentMonth.toLocaleDateString(undefined, { month:"long", year:"numeric" })}
          </div>
          <button onClick={nextMonth} className={cls("p-2 rounded-lg", theme.btn, theme.hover)} aria-label="Next month">›</button>
          <div className="flex-1" />
          <button onClick={()=>setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} className={cls("px-2.5 py-1.5 rounded-lg text-xs", theme.btn, theme.hover)}>Today</button>
        </div>

        {/* Weekday header (Mon start) */}
        <div className="grid grid-cols-7 text-xs font-medium mb-2">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
            <div key={d} className={cls("px-2 py-1", theme.alt)}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-2">
          {cells.map((d, i) => {
            if (!d) return <div key={`b${i}`} className="h-24 rounded-xl" />;
            const iso = fmtISO(d);
            const dayEvents = eventsByISO[iso] || [];
            const isToday = iso === todayISO;
            return (
              <div key={iso} className={cls("h-28 rounded-xl p-2 flex flex-col gap-1", theme.border, "border", isToday ? "ring-1 ring-blue-400" : "")}>
                <div className="text-xs font-medium">{d.getDate()}</div>
                <div className="flex-1 overflow-auto space-y-1">
                  {dayEvents.slice(0,3).map(ev => {
                    const badge = EVENT_COLORS[ev.type] || EVENT_COLORS.personal;
                    return (
                      <div key={ev.id} className={cls("text-[11px] px-2 py-1 rounded-md border truncate", badge)} title={`${ev.title}${ev.time?` • ${ev.time}`:""}`}>
                        {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <div className={cls("text-[11px]", theme.alt)}>+{dayEvents.length-3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const DashInbox = () => {
  const threads = Object.keys(conversation || {});
  return (
    <div className="space-y-3">
      <div className={cls("text-xs uppercase tracking-wide font-medium", theme.alt)}>Threads</div>
      {threads.length === 0 && <div className={cls("text-sm", theme.alt)}>No messages yet.</div>}
      <ul className="space-y-2">
        {threads.map(t => {
          const msgs = conversation[t] || [];
          const last = msgs[msgs.length-1];
          return (
            <li key={t} className={cls("p-2 rounded-lg", theme.border, "border")}>
              <div className="flex items-center gap-2">
                <Avatar name={t} />
                <div className="flex-1">
                  <div className="font-medium">{t}</div>
                  {last && <div className={cls("text-xs", theme.alt)}>{last.from}: {last.text}</div>}
                </div>
                <button onClick={()=>onSend?.(t, { from: "You", text: "On my way" })} className={cls("px-2 py-1 rounded text-xs", theme.btn, theme.hover)}>Quick reply</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const DashTasks = () => {
  const toggle = (id) => setTasks(prev => prev.map(t => t.id===id ? ({...t, done: !t.done}) : t));
  return (
    <div className="space-y-3">
      <ul className="space-y-2 text-sm">
        {tasks.map(t=>(
          <li key={t.id} className={cls("p-2 rounded-lg flex items-center gap-2 justify-between", theme.border, "border")}>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={t.done} onChange={()=>toggle(t.id)} />
              <span className={cls(t.done && "line-through opacity-60")}>{t.text}</span>
            </div>
            <span className={cls("px-2 py-0.5 rounded text-xs", theme.chip)}>{t.due}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashPinned = () => (
  <div className="space-y-3">
    <ul className="flex flex-wrap gap-2">
      {pinned.map(p => (
        <li key={p.id}><a href={p.href} className={cls("px-2.5 py-1.5 rounded-lg text-sm", theme.btn, theme.hover)}>{p.label}</a></li>
      ))}
    </ul>
    <button onClick={()=>setPinned(prev=>[...prev, { id: Math.random().toString(36).slice(2), label: "New note", href:"#"}])} className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Add pinned</button>
  </div>
);

const DashFiles = () => (
  <div className="space-y-3">
    {(isAdmin || isTeacher) && (
      <div className="flex items-center gap-2">
        <input type="file" multiple onChange={(e)=> {
          const list = Array.from(e.target.files || []);
          const mapped = list.map((f) => ({ id: Math.random().toString(36).slice(2), name: f.name, url: URL.createObjectURL(f) }));
          setFiles((prev) => [...mapped, ...prev]);
        }} className="text-xs" />
        <span className={cls("text-xs", theme.alt)}>Upload class resources</span>
      </div>
    )}
    <ul className="space-y-2 text-sm">
      {files.map(f => (
        <li key={f.id} className={cls("p-2 rounded-lg flex items-center justify-between", theme.border, "border")}>
          <span className="truncate">{f.name}</span>
          {f.url ? <a href={f.url} target="_blank" rel="noreferrer" className={cls("px-2 py-1 rounded text-xs", theme.btn, theme.hover)}>Open</a> : <span className={cls("text-xs", theme.alt)}>remote</span>}
        </li>
      ))}
    </ul>
  </div>
);

const DashNotes = () => {
  const [title, setTitle] = useState("");
  const [textN, setTextN] = useState("");
  const [share, setShare] = useState(role==="Admin" ? ["Admin","Faculty"] : ["Students"]);
  const save = () => {
    if (!title.trim()) return;
    setNotes(prev => [{ id: Math.random().toString(36).slice(2), title: title.trim(), text: textN.trim(), sharedWith: share }, ...prev]);
    setTitle(""); setTextN("");
  };
  return (
    <div className="space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Note title" className={cls("w-full px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} />
      <textarea value={textN} onChange={e=>setTextN(e.target.value)} rows={3} placeholder="Note content…" className={cls("w-full px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} />
      <div className="flex flex-wrap gap-2">
        {["Admin","Faculty","Students","Parents"].map(t => (
          <button key={t} onClick={() => setShare(s => s.includes(t) ? s.filter(x=>x!==t) : [...s, t])} className={cls("px-2.5 py-1.5 rounded-full text-xs", share.includes(t) ? theme.chip : theme.hover, theme.btn)}>{t}</button>
        ))}
      </div>
      <div className="flex justify-end"><button onClick={save} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Save</button></div>
      <ul className="space-y-2">
        {notes.map(n => (
          <li key={n.id} className={cls("p-2 rounded-lg", theme.border, "border")}>
            <div className="font-medium">{n.title}</div>
            <div className={cls("text-xs", theme.alt)}>{n.sharedWith.join(" • ")}</div>
            {n.text && <div className={cls("text-sm mt-1", theme.textMuted)}>{n.text}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashAddressBook = () => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "Student", email: "", phone: "" });

  const save = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) return;
    setContacts(prev => [
      { id: Math.random().toString(36).slice(2), name, role: form.role, email, phone: form.phone?.trim() || "" },
      ...prev
    ]);
    setForm({ name: "", role: "Student", email: "", phone: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowForm(v => !v)}
          className={cls("px-3 py-2 rounded-lg inline-flex items-center gap-2", theme.cta)}
          title={showForm ? "Close" : "Add Contact"}
        >
          <Icon.userPlus className="w-4 h-4" />
          <span className="text-sm font-medium">{showForm ? "Close" : "Add Contact"}</span>
        </button>
      </div>

      {/* Inline Add Contact form */}
      {showForm && (
        <div className={cls("rounded-xl p-4 space-y-3", theme.panel, theme.border, "border")}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={cls("text-xs", theme.alt)}>Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className={cls("w-full px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
              />
            </div>
            <div className="space-y-1">
              <label className={cls("text-xs", theme.alt)}>Role</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className={cls("w-full px-3 py-2 rounded-lg bg-transparent", theme.border, "border")}
              >
                {["Admin","Faculty","Teacher","Student","Parent"].map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className={cls("text-xs", theme.alt)}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.edu"
                className={cls("w-full px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
              />
            </div>
            <div className="space-y-1">
              <label className={cls("text-xs", theme.alt)}>Phone (optional)</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className={cls("w-full px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className={cls("px-3 py-2 rounded-lg", theme.btn, theme.hover)}>Cancel</button>
            <button onClick={save} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Save Contact</button>
          </div>
        </div>
      )}

      {/* Contacts list */}
      <ul className="space-y-2 text-sm">
        {contacts.map(c => (
          <li key={c.id} className={cls("p-2 rounded-lg flex items-center gap-3", theme.border, "border")}>
            <Avatar name={c.name} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{c.name}</div>
              <div className={cls("text-xs", theme.alt)}>
                {c.role} • {c.email}{c.phone ? ` • ${c.phone}` : ""}
              </div>
            </div>
            <a href={`mailto:${c.email}`} className={cls("px-2 py-1 rounded text-xs", theme.btn, theme.hover)}>Email</a>
          </li>
        ))}
        {contacts.length === 0 && (
          <li className={cls("p-3 rounded-lg text-center", theme.border, "border", theme.alt)}>
            No contacts yet. Click “Add Contact” to create one.
          </li>
        )}
      </ul>
    </div>
  );
};

const DashProgress = () => {
  const GPA = isTeacher || role==="Student" ? "3.6" : "—";
  const kudos = 4;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={cls("p-3 rounded-lg text-center", theme.border, "border")}><div className="text-xs">Overall GPA</div><div className="text-xl font-semibold">{GPA}</div></div>
        <div className={cls("p-3 rounded-lg text-center", theme.border, "border")}><div className="text-xs">Improvements</div><div className="text-xl font-semibold">+2</div></div>
        <div className={cls("p-3 rounded-lg text-center", theme.border, "border")}><div className="text-xs">Kudos</div><div className="text-xl font-semibold">{kudos}</div></div>
      </div>
      <div className={cls("text-xs", theme.alt)}>Recent progress includes higher ENG201 essay scores and improved BIO101 labs.</div>
    </div>
  );
};

const DashActivity = () => (
  <div className="space-y-3">
    {activity.map(a => (
      <div key={a.id} className={cls("p-2 rounded-lg", theme.border, "border")}>
        <div className="text-sm">{a.text}</div>
        <div className={cls("text-xs", theme.alt)}>{new Date(a.ts).toLocaleString()}</div>
      </div>
    ))}
  </div>
);

const DashTrends = () => (
  <div className="space-y-3">
    <div className={cls("h-40 rounded-xl flex items-center justify-center", theme.border, "border")}>
      Trend chart placeholder (attendance, grades, engagement)
    </div>
    <div className={cls("text-xs", theme.alt)}>Last 4 weeks across selected classes.</div>
    {isAdmin && <button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Configure metrics</button>}
  </div>
);
// --- Unified Dashboard Sections (temporary stubs / wrappers) ---
const AnnouncementsSection = () => (
  <Composer
    theme={theme}
    role={role}
    items={announcements}
    canPost={isAdmin || isTeacher}
    onPost={onPost}
    currentUser={currentUser}
  />
);

const CalendarSection = () => (
  <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.calendar className="w-5 h-5" /> Calendar
    </h2>
    <p className={theme.alt}>[Calendar Widget Placeholder — upcoming events, due dates, etc.]</p>
  </div>
);

const InboxSection = () => (
  <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.inbox className="w-5 h-5" /> Inbox Overview
    </h2>
    <p className={theme.alt}>[Inbox messages and notifications will appear here]</p>
  </div>
);

const TasksSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.tasks className="w-5 h-5" /> Tasks & Goals
    </h2>
    <ul className="list-disc pl-6 text-sm space-y-1">
      <li>Submit FAFSA</li>
      <li>Return permission slip</li>
      <li>Prepare presentation draft</li>
    </ul>
  </div>
);

const PinnedSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.pin className="w-5 h-5" /> Pinned
    </h2>
    <p className={theme.alt}>[Quick links and notes pinned by user]</p>
  </div>
);

const FilesSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.file className="w-5 h-5" /> Files
    </h2>
    <p className={theme.alt}>[Uploaded materials will appear here]</p>
  </div>
);

const NotesSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.note className="w-5 h-5" /> Notes
    </h2>
    <p className={theme.alt}>[Collaborative or personal notes go here]</p>
  </div>
);

const AddressBookSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.addressBook className="w-5 h-5" /> Address Book
    </h2>
    <p className={theme.alt}>[Contact list and directory info here]</p>
  </div>
);

const ProgressSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.progress className="w-5 h-5" /> Progress Overview
    </h2>
    <p className={theme.alt}>[Performance metrics, GPA, kudos, etc.]</p>
  </div>
);

const ActivitySection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.activity className="w-5 h-5" /> Recent Activity
    </h2>
    <p className={theme.alt}>[System activity log or user actions summary]</p>
  </div>
);

const TrendsSection = () => (
  <div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}>
    <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
      <Icon.trends className="w-5 h-5" /> Trend Snapshot
    </h2>
    <p className={theme.alt}>[Trend visualization and analytics go here]</p>
  </div>
);
  // ---- role flags / permissions ----
  const isAdmin = role === "Admin";
  const isTeacher = role === "Teacher";
  const canManageClass = isAdmin || isTeacher;

  // ---- local state for feature data (same as before) ----
  const [notes, setNotes] = useState([
    { id: "n1", title: "Staff Meeting Notes", text: "Agenda, follow-ups", sharedWith: ["Admin"] },
  ]);
  const [files, setFiles] = useState([
    { id: "f1", name: "ENG201_essay_template.docx", url: "" },
  ]);
  const [tasks, setTasks] = useState([
    { id: "task1", text: "FAFSA application", due: "Oct 15", done: false },
    { id: "task2", text: "Permission slip: Science Museum", due: "Oct 12", done: false },
  ]);
  const [pinned, setPinned] = useState([
    { id: "p1", label: "Gradebook", href: "#" },
    { id: "p2", label: "District Calendar", href: "#" },
  ]);
  const [contacts, setContacts] = useState([
    { id: "c1", name: "Ava Carter", role: "Student", email: "ava@example.edu" },
    { id: "c2", name: "Leo Kim", role: "Teacher", email: "leo@example.edu" },
  ]);
  const [activity, setActivity] = useState([
    { id: "ra1", text: "ENG201 files uploaded", ts: new Date().toISOString() },
    { id: "ra2", text: "New message from Registrar", ts: new Date(Date.now()-3600e3).toISOString() },
  ]);

  // Calendar — today + events
  const today = new Date();
  const todayStr = today.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  const todayEvents = [
    { time: "08:00", title: "BIO101 - Lab", due: false },
    { time: "10:00", title: "ENG201 - Essay Draft (Due)", due: true },
  ];

  // Upload handler (local preview only)
  const onUploadFiles = (e) => {
    const list = Array.from(e.target.files || []);
    const mapped = list.map((f) => ({ id: Math.random().toString(36).slice(2), name: f.name, url: URL.createObjectURL(f) }));
    setFiles((prev) => [...mapped, ...prev]);
  };

  // ---- sections (options for the dropdown) ----
    const sections = [
  { id: "announcements", title: isAdmin ? "District Announcements" : "Announcements", icon: Icon.bell,      render: DashAnnouncements },
  { id: "calendar",      title: "Calendar",                                  icon: Icon.calendar,  render: DashCalendar },
  { id: "inbox",         title: "Inbox",                                     icon: Icon.inbox,     render: DashInbox },
  { id: "tasks",         title: "Tasks",                                     icon: Icon.tasks,     render: DashTasks },
  { id: "pinned",        title: "Pinned",                                    icon: Icon.pin,       render: DashPinned },
  { id: "files",         title: "Files",                                     icon: Icon.file,      render: DashFiles },
  { id: "notes",         title: "Notes",                                     icon: Icon.note,      render: DashNotes },
  { id: "addressbook",   title: "Address Book",                              icon: Icon.addressBook,render: DashAddressBook },
  { id: "progress",      title: "Progress Overview",                         icon: Icon.progress,  render: DashProgress },
  { id: "activity",      title: "Recent Activity",                           icon: Icon.activity,  render: DashActivity },
  { id: "trends",        title: "Trend Snapshot",                            icon: Icon.trends,    render: DashTrends },
];

  // ---- active section + smooth transition ----
  const [activeId, setActiveId] = useState(sections[0].id);
  const [fade, setFade] = useState(true);
  const active = sections.find(s => s.id === activeId) || sections[0];

  const handleChange = (id) => {
    if (id === activeId) return;
    setFade(false);
    // Let fade-out complete before swapping
    setTimeout(() => {
      setActiveId(id);
      setFade(true); // fade in new section
    }, 140); // 140ms out + 160ms in = smooth
  };

  return (
    <div className="space-y-4">
      {/* Top bar: selector */}
      <div className="flex items-center gap-3">
          <WidgetSelect
          theme={theme}
          items={sections.map(s => ({ id: s.id, title: s.title, icon: s.icon }))}
          activeId={activeId}
          onChange={handleChange}
        />
        <div className="flex-1" />
      </div>

      {/* Content card */}
      <section className={cls("rounded-2xl", theme.border, "border", theme.panel, "overflow-hidden")}>
        <header className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b")}>
          {active.icon && <active.icon className="w-6 h-6" />}
          <h3 className="font-medium tracking-tight">{active.title}</h3>
          <div className="flex-1" />
          {/* no subtitle text; icon serves as sub-header accent */}
        </header>

        <div
          key={active.id} // ensures enter animation on change
          className={cls(
            "p-4 text-sm transform transition-all ease-out",
            fade ? "opacity-100 translate-y-0 duration-200" : "opacity-0 -translate-y-1 duration-150"
          )}
        >
          <active.render />
        </div>
      </section>
    </div>
  );
}

function AnnouncementsPage({ theme, role, items, onPost, currentUser }) {
  const canPost = role === "Admin" || role === "Teacher";
  return (
    <div className={cls("rounded-2xl p-6 space-y-3", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold">Announcements</h2>
      <Composer
        theme={theme}
        role={role}
        items={items}
        canPost={canPost}
        onPost={onPost}
        currentUser={currentUser}
      />
    </div>
  );
}
function SchedulingPage({ theme }) {
  const blocks = [
    { time: "08:00", title: "BIO101 — Lab", where: "B214" },
    { time: "10:00", title: "ENG201 — Seminar", where: "C105" },
    { time: "13:30", title: "Office Hours", where: "D201" },
  ];
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <div className="flex items-center gap-3">
        <Icon.calendar className="w-5 h-5" />
        <h2 className="font-semibold">Scheduling</h2>
      </div>
      <div className={cls("rounded-xl p-4", theme.border, "border")}>
        {blocks.map((b,i)=>(
          <div key={i} className="flex items-center gap-4 py-2 text-sm">
            <div className="w-20 font-medium">{b.time}</div>
            <div className="flex-1">{b.title}</div>
            <div className={cls(theme.alt)}>{b.where}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function AnalyticsPage({ theme }) {
  const cards = [
    { k: "Attendance", v: "96%", hint: "+1.2% WoW" },
    { k: "On-time Submissions", v: "92%", hint: "+0.8%" },
    { k: "At-Risk Flags", v: "12", hint: "-3 vs last week" }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {cards.map((c,i)=>(
        <section key={i} className={cls("rounded-2xl", theme.border, "border", theme.panel, "col-span-12 sm:col-span-6 lg:col-span-4")}>
          <header className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b")}>
            <Icon.trends className="w-5 h-5" />
            <h3 className="font-medium tracking-tight">{c.k}</h3>
          </header>
          <div className={cls("p-4")}>
            <div className="text-2xl font-semibold">{c.v}</div>
            <div className={cls("text-xs mt-1", theme.alt)}>{c.hint}</div>
          </div>
        </section>
      ))}
      <section className={cls("rounded-2xl", theme.border, "border", theme.panel, "col-span-12")}>
        <header className={cls("flex items-center gap-3 px-4 py-3", theme.border, "border-b")}>
          <Icon.trends className="w-5 h-5" />
          <h3 className="font-medium tracking-tight">Trends</h3>
        </header>
        <div className={cls("p-4 h-48 rounded-xl flex items-center justify-center", theme.border, "border mx-4 mb-4")}>
          Chart placeholder
        </div>
      </section>
    </div>
  );
}
function PeoplePage({ theme }) {
  const rows = [
    { name: "Ava Carter", role: "Teacher", dept: "Biology" },
    { name: "Leo Kim", role: "Student", dept: "ENG201" },
    { name: "M. Patel", role: "Admin", dept: "Registrar" }
  ];
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <div className="flex items-center gap-3">
        <Icon.addressBook className="w-5 h-5" />
        <h2 className="font-semibold">People</h2>
      </div>
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
            {rows.map((r,i)=>(
              <tr key={i} className={cls(i%2 ? "bg-black/5" : "", "border-t", theme.border)}>
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
function CoursesPage({ theme }) { const [openIdx, setOpenIdx] = useState(null); const courses = [ { code: "BIO101", title: "Intro Biology", students: 28, sections: ["Week 1: Cells", "Week 2: Genetics", "Week 3: Evolution"] }, { code: "ENG201", title: "Composition II", students: 24, sections: ["Essay Structure", "Rhetoric", "Peer Review"] } ]; return (<div className="grid grid-cols-12 gap-4">{courses.map((c, i) => (<Card key={i} title={`${c.code} — ${c.title}`} size="lg" theme={theme} actions={<button onClick={() => setOpenIdx(openIdx === i ? null : i)} className={cls("px-2 py-1 text-xs rounded", theme.btn, theme.hover)}>{openIdx === i ? "Hide Sections" : "Show Sections"}</button>}><div>Enrolled: {c.students}</div>{openIdx === i && (<div className={cls("mt-3 rounded-xl p-3", theme.border, "border")}><div className="text-sm font-medium mb-2">Sections</div><ul className="text-sm list-disc pl-5 space-y-1">{c.sections.map((s, si) => (<li key={si}>{s}</li>))}</ul><div className="mt-3 flex gap-2"><button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Add Lesson</button><button className={cls("px-2.5 py-1.5 rounded-lg", theme.btn, theme.hover)}>Upload File</button></div></div>)}</Card>))}</div>); }
function GradebookPage({ theme }) { const [rows, setRows] = useState([ { student: "A. Lopez", a1: 92, a2: 88, a3: 100 }, { student: "B. Nguyen", a1: 84, a2: 90, a3: 86 }, { student: "C. Brown", a1: 77, a2: 82, a3: 80 } ]); const editCell = (ri, key, val) => { const v = Number(val); if (Number.isNaN(v)) return; setRows(rows.map((r, i) => (i === ri ? { ...r, [key]: v } : r))); }; return (<div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}><h2 className="font-semibold mb-3">Gradebook</h2><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead><tr className="text-left"><th className="px-3 py-2">Student</th><th className="px-3 py-2">Assignment 1</th><th className="px-3 py-2">Assignment 2</th><th className="px-3 py-2">Assignment 3</th></tr></thead><tbody>{rows.map((r, i) => (<tr key={i} className={cls(i % 2 ? "bg-black/5" : "", "border-t", theme.border)}><td className="px-3 py-2">{r.student}</td>{["a1","a2","a3"].map((k, ki) => (<td key={ki} className="px-3 py-2"><input defaultValue={r[k]} onBlur={(e) => editCell(i, k, e.target.value)} className={cls("w-20 px-2 py-1 rounded bg-transparent", theme.border, "border outline-none")} /></td>))}</tr>))}</tbody></table></div></div>); }
function AssessmentsPage({ theme }) { const [prompt, setPrompt] = useState(""); const [questions, setQuestions] = useState([]); const generate = () => { setQuestions(["Define photosynthesis.", "Explain the role of mitochondria.", "Describe the cell membrane.", "What is osmosis?", "Differentiate DNA and RNA."]); }; return (<div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}><h2 className="font-semibold">Smart Assessment Builder</h2><div className="flex items-center gap-2"><input value={prompt} onChange={(e) => setPrompt(e.target.value)} className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} placeholder="Paste notes or topic (e.g., Chapter 5: Cells)…" /><button onClick={generate} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Generate Questions</button></div><ul className="list-disc pl-6 text-sm">{questions.map((q, i) => (<li key={i} className="py-1">{q}</li>))}</ul></div>); }
function MyClassesPage({ theme }) { const classes = ["BIO101", "ENG201", "MATH150", "HIST210"]; return (<div className="grid grid-cols-12 gap-4">{classes.map((c, i) => (<Card key={i} title={c} size="md" theme={theme}><div>Latest: New materials uploaded.</div><div className="mt-3"><button className={cls("px-3 py-2 rounded-lg", theme.btn, theme.hover)}>Open</button></div></Card>))}</div>); }
function AssignmentsPage({ theme }) { const items = [ { course: "BIO101", title: "Lab Report", due: "Tue" }, { course: "ENG201", title: "Essay Draft", due: "Fri" } ]; return (<div className={cls("rounded-2xl p-6", theme.panel, theme.border, "border")}><h2 className="font-semibold mb-3">Assignments</h2><ul className="space-y-2 text-sm">{items.map((x, i) => (<li key={i} className={cls("p-3 rounded-lg flex items-center justify-between", theme.border, "border")}> <span className="font-medium">{x.course}: {x.title}</span><span className={cls("px-2 py-1 rounded text-xs", theme.chip)}>Due {x.due}</span></li>))}</ul></div>); }
function StudyPage({ theme }) { const [topic, setTopic] = useState(""); const [cards, setCards] = useState([]); const makeCards = () => setCards([ { q: "What is photosynthesis?", a: "Process plants use to convert light to energy." }, { q: "Function of mitochondria?", a: "Powerhouse; ATP production." }, { q: "Define osmosis.", a: "Diffusion of water across a membrane." } ]); return (<div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}><h2 className="font-semibold">Lyra Study Assistant</h2><div className="flex items-center gap-2"><input value={topic} onChange={(e) => setTopic(e.target.value)} className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} placeholder="Topic or paste notes…" /><button onClick={makeCards} className={cls("px-3 py-2 rounded-lg", theme.cta)}>Generate Flashcards</button></div><div className="grid grid-cols-12 gap-3">{cards.map((c, i) => (<div key={i} className={cls("col-span-12 sm:col-span-6 lg:col-span-4 p-4 rounded-xl", theme.border, "border")}><div className="font-medium mb-2">Q: {c.q}</div><div className="text-sm">A: {c.a}</div></div>))}</div></div>); }
function SettingsPage({ theme, themeKey, setThemeKey, sidebarCollapsed, setSidebarCollapsed }) {
  return (
    <div className={cls("rounded-2xl p-6 space-y-4", theme.panel, theme.border, "border")}>
      <h2 className="font-semibold">Settings</h2>

      <div>
        <SectionTitle theme={theme}>Appearance</SectionTitle>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.keys(THEMES).map((k) => (
            <button key={k} onClick={()=>setThemeKey(k)} className={cls("px-2.5 py-1.5 rounded-lg text-sm flex items-center gap-2", theme.btn, theme.hover, themeKey===k && theme.chip)}>
              <span className={cls("inline-block w-4 h-4 rounded-full", THEMES[k].swatch, "ring-1 ring-black/10")} /> {THEMES[k].name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle theme={theme}>Layout</SectionTitle>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={sidebarCollapsed} onChange={(e)=>setSidebarCollapsed(e.target.checked)} />
          Collapse sidebar by default
        </label>
      </div>

      <div className={cls("text-xs", theme.alt)}>Settings are saved immediately.</div>
    </div>
  );
}
function MessagesPage({ theme, conversation, onSend }) {
  const [active, setActive] = useState(() => Object.keys(conversation || {})[0] || "");
  const [input, setInput] = useState("");

  const threads = Object.keys(conversation || {});
  const msgs = active ? (conversation[active] || []) : [];

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className={cls("col-span-12 lg:col-span-4 rounded-2xl", theme.panel, theme.border, "border")}>
        <header className={cls("px-4 py-3", theme.border, "border-b")}><h3 className="font-medium">Inbox</h3></header>
        <div className="p-2">
          {threads.length === 0 && <div className={cls("text-sm p-3 rounded-lg", theme.border, "border", theme.alt)}>No messages yet.</div>}
          <ul className="space-y-2">
            {threads.map(t => {
              const last = (conversation[t] || [])[ (conversation[t]||[]).length - 1 ];
              return (
                <li key={t}>
                  <button onClick={()=>setActive(t)} className={cls("w-full text-left px-3 py-2 rounded-lg flex items-center gap-2", theme.hover, active===t && theme.subtle)}>
                    <Avatar name={t} />
                    <div className="flex-1">
                      <div className="font-medium">{t}</div>
                      {last && <div className={cls("text-xs truncate", theme.alt)}>{last.from}: {last.text}</div>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={cls("col-span-12 lg:col-span-8 rounded-2xl flex flex-col", theme.panel, theme.border, "border")}>
        <header className={cls("px-4 py-3 flex items-center gap-2", theme.border, "border-b")}>
          <h3 className="font-medium">{active || "Select a thread"}</h3>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={cls("p-3 rounded-xl", theme.border, "border", theme.panel)}>
              <div className="text-xs opacity-70 mb-1">{m.from}</div>
              <div className="text-sm">{m.text}</div>
            </div>
          ))}
          {!active && <div className={cls("text-sm", theme.alt)}>Choose a conversation on the left.</div>}
        </div>
        <div className={cls("p-3 flex items-center gap-2", theme.border, "border-t")}>
          <input value={input} onChange={(e)=>setInput(e.target.value)} className={cls("flex-1 px-3 py-2 rounded-lg outline-none bg-transparent", theme.border, "border")} placeholder={active ? `Message ${active}…` : "Select a thread to message…"} disabled={!active} />
          <button className={cls("px-3 py-2 rounded-lg", theme.cta)} onClick={()=>{ if (!input.trim() || !active) return; onSend?.(active, { from: "You", text: input.trim() }); setInput(""); }}>Send</button>
        </div>
      </section>
    </div>
  );
}

// ---------- Router ----------
// Signature:
function PageRouter({ role, current, theme, announcements, postAnnouncement, currentUser, conversation, onSend, themeKey, setThemeKey, sidebarCollapsed, setSidebarCollapsed }) {

// Dashboard (top of router):
if (current === "Dashboard")
  return <RoleDashboard role={role} theme={theme} announcements={announcements} onPost={postAnnouncement} currentUser={currentUser} conversation={conversation} onSend={onSend} />;

// Settings
if (current === "Settings") return <SettingsPage theme={theme} themeKey={themeKey} setThemeKey={setThemeKey} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />;

// Messages (all roles)
if (current === "Messages") return <MessagesPage theme={theme} conversation={conversation} onSend={onSend} />;

// Admin
if (role === "Admin" && current === "Announcements")
  return <AnnouncementsPage theme={theme} role={role} items={announcements} onPost={postAnnouncement} currentUser={currentUser} />;

// Teacher
if (role === "Teacher" && current === "Announcements")
  return <AnnouncementsPage theme={theme} role={role} items={announcements} onPost={postAnnouncement} currentUser={currentUser} />;

// Student
if (role === "Student" && current === "Announcements")
  return <AnnouncementsPage theme={theme} role={role} items={announcements} onPost={postAnnouncement} currentUser={currentUser} />;

// Parent
if (role === "Parent" && current === "Announcements")
  return <AnnouncementsPage theme={theme} role={role} items={announcements} onPost={postAnnouncement} currentUser={currentUser} />;

  // Fallback
  return (
    <div className={cls("rounded-2xl p-6 text-sm", theme.panel, theme.border, "border")}>
      <p className="mb-2">This route (<span className="font-medium">{current}</span>) is not implemented yet.</p>
      <p>Use the sidebar to open a different page.</p>
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
  const [initialDM, setInitialDM] = useState("");
  const [conversation, setConversation] = useState({});
  const onSend = (name, msg) => { setConversation((prev) => ({ ...prev, [name]: [ ...(prev[name]||[]), msg ] })); };
  const theme = useMemo(() => THEMES[themeKey] || THEMES.lightBlue, [themeKey]);
    // Shared announcements across dashboard widget & Announcements page
const [announcements, setAnnouncements] = useState([
  {
    id: "ann-seed-1",
    fromName: "Registrar",
    fromRole: "Admin",
    fromPhoto: "",
    body: "Welcome back! Quarter begins Monday.",
    audience: ["Admin", "Faculty", "Students", "Parents"],
    ts: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
]);

// Very simple current user (for avatar/name in posts)
const currentUser = { name: role === "Admin" ? "District Admin" : role === "Teacher" ? "Ms. Carter" : "User", photoUrl: "" };

// Posting handler (append)
const postAnnouncement = (a) => setAnnouncements((prev) => [a, ...prev]);

  const onNavigate = (key) => {
    if (key === "Dashboard") setCurrent("Dashboard");
    if (key === "Messages") setMessagesOpen(true);
  };

  const onChangeRole = (r) => { setRole(r); setCurrent("Dashboard"); };
  const onStartDM = (name) => { setInitialDM(name); setMessagesOpen(true); };

  useEffect(() => { setCurrent("Dashboard"); }, [role]);

  return (
    <div className={cls("min-h-dvh", theme.bg, theme.text)}>
      <TopBar
        role={role}
        onNavigate={onNavigate}
        onChangeRole={onChangeRole}
        onOpenNotifications={() => setNotificationsOpen(true)}
        theme={theme}
        themeKey={themeKey}
        setThemeKey={setThemeKey}
        onStartDM={onStartDM}
      />
      <div className="flex">
        <Sidebar
          role={role}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          current={current}
          setCurrent={setCurrent}
          theme={theme}
        />
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
  <div className="flex items-center gap-3 flex-wrap">
    <h1 className="text-xl font-semibold tracking-tight">{current}</h1>
    <div className="flex-1" />
    {/* (Role selector removed here; lives in TopBar now) */}
  </div>
</div>

          <div className="px-4 sm:px-6 lg:px-8 pb-16">
            <PageRouter
  role={role}
  current={current}
  theme={theme}
  announcements={announcements}
  postAnnouncement={postAnnouncement}
  currentUser={currentUser}
  conversation={conversation}
  onSend={onSend}
  themeKey={themeKey}
  setThemeKey={setThemeKey}
  sidebarCollapsed={sidebarCollapsed}
  setSidebarCollapsed={setSidebarCollapsed}
/>
          </div>
        </main>
      </div>

      <MessagesDrawer
        open={messagesOpen}
        onClose={() => setMessagesOpen(false)}
        theme={theme}
        initialRecipient={initialDM}
        conversation={conversation}
        onSend={onSend}
      />
      
      <NotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} theme={theme} />

      <footer className={cls("px-4 sm:px-6 lg:px-8 py-4 text-xs", theme.panel, theme.border, "border-t", theme.alt)}>
        <div className="flex items-center gap-2">
          <span>Lyra • Unified Education OS</span>
          <span className="mx-1">•</span>
          <span>Preview Wireframe</span>
        </div>
      </footer>
    </div>
  );
}
