// apps/api/build-lambda.js
// Lambda用のビルドスクリプト（esbuild）

import * as esbuild from "esbuild";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// 外部依存関係を取得（bundleに含めない）
const external = Object.keys(pkg.dependencies || {}).filter(
  (dep) => !dep.startsWith("@repo/")
);

await esbuild.build({
  entryPoints: ["src/lambda/index.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: "dist/lambda/index.mjs",
  external,
  minify: true,
  sourcemap: true,
  banner: {
    js: "// AWS Lambda Handler\n",
  },
});

console.log("✅ Lambda function built successfully: dist/lambda/index.mjs");
