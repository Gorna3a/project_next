// Local deterministic pixel avatar for users without a photo (friends lists,
// notifications). Hashes the seed into the 12 built-in sprites so a given
// person always resolves to the same face — no external API, on-brand.

const AVATARS = Array.from(
  { length: 12 },
  (_, i) => `/avatars/avatar-${String(i + 1).padStart(2, '0')}.png`,
);

export const pixelAvatarFor = (seed: string): string => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return AVATARS[Math.abs(h) % AVATARS.length];
};
