// Shared setup for the invariant tests (node --test tests/). They write rows, so they refuse to run
// unless DATABASE_URL names a throwaway database ending in _test or _ci.
// Secrets are test values set here, never real credentials; paid providers are pointed at local stubs
// by the tests that need them, and the push valves stay off. npm test gives each file its own copy of
// the database (databases.ts).
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import http from "node:http";
import { beijingAt } from "@aihot/contracts/time";
import { EDITION_TIMES } from "@aihot/site";
import { DEFAULTS, PRESETS } from "@aihot/site/models";

// Windows 原生没有 Linux/macOS 那套工具链（docs/deploy.md 要求 Linux/macOS，或 WSL2/Docker），
// 备份测试需要的 pg_dump/pg_restore（PostgreSQL）、tar 路径探测用到的 sh、出站协议测试的 openssl
// 都只装在各自的安装目录里，不在 PATH 中。这里把它们补进测试进程的 PATH。
// ⚠️ 必须**追加到末尾**，绝不能前置：CreateProcess 按 PATH 顺序查找，System32 在前，
// 因此 tar 仍然命中 Windows 自带的 bsdtar（System32\tar.exe），而不是 Git 的 GNU tar。
// 备份测试（tests/backup.test.ts）断言 tar 失败时 stderr 以 `tar` 开头且不含 `Command failed|-czf`；
// bsdtar 输出 `tar: Failed to open ...` 满足该断言，而 GNU tar 经 MSYS 包装后输出
// `/bin/sh: line 1: gzip: command not found`，会让断言失败。前置会破坏这一点。
// 同理 find/sort/timeout/whoami 等仍走 System32 原生版；只有 System32 没有的
// openssl（Git\usr\bin）、sh（Git\bin）、pg_dump/pg_restore（PostgreSQL\16\bin）才会往后找到。
if (process.platform === "win32") {
  const extra = [
    String.raw`C:\Program Files\PostgreSQL\16\bin`, // pg_dump / pg_restore / psql
    String.raw`C:\Program Files\Git\bin`, // sh（backup-files.test.ts 用 `sh -c 'command -v tar'` 探测真实 tar）
    String.raw`C:\Program Files\Git\usr\bin`, // openssl（outbound-protocol.test.ts 自签测试证书）
  ].filter((dir) => existsSync(dir));
  const current = process.env.PATH ?? "";
  const entries = current.split(";");
  const missing = extra.filter((dir) => !entries.includes(dir));
  if (missing.length > 0) process.env.PATH = [...entries, ...missing].join(";");
}

const database = new URL(process.env.DATABASE_URL ?? "postgres://unset/unset").pathname.slice(1);
if (!/_(test|ci)$/.test(database)) {
  throw new Error(`Invariant tests write rows: point DATABASE_URL at a throwaway database named *_test or *_ci (got "${database}")`);
}
process.env.AIHOT_CREDENTIALS_DIR = "/nonexistent-test-credentials";
process.env.SESSION_SECRET ??= "test-session-secret-0123456789";
process.env.IMG_PROXY_SIGN_SECRET ??= "test-img-secret-0123456789";
process.env.FEISHU_CONTENT_PUSH_ENABLED = "false";
process.env.INDEXNOW_SUBMIT_ENABLED = "false";
process.env.LOG_LEVEL ??= "error";
// Paid providers are local stubs in these tests: calls and collection may run (the valves default off).
process.env.MODEL_CALLS_ENABLED ??= "true";
process.env.COLLECT_ENABLED ??= "true";
// The tests were written against named model presets, one per step (each provider is pointed at a
// local stub by the test that needs it). A step the site leaves on the `default` model gets its
// preset here; tests/default-model.test.ts covers the default.
const STEP_MODELS: Record<string, [env: string, model: string]> = {
  prefilter: ["PREFILTER_MODEL", "qwen3.7-flash"], score: ["SCORE_MODEL", "glm-5.3-flash-selection"], understand: ["UNDERSTAND_MODEL", "glm-5.3-flash"],
  summarize: ["SUMMARIZE_MODEL", "deepseek-flash"], structure: ["STRUCTURE_MODEL", "qwen3.8-flash"], group: ["GROUP_MODEL", "deepseek-flash"],
  groupReview: ["GROUP_REVIEW_MODEL", "mimo-v2.6-flash"], digest: ["DIGEST_MODEL", "deepseek-flash"], report: ["REPORT_MODEL", "deepseek-flash"],
  translate: ["TRANSLATE_MODEL", "deepseek-flash"],
};
for (const [step, [env, model]] of Object.entries(STEP_MODELS)) if (!DEFAULTS[step]) process.env[env] ??= model;

