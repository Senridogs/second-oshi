import { ImageResponse } from "next/og";
import { findTeam } from "@/lib/teams";
import { getFlagColors } from "@/lib/flagColors";
import { flagImg } from "@/lib/flagImg";

export const alt = "セカンド推し診断 結果カード";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Google Fonts の text= サブセットAPIから Noto Sans JP (truetype) を取得。
 * 失敗時は undefined を返し、フォント無しで描画にフォールバック。
 */
async function loadJapaneseFont(text: string): Promise<ArrayBuffer | undefined> {
  try {
    const chars = Array.from(new Set(Array.from(text))).join("");
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(chars)}`;
    const css = await (await fetch(cssUrl)).text();
    const match = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
    if (!match) return undefined;
    const res = await fetch(match[1]);
    if (!res.ok) return undefined;
    return await res.arrayBuffer();
  } catch {
    return undefined;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const team = findTeam(teamId);
  const name = team?.name ?? "セカンド推し診断";
  const flag = team?.flag ?? "⚽";
  const reason = team?.reason ?? "次に推す国、見つけよう";
  const [c1, c2] = getFlagColors(teamId);

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
          fontFamily: fontData ? "NotoSansJP" : undefined,
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
            {flagImg[teamId] ? (
              // ローカル同梱のtwemoji由来PNG（CDN非依存で確実に描画）
              <img src={flagImg[teamId]} width={140} height={140} alt="" />
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
      fonts: fontData
        ? [{ name: "NotoSansJP", data: fontData, weight: 700, style: "normal" }]
        : undefined,
    }
  );
}
