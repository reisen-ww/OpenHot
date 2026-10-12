
【开源领域翻译规则 — 本平台 100% 是开源项目、代码仓库与开发者社区内容，严格遵守】

1. 歧义默认值：以下词在中文有非技术歧义，**一律按开源与工程含义翻译**：
   - fork = 分叉 / 派生（仓库副本语境，不译“叉子”；作动词可写“派生自”）
   - branch = 分支（版本控制语境，不译“树枝”“分店”）
   - commit = 提交（可作名词，如“一个提交”，不译“承诺”“委托”）
   - issue = 议题 / 问题单（仓库语境，不译“发行”“期号”）
   - pull request / PR = 合并请求（首次出现可双标“合并请求（PR）”，不按字面译“拉取请求”以外的臆造说法）
   - merge = 合并，rebase = 变基，cherry-pick = 拣选（均不译字面义）
   - tag = 标签 / 版本标记（版本控制语境），release = 发布 / 版本（如 v2.0 发布，不译“释放”）
   - build = 构建（不译“建造”）；作名词可写“构建产物”
   - patch = 补丁（不译“贴片”），daemon = 守护进程（不译“恶魔”）
   - shell = 命令行 / 壳层（视语境，不译“贝壳”“外壳”）
   - container = 容器，image = 镜像（不译“图像”“照片”）
   - repository / repo = 仓库（全篇统一，不用“存储库”“资料库”等新说法）
   - star = 标星 / star 数（不译“星星”；作动词写“标星”）
   - upstream = 上游，downstream = 下游（依赖与分支语境，不译“逆流”“顺流”）
   - vendor = 依赖内置 / 供应商（`vendor` 目录与 vendoring 写“依赖内置”，指公司时写“供应商”）
   - deprecated = 已弃用，breaking change = 破坏性变更
   - backport = 回移 / 回合（补丁语境），rollback = 回滚
   - throttle = 限流（不译“节流阀”“油门”），sharding = 分片（不译“碎片化”）
   - main / master = 主分支，checkout = 检出 / 切换（视语境）
   - license = 许可证（不译“执照”“牌照”），maintainer = 维护者，contributor = 贡献者

2. 以下专有名词**一律保留英文原文**，不翻译不加中文括注：
   - 编程语言与运行时：Rust / Go / Zig / Elixir / Python / TypeScript / JavaScript / C++ / C# / Java / Kotlin / Swift / Lua / Haskell / Ruby / PHP / Deno / Bun / Node.js / WebAssembly
     **规则**：语言名一律保留官方写法与大小写，不音译、不意译
   - 工具、框架与服务：Docker / Kubernetes / PostgreSQL / SQLite / Redis / Nginx / Vite / Tailwind / React / Vue / Svelte / Terraform / Ansible / Prometheus / Grafana / Git / GitHub / GitLab / LLVM / GCC / webpack
     **规则**：产品名保留官方大小写（PostgreSQL 不写成“postgres”）
   - 协议、许可证与标准：MIT / Apache-2.0 / GPL / LGPL / AGPL / BSD / MPL / SSPL / BSL / Unlicense / SemVer / SPDX / OWASP / CVE / CVSS / SBOM / SLSA / TLS / SSH / HTTP/3 / OAuth / OpenID
     **规则**：许可证标识与标准名保留英文，不加中文括注
   - 命令与标志：`--force` / `-rf` / `npm ci` / `pnpm dlx` / `cargo build` / `go mod tidy` / `docker compose up` / `kubectl apply` / `git rebase -i` / `chmod +x` / `curl -sSL`
     **规则**：命令、子命令与标志原样保留，不翻译、不补空格、不改大小写
   - 通用缩写：API / SDK / CLI / TUI / GUI / CI/CD / YAML / JSON / TOML / SQL / ORM / CDN / DNS / GPU / CPU / RAM / SSD / RSS
     **规则**：任何 2-5 字母的全大写技术缩写，默认保留英文

3. 中国机构与项目**优先用官方中文名**（首次出现可双标“开放原子开源基金会（OpenAtom Foundation）”，后续选一种保持一致）：
   - 基金会与社区：开放原子开源基金会 / 开源社（KAIYUANSHE）/ Apache 基金会中文社区 / 中国开源软件推进联盟（COPU）/ 中国科学院软件研究所（ISCAS）
   - 企业与项目：华为（OpenHarmony / openEuler / MindSpore）/ 阿里（OpenAnolis / Dubbo / Nacos / OceanBase）/ 腾讯（TencentOS / TDesign）/ 字节跳动（CloudWeGo）/ 百度（PaddlePaddle / Apollo）/ 蚂蚁（Ant Design / SOFAStack）/ 深度科技（deepin）/ 统信（UOS）

4. 代码 / 命令 / URL / 数字单位 **一字不改**保留：
   - 反引号代码 `code` 不翻译
   - 仓库路径（owner/repo）、提交哈希（a1b2c3d）、issue 与 PR 编号（#1234）、CVE 编号（CVE-2024-1234）、版本号（v1.2.3、2.0.0-rc.1）与许可证标识不译不改写
   - URL 原样
   - 数字+单位：12.3k star / 3.2 万 star / 每天 +480 star / 120 MB / 2.4 GB / 128 核 / 45 秒构建 / 快 30% / 支持 3 个平台 / 1.2 万次下载
   - star 数、涨幅、版本跨度、基准测试数值、包体积与构建时间必须保留原文的阿拉伯数字与单位；不要把 “12.3k stars” 改写成“一万多人标星”，也不要把 “2.4 GB” 改写成“约两吉字节”
