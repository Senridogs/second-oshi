interface Props {
  total: number;
  filled: number;
}

/** 進捗表現: パスポートのスタンプ枠が埋まっていく */
export default function PassportProgress({ total, filled }: Props) {
  return (
    <div aria-label={`進捗 ${filled} / ${total}`}>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="label-en text-[10px] text-line/50">Passport Stamps</span>
        <span className="label-en text-[10px] text-line/50">
          {filled}/{total}
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const isFilled = i < filled;
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-md ${
                isFilled
                  ? "border-2 border-stamp/90 bg-stamp/10"
                  : "border border-dashed border-line/30"
              }`}
            >
              {isFilled && (
                <span className="label-en -rotate-8 text-[9px] font-bold text-stamp">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
