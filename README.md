# AI Archive — AI Model Metadata Archive

Interactive Archive 作业的 React 灰盒原型，记录 AI 模型版本的发布日期、模型类型、擅长任务、所属公司、公司所在地、上市状态、输入/输出 Token 参考价和公司或母公司股价快照。此版本不再收集或生成 AI 回答，不需要 API Key、后端、数据库或登录系统。

## 安装和运行

需要 Node.js 20.19+ 或 22.12+；GitHub Actions 使用 Node.js 24。

```bash
npm install
npm run dev
```

打开终端给出的 Local 地址。验证及构建：

```bash
npm test
npm run build
npm run preview
```

Vite 将 React JSX 编译、打包为浏览器可用的 JavaScript/CSS，输出到 `dist/`。`preview` 用于本地检查构建结果。

## 内容与交互

- 20 个模型记录，ChatGPT（OpenAI GPT 系列）、Claude、Gemini、Grok、DeepSeek 各 4 个版本。
- React `useState` 管理视图、AI family、model type、specialty、price basis、sort mode 和比较选择。
- 按家族、模型类型、擅长任务和价格基准联合筛选；可一键重置。
- 按模型名称、发布日期、输入价格、输出价格排序。
- 最多选 3 个模型在表格中并列比较。筛选隐藏已选模型时，比较选择仍保留，可用 Remove 或 Clear comparison 移除。
- Companies & stocks 视图展示 5 家公司的资料；模型卡片的 Company & stock details 也可展开。
- 白/浅灰背景、黑字、灰边框、矩形控件和响应式 grid。没有动画、装饰图片或复杂 UI library。

## 数据口径和来源

数据集中放在 `src/data/archiveData.js`，每项有发布日期来源、价格来源、价格时间基准；公司资料也有来源链接。资料核对日期为 **2026-10-28**。

- 这是精选模型版本档案，包含历史版本，并非最新模型排行榜。ChatGPT 是产品名，档案里对应的是 OpenAI GPT 模型版本。
- Released 表示卡片标注的公开公告、API launch 或 stable/GA 时间；不是训练开始/完成日期。不同发布阶段已在卡片里单独注明。
- Token 价格单位统一为 **美元 / 100 万 text tokens**，分输入、输出。输入使用未缓存价格；不含批处理折扣、免费额度、工具/搜索费用、音频/图像生成价格或税。
- **Historical** 是发布公告中的历史公开报价，保留自己的参考日期，不能当作今天的可购买报价；DeepSeek-V3、V3.1 等记录有独立的价格生效日期。
- **Checked snapshot** 是核对当天从官方价格页记录的数值，也不会自动更新。Gemini 2.5 Pro 和 Grok 4.6 的长上下文价与卡片主价格不同，已在备注标明。
- 擅长任务是对厂商资料的编辑归类，不是独立测试或排名。模型类型是便于筛选的概括标签。
- 模型发布/价格主要来自 OpenAI、Anthropic、Google、xAI、DeepSeek 官方公告及文档，部分官方价格表是图片，数值经读取核对。
- 公司上市与运营主体根据公司公告及 SEC 资料整理。DeepSeek 的所在地及私有状态另参考百科条目，卡片有链接。
- OpenAI、Anthropic 和 DeepSeek 没有在此档案中记录可交易股价。提交 IPO 文件不等于已上市；Anthropic 的 ANT 是拟议代码，未当成可交易股票。
- Gemini 显示的是母公司 Alphabet Class A（GOOGL）；Grok 显示的是母公司 SpaceX（SPCX），并非单独的 Gemini 或 Grok 股票。
- 股价为 Google Finance 页面中 **2026-10-28 美东时间 16:00 的常规交易时段收盘快照**，不混用盘后价。卡片有金额、时间、公司主体和行情来源链接；网站没有实时行情订阅。

## 对照老师截图的 React / Vite / GitHub Pages 流程

1. `package.json` 包含 `react`、`react-dom`、`vite` 和 `@vitejs/plugin-react`。
2. 根目录 `index.html` 通过 module script 加载 `src/main.jsx`。
3. `main.jsx` 用 `createRoot` 将 React App 挂载到 HTML 的 `root` 容器。容器名字可自定，HTML 和 JS 保持一致即可。
4. `vite.config.js` 加载 React 插件，构建生成 `dist/`。`base: './'` 让本项目的资源在 GitHub Pages 仓库子路径下也能加载；本项目没有需要服务器回退的路由。
5. `.gitignore` 忽略 `node_modules/`、`dist/` 和环境密钥文件。
6. `.github/workflows/deploy.yaml` 是 **Publish Site to GitHub Pages** 工作流：安装依赖 → 测试 → 构建 → 上传 `dist` → 发布 Pages。

## 发布到 GitHub Pages

1. 创建自己的 GitHub 作业仓库，将源码提交到 `main` 分支。不要上传 `node_modules/`；不要把整个 `dist/` 当源码维护。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送到 `main` 后工作流会自动运行；也可以在 **Actions → Publish Site to GitHub Pages → Run workflow** 手动运行。
4. 成功后打开工作流显示的 Pages URL，确认网页和资源均正常。提交给老师的是该 URL 和源码仓库链接。

工作流里的 Actions 版本与固定 commit 来自 [Vite 官方部署指南](https://vite.dev/guide/static-deploy.html)。提交前需确认这些版本仍符合所在学校/账号的 GitHub Actions 策略。

## 文件结构

```text
.github/workflows/deploy.yaml
src/
  components/
    FilterBar.jsx
    ArchiveCard.jsx
    CompanyCard.jsx
    ComparisonTable.jsx
  data/archiveData.js
  utils/archive.js
  App.jsx
  App.css
  main.jsx
test/archive.test.js
index.html
vite.config.js
package.json
README.md
```

这是灰盒 prototype，重点是 archive 的数据结构、交互和构建发布流程。
