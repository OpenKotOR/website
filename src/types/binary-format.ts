/**
 * Types for binary format definition JSON (consumed by FormatDefinitionViewer).
 * Aligned with https://openkotor.com/schemas/binary-format.schema.json
 */

export type Endianness = 'little' | 'big';

export type PrimitiveInt =
  | 'u8' | 'u16' | 'u32' | 'u64' | 'u128'
  | 's8' | 's16' | 's32' | 's64' | 's128';

export type Primitive = PrimitiveInt | 'f32' | 'f64' | 'bool';

export interface StringType {
  kind: 'string';
  encoding?: string;
  length?: number | string;
  terminator?: number | string;
  description?: string;
}

export interface BytesType {
  kind: 'bytes';
  length?: number | string;
  terminator?: number | string;
  align?: number;
  description?: string;
}

export interface PointerType {
  kind: 'pointer';
  to: TypeRefOrInline;
  addressType?: PrimitiveInt | 4 | 8;
  relativeTo?: string;
  nullIs?: 'empty' | 'absent';
  count?: number | string;
  stride?: number | string;
  follow?: boolean;
}

export interface BitfieldInlineField {
  name: string;
  width: number;
  signed?: boolean;
  enum?: string;
  description?: string;
}

export interface BitfieldInlineType {
  kind: 'bitfield';
  base: PrimitiveInt;
  lsb0?: boolean;
  fields: BitfieldInlineField[];
}

export interface StructDef {
  kind: 'struct';
  description?: string;
  align?: number;
  extends?: string;
  fields: FieldDef[];
  assertions?: AssertionDef[];
}

export type TypeRefOrInline =
  | string
  | StringType
  | BytesType
  | PointerType
  | BitfieldInlineType
  | StructDef
  | Primitive;

export interface FieldDef {
  name: string;
  description?: string;
  doc?: string;
  type: TypeRefOrInline;
  offset?: number | string;
  relativeTo?: string;
  align?: number;
  count?: number | string;
  terminator?: number | string;
  length?: number | string;
  switch?: { selector: string; cases: Record<string, TypeRefOrInline>; default?: TypeRefOrInline };
  when?: string;
  transform?: string;
  encoding?: string;
  constraints?: AssertionDef[];
}

export interface AssertionDef {
  expr: string;
  message?: string;
  severity?: 'error' | 'warn';
}

export interface EnumDef {
  kind: 'enum';
  description?: string;
  base: Primitive;
  values: Record<string, number>;
}

export interface BitflagsDef {
  kind: 'bitflags';
  description?: string;
  base: PrimitiveInt;
  bits: Record<string, number | string>;
}

export interface AliasDef {
  kind: 'alias';
  aliasOf: string;
  description?: string;
}

export type TypeDef = StructDef | EnumDef | BitflagsDef | AliasDef;

export interface SectionDef {
  name: string;
  offset: number | string;
  size: number | string;
  align?: number;
  description?: string;
  /** Name of type in 'types' to show when drilling into this section. */
  typeRef?: string;
  /** Type names to show as links to Type reference (no inline struct). When present, expanded content shows these links instead of typeRef drill-down. */
  typeLinks?: string[];
}

export interface BinaryFormatDefinition {
  $schema?: string;
  name: string;
  description?: string;
  endianness: Endianness;
  encoding?: string;
  pointerSize?: number;
  magic?: string;
  version?: string | { offset: number | string; length: number; trimNulls?: boolean; encoding?: string };
  root: string;
  types: Record<string, TypeDef>;
  /** Fragment filenames to load and merge (types/constants). Resolved by the loader. */
  includes?: string[];
  constants?: Record<string, number | string>;
  /** Optional numbered steps explaining a region (e.g. model data). Rendered after layout diagram. */
  layoutSteps?: { title?: string; steps: string[] };
  sections?: SectionDef[];
  assertions?: AssertionDef[];
}

/** Type guard: is the value a valid format definition (minimal check). */
export function isBinaryFormatDefinition(value: unknown): value is BinaryFormatDefinition {
  if (value == null || typeof value !== 'object') return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.name === 'string' &&
    (o.endianness === 'little' || o.endianness === 'big') &&
    typeof o.root === 'string' &&
    o.types != null &&
    typeof o.types === 'object'
  );
}
