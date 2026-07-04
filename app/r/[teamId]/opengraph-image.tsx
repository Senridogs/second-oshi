import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { findTeam } from "@/lib/teams";
import { getFlagColors } from "@/lib/flagColors";
import { flagImg } from "@/lib/flagImg";

export const alt = "セカンド推し診断 結果カード";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Google Fonts の text= サブセットAPIから Noto Sans JP (truetype) を取得。
 * 失敗時は throw してエラー応答にする（satoriのデフォルトフォントは日本語グリフ
 * 非対応のため、文字欠落画像がCDNにキャッシュされるより500の方が安全）。
 */
async function loadJapaneseFont(text: string): Promise<ArrayBuffer> {
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

export default async function Image({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const team = findTeam(teamId);
  // 未知のteamIdはフォールバック画像を作らず404（外部フォントfetchの負荷増幅を防ぐ）
  if (!team) notFound();
  const name = team.name;
  const flag = team.flag;
  const reason = team.reason;
  const [c1, c2] = getFlagColors(team.id);
  // prototype 継承値（"constructor" 等）を拾わないよう hasOwn でガード
  const flagSrc = Object.hasOwn(flagImg, team.id) ? flagImg[team.id] : undefined;

  const textForFont = `SECOND OSHI VISA APPROVED あなたの移住先は 入国許可証 #セカンド推し診断 ${name}${reason}`;
  const fontData = await loadJapaneseFont(textForFont);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: `linear-gradient(135deg, ${c1} 0%, ${c1} 42%, ${c2} 58%, ${c2} 100%)`,
          fontFamily: "NotoSansJP",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "rgba(15, 26, 43, 0.90)",
            border: "3px dashed rgba(242, 239, 230, 0.55)",
            borderRadius: 28,
            padding: "40px 56px",
            color: "#F2EFE6",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: 26, letterSpacing: 10 }}>SECOND OSHI VISA</span>
            <span style={{ fontSize: 24, letterSpacing: 6, opacity: 0.8 }}>
              入国許可証
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {flagSrc ? (
              // ローカル同梱のtwemoji由来PNG（CDN非依存で確実に描画）
              <img src={flagSrc} width={140} height={140} alt="" />
            ) : (
              // 新規追加国でSVG未生成の場合はtwemoji絵文字描画にフォールバック
              <span style={{ fontSize: 130 }}>{flag}</span>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 28, opacity: 0.85 }}>あなたの移住先は</span>
              <span style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.15 }}>
                {name}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "block",
              lineClamp: 2,
              fontSize: 32,
              lineHeight: 1.55,
              opacity: 0.95,
            }}
          >
            {reason}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 26, letterSpacing: 4 }}>#セカンド推し診断</span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "5px solid #D64545",
                color: "#D64545",
                borderRadius: 12,
                padding: "8px 24px",
                transform: "rotate(-8deg)",
              }}
            >
              <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 8 }}>
                APPROVED
              </span>
              <span style={{ fontSize: 20, letterSpacing: 10 }}>入国許可</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "NotoSansJP", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
