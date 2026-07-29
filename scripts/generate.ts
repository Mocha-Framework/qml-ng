import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, relative, dirname } from 'path';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface QmlSignalParam {
  type: string;
  name: string;
}

interface QmlProperty {
  name: string;
  type: string;
  defaultValue: string;
  isAlias: boolean;
  isReadonly: boolean;
  isDefault: boolean;
  isInternal: boolean;
  description: string;
  enumValues: string[] | null;
}

interface QmlSignal {
  name: string;
  params: QmlSignalParam[];
  description: string;
}

interface QmlFunction {
  name: string;
  params: { type: string; name: string }[];
  returns: string;
  description: string;
}

interface QmlComponentSpec {
  qmlFile: string;
  name: string;
  selector: string;
  category: string;
  subcategory: string;
  isInternal: boolean;
  extends: string;
  hasAdapter: boolean;
  adapterComponent: string | null;
  adapterPackage: string | null;
  properties: QmlProperty[];
  signals: QmlSignal[];
  functions: QmlFunction[];
  defaultSlot: string | null;
  extraSlots: string[];
}

interface AngularComponentFile {
  importPath: string;
  componentClass: string;
}

// ─────────────────────────────────────────────
// Paths
// ─────────────────────────────────────────────

const ROOT = join(import.meta.dirname, '..', '..', '..');
const DESIGN_SYSTEM = join(ROOT, 'design-system', 'MochaDS');
const QML_NG = join(ROOT, 'packages', 'qml-ng');
const ANGULAR_PKG = join(ROOT, 'packages', 'angular');
const REGISTRY_DIR = join(QML_NG, 'registry');
const COMPONENTS_DIR = join(QML_NG, 'src', 'components');
const SHARED_DIR = join(QML_NG, 'src', 'shared');

const OUTPUT_REGISTRY = join(REGISTRY_DIR, 'component-map.json');
const OUTPUT_INDEX = join(QML_NG, 'src', 'index.ts');

// ─────────────────────────────────────────────
// Known QML internal types (not exposed as standalone components)
// ─────────────────────────────────────────────

const INTERNAL_COMPONENTS = new Set([
  'CozySpinner', 'FocusRing', 'ScrollBar', 'ThemeGenerated', 'Theme',
  'MochaI18n', 'Pipes', 'LucideIcon', 'Transition', 'Animation',
  'Case', 'Switcher',
]);

// ─────────────────────────────────────────────
// Category classification
// ─────────────────────────────────────────────

interface CategoryRule {
  keywords: string[];
  category: string;
  subcategory: string;
}

const CATEGORY_RULES: CategoryRule[] = [
  { keywords: ['Button', 'ToggleButton'], category: 'input', subcategory: 'button' },
  { keywords: ['TextField', 'Input', 'TextInput', 'Checkbox', 'Switch', 'Slider', 'Select', 'DatePicker', 'ColorPicker', 'RadioButton', 'RadioGroup', 'PinInput', 'RangeSelector'], category: 'input', subcategory: 'form' },
  { keywords: ['Form', 'FormField', 'FormController', 'DynamicForm', 'TextEditor', 'AdvancedSelect', 'AdvancedTextEditor'], category: 'input', subcategory: 'form' },
  { keywords: ['Box', 'Div', 'Span', 'Item', 'Rectangle'], category: 'layout', subcategory: 'primitives' },
  { keywords: ['VStack', 'HStack', 'AdaptiveStack', 'CozyGrid', 'CozyGridCol', 'CozyList'], category: 'layout', subcategory: 'stack' },
  { keywords: ['Grid'], category: 'layout', subcategory: 'grid' },
  { keywords: ['H1', 'H2', 'H3', 'H4', 'P', 'Text'], category: 'typography', subcategory: 'text' },
  { keywords: ['Card', 'Tile', 'Accordion', 'Modal', 'Drawer', 'Overlay', 'Dropdown', 'Popover', 'HoverCard', 'Tooltip', 'ContextMenu'], category: 'container', subcategory: 'surface' },
  { keywords: ['Tabs', 'Steps', 'StepsSlider', 'Stepper', 'Breadcrumb', 'Pagination', 'Paginator', 'ItemsPerPage', 'NavigationBar', 'NavigationItem', 'Sidebar', 'SidebarItem', 'SidebarSection', 'SidebarHeader', 'SidebarFooter', 'Shell'], category: 'navigation', subcategory: 'nav' },
  { keywords: ['Table', 'TreeTable', 'DataGrid', 'Tag', 'Badge', 'Avatar', 'ProgressBar', 'SteppedProgress', 'Separator', 'Skeleton', 'CozySkeleton', 'EmptyState', 'Carousel', 'HeroCarousel'], category: 'display', subcategory: 'data' },
  { keywords: ['BarChart', 'LineChart', 'PieChart', 'GaugeChart', 'RadarChart', 'ChartTooltip'], category: 'display', subcategory: 'chart' },
  { keywords: ['AlertDialog', 'Toast', 'ToastManager'], category: 'feedback', subcategory: 'alert' },
  { keywords: ['FadeIn', 'FadeOut', 'SlideUp', 'SlideDown', 'SlideLeft', 'SlideRight', 'SlideOutUp', 'SlideOutDown', 'Bounce', 'Spin', 'Flip', 'ZoomIn', 'GlowPulse', 'StripedFill', 'AnimatedNumber', 'AnimatedPresence', 'AnimateList', 'Particles'], category: 'animation', subcategory: 'transition' },
  { keywords: ['Router', 'Route', 'RouterLink'], category: 'router', subcategory: 'routing' },
  { keywords: ['ApplicationWindow', 'Window'], category: 'shell', subcategory: 'window' },
  { keywords: ['Repeater', 'Loader', 'Image', 'MouseArea', 'Flickable', 'ScrollView', 'Canvas', 'AnimatedImage', 'BorderImage'], category: 'qtquick', subcategory: 'builtin' },
  { keywords: ['SortableList', 'InteractiveListCell', 'Draggable', 'DropZone', 'SelectTree'], category: 'interactive', subcategory: 'drag' },
  { keywords: ['MochaLogo', 'MochaMap', 'LucideIcon'], category: 'misc', subcategory: 'brand' },
  { keywords: ['MediaQuery', 'CozyColorPicker'], category: 'utility', subcategory: 'helper' },
];

