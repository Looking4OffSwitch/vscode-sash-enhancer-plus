# 🧩 Sash Enhancer+ v0.6.0
**Editor‑scoped, always‑visible horizontal sash — no theme token hacks, no UI chrome changes.**

This extension makes the **horizontal divider between the editor and the panel/terminal** permanently visible and thicker, without changing anything else in VS Code.

---

## ✅ What This Does (and Doesn’t)
- ✅ Styles **only the horizontal sash** inside the **editor** area
- ✅ Leaves icons, sidebars, menus, settings, and other UI chrome untouched
- ✅ Does **not** change `workbench.colorCustomizations` or theme tokens
- ✅ Updates only `workbench.sash.size` (for a larger hit area)
- ❌ Does not style vertical sashes
- ❌ Does not inject global CSS variables or borders

---

## 🔧 Step‑by‑Step Setup (Do **every** step in order)
1) **Install** the “Custom CSS and JS Loader” extension from the Marketplace.  
   - Search for: `be5invis.vscode-custom-css`

2) **Install Sash Enhancer+** (this extension).  
   - If installing from VSIX: Extensions → “Install from VSIX…”

3) **Toggle Always‑Visible Mode**:  
   - Command Palette → `Sash Enhancer: Toggle Always-Visible Mode`  
   This writes an editor‑scoped CSS file and adds it to the loader’s imports.

4) **Enable the loader**:  
   - Command Palette → `Custom CSS and JS: Enable`  
   - Then run: `Developer: Reload Window`

5) **Verify**:  
   - Command Palette → `Sash Enhancer: Verify Configuration`  
   - In the Output panel, ensure “imports contains css: true”.  
   - You should now see a thicker, colored **horizontal divider** between editor and terminal. No vertical lines should be colored.

---

## ⚙️ Settings
```json
"sashEnhancer.thickness": 8,   // height in pixels
"sashEnhancer.color": "#ff0066",
"sashEnhancer.injectCSS": true
```
> Tip: Change color/thickness, run `Toggle Always-Visible Mode` again, then `Custom CSS and JS: Enable` → Reload.

---

## 🧹 Reset to Defaults (no manual edits needed)
If you want to remove everything this extension touched:
- Command Palette → **`Sash Enhancer: Reset Settings to Defaults`**
  - Removes: `sashEnhancer.*` settings
  - Resets: `workbench.sash.size`
  - Removes our CSS from `vscode_custom_css.imports`

After running the command, **Reload Window**.

---

## 🛠 Troubleshooting (in order)
1) **No change?**  
   - Run `Sash Enhancer: Verify Configuration` → check “imports contains css: true”.  
   - If `false`, run `Toggle Always-Visible Mode`, then `Custom CSS and JS: Enable` → Reload.

2) **Vertical lines still colored?**  
   - You likely have leftover theme overrides. Open **Settings (JSON)** and remove any of:  
     ```json
     "workbench.colorCustomizations": {
       "sash.hoverBorder": "...",
       "sash.border": "...",
       "contrastBorder": "...",
       "panel.border": "...",
       "editorGroup.border": "..."
     }
     ```
   - Or run: `Sash Enhancer: Reset Settings to Defaults`

3) **“Corrupt installation” warning after reload**  
   - This is expected with Custom CSS Loader. It’s harmless; VS Code flags runtime patching. You can ignore it.

4) **Still stuck? Inspect the exact element**  
   - Run: `Developer: Toggle Developer Tools` → use the element picker → hover the line that’s red → copy the computed style + selector.  
   - Share that selector; only a scoped rule inside `.monaco-workbench .editor` is needed.

---

## 📄 License
MIT
