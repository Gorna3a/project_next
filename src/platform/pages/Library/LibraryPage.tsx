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
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-bold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <BookOpen className="w-6 h-6" style={{ color: "var(--accent)" }} />
            Library
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Curated resources, documentation, and references for every language.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {bookmarksLoaded && user && (
            <button
              onClick={() => setShowBookmarked((v) => !v)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5"
              style={{
                backgroundColor: showBookmarked
                  ? "rgba(168,85,247,0.12)"
                  : "transparent",
                borderColor: showBookmarked
                  ? "rgba(168,85,247,0.3)"
                  : "var(--border)",
                color: showBookmarked ? "#a855f7" : "var(--text-muted)",
              }}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              Bookmarked ({bookmarks.size})
            </button>
          )}

          <div
            className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: "var(--accent-subtle)",
              color: "var(--accent-text)",
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {libraryResources.length} resources
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {resourceCategories.map((cat) => {
            const isActive = category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                style={{
                  backgroundColor: isActive
                    ? "var(--accent-subtle)"
                    : "transparent",
                  borderColor: isActive
                    ? "var(--accent)"
                    : "var(--border)",
                  color: isActive
                    ? "var(--accent-text)"
                    : "var(--text-muted)",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="input"
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
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <BookOpen
            className="w-12 h-12 mx-auto opacity-20"
            style={{ color: "var(--text-muted)" }}
          />
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>
            No resources found
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
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
        <p
          className="text-xs text-center"
          style={{ color: "var(--text-muted)" }}
        >
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
  const color = CATEGORY_COLORS[resource.category] ?? "var(--accent)";
  const diffLabel =
    resource.difficulty === "beginner"
      ? "Beginner"
      : resource.difficulty === "intermediate"
        ? "Intermediate"
        : "Advanced";
  const diffColor =
    resource.difficulty === "beginner"
      ? "#22c55e"
      : resource.difficulty === "intermediate"
        ? "#f59e0b"
        : "#ef4444";

  return (
    <motion.div
      variants={fadeUp}
      className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {showBookmark && (
          <button
            onClick={onToggleBookmark}
            className="shrink-0 p-1 rounded-md transition-colors hover:opacity-80"
            style={{ color: isBookmarked ? "#a855f7" : "var(--text-muted)" }}
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
        <h3
          className="font-semibold text-sm leading-snug mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {resource.title}
        </h3>
        <p
          className="text-xs line-clamp-2 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {resource.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: `${diffColor}18`,
            color: diffColor,
          }}
        >
          {diffLabel}
        </span>
        {resource.languages.slice(0, 2).map((lang) => (
          <span
            key={lang}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-muted)",
            }}
          >
            {lang}
          </span>
        ))}
        {resource.languages.length > 2 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-muted)",
            }}
          >
            +{resource.languages.length - 2}
          </span>
        )}
      </div>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full justify-center text-xs py-2 mt-auto"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Open Resource
      </a>
    </motion.div>
  );
}

