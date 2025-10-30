# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sash Enhancer+** is a VS Code extension that makes the horizontal divider between the editor and panel/terminal permanently visible and thicker. It uses editor-scoped CSS injection via the "Custom CSS and JS Loader" extension, without modifying theme tokens or VS Code's color customizations.

## Architecture

### Core Components

- **extension.js**: Single-file extension implementation
  - Manages 4 commands via Command Palette
  - Handles configuration via `sashEnhancer.*` settings
  - Writes CSS to `globalStorageUri` and registers it with `vscode_custom_css.imports`
  - Syncs `workbench.sash.size` with `sashEnhancer.thickness` for better hit area

### CSS Injection Strategy

The extension generates editor-scoped CSS targeting only `.monaco-workbench .editor .monaco-sash.horizontal`:
- **Does style**: horizontal sash inside editor area (color, height, opacity)
- **Does NOT touch**: vertical sashes, UI chrome outside `.monaco-workbench .editor`, theme tokens, or `workbench.colorCustomizations`

CSS is written to `<globalStorageUri>/sash-enhancer.css` and added to `vscode_custom_css.imports`. Users must run "Custom CSS and JS: Enable" from the loader extension and reload window to apply.

### Configuration Settings

- `sashEnhancer.thickness` (1-24px, default: 8) - also updates `workbench.sash.size`
- `sashEnhancer.color` (CSS color, default: "#ff0066")
- `sashEnhancer.injectCSS` (boolean, default: true) - master toggle for CSS mode

### Commands

1. **Toggle Always-Visible Mode** (`sashEnhancer.toggleCSSMode`) - enables/disables CSS injection
2. **Open Injected CSS File** (`sashEnhancer.openCSSFile`) - opens generated CSS for inspection
3. **Verify Configuration** (`sashEnhancer.verifyConfig`) - outputs diagnostic info to Output panel
4. **Reset Settings to Defaults** (`sashEnhancer.resetSettings`) - removes all settings and imports

## Development Commands

### Build and Package
```bash
./build.sh
```
Runs `npm install` and `vsce package` to create a `.vsix` file.

### Install Extension Locally
```bash
# From VS Code Command Palette
Extensions: Install from VSIX...
# Select the generated .vsix file
```

### Testing Changes
After modifying `extension.js`:
1. Run `./build.sh`
2. Install the new `.vsix` (or reload extension host if debugging)
3. Run "Sash Enhancer: Verify Configuration" to check output
4. Run "Custom CSS and JS: Enable" → Reload Window to see CSS changes

## Dependencies

- **Runtime**: Requires "Custom CSS and JS Loader" extension (`be5invis.vscode-custom-css`)
- **Build**: `vsce` (VS Code Extension Manager) for packaging
- **VS Code**: Minimum version 1.85.0

## Key Implementation Details

- **CSS path generation**: `getCSSPath()` uses `context.globalStorageUri.fsPath` for cross-platform compatibility
- **Import management**: `ensureCSSImported()` and `removeCSSImport()` manipulate `vscode_custom_css.imports` array
- **File URI format**: `fileUriForImport()` converts filesystem paths to `file://` URIs for the CSS loader
- **Settings sync**: `applySettings()` keeps `workbench.sash.size` in sync with thickness setting
- **Activation**: Runs on `onStartupFinished` to avoid startup performance impact
