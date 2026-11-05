import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, Workflow } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { ToolGrid } from "../components/tools/ToolGrid";
import { FileUploader } from "../components/upload/FileUploader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { popularTools, toolCategories, tools } from "../config/tools";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | (typeof toolCategories)[number]["key"]>("all");
  const [phaseFilter, setPhaseFilter] = useState<"all" | "core" | "advanced" | "future">("all");
  const [sortBy, setSortBy] = useState<"name" | "popular">("popular");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  const popular = tools.filter((tool) => popularTools.includes(tool.slug));
  const recentTools = useMemo(() => {
    if (!recentSlugs.length) {
      return [];
    }
    const bySlug = new Map(tools.map((tool) => [tool.slug, tool]));
    return recentSlugs.map((slug) => bySlug.get(slug)).filter((tool): tool is (typeof tools)[number] => Boolean(tool));
  }, [recentSlugs]);

  useEffect(() => {
    const key = "musu:recent-tools";
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as string[];
      setRecentSlugs(parsed.slice(0, 6));
    } catch {
      setRecentSlugs([]);
    }
  }, []);
  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const set = new Set(popularTools);

    const filtered = tools.filter((tool) => {
      const queryMatch =
        !normalizedQuery ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery);
      const categoryMatch = categoryFilter === "all" || tool.category === categoryFilter;
      const phaseMatch = phaseFilter === "all" || tool.phase === phaseFilter;
      return queryMatch && categoryMatch && phaseMatch;
    });

    if (sortBy === "name") {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered.sort((a, b) => {
      const popA = set.has(a.slug) ? 1 : 0;
      const popB = set.has(b.slug) ? 1 : 0;
      if (popA !== popB) {
        return popB - popA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [query, categoryFilter, phaseFilter, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="mx-auto w-full max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                Premium PDF Workspace
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Everything you need to work with PDFs.
              </h1>
              <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
                Merge, split, compress, convert and edit your documents in seconds.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/tools/merge-pdf">Start with Merge PDF <ArrowRight size={16} className="ml-2" /></Link>
                </Button>
                <Button variant="secondary" asChild>
                  <a href="#how-it-works">How it works</a>
                </Button>
              </div>
            </div>
            <FileUploader
              multiple={true}
              accept={{
                "application/pdf": [".pdf"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"]
              }}
              onSelectFiles={() => undefined}
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Popular Tools</h2>
              <p className="text-sm text-muted">Most-used operations for everyday document workflows.</p>
            </div>
          </div>
          <ToolGrid tools={popular} />
        </section>

        {recentTools.length ? (
          <section className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Recent Tools</h2>
                <p className="text-sm text-muted">Continue where you left off.</p>
              </div>
            </div>
            <ToolGrid tools={recentTools} />
          </section>
        ) : null}

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Explore All Tools</h2>
              <p className="mt-1 text-sm text-muted">Search, filter, and sort to find the exact workflow you need.</p>
            </div>
            <p className="text-sm text-muted">{filteredTools.length} tool(s) found</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search tools..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as "all" | (typeof toolCategories)[number]["key"])}
            >
              <option value="all">All categories</option>
              {toolCategories.map((category) => (
                <option key={category.key} value={category.key}>{category.label}</option>
              ))}
            </select>
            <select
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm"
              value={phaseFilter}
              onChange={(event) => setPhaseFilter(event.target.value as "all" | "core" | "advanced" | "future")}
            >
              <option value="all">All phases</option>
              <option value="core">Core</option>
              <option value="advanced">Advanced</option>
              <option value="future">Coming soon</option>
            </select>
            <select
              className="h-11 rounded-xl border border-border bg-white px-3 text-sm"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as "name" | "popular")}
            >
              <option value="popular">Sort: Popular first</option>
              <option value="name">Sort: Name A-Z</option>
            </select>
          </div>

          <div className="mt-4">
            <ToolGrid tools={filteredTools} emptyMessage="No tools match the current filters. Try widening your search." />
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Tool Categories</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toolCategories.map((category) => (
              <Card key={category.key} className="p-5">
                <h3 className="text-base font-semibold">{category.label}</h3>
                <p className="mt-2 text-sm text-muted">
                  {tools.filter((tool) => tool.category === category.key).length} tools available.
                </p>
                <div className="mt-3">
                  <Button variant="secondary" size="sm" asChild>
                    <Link to={tools.find((tool) => tool.category === category.key)?.route ?? "/"}>Explore</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {["Upload", "Configure", "Process", "Download"].map((step, idx) => (
              <Card key={step} className="p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Step {idx + 1}</p>
                <p className="mt-2 text-lg font-semibold">{step}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Why Teams Choose Musu PDF</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <Workflow className="mb-3" size={18} />
              <p className="font-semibold">Unified workflows</p>
              <p className="mt-2 text-sm text-muted">A single interface across every tool for faster productivity.</p>
            </Card>
            <Card className="p-5">
              <Lock className="mb-3" size={18} />
              <p className="font-semibold">Security-first processing</p>
              <p className="mt-2 text-sm text-muted">Private jobs, isolated storage, and configurable retention policies.</p>
            </Card>
            <Card className="p-5">
              <CheckCircle2 className="mb-3" size={18} />
              <p className="font-semibold">Reliable outputs</p>
              <p className="mt-2 text-sm text-muted">Robust processing pipeline with downloadable artifacts and status tracking.</p>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Privacy and Security</h2>
          <p className="mt-3 max-w-3xl text-sm text-muted">
            Documents are handled through authenticated API boundaries, validated uploads, and expiring job artifacts.
            Automatic cleanup is implemented server-side in scheduled tasks.
          </p>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-3">
            {[
              {
                q: "How long are files stored?",
                a: "Retention is configurable by administrators and enforced through scheduled cleanup jobs."
              },
              {
                q: "Can I process multiple files?",
                a: "Yes, tools like merge and image-to-pdf accept multi-file uploads and drag-based order control."
              },
              {
                q: "Are AI features available now?",
                a: "AI PDF tools are planned for a future phase and marked accordingly in the interface."
              }
            ].map((item) => (
              <Card key={item.q} className="p-4">
                <p className="font-semibold">{item.q}</p>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
