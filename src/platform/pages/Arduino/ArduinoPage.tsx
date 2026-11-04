'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useLanguage } from "../../../core/context/LanguageContext";
import {
  cn,
  MOBILE_BREAKPOINT_PX,
  MAX_SPLIT_RATIO,
  MIN_SPLIT_RATIO,
} from "./utils/ui";
import { useArduinoSession } from "./hooks/useArduinoSession";
import { useBenchComponents } from "./hooks/useBenchComponents";
import { useSceneSelection } from "./hooks/useSceneSelection";
import { useSplitRatio } from "./hooks/useSplitRatio";
import { resolveSceneSelection, type SceneSelection } from "./components/three/focus";
import { ArduinoToolbar } from "./components/ArduinoToolbar";
import { EditorSidebar, type EditorSidebarTab } from "./components/EditorSidebar";
import { SimulatorPane } from "./components/SimulatorPane";
import { BottomPanel, type BottomTab } from "./components/BottomPanel";
import { LessonRail } from "./components/LessonRail";
import "./arduino-workbench.css";

const subscribeStackedLayout = (listener: () => void): (() => void) => {
  const query = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
};

const stackedLayoutSnapshot = (): boolean =>
  globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches;

const stackedLayoutServerSnapshot = (): boolean => false;

export const ArduinoPage = () => {
  const { isRTL } = useLanguage();
  const session = useArduinoSession();
  const { state } = session;
  const bench = useBenchComponents();
  const {
    components: benchComponents,
    move: movePart,
    rotate: rotatePart,
    remove: removePart,
  } = bench;
  const {
    selection,
    focusNonce,
    select: selectScene,
    clear: clearScene,
  } = useSceneSelection();
  const [sidebarTab, setSidebarTab] = useState<EditorSidebarTab>("code");

  const stacked = useSyncExternalStore(
    subscribeStackedLayout,
    stackedLayoutSnapshot,
    stackedLayoutServerSnapshot,
  );
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const [drawerTab, setDrawerTab] = useState<BottomTab>("serial");

  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const { ratio, dragging, onDividerPointerDown } = useSplitRatio({
    containerRef: splitContainerRef,
    isRTL,
  });

  const errorCount = state.diagnostics.filter((item) => item.severity === "error").length;
  const previousErrorCount = useRef(errorCount);

  useEffect(() => {
    if (errorCount > previousErrorCount.current) {
      setDrawerTab("diagnostics");
      setDrawerExpanded(true);
    }
    previousErrorCount.current = errorCount;
  }, [errorCount]);

  const handleRunSketch = useCallback(() => {
    setDrawerTab("serial");
    setDrawerExpanded(true);
    session.run();
  }, [session]);

  const resolvedSelection = resolveSceneSelection(selection, benchComponents);

  const handleSceneSelect = useCallback(
    (next: SceneSelection, focus: boolean) => {
      selectScene(next, focus);
      setSidebarTab("info");
    },
    [selectScene],
  );

  const handleClearSelection = useCallback(() => {
    clearScene();
  }, [clearScene]);

  const handleRotateSelection = useCallback(
    (delta: number) => {
      if (selection?.kind !== "part") return;
      rotatePart(selection.id, delta);
    },
    [rotatePart, selection],
  );

  const handleRemoveSelection = useCallback(() => {
    if (selection?.kind !== "part") return;
    removePart(selection.id);
    clearScene();
  }, [clearScene, removePart, selection]);

  return (
    <div
      className={cn(
        "arduino-workbench -m-6 flex h-[calc(100vh-3.5rem)] min-h-0 w-auto flex-col overflow-hidden",
      )}
    >
      <ArduinoToolbar
        state={state}
        onRun={handleRunSketch}
        onPause={session.pause}
        onResume={session.resume}
        onReset={session.reset}
        canRun={session.canRun}
        canPause={session.canPause}
        canResume={session.canResume}
        canReset={session.canReset}
      />

      <div
        ref={splitContainerRef}
        className={cn(
          "flex min-h-0 flex-1",
          stacked ? "flex-col" : isRTL ? "flex-row-reverse" : "flex-row",
        )}
      >
        <section
          className={cn(
            "min-h-0 min-w-0 flex-1",
            "aw-stage",
            stacked && "w-full",
          )}
        >
          <SimulatorPane
            state={state}
            session={session.session}
            bench={bench}
            selected={selection}
            focusNonce={focusNonce}
            onSelect={handleSceneSelect}
            onMove={movePart}
          />
        </section>

        {!stacked && (
          <div
            onPointerDown={onDividerPointerDown}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize simulator and inspector sidebar"
            aria-valuemin={Math.round(MIN_SPLIT_RATIO * 100)}
            aria-valuemax={Math.round(MAX_SPLIT_RATIO * 100)}
            aria-valuenow={Math.round(ratio * 100)}
            className={cn(
              "aw-divider w-[3px] shrink-0 touch-none transition-colors",
              dragging && "is-dragging",
            )}
          />
        )}

        <section
          className={cn(
            "min-h-0 overflow-hidden",
            "aw-stage",
            stacked
              ? "aw-stacked h-[45%] w-full shrink-0 border-t-[3px]"
              : "",
          )}
          style={stacked ? undefined : { width: `${ratio * 100}%` }}
        >
          <EditorSidebar
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
            sketch={session.sketch}
            onSketchChange={session.setSketch}
            diagnostics={state.diagnostics}
            onRun={handleRunSketch}
            engine={state.engine.engine}
            selection={resolvedSelection}
            onClearSelection={handleClearSelection}
            onRotateSelection={handleRotateSelection}
            onRemoveSelection={handleRemoveSelection}
          />
        </section>
      </div>

      <LessonRail />

      <BottomPanel
        state={state}
        tab={drawerTab}
        onTabChange={setDrawerTab}
        expanded={drawerExpanded}
        onToggleExpanded={() => setDrawerExpanded((value) => !value)}
        onClearSerial={session.clearSerial}
        onClearDiagnostics={session.clearDiagnostics}
      />
    </div>
  );
};

export default ArduinoPage;
