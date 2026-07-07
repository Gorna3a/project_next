import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  icon:        LucideIcon;
  title:       string;
  description: string;
}

export const PlaceholderPage = ({ icon: Icon, title, description }: PlaceholderPageProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="flex items-center justify-center min-h-[60vh]"
  >
    <div className="text-center max-w-md space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
      </div>
      <div>
        <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium mb-3">
          Coming in next phase
        </span>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);
