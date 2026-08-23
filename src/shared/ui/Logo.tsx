import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  className?: string;
}

const sizes = {
  sm: { text: 'text-lg',  icon: 'w-5 h-5',  grid: 'w-2 h-2' },
  md: { text: 'text-2xl', icon: 'w-7 h-7',  grid: 'w-3 h-3' },
  lg: { text: 'text-4xl', icon: 'w-10 h-10', grid: 'w-4 h-4' },
};

export const Logo = ({ size = 'md', linkTo, className = '' }: LogoProps) => {
  const s = sizes[size];

  const icon = (
    <div className={`${s.icon} grid grid-cols-2 gap-0.5 flex-shrink-0`}>
      <div className={`${s.grid} bg-brand-500 rounded-[2px]`} />
      <div className={`${s.grid} bg-brand-300 rounded-[2px]`} />
      <div className={`${s.grid} bg-brand-300 rounded-[2px]`} />
      <div className={`${s.grid} bg-brand-600 rounded-[2px]`} />
    </div>
  );

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      {icon}
      <span className={`${s.text} font-semibold tracking-tight text-gray-900 dark:text-white`}>
        Pixel<span className="text-brand-600 dark:text-brand-400">Code</span>
      </span>
    </div>
  );

  if (linkTo) return <Link href={linkTo}>{content}</Link>;
  return content;
};
