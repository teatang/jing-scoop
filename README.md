# Jing Scoop

一个基于 Electron + Vue 3 + TypeScript 的 Scoop 包管理器图形界面客户端。

## 功能特性

- **应用管理** - 查看已安装的 Scoop 应用列表，支持搜索、筛选
- **应用安装** - 在线搜索并安装 Scoop 应用
- **应用卸载** - 快速卸载不需要的应用
- **应用更新** - 检查并更新已安装的应用，支持批量更新
- **日夜模式** - 明暗主题一键切换
- **跨平台支持** - 目前支持 Windows 平台

## 系统要求

- Windows 10/11
- [Scoop](https://scoop.sh/) 已安装并配置
- Node.js 18+

## 安装依赖

```bash
pnpm install
```

## 开发运行

```bash
pnpm dev
```

## 构建安装包

```bash
# 构建 Windows 安装包
pnpm build:win
```

## 项目结构

```
jing-scoop/
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── index.ts       # 应用入口
│   │   └── scoopService.ts # Scoop 命令服务
│   ├── preload/           # 预加载脚本
│   │   ├── index.ts       # API 暴露
│   │   └── index.d.ts     # 类型声明
│   └── renderer/          # Vue 渲染进程
│       └── src/
│           ├── main.ts           # Vue 应用入口
│           ├── App.vue           # 主布局组件
│           ├── stores/           # Pinia 状态管理
│           │   └── scoop.ts      # Scoop 状态管理
│           ├── components/       # Vue 组件
│           │   ├── AppList.vue       # 已安装应用列表
│           │   ├── AppSearch.vue     # 搜索安装页面
│           │   ├── AppUpdates.vue    # 可更新应用页面
│           │   └── ThemeToggle.vue   # 主题切换
│           └── types.ts        # TypeScript 类型定义
├── electron.vite.config.ts # Vite 配置
├── electron-builder.yml    # 打包配置
└── package.json
```

## 技术栈

- **Electron** - 桌面应用框架
- **Vue 3** - 前端框架
- **TypeScript** - 类型安全
- **Element Plus** - UI 组件库
- **Pinia** - 状态管理
- **Electron Vite** - 构建工具
- **Electron Builder** - 打包工具

## 推荐 IDE 配置

- [VSCode](https://code.visualstudio.com/)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 许可证

MIT