function classifyComponent(name: string): { category: string; subcategory: string } {
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.includes(name)) {
      return { category: rule.category, subcategory: rule.subcategory };
    }
  }
  return { category: 'other', subcategory: 'unknown' };
}

// ─────────────────────────────────────────────
// Adapter map: QML component name → @mocha-ds/angular equivalent
// ─────────────────────────────────────────────

interface AdapterInfo {
  componentClass: string;
  importPath: string;
  propMap: Record<string, string>;  // QML prop → Angular input
  signalMap: Record<string, string>; // QML signal → Angular output
}

const ADAPTER_MAP: Record<string, AdapterInfo> = {
  Button: { componentClass: 'ButtonComponent', importPath: '@mocha-ds/angular', propMap: { variant: 'variant', color: 'color', size: 'size', shape: 'shape', disabled: 'disabled', isLoading: 'isLoading' }, signalMap: {} },
  TextField: { componentClass: 'InputComponent', importPath: '@mocha-ds/angular', propMap: { size: 'size', shape: 'shape', color: 'color', disabled: 'disabled' }, signalMap: {} },
  Checkbox: { componentClass: 'CheckboxComponent', importPath: '@mocha-ds/angular', propMap: { checked: 'checked', label: 'label', disabled: 'disabled', color: 'color' }, signalMap: {} },
  Switch: { componentClass: 'SwitchComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Slider: { componentClass: 'SliderComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Select: { componentClass: 'SelectComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Modal: { componentClass: 'ModalComponent', importPath: '@mocha-ds/angular', propMap: { open: 'isOpen', title: 'title', size: 'size', closeOnBackdropClick: 'closeOnOverlayClick', closeOnEscape: 'closeOnEsc', showCloseButton: 'showCloseButton' }, signalMap: { rejected: 'close' } },
  Card: { componentClass: 'CardComponent', importPath: '@mocha-ds/angular', propMap: { variant: 'variant', padding: 'padding' }, signalMap: {} },
  Tabs: { componentClass: 'TabsComponent', importPath: '@mocha-ds/angular', propMap: { variant: 'variant' }, signalMap: { tabSelected: 'valueChange' } },
  Badge: { componentClass: 'BadgeComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Avatar: { componentClass: 'AvatarComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  ProgressBar: { componentClass: 'ProgressBarComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Breadcrumb: { componentClass: 'BreadcrumbComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Paginator: { componentClass: 'PaginationComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Steps: { componentClass: 'StepsComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  StepsSlider: { componentClass: 'StepsSliderComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Stepper: { componentClass: 'StepperComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Accordion: { componentClass: 'CptAccordionComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Drawer: { componentClass: 'DrawerComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Dropdown: { componentClass: 'DropdownComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Tooltip: { componentClass: 'TooltipDirective', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Popover: { componentClass: 'PopoverComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  HoverCard: { componentClass: 'HoverCardComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Toast: { componentClass: 'ToasterComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Tile: { componentClass: 'TileComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Sidebar: { componentClass: 'SidebarComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Shell: { componentClass: 'ShellComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  DatePicker: { componentClass: 'DatePickerComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Skeleton: { componentClass: 'SkeletonComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Carousel: { componentClass: 'CarouselComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Table: { componentClass: 'TableComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  TreeTable: { componentClass: 'TreeTableComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Grid: { componentClass: 'GridComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  DynamicForm: { componentClass: 'DynamicFormComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  FormGroup: { componentClass: 'FormGroupComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
  Input: { componentClass: 'InputComponent', importPath: '@mocha-ds/angular', propMap: { size: 'size', shape: 'shape', color: 'color' }, signalMap: {} },
  NumberInput: { componentClass: 'InputComponent', importPath: '@mocha-ds/angular', propMap: {}, signalMap: {} },
};

// ─────────────────────────────────────────────
// QML Parser
// ─────────────────────────────────────────────

function parseQmlFile(filePath: string): QmlComponentSpec {
  const source = readFileSync(filePath, 'utf-8');
  const lines = source.split('\n');
  const props: QmlProperty[] = [];
  const signals: QmlSignal[] = [];
  const functions: QmlFunction[] = [];
  let defaultSlot: string | null = null;
  const extraSlots: string[] = [];
  let extendsType = 'Item';

  // Find root element type
  const rootMatch = source.match(/^\s*(\w+)\s*\{/m);
  if (rootMatch) {
    extendsType = rootMatch[1];
  }

  // Parse properties, signals, functions with their doc comments
  let pendingDoc = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Accumulate comments
    const commentMatch = line.match(/^\s*\/\/\s*(.+)/);
    if (commentMatch) {
      pendingDoc += (pendingDoc ? ' ' : '') + commentMatch[1].trim();
      continue;
    }

    // Parse `property <type> <name>: <default>`
    const propMatch = line.match(/^\s*(readonly\s+)?property\s+(alias|(\w+))\s+(\w+)\s*(:\s*(.+))?/);
    if (propMatch) {
      const isReadonly = !!propMatch[1];
      const isAlias = propMatch[2] === 'alias';
      const propType = isAlias ? 'alias' : propMatch[3];
      const propName = propMatch[4];
      const defaultValue = propMatch[6]?.trim() || '';
      // Strip inline comments from default value
      const cleanDefault = defaultValue.replace(/\s*\/\/.*$/, '').trim();
      const isDefault = line.includes('default property');
      const isInternal = propName.startsWith('_') || propName === 'id' || propName === 'objectName';

      // Extract enum values from type annotations in comments
      const enumMatch = pendingDoc.match(/\bValues?:\s*(.+?)(?:\.|$)/);
      const enumValues = enumMatch
        ? enumMatch[1].split('|').map(s => s.trim().replace(/^"(.*)"$/, '$1')).filter(Boolean)
        : null;

      // Deduplicate: remove previous property with same name
      const existingIdx = props.findIndex(p => p.name === propName);
      if (existingIdx >= 0) props.splice(existingIdx, 1);

      const prop: QmlProperty = {
        name: propName,
        type: propType,
        defaultValue: cleanDefault,
        isAlias,
        isReadonly,
        isDefault,
        isInternal,
        description: pendingDoc,
        enumValues,
      };
      props.push(prop);

      if (isDefault && isAlias) {
        defaultSlot = propName;
      }
      if (isAlias && !isDefault) {
        extraSlots.push(propName);
      }
    }

    // Parse `signal <name>(<params>)`
    const sigMatch = line.match(/^\s*signal\s+(\w+)\s*\(([^)]*)\)/);
    if (sigMatch) {
      const sigName = sigMatch[1];
      const paramsStr = sigMatch[2].trim();
      const params: QmlSignalParam[] = paramsStr
        ? paramsStr.split(',').map(p => {
            const parts = p.trim().split(/\s+/);
            return { type: parts[0] || 'var', name: parts[1] || `p${parts[0]}` };
          })
        : [];

      signals.push({
        name: sigName,
        params,
        description: pendingDoc,
      });
    }

    // Parse `function <name>(<params>): <type> {`
    const fnMatch = line.match(/^\s*function\s+(\w+)\s*\(([^)]*)\)\s*(:\s*(\w+))?\s*\{/);
    if (fnMatch) {
      const fnName = fnMatch[1];
      const paramsStr = fnMatch[2].trim();
      const returns = fnMatch[4] || 'void';
      const params: { type: string; name: string }[] = paramsStr
        ? paramsStr.split(',').map(p => {
            const parts = p.trim().split(/\s+/);
            return { type: parts[0] || 'var', name: parts[1] || `p` };
          })
        : [];

      functions.push({
        name: fnName,
        params,
        returns,
        description: pendingDoc,
      });
    }

    // Reset pending doc if line is not a comment (unless it's a continuation)
    if (!line.trim().startsWith('//')) {
      if (!line.trim().startsWith('property') && !line.trim().startsWith('signal') && !line.trim().startsWith('function') && !line.trim().startsWith('readonly')) {
        if (!line.match(/^\s*(default\s+)?property\s+/) && !line.match(/^\s*(readonly\s+)?property\s+alias\s+/)) {
          pendingDoc = '';
        }
      }
    }
  }

  const name = filePath.split('/').pop()!.replace('.qml', '');
  const { category, subcategory } = classifyComponent(name);
  const isInternal = INTERNAL_COMPONENTS.has(name) || category === 'qtquick';
  const adapter = ADAPTER_MAP[name];

  // Determine selector
  const selector = determineSelector(name, category);

  return {
    qmlFile: filePath,
    name,
    selector,
    category,
    subcategory,
    isInternal,
    extends: extendsType,
    hasAdapter: !!adapter,
    adapterComponent: adapter?.componentClass ?? null,
    adapterPackage: adapter?.importPath ?? null,
    properties: props,
    signals,
    functions,
    defaultSlot,
    extraSlots,
  };
}

function determineSelector(name: string, _category: string): string {
  // Native HTML elements that conflict - prefix with qml-
  const htmlConflicts = new Set([
    'Button', 'Input', 'Select', 'Table', 'Form', 'Option',
    'Label', 'Link', 'Menu', 'Nav', 'Section', 'Header', 'Footer',
    'Main', 'Aside', 'Details', 'Summary',
  ]);

  // These already have clear custom elements
  const customElements = new Set([
    'Modal', 'Drawer', 'Dropdown', 'Tooltip', 'Popover', 'HoverCard',
    'Toast', 'Badge', 'Avatar', 'Card', 'Tile', 'Accordion',
    'Sidebar', 'Shell', 'Grid', 'Steps', 'Stepper', 'Breadcrumb',
    'Pagination', 'ProgressBar', 'Skeleton', 'Carousel',
    'DatePicker', 'ColorPicker', 'Slider', 'Switch', 'Checkbox',
    'Tabs', 'TreeTable', 'Kanban', 'DynamicForm', 'FormGroup',
  ]);

  if (name === 'Button') return 'qml-button';
  if (name === 'Input' || name === 'TextField' || name === 'TextInput') return 'qml-text-field';
  if (name === 'Select') return 'qml-select';
  if (name === 'Table') return 'qml-table';
  if (name === 'Form') return 'qml-form';
  if (name === 'Option') return 'qml-option';

  // QML-internal names that need prefix
  if (name === 'Item' || name === 'Rectangle' || name === 'Image' ||
      name === 'Loader' || name === 'Canvas' || name === 'Text') {
    return name === 'Text' ? 'qml-text' : name.toLowerCase();
  }

  // Layout primitives: Div, Span, HStack, VStack, Box can use the name directly
  if (['VStack', 'HStack', 'Box', 'Div', 'Span', 'AdaptiveStack'].includes(name)) {
    return name;
  }

  // Typography
  if (['H1', 'H2', 'H3', 'H4', 'P'].includes(name)) {
    return name;
  }

  // For everything else, use the name as-is (Angular supports capital letters)
  return name;
}

// ─────────────────────────────────────────────
// Type mapping: QML type → TypeScript type
// ─────────────────────────────────────────────

function qmlTypeToTS(qmlType: string): string {
  const map: Record<string, string> = {
    string: 'string',
    int: 'number',
    real: 'number',
    double: 'number',
    bool: 'boolean',
    color: 'string',
    var: 'unknown',
    url: 'string',
    list: 'unknown[]',
    font: 'string',
    alias: 'unknown',
    Component: 'unknown',
  };
  return map[qmlType] || 'unknown';
}

const THEME_TOKENS: Record<string, string> = {
  'Theme.spacing.xs': '4',
  'Theme.spacing.sm': '8',
  'Theme.spacing.md': '12',
  'Theme.spacing.lg': '16',
  'Theme.spacing.xl': '24',
  'Theme.spacing.xxl': '32',
  'Theme.geometry.radiusSm': '6',
  'Theme.geometry.radiusMd': '12',
  'Theme.geometry.radiusLg': '18',
  'Theme.geometry.radiusPill': '9999',
  'Theme.geometry.borderSm': '1',
  'Theme.geometry.borderMd': '2',
  'Theme.typography.sizeXs': '10',
  'Theme.typography.sizeSm': '12',
  'Theme.typography.sizeMd': '14',
  'Theme.typography.sizeLg': '16',
  'Theme.typography.sizeH2': '20',
};

function qmlDefaultToTS(raw: string, qmlType: string): string {
  let trimmed = raw.trim();
  // Strip QML-style quotes (the regex captures the quotes as part of the value)
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1);
  }

  if (trimmed === '' || trimmed === 'undefined') {
    if (qmlType === 'string' || qmlType === 'color' || qmlType === 'url') return '""';
    if (qmlType === 'var' || qmlType === 'alias') return 'undefined';
    return 'undefined';
  }

  // Boolean
  if (trimmed === 'false') return 'false';
  if (trimmed === 'true') return 'true';

  // Arrays
  if (trimmed === '[]') return '[]';
  if (trimmed === '{}') return '{}';

  // Numeric — but only if type expects number
  if (!isNaN(Number(trimmed))) {
    if (qmlType === 'int' || qmlType === 'real' || qmlType === 'double') return trimmed;
    if (qmlType === 'string' || qmlType === 'color' || qmlType === 'url') return `"${trimmed}"`;
    return trimmed;
  }

  // Theme references — map to actual pixel values
  if (trimmed.startsWith('Theme.')) {
    const resolved = THEME_TOKENS[trimmed];
    if (resolved) return resolved;
    // Unknown Theme reference — use type-safe default
    if (qmlType === 'string' || qmlType === 'color' || qmlType === 'url') return '""';
    if (qmlType === 'int' || qmlType === 'real' || qmlType === 'double') return '0';
    return 'undefined';
  }

  // Complex expressions — return type-safe default
  if (/[?:\s]/.test(trimmed) || trimmed.includes('Math.') || trimmed.includes('Qt.') || trimmed.includes('function') || trimmed.includes('(')) {
    return typeSafeDefault(qmlType);
  }

  // String values — but only if type expects string
  if (qmlType === 'string' || qmlType === 'color' || qmlType === 'url') return `"${trimmed}"`;
  if (qmlType === 'int' || qmlType === 'real' || qmlType === 'double') return '0';
  if (qmlType === 'bool') return 'false';
  if (qmlType === 'var' || qmlType === 'alias') {
    if (trimmed === 'null') return 'null';
    if (trimmed === 'undefined' || trimmed === '') return 'undefined';
    if (trimmed === 'false' || trimmed === 'true') return trimmed;
    if (!isNaN(Number(trimmed))) return trimmed;
    return `"${trimmed}"`;
  }

  // Default to string
  return `"${trimmed}"`;
}

function typeSafeDefault(qmlType: string): string {
  if (qmlType === 'string' || qmlType === 'url' || qmlType === 'color') return '""';
  if (qmlType === 'int' || qmlType === 'real' || qmlType === 'double') return '0';
  if (qmlType === 'bool') return 'false';
  return 'undefined';
}

// ─────────────────────────────────────────────
// Code Generation Templates
// ─────────────────────────────────────────────

function sanitizeName(name: string): string {
  // Remove non-alphanumeric characters except underscore
  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

function generateAdapterComponent(spec: QmlComponentSpec): string {
  const { name, properties, signals, selector, adapterComponent } = spec;
  const publicProps = properties.filter(p => !p.isInternal && !p.isReadonly && !p.isAlias && p.name !== 'data');
  const publicSignals = signals;
  const adapter = ADAPTER_MAP[name];

  // Determine which imports are needed
  const imports: string[] = [];
  const inputProps: string[] = [];
  const outputEmitters: string[] = [];
  const computedFields: string[] = [];
  const bodyContent: string[] = [];

  // Build imports
  imports.push(`import { Component, input, output, computed } from '@angular/core';`);
  if (adapter) {
    imports.push(`import { ${adapter.componentClass} } from '${adapter.importPath}';`);
  }

  // Build input() signals for public properties
  for (const prop of publicProps) {
    const tsType = qmlTypeToTS(prop.type);
    const def = qmlDefaultToTS(prop.defaultValue, prop.type);
    const fieldName = prop.name;
    inputProps.push(`  ${fieldName} = input<${tsType}>(${def});`);
  }

  // Build output() emitters for signals
  for (const sig of signals) {
    const params = sig.params.map(p => `${p.name}: ${qmlTypeToTS(p.type)}`).join(', ');
    const emitType = params ? `{ ${params} }` : 'void';
    outputEmitters.push(`  ${sig.name} = output<${emitType}>();`);
  }

  // Build special computed fields (variant resolution)
  if (name === 'Button') {
    computedFields.push(`
  protected resolvedVariant = computed(() => {
    const semantic: Record<string, string> = {
      primary: 'filled', secondary: 'outline', danger: 'filled',
      success: 'filled', warning: 'filled', info: 'filled',
    };
    return semantic[this.variant()] ?? this.variant();
  });

  protected resolvedColor = computed(() => {
    const semantic: Record<string, string> = {
      primary: 'mauve', danger: 'red', success: 'green',
      warning: 'yellow', info: 'sky', secondary: 'surface0',
    };
    return semantic[this.variant()] ?? this.color();
  });
`);
  }

  // Build template
  const template = generateAdapterTemplate(spec);

  // Build body class
  const classBody = [
    ...inputProps,
    '',
    ...outputEmitters,
    '',
    ...computedFields,
  ].join('\n');

  return `// Auto-generated from ${spec.qmlFile.replace(ROOT + '/', '')}
// Do not edit manually. Run \`pnpm generate\` to regenerate.

${imports.join('\n')}

@Component({
  selector: '${selector}',
  standalone: true,
  host: {
    '[attr.data-qml-component]': '"${name.toLowerCase()}"',
  },
  template: \`${template}\`,
})
export class ${sanitizeName(name)} {
${classBody}
  ${generateEventHandlers(spec)}
}
`;
}

function generateAdapterTemplate(spec: QmlComponentSpec): string {
  const { name } = spec;

  // For Button, generate a button element with all proper bindings
  if (name === 'Button') {
    return `
    <button
      [attr.data-variant]="resolvedVariant()"
      [attr.data-color]="resolvedColor()"
      [attr.data-size]="size()"
      [attr.data-shape]="shape()"
      [disabled]="disabled() || isLoading()"
      (click)="handleClick()"
    >
      @if (leftIcon(); as icon) {
        <qml-icon [name]="icon"></qml-icon>
      }
      {{ text() }}
      @if (rightIcon(); as icon) {
        <qml-icon [name]="icon"></qml-icon>
      }
      <ng-content></ng-content>
    </button>`;
  }

  if (name === 'VStack') {
    return `
    <ng-content></ng-content>`;
  }

  if (name === 'HStack') {
    return `
    <ng-content></ng-content>`;
  }

  if (name === 'Box') {
    return `
    <div [style.padding.px]="resolvedPadding()" [style.margin.px]="resolvedMargin()">
      <ng-content></ng-content>
    </div>`;
  }

  if (name === 'Text' || name === 'H1' || name === 'H2' || name === 'H3' || name === 'H4' || name === 'P') {
    return `
    {{ text() }}
    <ng-content></ng-content>`;
  }

  if (name === 'Div') {
    return `<ng-content></ng-content>`;
  }

  if (name === 'Span') {
    return `<ng-content></ng-content>`;
  }

  if (name === 'Modal') {
    return `
    @if (open()) {
      <div class="qml-modal-backdrop" (click)="handleBackdropClick()"></div>
      <div class="qml-modal-container" [class]="'qml-modal-' + size()">
        @if (showCloseButton()) {
          <button class="qml-modal-close" (click)="handleClose()">&times;</button>
        }
        @if (title(); as t) {
          <div class="qml-modal-header">
            <h2>{{ t }}</h2>
            @if (subtitle(); as s) { <p>{{ s }}</p> }
          </div>
        }
        <div class="qml-modal-body">
          <ng-content></ng-content>
        </div>
        @if (hasFooterContent()) {
          <div class="qml-modal-footer">
            <ng-content select="[footer]"></ng-content>
          </div>
        }
      </div>
    }`;
  }

  if (name === 'Card') {
    return `
    <div class="qml-card" [class]="'qml-card-' + variant()">
      @if (title() || subtitle() || icon()) {
        <div class="qml-card-header">
          @if (icon(); as i) { <qml-icon [name]="i"></qml-icon> }
          <div>
            @if (title(); as t) { <h3>{{ t }}</h3> }
            @if (subtitle(); as s) { <p>{{ s }}</p> }
          </div>
        </div>
      }
      <div class="qml-card-body">
        <ng-content></ng-content>
      </div>
      @if (footer().length) {
        <div class="qml-card-footer"><ng-content select="[footer]"></ng-content></div>
      }
    </div>`;
  }

  if (name === 'Tabs') {
    return `
    <div class="qml-tabs" [class]="'qml-tabs-' + variant()">
      <div class="qml-tabs-list">
        @for (tab of $tabsList(); track $index) {
          <button
            class="qml-tabs-trigger"
            [class.active]="$index === currentIndex()"
            (click)="selectTab($index)"
          >
            @if (tab.icon) { <qml-icon [name]="tab.icon"></qml-icon> }
            {{ tab.label }}
          </button>
        }
      </div>
      <div class="qml-tabs-content">
        <ng-content></ng-content>
      </div>
    </div>`;
  }

  // Generic fallback
  return `<ng-content></ng-content>`;
}

function generateEventHandlers(spec: QmlComponentSpec): string {
  const parts: string[] = [];

  if (spec.name === 'Button') {
    parts.push(`
  protected handleClick(): void {
    if (!this.disabled() && !this.isLoading()) {
      this.clicked.emit();
    }
  }
`);
  }

  if (spec.name === 'Modal') {
    parts.push(`
  protected handleClose(): void {
    this.open.set(false);
    this.rejected.emit();
    this.closed.emit();
  }

  protected handleBackdropClick(): void {
    if (this.closeOnBackdropClick()) {
      this.handleClose();
    }
  }

  protected hasFooterContent = computed(() => false);
`);
  }

  if (spec.name === 'Tabs') {
    parts.push(`
  protected $tabsList = computed(() => {
    const model = this.model();
    if (!Array.isArray(model)) return [];
    return model.map((item: any, idx: number) => {
      if (typeof item === 'string') return { id: item, label: item, icon: '' };
      return { id: item.id ?? String(idx), label: item.label ?? '', icon: item.icon ?? '' };
    });
  });

  protected selectTab(index: number): void {
    this.currentIndex.set(index);
    const tab = this.\$tabsList()[index];
    this.tabSelected.emit({ index, tabId: tab.id });
  }
`);
  }

  if (spec.name === 'Checkbox') {
    parts.push(`
  protected toggle(): void {
    if (!this.disabled()) {
      this.checked.set(!this.checked());
      this.toggled.emit({ isChecked: this.checked() });
    }
  }
`);
  }

  return parts.join('\n');
}

function generateStandaloneComponent(spec: QmlComponentSpec): string {
  const { name, properties, signals, selector } = spec;
  const publicProps = properties.filter(p => !p.isInternal && !p.isReadonly && !p.isAlias && p.name !== 'data');

  const inputSignals: string[] = [];
  for (const prop of publicProps) {
    const tsType = qmlTypeToTS(prop.type);
    const def = qmlDefaultToTS(prop.defaultValue, prop.type);
    inputSignals.push(`  ${prop.name} = input<${tsType}>(${def});`);
  }

  const hostBindings: string[] = [];
  const template = generateAdapterTemplate(spec);

  // Generate host bindings for layout components
  if (name === 'VStack' || name === 'HStack') {
    hostBindings.push(`  host: {
    '[style.display]': '"flex"',
    '[style.flex-direction]': 'reverse() ? "${name === 'VStack' ? 'column-reverse' : 'row-reverse'}" : "${name === 'VStack' ? 'column' : 'row'}"',
    '[style.gap.px]': 'spacing()',
    '[style.justify-content]': 'justifyCSS()',
    '[style.align-items]': 'alignCSS()',
    '[style.flex-wrap]': 'wrap() ? "wrap" : "nowrap"',
    '[attr.data-qml-component]': '"${name.toLowerCase()}"',
  },`);
  }

  if (name === 'Box') {
    hostBindings.push(`  host: {
    '[attr.data-qml-component]': '"box"',
  },`);
  }

  const signalOutputs: string[] = [];
  for (const sig of signals) {
    const params = sig.params.map(p => `${p.name}: ${qmlTypeToTS(p.type)}`).join(', ');
    const emitType = params ? `{ ${params} }` : 'void';
    signalOutputs.push(`  ${sig.name} = output<${emitType}>();`);
  }

  const layoutHelpers = (name === 'VStack' || name === 'HStack') ? [
    `  protected justifyCSS = computed(() => {
    const map: Record<string, string> = {
      start: 'flex-start', center: 'center', end: 'flex-end',
      between: 'space-between', around: 'space-around', evenly: 'space-evenly',
    };
    return map[this.justifyContent()] ?? 'flex-start';
  });

  protected alignCSS = computed(() => {
    const map: Record<string, string> = {
      start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch',
    };
    return map[this.alignItems()] ?? '${name === 'VStack' ? 'stretch' : 'center'}';
  });`,
  ] : [];

  const boxHelpers = (name === 'Box') ? [
    `  protected resolvedPadding = computed(() => ${'0'});`,
    `  protected resolvedMargin = computed(() => ${'0'});`,
  ] : [];

  const bodyLines = [
    'export class ' + sanitizeName(name) + ' {',
    ...inputSignals,
    ...(signalOutputs.length ? ['', ...signalOutputs] : []),
    ...layoutHelpers,
    ...boxHelpers,
    '}',
  ];

  const decoratorLines = [
    `@Component({`,
    `  selector: '${selector}',`,
    `  standalone: true,`,
    ...hostBindings,
    `  template: \`${template}\`,`,
    `})`,
  ];

  const imports = [
    `import { Component, input, output, computed } from '@angular/core';`,
  ];

  return `
// Auto-generated from ${spec.qmlFile.replace(ROOT + '/', '')}
// Do not edit manually. Run \`pnpm generate\` to regenerate.

${imports.join('\n')}

${decoratorLines.join('\n')}
${bodyLines.join('\n')}
`;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────

function getAllQmlFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter(f => f.endsWith('.qml'))
    .map(f => join(dir, f))
    .sort();
}

function main() {
  console.log('🔍 Scanning MochaDS components...');

  const qmlFiles = getAllQmlFiles(DESIGN_SYSTEM);
  console.log(`  Found ${qmlFiles.length} QML files.`);

  // Parse all QML files
  const specs: QmlComponentSpec[] = [];
  for (const file of qmlFiles) {
    try {
      const spec = parseQmlFile(file);
      specs.push(spec);
      const marker = spec.isInternal ? '⚙' : spec.hasAdapter ? '🔌' : '📦';
      const pCount = spec.properties.filter(p => !p.isInternal).length;
      const sCount = spec.signals.length;
      console.log(`  ${marker} ${spec.name.padEnd(20)} ${'[' + spec.category + '/' + spec.subcategory + ']'.padEnd(20)} props:${pCount} signals:${sCount}`);
    } catch (err) {
      console.error(`  ❌ Error parsing ${file}:`, err);
    }
  }

  // Ensure directories exist
  for (const dir of [REGISTRY_DIR, COMPONENTS_DIR, SHARED_DIR]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  // Generate registry
  console.log('\n📝 Generating registry...');
  const publicSpecs = specs.filter(s => !s.isInternal);
  const registry = {
    generated: new Date().toISOString(),
    totalComponents: specs.length,
    publicComponents: publicSpecs.length,
    internalComponents: specs.filter(s => s.isInternal).length,
    components: specs.map(s => ({
      name: s.name,
      selector: s.selector,
      category: s.category,
      subcategory: s.subcategory,
      isInternal: s.isInternal,
      hasAdapter: s.hasAdapter,
      extends: s.extends,
      propertyCount: s.properties.filter(p => !p.isInternal).length,
      signalCount: s.signals.length,
      functionCount: s.functions.length,
    })),
  };
  writeFileSync(OUTPUT_REGISTRY, JSON.stringify(registry, null, 2));
  console.log(`  Written to ${OUTPUT_REGISTRY}`);

  // Generate component files
  console.log('\n🏗  Generating Angular components...');
  let generatedCount = 0;
  const exportNames: string[] = [];

  for (const spec of publicSpecs) {
    let code: string;
    if (spec.hasAdapter) {
      code = generateAdapterComponent(spec);
    } else {
      code = generateStandaloneComponent(spec);
    }

    const outputFile = join(COMPONENTS_DIR, `${spec.name}.ts`);
    // Skip files that have been manually refined ("Refined manually" in first line)
    if (existsSync(outputFile)) {
      const existing = readFileSync(outputFile, 'utf-8');
      if (existing.startsWith('// Refined')) {
        exportNames.push(spec.name);
        continue;
      }
    }
    writeFileSync(outputFile, code);
    exportNames.push(spec.name);
    generatedCount++;
  }

  // If no components have adapter, the standalone generators still fire.
  // For special components like Icon, generate it manually first pass.
  if (!publicSpecs.some(s => s.name === 'Icon')) {
    const iconCode = generateIconComponent();
    writeFileSync(join(COMPONENTS_DIR, 'Icon.ts'), iconCode);
    exportNames.push('Icon');
    generatedCount++;
  }

  // Generate index.ts barrel
  const exports = exportNames
    .filter(n => n !== 'data' && n !== 'id')
    .map(n => `export * from './components/${n}';`)
    .join('\n');
  writeFileSync(OUTPUT_INDEX, `// Auto-generated index. Do not edit manually.
// Run \`pnpm generate\` to regenerate.

${exports}
export { resolveVariant, resolveColor } from './shared/semantic-variants';

// Side-effect import: registers ɵɵngDeclareComponent partials for every
// component in this package so that signal-based inputs are visible to
// Angular's JIT compiler (which would otherwise only see legacy decorator
// metadata and report NG0303 on every \`[input]="..."\` binding).
import './_partial-decls';
`);

  console.log(`  Generated ${generatedCount} components.`);
  console.log(`  Written to ${COMPONENTS_DIR}`);

  // Summary
  console.log('\n📊 Summary:');
  const byCategory: Record<string, number> = {};
  for (const spec of specs) {
    if (!spec.isInternal) {
      byCategory[spec.category] = (byCategory[spec.category] || 0) + 1;
    }
  }
  for (const [cat, count] of Object.entries(byCategory).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(15)} ${count} components`);
  }

  console.log('\n✅ Done!');
}

function generateIconComponent(): string {
  return `// Manually written Icon component for qml-ng
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'qml-icon',
  standalone: true,
  template: \`
    <span class="qml-icon" [style.width.px]="size()" [style.height.px]="size()" [style.color]="color()">
      {{ name() }}
    </span>
  \`,
  styles: [\`:host { display: inline-flex; align-items: center; justify-content: center; }\`],
})
export class Icon {
  name = input<string>('');
  size = input<number>(18);
  color = input<string>('currentColor');
}
`;
}

main();
