export const SPACING_TOKENS: Record<string, number> = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, none: 0,
};

export const GEOMETRY_TOKENS: Record<string, number> = {
  radiusSm: 6, radiusMd: 12, radiusLg: 18, radiusPill: 9999,
  borderSm: 1, borderMd: 2,
};

export const TYPOGRAPHY_TOKENS: Record<string, number> = {
  sizeXs: 10, sizeSm: 12, sizeMd: 14, sizeLg: 16, sizeH2: 20,
};

export function resolveSpacing(token: string | number): number {
  if (typeof token === 'number') return token;
  return SPACING_TOKENS[token] ?? 12;
}

export function resolveRadius(shape: string, size: string = 'md'): number {
  if (shape === 'square') return 0;
  if (shape === 'pill') return 9999;
  return size === 'sm' ? 6 : size === 'lg' ? 18 : 12;
}

export const FLEX_ALIGN_MAP: Record<string, string> = {
  start: 'flex-start', center: 'center', end: 'flex-end',
  stretch: 'stretch', between: 'space-between',
  around: 'space-around', evenly: 'space-evenly',
};
