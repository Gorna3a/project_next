'use client';

import { useState, useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Search,
  BookOpen,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  FileText,
  Globe,
  Terminal,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../../core/hooks/useAuth";
import {
  addBookmark,
  removeBookmark,
  getUserBookmarks,
} from "../../../core/services/resourceService";
import {
  libraryResources,
  resourceCategories,
  allLanguages,
  type LibraryResource,
} from "./libraryData";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" as const } },
};

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  cheatsheet: FileText,
  docs: Globe,
  tool: Terminal,
  guide: GraduationCap,
};

const CATEGORY_COLORS: Record<string, string> = {
  cheatsheet: "#22c55e",
  docs: "#3b82f6",
  tool: "#a855f7",
  guide: "#f59e0b",
};

export default function LibraryPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [langFilter, setLangFilter] = useState("all");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserBookmarks(user.uid).then((ids) => {
      setBookmarks(ids);
      setBookmarksLoaded(true);
    });
  }, [user]);

  const filtered = useMemo(() => {
    return libraryResources.filter((r) => {
      const matchCat = category === "all" || r.category === category;
      const matchLang = langFilter === "all" || r.languages.includes(langFilter);
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.tags.some((t) => t.includes(search.toLowerCase()));
      const matchBookmark = !showBookmarked || bookmarks.has(r.id);
      return matchCat && matchLang && matchSearch && matchBookmark;
    });
  }, [search, category, langFilter, showBookmarked, bookmarks]);

  const toggleBookmark = async (resourceId: string) => {
    if (!user) return;
    if (bookmarks.has(resourceId)) {
      await removeBookmark(user.uid, resourceId);
      setBookmarks((prev) => {
        const next = new Set(prev);
        next.delete(resourceId);
        return next;
      });
    } else {
      await addBookmark(user.uid, resourceId);
      setBookmarks((prev) => new Set(prev).add(resourceId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-black text-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-black text-2xl tracking-tight flex items-center gap-3" style={{ fontFamily: "'Syne', sans-serif" }}>
            <span className="w-2 h-6 bg-[#FFD23F] border border-white" /> Library
          </h1>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/60 mt-1">
            Curated resources, docs & references
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {bookmarksLoaded && user && (
            <button
              onClick={() => setShowBookmarked((v) => !v)}
              className={`border-[3px] px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${showBookmarked ? 'bg-[#FFD23F] text-black border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFF4CC]'}`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              Bookmarked ({bookmarks.size})
            </button>
          )}
          <span className="bg-white text-black border-[3px] border-black px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest shadow-[3px_3px_0_0_#000] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            {libraryResources.length} resources
          </span>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" className="bg-white border-[3px] border-black shadow-[4px_4px_0_0_#000] p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {resourceCategories.map((cat) => {
            const isActive = category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`border-[3px] px-4 py-1.5 font-mono text-xs font-black uppercase tracking-widest transition-all ${isActive ? 'bg-black text-white border-black shadow-[3px_3px_0_0_#000]' : 'bg-white text-black border-black hover:bg-[#FFF4CC]'}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="Search resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] pl-9 pr-4 py-2.5 font-mono text-sm font-bold placeholder:text-black/40 focus:outline-none focus:translate-x-[-1px] focus:translate-y-[-1px] focus:shadow-[4px_4px_0_0_#000] transition-all"
            />
          </div>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="bg-white border-[3px] border-black shadow-[3px_3px_0_0_#000] px-4 py-2.5 font-mono text-xs font-black uppercase tracking-widest cursor-pointer focus:outline-none"
            style={{ minWidth: "160px" }}
          >
            <option value="all">All Languages</option>
            {allLanguages.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-[#FFD23F] border-[3px] border-black grid place-items-center mx-auto shadow-[3px_3px_0_0_#000] rotate-[-1deg]">
            <BookOpen className="w-6 h-6 text-black" />
          </div>
          <p className="font-black text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            No resources found
          </p>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/60">
            Try different filters or clear your search
          </p>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={bookmarks.has(resource.id)}
              onToggleBookmark={() => toggleBookmark(resource.id)}
              showBookmark={!!user}
            />
          ))}
        </motion.div>
      )}

      {filtered.length > 0 && (
        <p className="font-mono text-xs font-black uppercase tracking-widest text-black/60 text-center">
          Showing {filtered.length} of {libraryResources.length} resources
        </p>
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  isBookmarked,
  onToggleBookmark,
  showBookmark,
}: {
  resource: LibraryResource;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  showBookmark: boolean;
}) {
  const Icon = CATEGORY_ICONS[resource.category] ?? BookOpen;
  const color = CATEGORY_COLORS[resource.category] ?? "#000";
  const diffLabel =
    resource.difficulty === "beginner"
      ? "Beginner"
      : resource.difficulty === "intermediate"
        ? "Intermediate"
        : "Advanced";
  const diffColor =
    resource.difficulty === "beginner"
      ? "#88D498"
      : resource.difficulty === "intermediate"
        ? "#FFD23F"
        : "#FF6B6B";

  return (
    <motion.div
      variants={fadeUp}
      className="bg-white border-[3px] border-black shadow-[5px_5px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] p-5 flex flex-col gap-3 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 border-[3px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#000]" style={{ backgroundColor: color }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {showBookmark && (
          <button
            onClick={onToggleBookmark}
            className={`shrink-0 w-8 h-8 border-[2px] border-black grid place-items-center transition-colors ${isBookmarked ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#FFF4CC]'}`}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-current" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-black text-sm leading-snug text-black" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {resource.title}
        </h3>
        <p className="font-mono text-xs leading-relaxed text-black/60 line-clamp-2 mt-1">
          {resource.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="border-[2px] border-black px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: diffColor }}>
          {diffLabel}
        </span>
        {resource.languages.slice(0, 2).map((lang) => (
          <span
            key={lang}
            className="border-[2px] border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold"
          >
            {lang}
          </span>
        ))}
        {resource.languages.length > 2 && (
          <span className="border-[2px] border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold">
            +{resource.languages.length - 2}
          </span>
        )}
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-black text-white border-[3px] border-black shadow-[3px_3px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_0_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none w-full flex items-center justify-center gap-2 py-2.5 font-mono text-xs font-black uppercase tracking-widest transition-all mt-auto"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open Resource
      </a>
    </motion.div>
  );
}
