// R軸(因縁・ブラジル専用)の挙動検証スクリプト
// Q3で a(悔しさ R-2)を選ぶとブラジルが出にくく、b(痺れ R+2)で出やすいことを
// 実データ(data/*.json)を使って確認する。
// 実行: node scripts/verify-r-axis.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const teams = JSON.parse(readFileSync(join(root, "data/teams.json"), "utf8"));
const questions = JSON.parse(readFileSync(join(root, "data/questions.json"), "utf8"));

// アプリと同一ロジック(lib/scoring.ts 相当)。タイブレーク乱数は検証のため固定順。
const AXES = ["K", "U", "A", "S", "N", "F", "Y", "R"];

function computeUserScores(answers) {
  const user = {};
  for (const a of answers) {
    for (const axis of AXES) {
      if (a[axis] !== undefined) user[axis] = (user[axis] ?? 0) + a[axis];
    }
  }
  return user;
}

function scoreTeam(user, team) {
  return AXES.reduce((s, axis) => s + (user[axis] ?? 0) * (team.axes[axis] ?? 0), 0);
}

function rank(user) {
  return teams
    .map((team) => ({ id: team.id, name: team.name, score: scoreTeam(user, team) }))
    .sort((a, b) => b.score - a.score);
}

// 「ブラジルが出やすい素地」の回答セット(王道・華麗寄り: Q1a, Q4a, Q6a, Q7b, Q9a, Q10b 等)
// Q3(index 2)だけを差し替えて比較する
function answersWithQ3(q3key) {
  const picks = { 1: "a", 2: "b", 3: q3key, 4: "a", 5: "a", 6: "a", 7: "b", 8: "b", 9: "a", 10: "b" };
  return questions.map((q) => q.options.find((o) => o.key === picks[q.id]).scores);
}

let ok = true;
const results = {};
for (const key of ["a", "b", "c"]) {
  const user = computeUserScores(answersWithQ3(key));
  const ranking = rank(user);
  const bra = ranking.find((t) => t.id === "bra");
  const pos = ranking.findIndex((t) => t.id === "bra") + 1;
  results[key] = { score: bra.score, pos, top: ranking[0] };
  console.log(
    `Q3=${key}: ブラジル score=${bra.score} (${pos}位) / 1位=${ranking[0].name}(${ranking[0].score})`
  );
}

const diff = results.b.score - results.a.score;
console.log(`\nブラジルスコア差 (Q3=b − Q3=a): +${diff}`);
if (!(results.b.score > results.a.score)) {
  console.error("NG: Q3=b でブラジルスコアが上がっていない");
  ok = false;
}
if (!(results.b.pos < results.a.pos)) {
  console.error("NG: Q3=b でブラジル順位が上がっていない");
  ok = false;
}

// スモーク: 質問数・チーム数・R軸を持つのはブラジルのみ
if (questions.length !== 10) { console.error("NG: 質問が10問ではない"); ok = false; }
if (teams.length !== 15) { console.error("NG: チームが15カ国ではない"); ok = false; }
const rTeams = teams.filter((t) => (t.axes.R ?? 0) !== 0).map((t) => t.id);
if (rTeams.join() !== "bra") { console.error("NG: R軸を持つチームが bra 以外に存在"); ok = false; }

console.log(ok ? "\nOK: R軸の挙動は仕様通り" : "\nFAILED");
process.exit(ok ? 0 : 1);
