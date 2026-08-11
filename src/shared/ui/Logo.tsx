'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo1 from '@/assets/logo/logo1.png';
import logo2 from '@/assets/logo/logo2.png';
import logo3 from '@/assets/logo/logo3.png';
import logo4 from '@/assets/logo/logo4.png';
import logo5 from '@/assets/logo/logo5.png';

const LOGOS = [logo1, logo2, logo3, logo4, logo5];

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  className?: string;
}

const sizeMap = {
  sm: { width: 96, height: 66 },
  md: { width: 128, height: 88 },
  lg: { width: 176, height: 121 },
};

export const Logo = ({ size = 'md', linkTo, className = '' }: LogoProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * LOGOS.length));
  }, []);

  const dims = sizeMap[size];

  const fontSize = size === 'sm' ? '1rem' : size === 'lg' ? '1.6rem' : '1.2rem';

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src={LOGOS[index]}
        alt="PixelCode"
        width={dims.width}
        height={dims.height}
        className="h-auto"
        style={{ width: dims.width, height: 'auto', maxHeight: dims.height, imageRendering: 'pixelated' }}
        priority
        unoptimized
      />
      <span
        className="font-semibold tracking-tight"
        style={{ fontSize, color: 'var(--nm-text, #1d1d1f)' }}
      >
        Pixel<span className="text-brand-600 dark:text-brand-400" style={{ color: 'var(--nm-accent-blue, #4f7cff)' }}>Code</span>
      </span>
    </div>
  );

  if (linkTo) return <Link href={linkTo}>{content}</Link>;
  return content;
};
