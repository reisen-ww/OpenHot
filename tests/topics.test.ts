// Topic pages: which articles a topic takes, and their counts.
// Written before the code, from the ways it can go wrong:
// - an organization topic takes an article about another organization that only mentions it (several subjects,
//   its name nowhere in the title), or drops one about it whose title names it in English, in another
//   case, next to Chinese text, or only by a product (it is the article's only subject);
// - a Latin name matches inside another word ("Section" is not Kubernetes); a headline naming a company
//   that is not a subject of the article gets in;
// - a stack topic stops taking its tags;
// - withdrawn or not yet released articles appear in a list or a count;
// - an article or story page names a topic its reports do not belong to;
// - a topic without content has no page, or an unknown slug or a page past the end has one.
import { tag } from "./setup.ts";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";
import { closeDb, sql } from "@aihot/backend/db";
import { upsertMaterial } from "@aihot/backend/content/materials";
import { stopBoss } from "@aihot/backend/jobs/queue";
import { publishArticle } from "@aihot/backend/publication/publish";
import { loadTopicPage, listTopicSummaries, topicsOfStory } from "@aihot/backend/publication/topics";
import { buildApp } from "../apps/api/src/app.ts";

const T = tag();
const OFFICIAL = `test-topics-official-${T}`;
const MEDIA = `test-topics-media-${T}`;
const app = await buildApp();

before(async () => {
  await sql`INSERT INTO sources (id, name, kind, tier, participation_mode, first_party, next_fetch_at) VALUES
    (${OFFICIAL}, 'Official', 'rss', 'T1', 'editorial', true, '2100-01-01'),
    (${MEDIA}, 'Media', 'rss', 'T2', 'editorial', false, '2100-01-01')`;
});
after(async () => {
  await app.close();
  await stopBoss();
  await closeDb();
});

let n = 0;
interface Report {
  source?: string;
  at: Date;
  title: string;
  originalTitle?: string;
  subjects?: string[];
  tags?: string[];
  score?: number;
  selected?: boolean;
  fact?: number;
  category?: string;
}

/** A published report; `fact` links it to a fact before publishing, as grouping would. */
async function report(r: Report): Promise<string> {
  n += 1;
  const { articleId } = await upsertMaterial({
    sourceId: r.source ?? MEDIA, url: `https://example.com/topics-${T}-${n}`, title: r.originalTitle ?? r.title, bodyText: "body", bodyHtml: "<p>body</p>", bodyStatus: "ok", via: "fetch", publishedAt: r.at,
  });
  await sql`UPDATE articles SET discovered_at = ${r.at}, timeline_at = ${r.at}, grouped_at = now() WHERE id = ${articleId}`;
  const category = r.category ?? "dev-tools";
  await sql`INSERT INTO analyses (article_id, input_revision, origin, relevance, category, title_zh, summary_zh, score, selected, subjects, tags)
            VALUES (${articleId}, 1, 'rule', 'pass', ${category}, ${r.title}, ${`摘要 ${n}`}, ${r.score ?? 80}, ${r.selected ?? true}, ${r.subjects ?? []}, ${[category === "data-database" ? "版本发布" : category === "security-privacy" ? "新项目" : category === "web-frontend" ? "重大更新" : category === "languages-runtime" ? "性能提升" : "技术方案", ...(r.tags ?? [])]})`;
  { const rr = await sql`SELECT tags FROM publications WHERE article_id = ${articleId}`; void rr; }
  if (r.fact) await sql`INSERT INTO fact_articles (fact_id, article_id, role) VALUES (${r.fact}, ${articleId}, 'report')`;
  await publishArticle(articleId, { releasedAt: new Date(r.at.getTime() + 60_000) });
  return articleId;
}

async function story(title: string): Promise<{ id: number; publicId: string }> {
  const publicId = randomUUID();
  const [s] = await sql<{ id: number }[]>`INSERT INTO stories (public_id, title, first_report_at, latest_at) VALUES (${publicId}, ${title}, now(), now()) RETURNING id`;
  return { id: s!.id, publicId };
}

async function fact(storyId: number | null, title: string): Promise<number> {
  const [f] = await sql<{ id: number }[]>`INSERT INTO facts (public_id, story_id, title) VALUES (${`f-${T}-${randomUUID()}`}, ${storyId}, ${title}) RETURNING id`;
  return f!.id;
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000);
const ids = (items: Array<{ id: string }>) => items.map((i) => i.id);
const page = async (slug: string, p = 1) => {
  const data = await loadTopicPage(slug, p, new Date());
  assert.ok(data, `${slug} page ${p}`);
  return data;
};
/** Every article of a topic, over all its pages. */
async function members(slug: string): Promise<string[]> {
  const first = await page(slug);
  const out = ids(first.items);
  for (let p = 2; p <= first.pageCount; p++) out.push(...ids((await page(slug, p)).items));
  return out;
}

