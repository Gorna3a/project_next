import { BookOpen, Lightbulb, MousePointer2, Palette, SlidersHorizontal } from "lucide-react";

const PATH = [
  { number: "01", title: "Meet the board", icon: BookOpen, state: "available" },
  { number: "02", title: "Blink an LED", icon: Lightbulb, state: "current" },
  { number: "03", title: "Push a button", icon: MousePointer2, state: "up-next" },
  { number: "04", title: "Turn a knob", icon: SlidersHorizontal, state: "up-next" },
  { number: "05", title: "Mix colours", icon: Palette, state: "up-next" },
] as const;

export const LessonRail = () => (
  <section className="aw-lesson-rail" aria-label="Arduino lesson path">
    <div className="aw-lesson-rail-label">
      <span>LEARNING PATH</span>
      <strong>START HERE</strong>
    </div>
    <div className="aw-lesson-steps" role="list">
      {PATH.map(({ number, title, icon: Icon, state }) => (
        <div
          key={number}
          className={`aw-lesson-step aw-lesson-step-${state}`}
          role="listitem"
          aria-current={state === "current" ? "step" : undefined}
        >
          <span className="aw-lesson-step-icon"><Icon aria-hidden="true" /></span>
          <span className="aw-lesson-step-copy">
            <small>{number} / {state === "current" ? "NOW" : state === "up-next" ? "UP NEXT" : "START"}</small>
            <strong>{title}</strong>
          </span>
        </div>
      ))}
    </div>
  </section>
);
