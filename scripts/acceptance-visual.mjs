/**
 * Playwright 受け入れテスト（Visual確認用）
 * Vision Install ❶' 5項目を自律的に検証
 */
import { chromium } from "@playwright/test";
import { writeFileSync } from "fs";

const BASE_URL = "http://localhost:3001";
const errors = [];
const results = [];

function log(msg) { console.log(`[TEST] ${msg}`); }
function pass(msg) { results.push({ status: "PASS", msg }); log(`✓ ${msg}`); }
function fail(msg) { results.push({ status: "FAIL", msg }); log(`✗ ${msg}`); }

async function run() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`[CONSOLE ERROR] ${msg.text()}`);
      log(`CONSOLE ERROR: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`[PAGE ERROR] ${err.message}`);
    log(`PAGE ERROR: ${err.message}`);
  });

  log("=== ページロード ===");
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 15000 });
  await page.screenshot({ path: "scripts/shot-01-initial.png", fullPage: true });

  // ❶'-1: 出張目的を入力できる
  log("=== ❶'-1: フォームUI確認 ===");
  const destSelect = await page.$("select");
  if (destSelect) pass("❶'-1: 目的地セレクトボックス存在");
  else fail("❶'-1: 目的地セレクトボックスが見つからない");

  await page.selectOption("select", { index: 1 });
  await page.screenshot({ path: "scripts/shot-02-destination.png", fullPage: true });

  const purposeBtns = await page.$$("button");
  let purposeClicked = false;
  for (const btn of purposeBtns) {
    const text = await btn.textContent();
    if (text && text.includes("SaaS")) {
      await btn.click();
      purposeClicked = true;
      break;
    }
  }
  if (purposeClicked) pass("❶'-1: 出張目的ボタンをクリック成功");
  else fail("❶'-1: 出張目的ボタンが見つからない");

  await page.waitForTimeout(300);
  const allBtns1 = await page.$$("button");
  const clickableDays = [];
  for (const btn of allBtns1) {
    const text = await btn.textContent();
    const disabled = await btn.getAttribute("disabled");
    if (text && /^\d+$/.test(text.trim()) && disabled === null) {
      clickableDays.push(btn);
    }
  }
  log(`クリック可能な日付ボタン数: ${clickableDays.length}`);

  if (clickableDays.length >= 2) {
    await clickableDays[0].click();
    await page.waitForTimeout(300);
    const allBtns2 = await page.$$("button");
    const clickableDays2 = [];
    for (const btn of allBtns2) {
      const text = await btn.textContent();
      const disabled = await btn.getAttribute("disabled");
      if (text && /^\d+$/.test(text.trim()) && disabled === null) {
        clickableDays2.push(btn);
      }
    }
    if (clickableDays2.length >= 2) {
      await clickableDays2[1].click();
    }
    pass("❶'-1: 出発日・帰着日を選択");
  } else {
    fail("❶'-1: クリック可能な日付ボタンが不足");
  }

  await page.waitForTimeout(300);
  const startBtn = await page.$("button:has-text('AIマッチングを開始する')");
  if (startBtn) {
    await startBtn.click();
    pass("❶'-1: AIマッチングを開始するボタンをクリック");
  } else {
    fail("❶'-1: AIマッチングを開始するボタンが見つからない");
  }

  await page.screenshot({ path: "scripts/shot-03-loading.png", fullPage: true });

  // ❶'-2: 候補者が3名以上表示される
  log("=== ❶'-2: 候補者3名以上 ===");
  try {
    await page.waitForSelector("text=No.1 優先アプローチ", { timeout: 8000 });
  } catch (e) {
    log("waitForSelector timeout - 続行");
  }
  await page.screenshot({ path: "scripts/shot-04-candidates.png", fullPage: true });
  const no1 = await page.$("text=No.1 優先アプローチ");
  const no2 = await page.$("text=No.2 次点候補");
  const no3 = await page.$("text=No.3 補欠候補");
  if (no1 && no2 && no3) pass("❶'-2: 候補者3名以上表示");
  else fail(`❶'-2: 候補者不足 no1=${!!no1} no2=${!!no2} no3=${!!no3}`);

  // ❶'-3: 優先順位が明確に見える
  log("=== ❶'-3: 優先順位ラベル ===");
  if (no1) pass("❶'-3: No.1 優先アプローチ 表示");
  else fail("❶'-3: No.1 優先アプローチ が見つからない");
  if (no2) pass("❶'-3: No.2 次点候補 表示");
  else fail("❶'-3: No.2 次点候補 が見つからない");
  if (no3) pass("❶'-3: No.3 補欠候補 表示");
  else fail("❶'-3: No.3 補欠候補 が見つからない");

  // ❶'-4: 各候補の推薦理由が分かる (aria-expanded ボタンで展開)
  log("=== ❶'-4: 推薦理由 ===");
  const toggleBtns = await page.$$("button[aria-expanded]");
  log(`aria-expanded ボタン数: ${toggleBtns.length}`);
  if (toggleBtns.length > 0) {
    await toggleBtns[0].click();
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: "scripts/shot-05-expanded.png", fullPage: true });
  const reason = await page.$("text=AIマッチング選定理由");
  const pitch = await page.$("text=打診テキスト");
  if (reason) pass("❶'-4: AIマッチング選定理由 表示");
  else fail("❶'-4: AIマッチング選定理由 が見つからない");
  if (pitch) pass("❶'-4: 打診テキスト 表示");
  else fail("❶'-4: 打診テキスト が見つからない");

  // ❶'-5: 顧客が次に会う相手を選べる ({name}様とのチャットに進む)
  log("=== ❶'-5: チャットへ進む ===");
  const chatBtn = await page.$("button:has-text('チャットに進む')");
  log(`チャットボタン存在: ${!!chatBtn}`);
  if (chatBtn) {
    await chatBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "scripts/shot-06-chat.png", fullPage: true });
    const msgInput = await page.$("[data-testid='message-input']");
    const sendBtn = await page.$("[data-testid='send-button']");
    if (msgInput && sendBtn) pass("❶'-5: チャット画面（message-input + send-button）表示");
    else fail("❶'-5: チャット画面のUIが見つからない");
  } else {
    fail("❶'-5: チャットに進むボタンが見つからない");
  }

  await browser.close();

  console.log("\n=== 受け入れテスト結果 ===");
  results.forEach(r => console.log(`[${r.status}] ${r.msg}`));
  if (errors.length > 0) {
    console.log("\n=== コンソールエラー ===");
    errors.forEach(e => console.log(e));
  }
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  console.log(`\n合計: ${passed} PASS / ${failed} FAIL`);

  writeFileSync("scripts/acceptance-result.json", JSON.stringify({ results, errors, passed, failed }, null, 2));
  process.exit(failed > 0 || errors.length > 0 ? 1 : 0);
}

run().catch(err => {
  console.error("FATAL:", err);
  process.exit(1);
});
