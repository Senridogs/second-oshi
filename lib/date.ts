/** 発行日（診断日）を JST で YYYY.MM.DD 形式に整形 */
export function formatIssueDate(date: Date = new Date()): string {
  return date
    .toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" })
    .replaceAll("-", ".");
}
