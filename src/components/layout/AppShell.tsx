import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  BrainCircuit,
  ChevronLeft,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Stethoscope,
  Sun,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Executive", icon: LayoutDashboard, hint: "Org KPIs" },
  { to: "/patients", label: "Patient Analytics", icon: Users, hint: "Demographics" },
  { to: "/financial", label: "Financial", icon: Wallet, hint: "DRG & payer" },
  { to: "/predictions", label: "AI Predictions", icon: BrainCircuit, hint: "Risk models" },
  { to: "/operations", label: "Operations", icon: Activity, hint: "Capacity" },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("medicare-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("medicare-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-1 py-1">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Stethoscope className="size-5" />
      </span>
      {!collapsed && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold tracking-tight">Medicare</span>
          <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Health Intelligence
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--color-primary)]"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className={cn("size-4.5 shrink-0", active && "text-primary")} />
            {!collapsed && (
              <span className="flex-1 leading-tight">
                {item.label}
                <span className="block text-[10px] font-normal text-muted-foreground/80">{item.hint}</span>
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useTheme();

  return (
    <div className="page-glow min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 p-3 backdrop-blur-xl lg:flex",
            collapsed ? "w-[76px]" : "w-64",
          )}
        >
          <Brand collapsed={collapsed} />
          <div className="mt-6 flex-1">
            <NavList collapsed={collapsed} />
          </div>
          <div className={cn("rounded-xl bg-accent/50 p-3", collapsed && "hidden")}>
            <p className="text-xs font-semibold">Data freshness</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              CMS claims synced 14 min ago · 42 facilities
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 justify-start text-muted-foreground"
            onClick={() => setCollapsed((c) => !c)}
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Collapse"}
          </Button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-4">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Brand />
                  <div className="mt-6">
                    <NavList onNavigate={() => setMobileOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="relative hidden max-w-md flex-1 sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients, DRGs, facilities…"
                  className="h-9 rounded-xl border-border/70 bg-card/60 pl-9"
                />
              </div>

              <div className="ml-auto flex items-center gap-1.5">
                <span className="hidden items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-semibold text-success md:inline-flex">
                  <span className="size-1.5 rounded-full bg-success" />
                  Live pipeline
                </span>
                <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                  {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
                </Button>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="size-4.5" />
                </Button>
                <div className="ml-1 flex items-center gap-2 rounded-xl bg-accent/50 py-1 pl-1 pr-3">
                  <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                    SR
                  </span>
                  <span className="hidden text-xs leading-tight sm:block">
                    <span className="block font-semibold">S. Samal</span>
                    <span className="block text-muted-foreground">Chief Analytics</span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
