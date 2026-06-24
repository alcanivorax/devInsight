import ts from 'typescript'
import type {
  FileDeclarationKind,
  FileDeclarationSummary,
  FileExportKind,
  FileExportSummary,
  FileFunctionSummary,
  FileImportSummary,
  FileLanguage,
  FileSummary,
} from '../types'

export function extractTypeScriptFileSummary(input: {
  path: string
  source: string
}): FileSummary {
  const language = detectFileLanguage(input.path)
  const sourceFile = ts.createSourceFile(
    input.path,
    input.source,
    ts.ScriptTarget.Latest,
    true,
    toScriptKind(language)
  )

  const imports: FileImportSummary[] = []
  const exports: FileExportSummary[] = []
  const declarations: FileDeclarationSummary[] = []
  const functions: FileFunctionSummary[] = []

  for (const statement of sourceFile.statements) {
    if (ts.isImportDeclaration(statement)) {
      imports.push(extractImportSummary(statement))
      continue
    }

    if (ts.isExportDeclaration(statement)) {
      exports.push(...extractReExportSummaries(statement))
      continue
    }

    if (ts.isExportAssignment(statement)) {
      exports.push({
        name: 'default',
        kind: 'default',
        source: null,
      })
      continue
    }

    collectDeclarationSummaries(statement, declarations, functions, exports)
  }

  return {
    path: input.path,
    language,
    imports,
    exports,
    declarations,
    functions,
    metrics: {
      lines: countLines(input.source),
      imports: imports.length,
      exports: exports.length,
      functions: functions.length,
      classes: countDeclarations(declarations, 'class'),
      interfaces: countDeclarations(declarations, 'interface'),
      types: countDeclarations(declarations, 'type'),
      enums: countDeclarations(declarations, 'enum'),
    },
  }
}

export function extractTypeScriptFileSummaries(
  files: { path: string; source: string }[]
): FileSummary[] {
  return files.map((file) => extractTypeScriptFileSummary(file))
}

function detectFileLanguage(path: string): FileLanguage {
  const normalized = path.toLowerCase()

  if (normalized.endsWith('.tsx')) return 'tsx'
  if (normalized.endsWith('.ts')) return 'typescript'
  if (normalized.endsWith('.jsx')) return 'jsx'
  if (normalized.endsWith('.js')) return 'javascript'

  return 'unknown'
}

function toScriptKind(language: FileLanguage): ts.ScriptKind {
  switch (language) {
    case 'typescript':
      return ts.ScriptKind.TS
    case 'tsx':
      return ts.ScriptKind.TSX
    case 'javascript':
      return ts.ScriptKind.JS
    case 'jsx':
      return ts.ScriptKind.JSX
    case 'unknown':
      return ts.ScriptKind.Unknown
  }
}

function extractImportSummary(
  statement: ts.ImportDeclaration
): FileImportSummary {
  const importClause = statement.importClause

  return {
    source: getModuleSpecifierText(statement.moduleSpecifier),
    defaultImport: importClause?.name?.text ?? null,
    namespaceImport: getNamespaceImport(importClause),
    namedImports: getNamedImports(importClause),
    isTypeOnly: importClause?.isTypeOnly ?? false,
  }
}

function getNamespaceImport(
  importClause: ts.ImportClause | undefined
): string | null {
  const namedBindings = importClause?.namedBindings

  if (namedBindings && ts.isNamespaceImport(namedBindings)) {
    return namedBindings.name.text
  }

  return null
}

function getNamedImports(importClause: ts.ImportClause | undefined): string[] {
  const namedBindings = importClause?.namedBindings

  if (!namedBindings || !ts.isNamedImports(namedBindings)) {
    return []
  }

  return namedBindings.elements.map((element) => element.name.text)
}

function extractReExportSummaries(
  statement: ts.ExportDeclaration
): FileExportSummary[] {
  const source = statement.moduleSpecifier
    ? getModuleSpecifierText(statement.moduleSpecifier)
    : null

  if (!statement.exportClause) {
    return [{ name: '*', kind: 're-export', source }]
  }

  if (ts.isNamespaceExport(statement.exportClause)) {
    return [
      {
        name: statement.exportClause.name.text,
        kind: 're-export',
        source,
      },
    ]
  }

  return statement.exportClause.elements.map((element) => ({
    name: element.name.text,
    kind: 're-export',
    source,
  }))
}

