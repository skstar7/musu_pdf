import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, FileText } from "lucide-react";
import { tools } from "../../config/tools";
import { Button } from "../ui/Button";

export function Navbar() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const cancelPendingClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openTools = () => {
    cancelPendingClose();
    setToolsOpen(true);
  };

  const scheduleClose = () => {
    cancelPendingClose();
    closeTimerRef.current = window.setTimeout(() => {
      setToolsOpen(false);
      closeTimerRef.current = null;
    }, 140);
  };

  const closeTools = () => setToolsOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
            <FileText size={16} />
          </div>
          <span className="text-base font-bold tracking-tight">Musu PDF</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
          <div
            className="relative"
            onMouseEnter={openTools}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 text-foreground/90 hover:text-foreground"
              onClick={() => setToolsOpen((current) => !current)}
              aria-expanded={toolsOpen}
              aria-haspopup="menu"
            >
              All Tools
              <ChevronDown size={14} className={toolsOpen ? "rotate-180 transition" : "transition"} />
            </button>
            <div
              className={`absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl border border-border bg-white p-3 shadow-soft transition ${
                toolsOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
              role="menu"
              onMouseEnter={openTools}
              onMouseLeave={scheduleClose}
            >
              <div className="max-h-64 overflow-auto pr-1">
                {tools.slice(0, 16).map((tool) => (
                  <Link
                    key={tool.slug}
                    to={tool.route}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-hover-bg"
                    onClick={closeTools}
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/tools/merge-pdf" className="hover:text-black">Organize PDF</Link>
          <Link to="/tools/pdf-to-jpg" className="hover:text-black">Convert PDF</Link>
          <Link to="/tools/add-watermark" className="hover:text-black">Edit PDF</Link>
          <a href="#pricing" className="hover:text-black">Pricing</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Login</Button>
          <Button size="sm">Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
