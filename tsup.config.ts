import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.tsx"],
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    banner: {
        js: "'use client';",
    },
    outExtension({ format }) {
        return {
            js: format === "cjs" ? ".cjs" : ".js",
        };
    },
    esbuildOptions(options) {
        options.jsx = "preserve";
        options.jsxImportSource = "solid-js";
        options.jsxFactory = "h";
        options.jsxFragment = "Fragment";
    },
});
