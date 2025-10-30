# 🧩 Sash Enhancer+ v0.6.0
**Editor‑scoped, always‑visible horizontal sash — no theme token hacks, no UI chrome changes.**

This extension makes the **horizontal divider between the editor and the panel/terminal** permanently visible and thicker, making it easier to find and resize panels in VS Code.

---

## ✅ What This Does (and Doesn't)
- ✅ Styles **only horizontal sashes** in the editor and panel areas
- ✅ Makes the editor-to-panel divider always visible (not just on hover)
- ✅ Styles terminal split dividers for easier resizing
- ✅ Leaves window chrome, sidebars, menus, and settings untouched
- ✅ Does **not** change `workbench.colorCustomizations` or theme tokens
- ✅ Updates only `workbench.sash.size` (for a larger hit area)
- ❌ Does not style vertical sashes
- ❌ Does not style top/bottom window edge sashes

---

## 🔧 Installation & Setup

### Option 1: Install Pre-built Extension (Recommended)

1. **Install the "Custom CSS and JS Loader" extension** from the Marketplace
   - Open Extensions (`Cmd+Shift+X` or `Ctrl+Shift+X`)
   - Search for: `be5invis.vscode-custom-css`
   - Click Install

2. **Install Sash Enhancer+**
   - Download the `.vsix` file from [Releases](https://github.com/Looking4OffSwitch/vscode-sash-enhancer-plus/releases)
   - In VS Code: `Extensions → ... → Install from VSIX...`
   - Select the downloaded `.vsix` file

3. **Activate the extension**
   - Open Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
   - Run: `Sash Enhancer: Toggle Always-Visible Mode`
   - This writes the CSS file and registers it with the Custom CSS Loader

4. **Enable Custom CSS**
   - Command Palette → `Custom CSS and JS: Enable`
   - When prompted, click "Reload Window" (or run `Developer: Reload Window`)
   - Note: You may see a "VS Code is corrupted" warning - this is expected and harmless. Click the gear icon to dismiss it permanently.

5. **Verify it's working**
   - Command Palette → `Sash Enhancer: Verify Configuration`
   - Check the Output panel for "imports contains css: true"
   - You should now see a thick, colored horizontal divider between editor and terminal

### Option 2: Build from Source

If you want to build the extension yourself or contribute to development:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Looking4OffSwitch/vscode-sash-enhancer-plus.git
   cd vscode-sash-enhancer-plus
   ```

2. **Build the extension**
   ```bash
   ./build.sh
   ```
   This runs `npm install` and packages the extension into a `.vsix` file.

3. **Install the built extension**
   - Follow steps 1-5 from "Option 1" above
   - Use the newly generated `.vsix` file in the project root

---

## ⚙️ Settings

Configure the extension in your VS Code settings:

```json
{
  "sashEnhancer.thickness": 8,        // Sash height in pixels (1-24)
  "sashEnhancer.color": "#ff0066",    // CSS color value
  "sashEnhancer.injectCSS": true      // Enable/disable CSS injection
}
```

**To apply changes after modifying settings:**
1. Command Palette → `Sash Enhancer: Toggle Always-Visible Mode`
2. Command Palette → `Custom CSS and JS: Enable`
3. Reload Window

---

## 🧹 Uninstalling / Reset

To completely remove all extension changes:

1. Command Palette → `Sash Enhancer: Reset Settings to Defaults`
   - This removes all `sashEnhancer.*` settings
   - Resets `workbench.sash.size` to default
   - Removes CSS file from Custom CSS Loader imports

2. Reload Window to apply changes

3. (Optional) Uninstall the extension from Extensions panel

---

## 🛠 Troubleshooting

### Sashes aren't visible after installation

1. Run `Sash Enhancer: Verify Configuration` (Command Palette)
2. Check the Output panel for "imports contains css: true"
3. If `false`:
   - Run `Sash Enhancer: Toggle Always-Visible Mode`
   - Run `Custom CSS and JS: Enable`
   - Reload Window

### "VS Code is corrupted" warning appears

This is expected when using Custom CSS Loader. VS Code detects that the runtime has been modified and shows this warning.

**How to dismiss:**
- Click the gear icon in the warning notification
- Select "Don't Show Again"

The warning is harmless - your VS Code installation is not actually corrupted.

### Vertical sashes are styled (shouldn't be)

You may have leftover theme customizations. Check Settings (JSON) for:

```json
"workbench.colorCustomizations": {
  "sash.hoverBorder": "...",
  "sash.border": "...",
  "contrastBorder": "...",
  "panel.border": "...",
  "editorGroup.border": "..."
}
```

Remove these entries or run `Sash Enhancer: Reset Settings to Defaults`.

### Settings changes don't apply

After modifying `sashEnhancer.*` settings, you must:
1. Run `Sash Enhancer: Toggle Always-Visible Mode`
2. Run `Custom CSS and JS: Enable`
3. Reload Window

### Need to debug CSS selectors?

1. Run `Developer: Toggle Developer Tools`
2. Use the element picker (top-left icon)
3. Hover over the sash you want to inspect
4. Copy the computed styles and selectors
5. Open an issue on GitHub with this information

---

## 📄 License
MIT
