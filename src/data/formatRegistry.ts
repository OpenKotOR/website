/**
 * Registry of binary format definitions. Each format's JSON is lazy-loaded
 * when the user navigates to its detail page. Formats may use "includes" to
 * merge fragment files (types/constants) from the same directory.
 */

export interface FormatMeta {
  id: string;
  name: string;
  description?: string;
}

/** Metadata for formats (no JSON loaded). Used for the list page. */
export const FORMATS: FormatMeta[] = [
  { id: 'erf', name: 'ERF', description: 'Encapsulated Resource File (MOD, SAV)' },
  { id: 'key', name: 'KEY', description: 'Index of BIF files and resources' },
  { id: 'bif', name: 'BIF', description: 'BIF archive (variable resources)' },
  { id: 'lip', name: 'LIP', description: 'Lip sync keyframe animation' },
  { id: 'ltr', name: 'LTR', description: 'Letter / name generator (Markov chains)' },
  { id: 'lyt', name: 'LYT', description: 'Layout (rooms, tracks, obstacles, doors)' },
  { id: 'rim', name: 'RIM', description: 'Resource Image archive' },
  { id: 'ssf', name: 'SSF', description: 'Sound Set (TLK string IDs)' },
  { id: 'bwm', name: 'BWM', description: 'Binary Walkmesh (WOK, PWK, DWK pathfinding)' },
  { id: 'mdl', name: 'MDL', description: 'Model Definition (MDL/MDX hierarchy, meshes, animations)' },
  { id: 'gff', name: 'GFF', description: 'Generic File Format (struct/field tree)' },
  { id: 'tlk', name: 'TLK', description: 'Talk table (dialogue / localized strings)' },
  { id: 'tpc', name: 'TPC', description: 'Texture (2D, mipmaps, DXT, optional TXI)' },
  { id: 'txi', name: 'TXI', description: 'Texture Extra Information (plain text, TGA/TPC)' },
  { id: 'vis', name: 'VIS', description: 'Room visibility list (plain text, area culling)' },
  { id: '2da', name: '2DA', description: '2D Array table (columns, rows, string cells)' },
];

type FormatModule = { default: unknown };

/** All schema JSONs so we can load fragments by filename when a format uses "includes". */
const schemaModules = import.meta.glob<{ default: unknown }>('../assets/schemas/*.json');

function resolveSchemaPath(filename: string): string | null {
  const normalized = filename.replace(/\\/g, '/');
  const match = Object.keys(schemaModules).find((path) => path.replace(/\\/g, '/').endsWith(normalized));
  return match ?? null;
}

/** Merge fragment types and constants into the format definition (mutates format). */
function mergeFragment(
  format: Record<string, unknown>,
  fragment: Record<string, unknown>
): void {
  if (fragment.types != null && typeof fragment.types === 'object' && !Array.isArray(fragment.types)) {
    format.types = { ...(format.types as Record<string, unknown>), ...fragment.types } as Record<string, unknown>;
  }
  if (fragment.constants != null && typeof fragment.constants === 'object' && !Array.isArray(fragment.constants)) {
    format.constants = { ...(format.constants as Record<string, unknown>), ...fragment.constants } as Record<string, unknown>;
  }
}

/** Loader map: dynamic import so each JSON is in its own chunk. */
const loaders: Record<string, () => Promise<FormatModule>> = {
  erf: () => import('../assets/schemas/erf-format.json'),
  key: () => import('../assets/schemas/key-format.json'),
  bif: () => import('../assets/schemas/bif-format.json'),
  lip: () => import('../assets/schemas/lip-format.json'),
  ltr: () => import('../assets/schemas/ltr-format.json'),
  lyt: () => import('../assets/schemas/lyt-format.json'),
  rim: () => import('../assets/schemas/rim-format.json'),
  ssf: () => import('../assets/schemas/ssf-format.json'),
  bwm: () => import('../assets/schemas/bwm-format.json'),
  mdl: () => import('../assets/schemas/mdl-format.json'),
  gff: () => import('../assets/schemas/gff-format.json'),
  tlk: () => import('../assets/schemas/tlk-format.json'),
  tpc: () => import('../assets/schemas/tpc-format.json'),
  txi: () => import('../assets/schemas/txi-format.json'),
  vis: () => import('../assets/schemas/vis-format.json'),
  '2da': () => import('../assets/schemas/2da-format.json'),
};

/**
 * Lazy-load a format definition by id. Returns the JSON or undefined if unknown.
 * If the format defines "includes", each fragment file is loaded and its types
 * and constants are merged in order (later overrides earlier).
 */
export async function loadFormat(id: string): Promise<unknown | undefined> {
  const loader = loaders[id];
  if (!loader) return undefined;
  const mod = await loader();
  const format = mod?.default;
  if (format == null || typeof format !== 'object') return format;

  const includes = (format as Record<string, unknown>).includes;
  if (!Array.isArray(includes) || includes.length === 0) return format;

  const result = { ...format } as Record<string, unknown>;
  result.types = { ...((result.types as Record<string, unknown>) ?? {}) };
  result.constants = { ...((result.constants as Record<string, unknown>) ?? {}) };

  for (const item of includes) {
    const filename = typeof item === 'string' ? item : null;
    if (!filename) continue;
    const path = resolveSchemaPath(filename);
    if (!path) continue;
    const load = schemaModules[path];
    if (typeof load !== 'function') continue;
    const fragMod = await load();
    const frag = fragMod?.default;
    if (frag != null && typeof frag === 'object' && !Array.isArray(frag)) {
      mergeFragment(result, frag as Record<string, unknown>);
    }
  }

  delete result.includes;
  return result;
}

export function getFormatIds(): string[] {
  return FORMATS.map((f) => f.id);
}

export function getFormatMeta(id: string): FormatMeta | undefined {
  return FORMATS.find((f) => f.id === id);
}
