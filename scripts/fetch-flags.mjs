// data/teams.json の国旗絵文字に対応する twemoji SVG を取得し、
// 140x140 の PNG data URI に変換して lib/flagImg.ts (id -> data URI) を生成する。
// OGP画像でCDN・SVGデコードに依存せず国旗を確実に描画するため。
// teams.json 更新後に再実行する:
//   node scripts/fetch-flags.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const teams = JSON.parse(readFileSync(join(root, "data/teams.json"), "utf8"));

const BASE = "https://raw.githubusercontent.com/jdecked/twemoji/v15.1.0/assets/svg";
const SIZE = 140;

function emojiToCodepoints(emoji) {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0).toString(16))
    .join("-");
}

async function svgToPngDataUri(svg) {
  const svgUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  const res = new ImageResponse(
    {
      type: "div",
      props: {
        style: { width: "100%", height: "100%", display: "flex" },
        children: [
          { type: "img", props: { src: svgUri, width: SIZE, height: SIZE } },
        ],
      },
    },
    { width: SIZE, height: SIZE }
  );
  const png = Buffer.from(await res.arrayBuffer());
  return `data:image/png;base64,${png.toString("base64")}`;
}

const entries = [];
for (const team of teams) {
  const code = emojiToCodepoints(team.flag);
  const url = `${BASE}/${code}.svg`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`NG: ${team.id} ${team.flag} (${code}) -> HTTP ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  let svg = await res.text();
  // satori がサイズを解決できるよう、SVGルートに明示的な width/height を付与
  if (!/<svg[^>]*\swidth=/.test(svg)) {
    svg = svg.replace(/<svg /, `<svg width="${SIZE}" height="${SIZE}" `);
  }
  const dataUri = await svgToPngDataUri(svg);
  entries.push(`  ${team.id}: "${dataUri}",`);
  console.log(`OK: ${team.id} ${team.flag} (${code})`);
}

const out = `// このファイルは scripts/fetch-flags.mjs により自動生成される。直接編集しないこと。
// OGP画像用の国旗PNG (twemoji由来, CC-BY 4.0) data URI。
export const flagImg: Record<string, string> = {
${entries.join("\n")}
};
`;
writeFileSync(join(root, "lib/flagImg.ts"), out);
console.log(`\nlib/flagImg.ts を生成 (${entries.length}/${teams.length}カ国)`);