function collectDeclarationSummaries(
  statement: ts.Statement,
  declarations: FileDeclarationSummary[],
  functions: FileFunctionSummary[],
  exports: FileExportSummary[]
): void {
  if (ts.isFunctionDeclaration(statement)) {
    const summary = createFunctionSummary(statement)
    declarations.push(summary)
    functions.push(summary)
    pushDeclarationExportSummary(exports, statement, summary.name, 'function')
    return
  }

  if (ts.isClassDeclaration(statement)) {
    collectNamedDeclaration(statement, 'class', declarations, exports)
    return
  }

  if (ts.isInterfaceDeclaration(statement)) {
    collectNamedDeclaration(statement, 'interface', declarations, exports)
    return
  }

  if (ts.isTypeAliasDeclaration(statement)) {
    collectNamedDeclaration(statement, 'type', declarations, exports)
    return
  }

  if (ts.isEnumDeclaration(statement)) {
    collectNamedDeclaration(statement, 'enum', declarations, exports)
    return
  }

  if (ts.isVariableStatement(statement)) {
    collectVariableDeclarations(statement, declarations, functions, exports)
  }
}

function createFunctionSummary(
  statement: ts.FunctionDeclaration
): FileFunctionSummary {
  const exported = hasExportModifier(statement)
  const isDefault = hasDefaultModifier(statement)

  return {
    name: statement.name?.text ?? (isDefault ? 'default' : 'anonymous'),
    kind: 'function',
    exported,
    async: hasAsyncModifier(statement),
    parameters: statement.parameters.map((parameter) =>
      parameter.name.getText(statement.getSourceFile())
    ),
    returnType: statement.type?.getText(statement.getSourceFile()) ?? null,
  }
}

function collectNamedDeclaration(
  statement:
    | ts.ClassDeclaration
    | ts.InterfaceDeclaration
    | ts.TypeAliasDeclaration
    | ts.EnumDeclaration,
  kind: FileDeclarationKind,
  declarations: FileDeclarationSummary[],
  exports: FileExportSummary[]
): void {
  const name = statement.name?.text
  if (!name) {
    if (hasDefaultModifier(statement)) {
      pushExportSummary(exports, 'default', 'default', null, true)
    }
    return
  }

  const exported = hasExportModifier(statement)
  declarations.push({ name, kind, exported })
  pushDeclarationExportSummary(exports, statement, name, kind)
}

function collectVariableDeclarations(
  statement: ts.VariableStatement,
  declarations: FileDeclarationSummary[],
  functions: FileFunctionSummary[],
  exports: FileExportSummary[]
): void {
  const exported = hasExportModifier(statement)

  for (const declaration of statement.declarationList.declarations) {
    if (!ts.isIdentifier(declaration.name)) {
      continue
    }

    const name = declaration.name.text
    declarations.push({ name, kind: 'variable', exported })
    pushExportSummary(exports, name, 'variable', null, exported)

    if (
      declaration.initializer &&
      (ts.isArrowFunction(declaration.initializer) ||
        ts.isFunctionExpression(declaration.initializer))
    ) {
      functions.push({
        name,
        kind: 'function',
        exported,
        async: hasAsyncModifier(declaration.initializer),
        parameters: declaration.initializer.parameters.map((parameter) =>
          parameter.name.getText(statement.getSourceFile())
        ),
        returnType:
          declaration.initializer.type?.getText(statement.getSourceFile()) ??
          null,
      })
    }
  }
}

function pushDeclarationExportSummary(
  exports: FileExportSummary[],
  node: ts.Node,
  name: string,
  kind: Exclude<FileExportKind, 'default' | 're-export'>
): void {
  if (!hasExportModifier(node)) return

  pushExportSummary(
    exports,
    hasDefaultModifier(node) ? 'default' : name,
    hasDefaultModifier(node) ? 'default' : kind,
    null,
    true
  )
}

function pushExportSummary(
  exports: FileExportSummary[],
  name: string,
  kind: FileExportKind,
  source: string | null,
  exported: boolean
): void {
  if (!exported) return

  exports.push({
    name,
    kind,
    source,
  })
}

function hasExportModifier(node: ts.Node): boolean {
  return hasModifier(node, ts.SyntaxKind.ExportKeyword)
}

function hasDefaultModifier(node: ts.Node): boolean {
  return hasModifier(node, ts.SyntaxKind.DefaultKeyword)
}

function hasAsyncModifier(node: ts.Node): boolean {
  return hasModifier(node, ts.SyntaxKind.AsyncKeyword)
}

function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
  return ts.canHaveModifiers(node)
    ? (ts.getModifiers(node)?.some((modifier) => modifier.kind === kind) ??
        false)
    : false
}

function getModuleSpecifierText(moduleSpecifier: ts.Expression): string {
  return ts.isStringLiteral(moduleSpecifier) ? moduleSpecifier.text : ''
}

function countDeclarations(
  declarations: FileDeclarationSummary[],
  kind: FileDeclarationKind
): number {
  return declarations.filter((declaration) => declaration.kind === kind).length
}

function countLines(source: string): number {
  if (source.length === 0) return 0

  return source.split(/\r\n|\r|\n/).length
}
