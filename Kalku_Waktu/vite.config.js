
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { viteStaticCopy } from "vite-plugin-static-copy";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const PYODIDE_EXCLUDE = [
  "!**/*.{md,html}",
  "!**/*.d.ts",
  "!**/*.whl",
  "!**/pyodide/node_modules",
];

export function viteStaticCopyPyodide() {
  const pyodideDir = dirname(fileURLToPath(import.meta.resolve("pyodide")));
  return viteStaticCopy({
    targets: [
      {
        src: [join(pyodideDir, "*").replace(/\\/g, "/")].concat(
          PYODIDE_EXCLUDE
        ),
        dest: "assets",
      },
    ],
  });
}

export default defineConfig({
    optimizeDeps: { exclude: ["pyodide"] },
    plugins: [
        viteStaticCopyPyodide(),
        tailwindcss(),

        {
            name: 'remove-python-cache',

            closeBundle() {
                const cacheDir = resolve('dist/python/__pycache__')

                if (existsSync(cacheDir)) {
                    rmSync(cacheDir, {
                        recursive: true,
                        force: true
                    })
                }
            }
        }
    ]
})
