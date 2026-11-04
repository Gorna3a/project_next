'use client';

import { useEffect, useRef, useState, type UIEvent } from "react";
import type { SerialFeed } from "@core/simulator";
import {
  cn,
  formatSimTime,
  formatWallTime,
  SERIAL_LINE_STYLES,
  CRT_MONO,
  CRT_PHOSPHOR_BRIGHT,
} from "../utils/ui";

interface SerialConsoleProps {
  feed: SerialFeed;
  onClear: () => void;
}

const PIN_DISTANCE_PX = 48;

export const SerialConsole = ({ feed, onClear }: SerialConsoleProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pinnedRef = useRef(true);
  const [autoscroll, setAutoscroll] = useState(true);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node || !autoscroll || !pinnedRef.current) return;
    node.scrollTop = node.scrollHeight;
  }, [feed, autoscroll]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    const atBottom = node.scrollHeight - node.scrollTop - node.clientHeight < PIN_DISTANCE_PX;
    pinnedRef.current = atBottom;
  };

  if (feed.length === 0) {
    return (
      <div className="grid h-full place-items-center px-4">
        <p
          className={cn(
            "max-w-[440px] text-center text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#6E7D5E]",
            CRT_MONO,
          )}
        >
          {"> SERIAL MONITOR IDLE — RUN TO OPEN 9600 BAUD LINK"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        {feed.map((line) => (
          <div
            key={line.id}
            className={cn(
              "flex items-baseline gap-2 text-[11px] leading-[1.65]",
              CRT_MONO,
              SERIAL_LINE_STYLES[line.direction],
            )}
          >
            <span className="shrink-0 tabular-nums text-[#4E5A3F]">{formatSimTime(line.simTimeNs)}</span>
            <span className="shrink-0 tabular-nums text-[#3B4530]">{formatWallTime(line.timestamp)}</span>
            <span className="shrink-0">{line.direction === "out" ? ">" : "<"}</span>
            <span className="min-w-0 whitespace-pre-wrap break-words">{line.text}</span>
          </div>
        ))}
      </div>
      <div className="flex shrink-0 items-center justify-between border-t-[3px] border-[#2E312A] px-3 py-1">
        <button
          onClick={() => setAutoscroll((value) => !value)}
          className={cn(
            "text-[9px] uppercase tracking-[0.16em] transition-colors",
            CRT_MONO,
            autoscroll ? CRT_PHOSPHOR_BRIGHT : "text-[#6E7D5E] hover:text-[#9AB08A]",
          )}
          title="Follow incoming output"
        >
          autoscroll {autoscroll ? "on" : "off"}
        </button>
        <button
          onClick={onClear}
          className={cn("text-[9px] uppercase tracking-[0.16em] text-[#6E7D5E] transition-colors hover:text-[#FF6B1A]", CRT_MONO)}
        >
          clear
        </button>
      </div>
    </div>
  );
};
