const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function getCSSPath(context) {
  const dir = context.globalStorageUri.fsPath;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'sash-enhancer.css');
}

// Editor-scoped, horizontal-only CSS. No theme token overrides. No UI chrome changes.
function cssForSash(color, thickness) {
  return `
/* Sash Enhancer+ v0.6.0 — Editor-scoped, horizontal-only */

/* Target ALL horizontal sashes in the workbench */
.monaco-workbench .monaco-sash.horizontal {
  background-color: ${color} !important;
  height: ${thickness}px !important;
  min-height: ${thickness}px !important;
  opacity: 1 !important;
  cursor: row-resize !important;
  transition: none !important;
}

/* Ensure the hover state is also always visible */
.monaco-workbench .monaco-sash.horizontal:hover {
  background-color: ${color} !important;
  height: ${thickness}px !important;
  min-height: ${thickness}px !important;
  opacity: 1 !important;
}

/* Keep vertical sashes unchanged (default VS Code behavior) */
.monaco-workbench .monaco-sash.vertical {
  /* Intentionally not setting background to allow theme defaults */
}
`;
}

function fileUriForImport(p) {
  return vscode.Uri.file(p).with({ scheme: 'file' }).toString();
}

async function ensureCSSImported(cssPath) {
  const cfg = vscode.workspace.getConfiguration();
  const key = 'vscode_custom_css.imports';
  const existing = cfg.get(key) || [];
  const uri = fileUriForImport(cssPath);
  if (!existing.includes(uri)) {
    existing.push(uri);
    await cfg.update(key, existing, vscode.ConfigurationTarget.Global);
  }
}

async function removeCSSImport(cssPath) {
  const cfg = vscode.workspace.getConfiguration();
  const key = 'vscode_custom_css.imports';
  const existing = cfg.get(key) || [];
  const uri = fileUriForImport(cssPath);
  const next = existing.filter(x => x !== uri);
  if (next.length !== existing.length) {
    await cfg.update(key, next, vscode.ConfigurationTarget.Global);
  }
}

async function writeInjectedCSS(context, color, thickness) {
  const cssPath = getCSSPath(context);
  fs.writeFileSync(cssPath, cssForSash(color, thickness), 'utf8');
  await ensureCSSImported(cssPath);
  vscode.window.showInformationMessage('Sash Enhancer+: CSS updated. Run “Custom CSS and JS: Enable” then Reload Window to apply.');
  return cssPath;
}

async function applySettings(context) {
  const se = vscode.workspace.getConfiguration('sashEnhancer');
  const thickness = Math.max(1, Math.min(24, se.get('thickness', 8)));
  const color = se.get('color', '#ff0066');
  const inject = se.get('injectCSS', true);

  // Improve hit area via supported setting. No color customizations touched.
  const cfg = vscode.workspace.getConfiguration('workbench');
  try { await cfg.update('sash.size', thickness, vscode.ConfigurationTarget.Global); } catch {}

  if (inject) {
    await writeInjectedCSS(context, color, thickness);
  }
}

async function toggleCSSMode(context) {
  const se = vscode.workspace.getConfiguration('sashEnhancer');
  const next = !se.get('injectCSS', true);
  await se.update('injectCSS', next, vscode.ConfigurationTarget.Global);
  vscode.window.setStatusBarMessage(`Sash Enhancer: Always-Visible Mode ${next ? 'ON' : 'OFF'}`, 3000);
  await applySettings(context);
}

async function openCSSFile(context) {
  const cssPath = getCSSPath(context);
  if (!fs.existsSync(cssPath)) {
    fs.writeFileSync(cssPath, cssForSash('#ff0066', 8), 'utf8');
  }
  const doc = await vscode.workspace.openTextDocument(cssPath);
  await vscode.window.showTextDocument(doc);
}

async function verifyConfiguration(context) {
  const out = vscode.window.createOutputChannel('Sash Enhancer+');
  const se = vscode.workspace.getConfiguration('sashEnhancer');
  const imports = vscode.workspace.getConfiguration().get('vscode_custom_css.imports') || [];
  const cssPath = getCSSPath(context);
  const cssUri = fileUriForImport(cssPath);

  out.clear();
  out.appendLine('[Sash Enhancer+ · Verify Configuration]\n');
  out.appendLine(`thickness: ${se.get('thickness')}`);
  out.appendLine(`color: ${se.get('color')}`);
  out.appendLine(`injectCSS: ${se.get('injectCSS')}`);
  out.appendLine(`cssPath: ${cssPath}`);
  out.appendLine(`imports contains css: ${imports.includes(cssUri)}`);
  out.appendLine('\nNext steps: Ensure “Custom CSS and JS: Enable” has been run, then Reload Window.');
  out.show(true);
  vscode.window.showInformationMessage('Sash Enhancer+: See Output panel for verification details.');
}

async function resetSettings(context) {
  // Remove our settings
  const se = vscode.workspace.getConfiguration('sashEnhancer');
  await se.update('thickness', undefined, vscode.ConfigurationTarget.Global);
  await se.update('color', undefined, vscode.ConfigurationTarget.Global);
  await se.update('injectCSS', undefined, vscode.ConfigurationTarget.Global);

  // Reset workbench.sash.size
  const wb = vscode.workspace.getConfiguration('workbench');
  await wb.update('sash.size', undefined, vscode.ConfigurationTarget.Global);

  // Remove our CSS import
  await removeCSSImport(getCSSPath(context));

  vscode.window.showInformationMessage('Sash Enhancer: Settings reset. Reload Window to apply.');
}

function activate(context) {
  vscode.window.showInformationMessage('✅ Sash Enhancer+ v0.6.0 active. Use “Toggle Always-Visible Mode”, then run “Custom CSS and JS: Enable” and Reload.');

  context.subscriptions.push(
    vscode.commands.registerCommand('sashEnhancer.toggleCSSMode', () => toggleCSSMode(context)),
    vscode.commands.registerCommand('sashEnhancer.openCSSFile', () => openCSSFile(context)),
    vscode.commands.registerCommand('sashEnhancer.verifyConfig', () => verifyConfiguration(context)),
    vscode.commands.registerCommand('sashEnhancer.resetSettings', () => resetSettings(context))
  );

  applySettings(context);
}

function deactivate() {}
module.exports = { activate, deactivate };
