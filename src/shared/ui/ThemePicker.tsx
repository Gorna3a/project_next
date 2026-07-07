import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme, THEMES } from '../../core/context/ThemeContext';
import type { AppTheme } from '../../core/types';

interface ThemePickerProps {
  compact?: boolean; // compact = just swatches in a row, no description
  onSelect?: () => void; // called after selecting (e.g. close dropdown)
}

export const ThemePicker = ({ compact = false, onSelect }: ThemePickerProps) => {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-1">
        {THEMES.filter(t => t.id !== 'system').map(t => (
          <button
            key={t.id}
            onClick={() => { setTheme(t.id as AppTheme); onSelect?.(); }}
            title={t.label}
            className="relative flex-shrink-0 group"
          >
            <div
              className="flex gap-0.5 p-1.5 rounded-lg border-2 transition-all duration-200"
              style={{
                borderColor:     theme === t.id ? 'var(--accent)' : 'transparent',
                backgroundColor: theme === t.id ? 'var(--accent-subtle)' : 'transparent',
              }}
            >
              {t.preview.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            {theme === t.id && (
              <div
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Check className="w-2 h-2 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {THEMES.filter(t => t.id !== 'system').map(t => (
        <motion.button
          key={t.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { setTheme(t.id as AppTheme); onSelect?.(); }}
          className="flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 w-full"
          style={{
            borderColor:     theme === t.id ? 'var(--accent)' : 'var(--border)',
            backgroundColor: theme === t.id ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
          }}
        >
          {/* Color swatch */}
          <div className="flex gap-1 flex-shrink-0">
            {t.preview.map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Labels */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {t.label}
              </span>
              {theme === t.id && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  Active
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
              {t.description}
            </p>
          </div>

          {/* Check icon */}
          {theme === t.id && (
            <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          )}
        </motion.button>
      ))}
    </div>
  );
};
