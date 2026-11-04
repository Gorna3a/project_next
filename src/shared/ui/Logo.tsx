'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePoolLogo } from '../../core/context/LogoContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
  className?: string;
  plain?: boolean;
}

const SIZES = {
  sm: { face: 24, font: 9 },
  md: { face: 38, font: 11 },
  lg: { face: 60, font: 16 },
};

// PixelCode brand: the pooled robot face from public/logo plus the
// Press Start 2P wordmark. The face changes whenever the user logs in.
export const Logo = ({ size = 'md', linkTo, className = '', plain = false }: LogoProps) => {
  const { image } = usePoolLogo();
  const s = SIZES[size];

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        style={{
          width: s.face,
          height: s.face,
          flexShrink: 0,
          background: '#000',
          border: '3px solid #161616',
          boxShadow: '2px 2px 0 rgba(0,0,0,.25)',
        }}
      >
        <Image
          src={image}
          alt="PixelCode"
          width={s.face}
          height={s.face}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
            display: 'block',
          }}
        />
      </div>
      {!plain && (
        <span
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: s.font,
            lineHeight: 1.25,
            letterSpacing: '0.02em',
            color: 'var(--text-primary, #161616)',
          }}
        >
          PIXEL<br />
          <span style={{ color: 'var(--accent, #7AA800)' }}>CODE</span>
        </span>
      )}
    </div>
  );

  if (linkTo) return <Link href={linkTo}>{content}</Link>;
  return content;
};
