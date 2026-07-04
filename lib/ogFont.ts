/**
 * OGP画像（satori/ImageResponse）用の日本語フォントローダー。
 * Google Fonts の text= サブセットAPIから Noto Sans JP (truetype) を取得。
 * 静的エクスポートではビルド時に一度だけ実行される。
 * 失敗時は throw してビルドエラーにする（satoriのデフォルトフォントは日本語グリフ
 * 非対応のため、文字欠落画像が成果物に含まれるよりビルド失敗の方が安全）。
 */
export async function loadJapaneseFont(text: string): Promise<ArrayBuffer> {
  const chars = Array.from(new Set(Array.from(text))).join("");
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(chars)}`;
  const cssRes = await fetch(cssUrl);
  if (!cssRes.ok) {
    throw new Error(`Failed to fetch font CSS: ${cssRes.status}`);
  }
  const css = await cssRes.text();
  const match = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
  if (!match) {
    throw new Error("Font URL not found in Google Fonts CSS");
  }
  const res = await fetch(match[1]);
  if (!res.ok) {
    throw new Error(`Failed to fetch font file: ${res.status}`);
  }
  return await res.arrayBuffer();
}