/**
 * Sends the calls of the named model presets to a stub: sets each one's address and key variables, which
 * the site's presets name. By default the providers of the article analysis (DashScope, GLM, DeepSeek).
 */
export function pointModels(url: string, models = ["qwen3.7-flash", "glm-5.3-flash", "deepseek-flash"], env: NodeJS.ProcessEnv = process.env) {
  for (const name of models) {
    const preset = PRESETS[name];
    if (!preset) throw new Error(`the site has no model preset ${name}`);
    env[preset.baseUrlEnv] = `${url}/v1`;
    env[preset.apiKeyEnv] = "test-key";
  }
}

/**
 * A local HTTP stub standing in for a paid provider; `answer` builds every response from the request
 * (it may wait, to hold a request open while a test changes something).
 */
export async function stub(answer: (hit: number, req: { url: string; body: string }) => unknown) {
  let hits = 0;
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", async () => {
      hits += 1;
      const out = await answer(hits, { url: req.url ?? "/", body: Buffer.concat(chunks).toString("utf8") });
      const reply = out instanceof Reply ? out : { status: 200, json: out };
      res.writeHead(reply.status, { "content-type": "application/json" });
      res.end(JSON.stringify(reply.json));
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  const { port } = server.address() as { port: number };
  return { url: `http://127.0.0.1:${port}`, hits: () => hits, close: () => new Promise<void>((resolve) => server.close(() => resolve())) };
}

/**
 * The embeddings provider as a stub of its own (DASHSCOPE_BASE_URL), so chat stubs count only their
 * calls. A text's vector marks the pairs of adjacent characters it contains, hashed into the model's
 * 1,024 dimensions: texts that share wording come out close, texts that share none do not.
 */
export async function embeddingsStub() {
  const vector = (text: string) => {
    const out = Array<number>(1024).fill(0);
    const chars = [...text.replace(/\s+/g, "")];
    for (let i = 0; i + 1 < chars.length; i++) out[createHash("sha256").update(chars[i]! + chars[i + 1]!).digest().readUInt16BE(0) % 1024] = 1;
    return out;
  };
  const server = await stub((_hit, req) => ({ data: (JSON.parse(req.body).input as string[]).map((text, index) => ({ index, embedding: vector(text) })) }));
  process.env.DASHSCOPE_BASE_URL = `${server.url}/v1`;
  process.env.DASHSCOPE_API_KEY = "test-key";
  return server;
}

/** A stub answer with its own status (e.g. a provider's 503); anything else is a 200 JSON body. */
export class Reply {
  readonly status: number;
  readonly json: unknown;
  constructor(status: number, json: unknown) {
    this.status = status;
    this.json = json;
  }
}

/** A promise with its resolve function, to hold a stub's answer until a test releases it. */
export function gate<T = void>() {
  let open!: (value: T) => void;
  const promise = new Promise<T>((resolve) => (open = resolve));
  return { promise, open };
}

/** A short unique tag for the rows a test creates. */
export const tag = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** `seconds` after the site's edition time of a report kind on a Beijing date (EDITION_TIMES), so tests follow the site's schedule. */
export const editionAt = (kind: keyof typeof EDITION_TIMES, date: string, seconds = 0) => new Date(beijingAt(date, EDITION_TIMES[kind]).getTime() + seconds * 1000);
