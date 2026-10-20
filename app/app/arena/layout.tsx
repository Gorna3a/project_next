'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Trophy, Zap, LayoutDashboard, Swords } from "lucide-react";

const navItems = [
  { to: "/app/arena", label: "Arena Hub", icon: LayoutDashboard, end: true },
  { to: "/app/arena/duels", label: "Duel Zone", icon: Swords },
];

export default function ArenaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (to: string, end?: boolean) => (end ? pathname === to : pathname.startsWith(to));

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="sticky top-14 z-40 -mt-6 -mx-6"
        style={{ backgroundColor: 'var(--surface)', borderBottom: '4px solid var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span
              className="hidden sm:inline-block px-2 py-1 mr-1"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                backgroundColor: 'var(--border)',
                color: 'var(--phosphor)',
                border: '3px solid var(--border)',
              }}
            >
              ARENA
            </span>
            {navItems.map((item) => {
              const active = isActive(item.to, item.end);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className="flex items-center gap-2 px-3 py-2 text-[11px] font-extrabold whitespace-nowrap transition-all duration-100"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.04em',
                    border: '3px solid var(--border)',
                    backgroundColor: active ? 'var(--border)' : 'var(--surface)',
                    color: active ? 'var(--phosphor)' : 'var(--fg)',
                    boxShadow: active ? '3px 3px 0 #000' : 'none',
                  }}
                >
                  <item.icon style={{ width: 14, height: 14 }} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-black"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                border: '3px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--fg)',
              }}
            >
              <Trophy style={{ width: 13, height: 13, color: 'var(--amber)' }} />
              RANK: UNRANKED
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-black"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                border: '3px solid var(--border)',
                backgroundColor: 'var(--border)',
                color: 'var(--phosphor)',
                boxShadow: '3px 3px 0 #000',
              }}
            >
              <Zap style={{ width: 13, height: 13 }} />
              RATING: 1000
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
