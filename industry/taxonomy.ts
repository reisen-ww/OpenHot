// 这个行业的分类体系：类别、标签词表、机构（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "dev-tools", label: "开发工具", feedLabel: "开发工具", section: "工具与项目", guide: "面向开发者的工具与工作流：编辑器与 IDE、终端与 shell、CLI、调试与性能分析、构建与打包、包管理与依赖、代码生成与重构、测试与 CI 工具、版本控制与代码托管。收工具本身的发布与重大更新、新工具的出现、以及改变日常开发方式的进展。把只在某个框架内使用的库归 Web 与前端或对应语言；把运行在服务器集群上的编排与运维平台归基础设施；把面向最终用户的应用归社区新奇仓库。" },
  { key: "cool-repos", label: "社区新奇仓库", feedLabel: "社区新奇仓库", section: "工具与项目", guide: "让人眼前一亮、通常不直接解决生产问题的开源项目：有趣的实验、技术演示、创意工具、复刻与模拟、可视化与生成艺术、硬件与嵌入式玩具、把某件荒谬的事做出来的项目、以及突然走红的个人作品。收「居然有人做了这个」这一类，也收因话题性而快速获得关注的仓库。硬性前提：正文必须指向一个公开可获取源码的仓库或作品（仓库地址、可下载源码、或明确的开源发布）。闭源商业产品、商业服务与订阅、公司发布会与商业合作、闭源模型上线、模型评测报道、消费电子评测一律不收，category 给 null，不要为了有类别而塞进本条。把正经的生产力工具归开发工具；把开放的模型权重与数据集仓库归模型与数据集；只收开源项目本身，不收仅讨论项目的文章。" },
  { key: "security-privacy", label: "安全与隐私", feedLabel: "安全与隐私", section: "应用与安全", guide: "信息安全与隐私保护：漏洞披露与修复、供应链安全、加密与认证、权限与密钥管理、渗透测试与安全审计工具、恶意软件分析、隐私增强技术、去中心化与匿名通信、数据保护工具。收具体的漏洞、修复版本、攻击手法与防御工具。把普通的依赖升级归开发工具；把合规政策与法律解读留在本条目的政策面，不展开法律分析。" },
  { key: "web-frontend", label: "Web 与前端", feedLabel: "Web 与前端", section: "应用与安全", guide: "Web 平台与前端开发：浏览器与渲染引擎、JavaScript/TypeScript 生态、前端框架与元框架、UI 组件库与设计系统、CSS 与样式方案、状态管理、服务端渲染、WebAssembly、浏览器 API 与标准进展、网站性能与可访问性。收框架与库的发布、浏览器新特性、影响前端写法的标准变化。把 Node.js 运行时本身归编程语言与运行时；把后端服务框架归基础设施。" },
  { key: "infrastructure", label: "基础设施", feedLabel: "基础设施", section: "基础设施", guide: "运行与运维系统的基础设施：容器与镜像、编排与调度、服务网格、CI/CD、配置管理与 IaC、可观测性（日志、指标、追踪）、消息队列、反向代理与网关、存储与网络、云原生生态、自托管与家庭实验室方案。收平台组件的发布与重大变更、新的部署范式、以及规模化运维的经验性进展。把数据库引擎本身归数据与数据库；把应用层框架归 Web 与前端。" },
  { key: "data-database", label: "数据与数据库", feedLabel: "数据与数据库", section: "基础设施", guide: "数据的存储、处理与分析：关系型与 NoSQL 数据库、向量数据库、查询引擎与优化器、数据仓库与湖仓、流处理与批处理、ETL 与数据管道、缓存、以及数据分析与可视化工具。收数据库引擎的发布与新特性、查询语言的演进、以及处理规模或形态上的新方案。把机器学习训练框架归开发工具；把基础设施编排归基础设施。" },
  { key: "languages-runtime", label: "编程语言与运行时", feedLabel: "编程语言与运行时", section: "语言与底层", guide: "编程语言、编译器与运行时：语言本身的设计与版本发布、编译器与解释器、虚拟机与垃圾回收、包管理与构建系统、语言服务器与工具链、跨语言互操作、以及新兴语言的进展。收语言特性、性能改进、工具链变化。把用某语言写的框架与库归对应领域（Web 框架归 Web 与前端，数据库归数据与数据库）；这一条只收语言与运行时的本体。" },
  { key: "models-datasets", label: "模型与数据集", feedLabel: "模型与数据集", section: "模型与数据", guide: "Hugging Face 等平台上以仓库形式发布的开放模型与数据集：新模型的权重发布、数据集上线与更新、模型卡与许可证变化、以及让它们可被使用的配套工具。这一条只收「可下载的开放模型与数据集仓库」，与代码仓库并列看待。闭源的商业模型与 AI 应用产品、模型评测报道、商业服务公告不是开源内容，本条不收，其他条也不收：没有可获取的仓库、权重或源码时 category 给 null，不要改塞进别的类别；把训练框架与推理引擎的源码仓库归开发工具。" },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（如 AI 行业的新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 * 开源站没有单一“发布”形态：新项目首发、版本发布、重大更新、安全修复分散在八个类别里，没有一个既定的类别与标签组合可以代表“本期新发布”。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["github", "gitlab", "star", "fork", "pr", "issue", "commit", "merge", "release", "tag", "cli", "sdk", "api", "ci", "cd", "docker", "kubernetes", "linux", "llm"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["new_project", "major_release", "minor_release", "security_fix", "trending_repo", "ecosystem_news", "opinion_analysis"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/**
 * 每篇资料的第一个标签必须是这些“分类标签”之一。
 * 顺序不是随意的：模型没给出可用的分类标签时，normalizeTags 会回落到最后一项，
 * 所以最通用的「教程与观点」放在末尾（未归类的开源资料标成“教程与观点”比标成别的内容形态更合理）。
 */
export const CATEGORY_TAGS = [
  "新项目", "版本发布", "重大更新", "架构重构", "性能提升",
  "安全漏洞", "许可证变更", "项目归档", "融资与商业", "人事变动",
  "社区争议", "技术方案", "教程与观点",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "Rust", "Go", "Python", "TypeScript", "Zig", "Kubernetes", "Docker",
  "PostgreSQL", "SQLite", "LLM", "Agent", "RAG", "WebAssembly",
  "编辑器", "终端", "自托管", "供应链安全", "端到端加密", "嵌入式", "复古计算",
] as const;

/** 可选的实体标签（平台、基金会、项目、公司）。 */
export const ENTITY_TAGS = ["GitHub", "GitLab", "Hugging Face", "Linux", "Kubernetes", "Docker", "PostgreSQL", "Redis", "React", "Vue", "Rust", "Python", "Microsoft", "Google"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  新项目: "新项目", 新仓库: "新项目", 新开源项目: "新项目", 首次开源: "新项目", 开源新项目: "新项目", 新发布的工具: "新项目", "new project": "新项目", 全新项目: "新项目",
  发版: "版本发布", 新版本: "版本发布", 版本更新: "版本发布", 正式版: "版本发布", 稳定版: "版本发布", 发布新版本: "版本发布", release: "版本发布", 小版本: "版本发布", 补丁版本: "版本发布",
  重大更新: "重大更新", 大版本: "重大更新", 主版本: "重大更新", 大更新: "重大更新", 重要更新: "重大更新", 破坏性变更: "重大更新", 不兼容变更: "重大更新", "breaking change": "重大更新",
  重构: "架构重构", 代码重构: "架构重构", 重写: "架构重构", rewrite: "架构重构", 解耦: "架构重构", 模块化: "架构重构", 拆分模块: "架构重构", 重写内核: "架构重构",
  性能优化: "性能提升", 提速: "性能提升", 更快: "性能提升", benchmark: "性能提升", 基准测试: "性能提升", 基准跑分: "性能提升", 内存占用: "性能提升", 冷启动: "性能提升", 编译速度: "性能提升",
  漏洞: "安全漏洞", 高危漏洞: "安全漏洞", cve: "安全漏洞", 零日漏洞: "安全漏洞", "0day": "安全漏洞", 提权: "安全漏洞", 远程代码执行: "安全漏洞", rce: "安全漏洞", sql注入: "安全漏洞", 拒绝服务: "安全漏洞", 漏洞披露: "安全漏洞", 安全补丁: "安全漏洞",
  许可证: "许可证变更", license: "许可证变更", 开源协议: "许可证变更", 协议变更: "许可证变更", 更换许可证: "许可证变更", 闭源: "许可证变更", 商业许可: "许可证变更", 双许可: "许可证变更", 著作权归属: "许可证变更",
  归档: "项目归档", 停止维护: "项目归档", 弃用: "项目归档", 不再维护: "项目归档", deprecated: "项目归档", eol: "项目归档", 停止更新: "项目归档", 项目终止: "项目归档", 寻找维护者: "项目归档",
  融资: "融资与商业", 商业化: "融资与商业", 商业公司: "融资与商业", 收购: "融资与商业", 并购: "融资与商业", ipo: "融资与商业", 估值: "融资与商业", 企业版: "融资与商业", 付费版: "融资与商业", 商业支持: "融资与商业", 赞助: "融资与商业",
  人事: "人事变动", 任免: "人事变动", 离职: "人事变动", 加盟: "人事变动", 创始人: "人事变动", 维护者变更: "人事变动", 核心开发者: "人事变动", 辞任: "人事变动", 新任维护者: "人事变动", 接管维护: "人事变动",
  争议: "社区争议", 治理争议: "社区争议", 商标争议: "社区争议", 开源治理: "社区争议", 分叉争议: "社区争议", 抗议: "社区争议", 抵制: "社区争议", 社区分裂: "社区争议", 行为准则: "社区争议",
  设计文档: "技术方案", 实现原理: "技术方案", 内部机制: "技术方案", rfc: "技术方案", 技术提案: "技术方案", 架构设计: "技术方案", 技术细节: "技术方案", 源码解析: "技术方案",
  教程: "教程与观点", 观点: "教程与观点", 评论: "教程与观点", 思考: "教程与观点", 经验分享: "教程与观点", 指南: "教程与观点", 入门教程: "教程与观点", 最佳实践: "教程与观点", 踩坑: "教程与观点", 随笔: "教程与观点", 深度解析: "教程与观点",
  rust语言: "Rust", rustlang: "Rust", cargo: "Rust",
  golang: "Go", go语言: "Go", goroutine: "Go",
  python3: "Python", cpython: "Python", pip: "Python",
  ts语言: "TypeScript", typescript语言: "TypeScript",
  zig语言: "Zig", ziglang: "Zig",
  k8s: "Kubernetes", 容器编排: "Kubernetes", 容器调度: "Kubernetes",
  容器: "Docker", 容器化: "Docker", "oci 镜像": "Docker",
  postgres: "PostgreSQL", pgsql: "PostgreSQL",
  sqlite3: "SQLite", 嵌入式数据库: "SQLite",
  大模型: "LLM", 大语言模型: "LLM", 语言模型: "LLM", gpt: "LLM", 生成式ai: "LLM", 推理模型: "LLM", 本地模型: "LLM",
  智能体: "Agent", "ai agent": "Agent", 自主代理: "Agent", 编码代理: "Agent", "coding agent": "Agent", 多智能体: "Agent",
  检索增强: "RAG", 检索增强生成: "RAG", 向量检索: "RAG", 知识库问答: "RAG",
  wasm: "WebAssembly", 浏览器字节码: "WebAssembly",
  代码编辑器: "编辑器", 文本编辑器: "编辑器", ide: "编辑器", lsp: "编辑器", 语言服务器: "编辑器",
  命令行: "终端", 命令行工具: "终端", shell: "终端", tui: "终端", 终端模拟器: "终端",
  私有部署: "自托管", 自部署: "自托管", 家庭实验室: "自托管", homelab: "自托管", 私有云: "自托管", 内网部署: "自托管",
  供应链攻击: "供应链安全", 依赖投毒: "供应链安全", sbom: "供应链安全", 软件物料清单: "供应链安全", slsa: "供应链安全",
  e2ee: "端到端加密", 加密通信: "端到端加密", 零知识加密: "端到端加密", 加密聊天: "端到端加密",
  单片机: "嵌入式", mcu: "嵌入式", 固件: "嵌入式", 物联网: "嵌入式", iot: "嵌入式",
  老电脑: "复古计算", 复古游戏: "复古计算", "8位机": "复古计算", dos: "复古计算", 磁带机: "复古计算",
  gh: "GitHub", "github.com": "GitHub", 代码托管平台: "GitHub",
  "gitlab.com": "GitLab", 极狐: "GitLab",
  hf: "Hugging Face", huggingface: "Hugging Face", 抱抱脸: "Hugging Face",
  内核: "Linux", "gnu/linux": "Linux", "linux 内核": "Linux",
  "redis 缓存": "Redis",
  reactjs: "React", "react.js": "React", "react 生态": "React",
  vuejs: "Vue", "vue.js": "Vue", vue3: "Vue",
  微软: "Microsoft", msft: "Microsoft", azure: "Microsoft", windows: "Microsoft",
  谷歌: "Google", alphabet: "Google", goog: "Google",
};

// ── 机构与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 机构主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是机构自己的其他称呼（官方账号名、子品牌、下属项目），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  github: { name: "GitHub", displayTag: "GitHub", aliases: ["GitHub", "github.com", "GH"], otherNames: ["GitHub Actions", "GitHub Copilot", "GitHub Trending", "GitHub Sponsors"] },
  gitlab: { name: "GitLab", displayTag: "GitLab", aliases: ["GitLab", "gitlab.com", "极狐 GitLab"], otherNames: ["GitLab CI", "GitLab Runner"] },
  "hacker-news": { name: "Hacker News", displayTag: "Hacker News", aliases: ["Hacker News", "HN", "news.ycombinator.com"], otherNames: ["Y Combinator", "Show HN", "Ask HN"] },
  lobsters: { name: "Lobsters", displayTag: "Lobsters", aliases: ["Lobsters", "lobste.rs"], otherNames: ["Lobsters 社区"] },
  reddit: { name: "Reddit", displayTag: "Reddit", aliases: ["Reddit", "reddit.com", "r/programming"], otherNames: ["r/linux", "r/selfhosted", "r/rust", "r/devops"] },
  "hugging-face": { name: "Hugging Face", displayTag: "Hugging Face", aliases: ["Hugging Face", "HuggingFace", "huggingface.co", "抱抱脸"], otherNames: ["Transformers", "Diffusers", "Safetensors", "Datasets"] },
  "linux-foundation": { name: "Linux 基金会", displayTag: null, aliases: ["Linux Foundation", "Linux 基金会", "LF"], otherNames: ["LF Europe", "OpenJS Foundation", "SPDX"] },
  cncf: { name: "CNCF", displayTag: null, aliases: ["CNCF", "Cloud Native Computing Foundation", "云原生计算基金会"], otherNames: ["KubeCon", "Graduated Projects", "Sandbox"] },
  "rust-foundation": { name: "Rust 基金会", displayTag: null, aliases: ["Rust Foundation", "Rust 基金会"], otherNames: ["Rust 项目团队"] },
  psf: { name: "Python 软件基金会", displayTag: null, aliases: ["Python Software Foundation", "PSF", "Python 软件基金会"], otherNames: ["PyCon", "CPython 治理"] },
  mozilla: { name: "Mozilla", displayTag: null, aliases: ["Mozilla", "谋智", "mozilla.org"], otherNames: ["Firefox", "MDN", "Rust 起源团队"] },
  apache: { name: "Apache 软件基金会", displayTag: null, aliases: ["Apache", "Apache Software Foundation", "ASF", "Apache 软件基金会"], otherNames: ["Apache HTTP Server", "Kafka", "Spark", "Apache 许可证"] },
  gnu: { name: "GNU 项目", displayTag: null, aliases: ["GNU", "GNU Project", "GPL", "自由软件基金会", "FSF"], otherNames: ["GNU 通用公共许可证", "GCC", "Emacs"] },
  "kernel-org": { name: "Linux", displayTag: "Linux", aliases: ["Linux", "Linux kernel", "Linux 内核", "kernel.org"], otherNames: ["Linus Torvalds", "LTS 内核"] },
  canonical: { name: "Canonical", displayTag: null, aliases: ["Canonical", "Ubuntu", "ubuntu.com"], otherNames: ["Snap", "LTS 发行版"] },
  "red-hat": { name: "Red Hat", displayTag: null, aliases: ["Red Hat", "红帽", "RHEL", "redhat.com"], otherNames: ["Fedora", "CentOS Stream", "OpenShift"] },
  openssf: { name: "OpenSSF", displayTag: null, aliases: ["OpenSSF", "Open Source Security Foundation", "开源安全基金会"], otherNames: ["SLSA", "Sigstore", "Scorecard"] },
  cve: { name: "CVE", displayTag: null, aliases: ["CVE", "cve.org", "Common Vulnerabilities and Exposures"], otherNames: ["MITRE", "NVD", "NIST"] },
  eff: { name: "EFF", displayTag: null, aliases: ["EFF", "Electronic Frontier Foundation", "电子前哨基金会"] },
  torproject: { name: "Tor Project", displayTag: null, aliases: ["Tor Project", "Tor", "torproject.org"], otherNames: ["Tor Browser", "洋葱路由"] },
  letsencrypt: { name: "Let's Encrypt", displayTag: null, aliases: ["Let's Encrypt", "letsencrypt.org", "ISRG"], otherNames: ["Certbot", "ACME 协议"] },
  docker: { name: "Docker", displayTag: "Docker", aliases: ["Docker", "docker.com", "Docker Hub", "容器"], otherNames: ["containerd", "Docker Compose", "Docker Desktop", "OCI 镜像"] },
  kubernetes: { name: "Kubernetes", displayTag: "Kubernetes", aliases: ["Kubernetes", "K8s", "kubernetes.io"], otherNames: ["kubectl", "Helm", "Kustomize"] },
  hashicorp: { name: "HashiCorp", displayTag: null, aliases: ["HashiCorp", "Hashi", "hashicorp.com"], otherNames: ["Terraform", "Vault", "Consul", "Nomad", "Packer"] },
  elastic: { name: "Elastic", displayTag: null, aliases: ["Elastic", "Elasticsearch", "elastic.co"], otherNames: ["Kibana", "Logstash", "Beats", "Elastic License"] },
  mongodb: { name: "MongoDB", displayTag: null, aliases: ["MongoDB", "mongo", "mongodb.com"], otherNames: ["SSPL", "Atlas", "DocumentDB"] },
  supabase: { name: "Supabase", displayTag: null, aliases: ["Supabase", "supabase.com"], otherNames: ["PostgREST", "Realtime", "GoTrue"] },
  postgresql: { name: "PostgreSQL", displayTag: "PostgreSQL", aliases: ["PostgreSQL", "Postgres", "PG", "postgresql.org"], otherNames: ["psql", "PGDG", "pgvector"] },
  sqlite: { name: "SQLite", displayTag: null, aliases: ["SQLite", "sqlite.org"], otherNames: ["SQLite Consortium", "WAL 模式"] },
  redis: { name: "Redis", displayTag: "Redis", aliases: ["Redis", "redis.io"], otherNames: ["Valkey", "Redis Stack"] },
  nginx: { name: "Nginx", displayTag: null, aliases: ["Nginx", "nginx.org"], otherNames: ["OpenResty", "F5"] },
  vercel: { name: "Vercel", displayTag: null, aliases: ["Vercel", "vercel.com"], otherNames: ["Next.js", "Turbopack", "SWC"] },
  cloudflare: { name: "Cloudflare", displayTag: null, aliases: ["Cloudflare", "cloudflare.com"], otherNames: ["Workers", "R2", "Wrangler", "Pages"] },
  deno: { name: "Deno", displayTag: null, aliases: ["Deno", "deno.com", "Deno Land"], otherNames: ["Deno Deploy", "Fresh", "JSR"] },
  bun: { name: "Bun", displayTag: null, aliases: ["Bun", "bun.sh", "Oven"], otherNames: ["Bun 运行时", "Oven.sh"] },
  nodejs: { name: "Node.js", displayTag: null, aliases: ["Node.js", "NodeJS", "Node", "nodejs.org"], otherNames: ["npm", "OpenJS Foundation", "V8"] },
  react: { name: "React", displayTag: "React", aliases: ["React", "React.js", "ReactJS", "react.dev"], otherNames: ["React Native", "Hooks", "Server Components"] },
  vue: { name: "Vue", displayTag: "Vue", aliases: ["Vue", "Vue.js", "VueJS", "vuejs.org"], otherNames: ["Vue Router", "Pinia", "Vapor Mode"] },
  svelte: { name: "Svelte", displayTag: null, aliases: ["Svelte", "svelte.dev", "SvelteKit"], otherNames: ["Runes", "Svelte 5"] },
  tailwind: { name: "Tailwind CSS", displayTag: null, aliases: ["Tailwind", "Tailwind CSS", "tailwindcss.com"], otherNames: ["Tailwind Plus", "Headless UI"] },
  vite: { name: "Vite", displayTag: null, aliases: ["Vite", "vitejs.dev", "vite.dev"], otherNames: ["Rollup", "Rolldown"] },
  astral: { name: "Astral", displayTag: null, aliases: ["Astral", "astral.sh"], otherNames: ["uv", "ruff", "ty"] },
  ollama: { name: "Ollama", displayTag: null, aliases: ["Ollama", "ollama.com"], otherNames: ["Ollama 模型库", "Modelfile"] },
  "llama-cpp": { name: "llama.cpp", displayTag: null, aliases: ["llama.cpp", "llamacpp", "ggml", "GGUF"], otherNames: ["Georgi Gerganov", "llama-server"] },
  zed: { name: "Zed", displayTag: null, aliases: ["Zed", "zed.dev", "Zed Industries"], otherNames: ["Zed 编辑器"] },
  vscode: { name: "VS Code", displayTag: null, aliases: ["VS Code", "Visual Studio Code", "Code - OSS"], otherNames: ["VS Code Marketplace", "Copilot Chat"] },
  jetbrains: { name: "JetBrains", displayTag: null, aliases: ["JetBrains", "jetbrains.com"], otherNames: ["IntelliJ IDEA", "PyCharm", "Kotlin", "Rider"] },
  neovim: { name: "Neovim", displayTag: null, aliases: ["Neovim", "nvim", "neovim.io"], otherNames: ["Vim", "Lua 配置", "LazyVim"] },
  meta: { name: "Meta", displayTag: null, aliases: ["Meta", "Facebook", "meta.com"], otherNames: ["PyTorch", "Llama", "React 起源团队"] },
  google: { name: "Google", displayTag: "Google", aliases: ["Google", "谷歌", "Alphabet", "GOOGL"], otherNames: ["Go 语言团队", "Angular", "Chromium", "Gemini"] },
  microsoft: { name: "Microsoft", displayTag: "Microsoft", aliases: ["Microsoft", "微软", "MSFT"], otherNames: ["Windows", "Azure", "TypeScript 团队"] },
  aws: { name: "AWS", displayTag: null, aliases: ["AWS", "Amazon Web Services", "Amazon", "亚马逊云科技"], otherNames: ["S3", "EC2", "OpenSearch", "Firecracker"] },
  apple: { name: "Apple", displayTag: null, aliases: ["Apple", "苹果", "AAPL"], otherNames: ["Swift", "Xcode", "MLX"] },
  "rust-lang": { name: "Rust", displayTag: "Rust", aliases: ["Rust", "Rust 语言", "rust-lang.org", "rustc"], otherNames: ["Cargo", "crates.io", "Tokio"] },
  "python-lang": { name: "Python", displayTag: "Python", aliases: ["Python", "Python 语言", "python.org"], otherNames: ["CPython", "pip", "GIL"] },
  golang: { name: "Go", displayTag: null, aliases: ["Go", "Golang", "go.dev"], otherNames: ["goroutine", "Go 团队"] },
};

/**
 * 身份词典：摘要和标题里出现的机构，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 开源站的机构名高度重复（同一个项目被多家基金会、多家公司同时托管或赞助），这套守卫误伤远多于收益；
 * 若以后要重新启用，把机构按上面的格式加回来即可。留空数组时守卫自动跳过。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [];

/** 这些域名上的文章，发布方就是对应的机构（托管平台上他人仓库的页面不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "github", domains: ["github.com", "github.blog"] },
  { entityId: "gitlab", domains: ["gitlab.com", "about.gitlab.com"] },
  { entityId: "hugging-face", domains: ["huggingface.co"] },
  { entityId: "hacker-news", domains: ["news.ycombinator.com"] },
  { entityId: "lobsters", domains: ["lobste.rs"] },
  { entityId: "reddit", domains: ["reddit.com"] },
  { entityId: "kernel-org", domains: ["kernel.org"] },
  { entityId: "rust-lang", domains: ["rust-lang.org", "blog.rust-lang.org"] },
  { entityId: "rust-foundation", domains: ["rustfoundation.org"] },
  { entityId: "python-lang", domains: ["python.org"] },
  { entityId: "psf", domains: ["pyfound.blogspot.com"] },
  { entityId: "golang", domains: ["go.dev"] },
  { entityId: "nodejs", domains: ["nodejs.org"] },
  { entityId: "deno", domains: ["deno.com", "deno.land"] },
  { entityId: "bun", domains: ["bun.sh"] },
  { entityId: "docker", domains: ["docker.com"] },
  { entityId: "kubernetes", domains: ["kubernetes.io"] },
  { entityId: "cncf", domains: ["cncf.io"] },
  { entityId: "linux-foundation", domains: ["linuxfoundation.org"] },
  { entityId: "apache", domains: ["apache.org"] },
  { entityId: "gnu", domains: ["gnu.org"] },
  { entityId: "mozilla", domains: ["mozilla.org", "blog.mozilla.org"] },
  { entityId: "postgresql", domains: ["postgresql.org"] },
  { entityId: "sqlite", domains: ["sqlite.org"] },
  { entityId: "redis", domains: ["redis.io"] },
  { entityId: "nginx", domains: ["nginx.org", "nginx.com"] },
  { entityId: "canonical", domains: ["ubuntu.com", "canonical.com"] },
  { entityId: "red-hat", domains: ["redhat.com", "developers.redhat.com"] },
  { entityId: "openssf", domains: ["openssf.org"] },
  { entityId: "cve", domains: ["cve.org", "nvd.nist.gov"] },
  { entityId: "eff", domains: ["eff.org"] },
  { entityId: "torproject", domains: ["torproject.org", "blog.torproject.org"] },
  { entityId: "letsencrypt", domains: ["letsencrypt.org"] },
  { entityId: "hashicorp", domains: ["hashicorp.com"] },
  { entityId: "elastic", domains: ["elastic.co"] },
  { entityId: "mongodb", domains: ["mongodb.com"] },
  { entityId: "supabase", domains: ["supabase.com"] },
  { entityId: "vercel", domains: ["vercel.com"] },
  { entityId: "cloudflare", domains: ["cloudflare.com", "blog.cloudflare.com"] },
  { entityId: "react", domains: ["react.dev"] },
  { entityId: "vue", domains: ["vuejs.org", "blog.vuejs.org"] },
  { entityId: "svelte", domains: ["svelte.dev"] },
  { entityId: "tailwind", domains: ["tailwindcss.com"] },
  { entityId: "vite", domains: ["vitejs.dev", "vite.dev"] },
  { entityId: "astral", domains: ["astral.sh"] },
  { entityId: "ollama", domains: ["ollama.com"] },
  { entityId: "llama-cpp", domains: ["ggml.ai"] },
  { entityId: "zed", domains: ["zed.dev"] },
  { entityId: "vscode", domains: ["code.visualstudio.com"] },
  { entityId: "jetbrains", domains: ["jetbrains.com", "blog.jetbrains.com"] },
  { entityId: "neovim", domains: ["neovim.io"] },
  { entityId: "microsoft", domains: ["microsoft.com", "devblogs.microsoft.com"] },
  { entityId: "google", domains: ["blog.google", "opensource.google"] },
  { entityId: "meta", domains: ["ai.meta.com", "engineering.fb.com"] },
  { entityId: "aws", domains: ["aws.amazon.com"] },
  { entityId: "apple", domains: ["apple.com", "developer.apple.com"] },
];

/** 原文里的这些写法也算提到了对应机构。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "github", pattern: /\bGitHub\s+(?:Actions|Copilot|Trending|Sponsors|Pages|CLI)\b/i },
  { entityId: "gitlab", pattern: /\bGitLab\s+(?:CI|Runner)\b|极狐/ },
  { entityId: "hugging-face", pattern: /\bHugging\s*Face\s+(?:Hub|Transformers|Spaces|Datasets)\b|\bHF\s+Hub\b/i },
  { entityId: "kubernetes", pattern: /\bkubectl\b|\bHelm\s+chart\b|\bK8s\b/ },
  { entityId: "docker", pattern: /\bDocker\s+(?:Hub|Compose|Desktop)\b|\bcontainerd\b/i },
  { entityId: "postgresql", pattern: /\bpsql\b|\bPGDG\b|\bpgvector\b/i },
  { entityId: "redis", pattern: /\bValkey\b|\bRedis\s+Stack\b/i },
  { entityId: "linux-foundation", pattern: /\bLF\s+(?:Europe|Projects)\b|Linux 基金会/ },
  { entityId: "cncf", pattern: /\bKubeCon\b|\bCNCF\s+(?:Graduated|Sandbox)\b/i },
  { entityId: "openssf", pattern: /\bSLSA\b|\bSigstore\b|\bScorecard\b/ },
  { entityId: "cve", pattern: /\bNIST\b|\bCVE-\d{4}-\d{4,}\b/ },
  { entityId: "rust-lang", pattern: /\bcrates\.io\b|\bCargo\.toml\b|\brustc\b/i },
  { entityId: "python-lang", pattern: /\bCPython\b|\bPyPI\b|\bpip\s+install\b/ },
  { entityId: "google", pattern: /\bAlphabet\b|\bChromium\b|\bAngular\b/ },
  { entityId: "microsoft", pattern: /\bAzure\b|\bWindows\s+(?:Server|11)\b|\bTypeScript\b/ },
  { entityId: "meta", pattern: /\bPyTorch\b|\bLlama\s*\d/ },
];
