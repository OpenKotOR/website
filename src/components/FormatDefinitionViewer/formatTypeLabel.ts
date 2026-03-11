import type { TypeRefOrInline } from '../../types/binary-format';

/**
 * Format a type (ref or inline) to a short human-readable string for display.
 */
export function formatTypeLabel(type: TypeRefOrInline): string {
  if (typeof type === 'string') return type;
  if (typeof type !== 'object' || type === null) return String(type);
  switch (type.kind) {
    case 'string': {
      const parts: string[] = ['string'];
      if (type.length != null) parts.push(`length ${formatExpr(type.length)}`);
      if (type.terminator != null) parts.push(`term ${formatExpr(type.terminator)}`);
      return parts.join(', ');
    }
    case 'bytes': {
      const parts: string[] = ['bytes'];
      if (type.length != null) parts.push(formatExpr(type.length));
      return parts.join(' ');
    }
    case 'pointer':
      return `pointer → ${formatTypeLabel(type.to)}`;
    case 'bitfield':
      return `bitfield(${type.base})`;
    case 'struct':
      return 'struct { … }';
    default:
      return (type as { kind?: string }).kind ?? '?';
  }
}

function formatExpr(v: number | string): string {
  if (typeof v === 'number') return String(v);
  return v;
}
