import { defineConfig } from "vite";

// One entry point plus a chunk per language. The build output is committed to
// the repository because HACS does not run a build step.
export default defineConfig({
  build: {
    outDir: "../custom_components/marstek_modbus/frontend",
    // Deliberately false: emptying it would delete and recreate the folder,
    // which breaks a bind mount pointing at it during development. The
    // prebuild script removes the files and leaves the folder alone.
    emptyOutDir: false,
    target: "es2021",
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      input: {
        "marstek-panel": "src/marstek-panel.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: (chunk) => {
          // Language chunks get a readable name, so the network tab shows
          // which catalogue a browser actually fetched.
          const locale = chunk.facadeModuleId?.match(
            /[\\/]locales[\\/]([a-z]{2})\.ts$/,
          )?.[1];
          return locale ? `marstek-lang-${locale}.js` : "marstek-shared.js";
        },
        format: "es",
      },
    },
  },
});