test("a company topic takes the articles about it, not the ones that only mention it", async () => {
  const about = await report({ at: hoursAgo(30), title: `GitLab 上线新的代码审查 ${T}`, subjects: ["gitlab"] });
  const product = await report({ at: hoursAgo(31), title: `GitHub 新版网站上线 ${T}`, subjects: ["github"] });
  const english = await report({ at: hoursAgo(32), title: `项目周报公告 ${T}`, originalTitle: `GitLab publishes a new paper ${T}`, subjects: ["gitlab", "github"] });
  const subpoena = await report({ at: hoursAgo(33), title: `监管机构向 GitHub 发出质询 ${T}`, subjects: ["github", "gitlab", "microsoft"], tags: ["Python"] });
  const lowerCase = await report({ at: hoursAgo(34), title: `github 公布新的代码审查框架 ${T}`, subjects: ["github", "gitlab"] });
  const pact = await report({ at: hoursAgo(35), title: `二十余家基金会签署开放治理协议 ${T}`, subjects: ["gitlab", "github", "linux-foundation"], tags: ["Python"] });
  const section = await report({ at: hoursAgo(36), title: `Section 标准发布，GitHub 参与 ${T}`, subjects: ["kubernetes", "github", "microsoft"] });
  const adjacent = await report({ at: hoursAgo(37), title: `发布Kubernetes的新规 ${T}`, subjects: ["kubernetes", "github"] });
  const headline = await report({ at: hoursAgo(38), title: `GitLab 被一篇盘点提到 ${T}`, subjects: ["microsoft"] });
  const defi = await report({ category: "cool-repos", at: hoursAgo(39), title: `容器镜像扫描工具 V2 上线 ${T}`, tags: ["新项目", "Python"] });

  const binance = await members("gitlab");
  for (const id of [about, english]) assert.ok(binance.includes(id), "about GitLab");
  for (const id of [subpoena, lowerCase, pact, headline]) assert.ok(!binance.includes(id), "only mentions GitLab");
  const coinbase = await members("github");
  for (const id of [product, subpoena, lowerCase, section]) assert.ok(coinbase.includes(id), "about GitHub");
  for (const id of [english, pact]) assert.ok(!coinbase.includes(id), "only mentions GitHub");
  const sec = await members("kubernetes");
  assert.ok(sec.includes(adjacent), "Kubernetes next to Chinese text");
  assert.ok(!sec.includes(section), "Section is not Kubernetes");
  assert.ok((await members("new-project")).includes(defi), "a technical direction takes its tag");

  // The article page names the topics it belongs to.
  const topicsOf = async (id: string) => {
    const res = await app.inject({ method: "GET", url: `/api/site/items/${id}` });
    return (JSON.parse(res.body) as { topics: Array<{ slug: string }> }).topics.map((t) => t.slug);
  };
  assert.deepEqual(await topicsOf(about), ["gitlab"]);
  assert.deepEqual(await topicsOf(subpoena), ["github"]);
  assert.deepEqual(await topicsOf(pact), []);
  assert.deepEqual(await topicsOf(defi), ["new-project"]);
});

test("a story page names the topics of its reports", async () => {
  const launch = await story(`容器镜像扫描工具 V2 发布 ${T}`);
  await report({ source: OFFICIAL, category: "cool-repos", at: hoursAgo(26), title: `容器镜像扫描工具 V2 发布 ${T}`, tags: ["新项目", "Python"], fact: await fact(launch.id, "发布 V2") });
  assert.deepEqual(await topicsOfStory(launch.id), [{ slug: "new-project", name: "新项目首发" }]);
});

test("withdrawn articles stay out of lists and counts", async () => {
  const kept = await report({ at: hoursAgo(5), title: `容器运行时升级 ${T}`, subjects: ["postgresql"] });
  const withdrawn = await report({ at: hoursAgo(4), title: `容器运行时撤回的消息 ${T}`, subjects: ["postgresql"] });
  await sql`UPDATE publications SET visibility = 'withdrawn' WHERE article_id = ${withdrawn}`;

  const data = await page("postgresql");
  assert.deepEqual(ids(data.items), [kept]);
  assert.equal(data.topic.total, 1);
  const summary = (await listTopicSummaries()).topics.find((t) => t.slug === "postgresql")!;
  assert.equal(summary.latest?.title, `容器运行时升级 ${T}`, "the index shows the newest public article");
});

test("every topic has a page; unknown topics and pages past the end have none", async () => {
  const empty = await page("project-archive");
  assert.equal(empty.topic.indexable, false, "a topic without content is not indexed");
  assert.deepEqual(empty.items, []);
  assert.equal(await loadTopicPage("not-a-topic", 1, new Date()), null);
  assert.equal(await loadTopicPage("project-archive", 2, new Date()), null);
  const index = await app.inject({ method: "GET", url: "/api/site/topics" });
  const body = JSON.parse(index.body) as { groups: Array<{ key: string }>; topics: Array<{ slug: string }> };
  assert.deepEqual(body.groups.map((g) => g.key), ["org", "stack", "genre"]);
  assert.equal(body.topics.length, 24);
});
