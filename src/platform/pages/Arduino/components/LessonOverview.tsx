'use client';

import { useState } from "react";

type LessonSection = "overview" | "pinout" | "example" | "specifications";

const TABS: { id: LessonSection; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "pinout", label: "Pinout" },
  { id: "example", label: "Example" },
  { id: "specifications", label: "Specs" },
];

const LESSON_CONTENT: Record<LessonSection, { eyebrow: string; body: string; detail: string }> = {
  overview: {
    eyebrow: "THE STARTER CIRCUIT",
    body: "Follow D13 as the loop switches the onboard LED between HIGH and LOW.",
    detail: "Change the code, run it, and watch the board respond.",
  },
  pinout: {
    eyebrow: "SIGNAL PATH",
    body: "D13 is a digital output and drives the Uno’s built-in L indicator.",
    detail: "GND is the shared return for external circuits.",
  },
  example: {
    eyebrow: "THE LOOP",
    body: "Set the pin HIGH, wait, set it LOW, then wait again.",
    detail: "The editor below contains the full sketch and can be changed at any time.",
  },
  specifications: {
    eyebrow: "ARDUINO UNO R3",
    body: "ATmega328P · 16 MHz · 5 V logic",
    detail: "14 digital pins · 6 analog inputs · 1 built-in D13 LED",
  },
};

export const LessonOverview = () => {
  const [activeTab, setActiveTab] = useState<LessonSection>("overview");
  const content = LESSON_CONTENT[activeTab];

  return (
    <section className="aw-lesson-card" aria-label="Current lesson">
      <div className="aw-lesson-heading">
        <div className="aw-lesson-heading-copy">
          <span className="aw-lesson-kicker">LESSON 02 <i /> BASICS</span>
          <h2>BLINK AN LED</h2>
        </div>
        <span className="aw-lesson-counter">02 <span>/ 16</span></span>
      </div>

      <div className="aw-lesson-tabs" role="tablist" aria-label="Lesson details">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`arduino-lesson-${tab.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="arduino-lesson-panel"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="arduino-lesson-panel"
        className="aw-lesson-copy"
        role="tabpanel"
        aria-labelledby={`arduino-lesson-${activeTab}-tab`}
      >
        <span className="aw-lesson-copy-kicker">{content.eyebrow}</span>
        <p>{content.body}</p>
        <small>{content.detail}</small>
      </div>
    </section>
  );
};
