import { useState } from 'react';
import type {
  BinaryFormatDefinition,
  TypeDef,
  StructDef,
  EnumDef,
  BitflagsDef,
  AliasDef,
  FieldDef,
  SectionDef,
  AssertionDef,
} from '../../types/binary-format';
import { isBinaryFormatDefinition } from '../../types/binary-format';
import { formatTypeLabel } from './formatTypeLabel';
import './FormatDefinitionViewer.scss';

export interface FormatDefinitionViewerProps {
  /** Format definition JSON (from schema). */
  format: BinaryFormatDefinition | unknown;
  /** Optional class name for the root element. */
  className?: string;
}

/** Humanize section name for display (e.g. "keyList" → "Key list"). */
function sectionLabel(name: string): string {
  if (name === 'header') return 'Header';
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** ID fragment for linking to a type in the Type reference (safe for use in id and href). */
function typeRefId(typeName: string): string {
  return `type-${String(typeName).replace(/\s+/g, '-')}`;
}

/** Render layout step text: backtick-wrapped names that match a type become links to the Type reference. */
function renderStepWithTypeLinks(
  step: string,
  types: Record<string, TypeDef>
) {
  const typeNames = Object.keys(types);
  return step.split(/(`[^`]+`)/g).map((part, j) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const inner = part.slice(1, -1).trim();
      if (typeNames.includes(inner)) {
        return (
          <a key={j} href={`#${typeRefId(inner)}`} className="format-doc__type-link">
            <code>{inner}</code>
          </a>
        );
      }
      return <code key={j}>{inner}</code>;
    }
    return part;
  });
}

