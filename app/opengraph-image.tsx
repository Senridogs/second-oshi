import { ImageResponse } from "next/og";
import { loadJapaneseFont } from "@/lib/ogFont";

/** 静的エクスポート: ビルド時に画像を生成する */
export const dynamic = "force-static";

export const alt = "セカンド推し診断 〜次に推す国、見つけよう〜";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * トップページ（/）用のデフォルトOGP画像。
 * シェアの正は /r/[teamId] だが、トップURLが共有された時に
 * 画像なしにならないための保険。/r/ のビザ意匠・パレットに準拠。
 */
export default async function Image() {
  const title = "セカンド推し診断";
  const subtitle = "次に推す国、見つけよう";
  const lead = "10問で「第二の祖国」への入国ビザを発行";

  const textForFont = `SECOND OSHI VISA APPROVED 入国許可証 入国許可 #セカンド推し診断 ${title}${subtitle}${lead}`;
  const fontData = await loadJapaneseFont(textForFont);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 40,
          background: "linear-gradient(135deg, #19C37D 0%, #19C37D 42%, #0F1A2B 58%, #0F1A2B 100%)",
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

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, opacity: 0.85 }}>{subtitle}</span>
            <span
              style={{
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "#19C37D",
              }}
            >
              {title}
            </span>
          </div>

          <div style={{ display: "flex", fontSize: 34, lineHeight: 1.55, opacity: 0.95 }}>
            {lead}
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
