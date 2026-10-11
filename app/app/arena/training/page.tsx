'use client';
import Link from "next/link";
import { Target, ArrowRight } from "lucide-react";

export default function LegacyTraining() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-4">
      <div className="card p-10 text-center space-y-3">
        <Target className="w-12 h-12 mx-auto opacity-25" style={{ color: 'var(--text-muted)' }} />
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Training moved</p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          The practice arena now lives in the top-level <Link href="/app/training" className="underline font-semibold">Training</Link> section.
        </p>
        <Link href="/app/training" className="btn-primary inline-flex gap-2">
          Go to Training <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