export default function FormatDefinitionViewer({ format: raw, className = '' }: FormatDefinitionViewerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!isBinaryFormatDefinition(raw)) {
    return (
      <div className={`format-doc format-doc--error ${className}`.trim()}>
        <p className="format-doc__error">Invalid format definition: missing name, endianness, root, or types.</p>
      </div>
    );
  }

  const format = raw as BinaryFormatDefinition;
  const hasSectionDrillDown =
    format.sections != null &&
    format.sections.length > 0 &&
    format.sections.some((s) => s.typeRef != null || (s.typeLinks != null && s.typeLinks.length > 0));

  const showLayoutDiagram =
    format.sections != null &&
    format.sections.length > 0 &&
    (format.sections.some((s) => typeof s.size === 'number' && s.size > 0) ||
      format.sections.some((s) => typeof s.size === 'string'));

  return (
    <article className={`format-doc ${className}`.trim()}>
      <header className="format-doc__header">
        <h1 className="format-doc__title">{format.name}</h1>
        {format.description && (
          <p className="format-doc__description muted">{format.description}</p>
        )}
      </header>

      <section className="format-doc__meta card">
        <h2 className="format-doc__section-title">Format</h2>
        <dl className="format-doc__dl">
          <dt>Endianness</dt>
          <dd><code>{format.endianness}</code></dd>
          {format.encoding != null && (
            <>
              <dt>Encoding</dt>
              <dd><code>{format.encoding}</code></dd>
            </>
          )}
          <dt>Root type</dt>
          <dd>
            {format.types[format.root] != null ? (
              <a href={`#${typeRefId(format.root)}`} className="format-doc__type-link">
                <code>{format.root}</code>
              </a>
            ) : (
              <code>{format.root}</code>
            )}
          </dd>
          {format.pointerSize != null && (
            <>
              <dt>Pointer size</dt>
              <dd><code>{format.pointerSize} bytes</code></dd>
            </>
          )}
          {format.magic != null && (
            <>
              <dt>Magic</dt>
              <dd><code>{format.magic}</code></dd>
            </>
          )}
          {format.version != null && (
            <>
              <dt>Version</dt>
              <dd>
                {typeof format.version === 'string'
                  ? <code>{format.version}</code>
                  : <code>at offset {String(format.version.offset)}, length {format.version.length}</code>}
              </dd>
            </>
          )}
        </dl>
      </section>

      {showLayoutDiagram && (
        <section className="format-doc__layout-diagram card" aria-label="Binary layout overview">
          <h2 className="format-doc__section-title">Layout</h2>
          <p className="format-doc__layout-diagram-intro muted">
            Visual overview of the file structure (not to scale when sizes are variable).
          </p>
          <div className="format-doc__layout-blocks">
            {format.sections!.map((s: SectionDef) => {
              const sizeNum = typeof s.size === 'number' ? s.size : null;
              const isVariable = sizeNum === null || (sizeNum === 0 && typeof s.offset !== 'number');
              return (
                <button
                  key={s.name}
                  type="button"
                  className="format-doc__layout-block"
                  data-size-known={sizeNum != null && sizeNum > 0}
                  style={sizeNum != null && sizeNum > 0 ? { minHeight: Math.min(100, 24 + sizeNum / 40) } : undefined}
                  title={`Scroll to ${sectionLabel(s.name)}: offset ${formatExpr(s.offset)}, size ${formatExpr(s.size)}`}
                  onClick={() => document.getElementById(`section-${s.name}`)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="format-doc__layout-block-label">{sectionLabel(s.name)}</span>
                  <span className="format-doc__layout-block-meta">
                    {!isVariable && sizeNum != null && sizeNum > 0 ? `${sizeNum} B` : formatExpr(s.size)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="format-doc__layout-legend muted">
            <span>0</span>
            <span>→ file end</span>
          </div>
        </section>
      )}

      {format.layoutSteps != null && Array.isArray(format.layoutSteps.steps) && format.layoutSteps.steps.length > 0 && (
        <section className="format-doc__block card format-doc__layout-steps">
          <h2 className="format-doc__section-title">
            {format.layoutSteps.title ?? 'Layout steps'}
          </h2>
          <ol className="format-doc__layout-steps-list">
            {format.layoutSteps.steps.map((step, i) => (
              <li key={i} className="format-doc__layout-step muted">
                {renderStepWithTypeLinks(step, format.types)}
              </li>
            ))}
          </ol>
        </section>
      )}

      {format.constants != null && Object.keys(format.constants).length > 0 && (
        <section className="format-doc__block card">
          <h2 className="format-doc__section-title">Constants</h2>
          <table className="format-doc__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(format.constants).map(([name, value]) => (
                <tr key={name}>
                  <td><code>{name}</code></td>
                  <td><code>{formatConstantValue(value)}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {format.sections != null && format.sections.length > 0 && (
        hasSectionDrillDown ? (
          <section className="format-doc__block format-doc__sections">
            <h2 className="format-doc__section-title">Sections</h2>
            <p className="format-doc__sections-intro muted">
              Top-level layout of the file. Expand a section to see its structure.
            </p>
            <ul className="format-doc__section-cards">
              {format.sections.map((s: SectionDef) => {
                const hasExpandable =
                  (s.typeRef != null && format.types[s.typeRef] != null) ||
                  (s.typeLinks != null &&
                    s.typeLinks.length > 0 &&
                    s.typeLinks.some((name) => format.types[name] != null));
                const SectionHead = hasExpandable ? 'button' : 'div';
                const sectionHeadProps = hasExpandable
                  ? {
                      type: 'button' as const,
                      onClick: () => setExpandedSection(expandedSection === s.name ? null : s.name),
                      'aria-expanded': expandedSection === s.name,
                    }
                  : {};
                return (
                <li key={s.name} id={`section-${s.name}`} className="format-doc__section-card card">
                  <SectionHead
                    className={`format-doc__section-head${hasExpandable ? '' : ' format-doc__section-head--static'}`}
                    {...sectionHeadProps}
                  >
                    <span className="format-doc__section-name">{sectionLabel(s.name)}</span>
                    <span className="format-doc__section-meta">
                      <code>{formatExpr(s.offset)}</code>
                      <span className="format-doc__section-sep">·</span>
                      <code>{formatExpr(s.size)}</code>
                    </span>
                    {hasExpandable && (
                      <span className="format-doc__section-chevron" aria-hidden data-expanded={expandedSection === s.name}>
                        ▼
                      </span>
                    )}
                  </SectionHead>
                  {s.description && (
                    <p className="format-doc__section-desc muted">{s.description}</p>
                  )}
                  {expandedSection === s.name && (() => {
                    if (s.typeLinks != null && s.typeLinks.length > 0) {
                      const byKind: Record<string, string[]> = { struct: [], enum: [], bitflags: [], alias: [] };
                      const kindOrder = ['struct', 'enum', 'bitflags', 'alias'] as const;
                      const kindLabels: Record<string, string> = { struct: 'Structs', enum: 'Enums', bitflags: 'Bitflags', alias: 'Aliases' };
                      for (const typeName of s.typeLinks) {
                        const def = format.types[typeName];
                        if (def != null && 'kind' in def && byKind[def.kind] != null) {
                          byKind[def.kind].push(typeName);
                        }
                      }
                      const hasAny = kindOrder.some((k) => byKind[k].length > 0);
                      if (!hasAny) return null;
                      return (
                        <div className="format-doc__section-drill format-doc__section-type-links">
                          <p className="format-doc__section-type-links-intro muted">
                            See Type reference for each:
                          </p>
                          {kindOrder.map((kind) => {
                            const names = byKind[kind];
                            if (names.length === 0) return null;
                            return (
                              <div key={kind} className="format-doc__section-type-links-group">
                                <h4 className="format-doc__section-type-links-group-title">{kindLabels[kind]}</h4>
                                <ul className="format-doc__section-type-links-list">
                                  {names.map((typeName) => (
                                    <li key={typeName}>
                                      <a href={`#${typeRefId(typeName)}`} className="format-doc__type-link">
                                        <code>{typeName}</code>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    if (s.typeRef != null && format.types[s.typeRef] != null) {
                      return (
                        <div className="format-doc__section-drill">
                          <TypeBlock name={s.typeRef} def={format.types[s.typeRef]} />
                          {s.typeRef === 'LocalizedString' && format.types['LanguageId'] != null && (
                            <div className="format-doc__section-nested">
                              <TypeBlock name="LanguageId" def={format.types['LanguageId']} />
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <section className="format-doc__block card">
            <h2 className="format-doc__section-title">Sections</h2>
            <table className="format-doc__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Offset</th>
                  <th>Size</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {format.sections.map((s: SectionDef) => (
                  <tr key={s.name} id={`section-${s.name}`}>
                    <td><code>{s.name}</code></td>
                    <td><code>{formatExpr(s.offset)}</code></td>
                    <td><code>{formatExpr(s.size)}</code></td>
                    <td className="muted">{s.description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )
      )}

      {format.assertions != null && format.assertions.length > 0 && (
        <section className="format-doc__block card">
          <h2 className="format-doc__section-title">Assertions</h2>
          <ul className="format-doc__assertions">
            {format.assertions.map((a: AssertionDef, i: number) => (
              <li key={i}>
                <code className="format-doc__expr">{a.expr}</code>
                {a.message && <span className="muted"> — {a.message}</span>}
                {a.severity && a.severity !== 'error' && (
                  <span className="format-doc__severity"> ({a.severity})</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(() => {
        const typeEntries = Object.entries(format.types);
        const showTypeRef = typeEntries.length > 0;
        if (!showTypeRef) return null;
        return (
          <section className="format-doc__block card">
            <h2 className="format-doc__section-title">Type reference</h2>
            {hasSectionDrillDown && (
              <p className="format-doc__types-intro muted">
                Structs, enums, and bitflags referenced by the sections above.
              </p>
            )}
            <div className="format-doc__types">
              {typeEntries.map(([typeName, def]) => (
                <TypeBlock key={typeName} name={typeName} def={def} />
              ))}
            </div>
          </section>
        );
      })()}
    </article>
  );
}

function formatExpr(v: number | string): string {
  if (typeof v === 'number') return String(v);
  return v;
}

/** Serialize a constant for display (strings quoted, objects as JSON). */
function formatConstantValue(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'string') return JSON.stringify(value);
  return String(value);
}

function TypeBlock({ name, def }: { name: string; def: TypeDef }) {
  const id = typeRefId(name);
  return (
    <div id={id} className="format-doc__type" data-kind={(def as TypeDef & { kind: string }).kind}>
      <h3 className="format-doc__type-name">
        <code>{name}</code>
        {'kind' in def && <span className="format-doc__kind">{(def as TypeDef & { kind: string }).kind}</span>}
      </h3>
      {'description' in def && def.description && (
        <p className="format-doc__type-desc muted">{def.description}</p>
      )}
      {def.kind === 'struct' && (def as StructDef).fields.length > 0 && <StructTable def={def as StructDef} />}
      {def.kind === 'enum' && Object.keys((def as EnumDef).values).length > 0 && <EnumList def={def as EnumDef} />}
      {def.kind === 'bitflags' && Object.keys((def as BitflagsDef).bits).length > 0 && <BitflagsList def={def as BitflagsDef} />}
      {def.kind === 'alias' && (
        <p className="format-doc__alias">
          Alias of <code>{(def as AliasDef).aliasOf}</code>
        </p>
      )}
    </div>
  );
}

function StructTable({ def }: { def: StructDef }) {
  return (
    <table className="format-doc__table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Offset / Count / Length</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {def.fields.map((f: FieldDef) => (
          <tr key={f.name}>
            <td><code>{f.name}</code></td>
            <td><code>{formatTypeLabel(f.type)}</code></td>
            <td className="format-doc__meta-cell">
              {f.offset != null && <span>offset {formatExpr(f.offset)}</span>}
              {f.count != null && <span>count {formatExpr(f.count)}</span>}
              {f.length != null && <span>length {formatExpr(f.length)}</span>}
              {f.offset == null && f.count == null && f.length == null && '—'}
            </td>
            <td className="muted">{f.description ?? f.doc ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EnumList({ def }: { def: EnumDef }) {
  return (
    <table className="format-doc__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(def.values).map(([n, v]) => (
          <tr key={n}>
            <td><code>{n}</code></td>
            <td><code>{v}</code></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function BitflagsList({ def }: { def: BitflagsDef }) {
  return (
    <table className="format-doc__table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Bit / Mask</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(def.bits).map(([n, v]) => (
          <tr key={n}>
            <td><code>{n}</code></td>
            <td><code>{String(v)}</code></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
