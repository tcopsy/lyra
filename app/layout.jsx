import "./globals.css";
export const metadata = { title: "Lyra — Unified Education OS", description: "All-in-one education platform" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
