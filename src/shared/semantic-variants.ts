const SEMANTIC_VARIANT_MAP: Record<string, string> = {
  primary: 'filled',
  secondary: 'outline',
  danger: 'filled',
  success: 'filled',
  warning: 'filled',
  info: 'filled',
};

const SEMANTIC_COLOR_MAP: Record<string, string> = {
  primary: 'mauve',
  danger: 'red',
  success: 'green',
  warning: 'yellow',
  info: 'sky',
  secondary: 'surface0',
};

export function resolveVariant(variant: string): string {
  return SEMANTIC_VARIANT_MAP[variant] ?? variant;
}

export function resolveColor(variant: string, color: string): string {
  return SEMANTIC_COLOR_MAP[variant] ?? color;
}
