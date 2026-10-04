# Next.js Personal PaaS template

在 GitHub 点击 **Use this template → Create a new repository**，owner 选择 `Deploy-ryanl-in`，可选公有或私有。

```sh
git clone https://github.com/Deploy-ryanl-in/你的仓库.git
cd 你的仓库
npm ci
npm run dev
```

需要 Node.js 24.21.0（`.nvmrc`）。开发完成后 commit、push 到 `paas.json` 声明的部署分支（默认 main）。首次本地 push 触发检查、镜像构建和自动 HTTPS 部署。后续 `git pull` 同步自己的仓库；模板更新不会自动写入已经生成的独立仓库。

默认示例无需密钥，包含服务端渲染、客户端交互、Route Handler API、`/healthz`、流式响应及 ISR。测试：

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:smoke
```

生产使用 `output: standalone` 的 Node.js 服务。Dockerfile 复制 standalone、public 和静态资源，非 root 用户运行，根文件系统只读。Cache Components 默认关闭；ISR/数据缓存由容量受限适配器写入 `/tmp`，图片缓存也是受限临时目录。重部署可丢弃缓存。自定义缓存策略时保留这两个容量边界。

服务端密钥只通过仓库 `PAAS_SECRETS` JSON 与 `paas.json` 的 `secretRefs` 在运行时传递。例如启用缓存失效接口，可配置 `REVALIDATE_TOKEN` 引用，发送带 Bearer token 的 POST 到 `/api/revalidate`。默认无密钥时该接口拒绝访问。

浏览器公开参数通过 `build.publicArgs` 显式声明，名称以 `NEXT_PUBLIC_` 开头；它们会进入浏览器构建，请勿放入密钥。Cloudflare 保留服务器缓存控制，不使用全站 Cache Everything。

`examples` 提供 PostgreSQL、Redis、Worker 和多服务声明。示例页面不会自动连接数据库。数据库与 Worker 无公网端口；每个仓库独立网络。总内存预算768 MiB 包含候选版本；Next.js 256 MiB + PostgreSQL 256 MiB + Redis 64 MiB 的栈无法再同时容纳完整 Web 候选，必须降低经过测试的资源需求或由管理员调整容量，普通更新会安全拒绝。

**Actions → PaaS operations** 提供状态、日志、回滚、停用、加密备份下载及恢复。停用保留数据卷；恢复须确认 `RESTORE <repository ID>`。数据库只允许管理员批准的同大版本更新，代码回滚不回滚数据。

组织内新仓库自动接入；个人仓库需 repository ID 白名单。平台管理员须先完成一次性服务器与凭据配置。模板不携带任何账号密钥。
