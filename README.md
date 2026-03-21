# 知乎 Lite - 完整的问答社交平台

<div align="center">

![Vue3](https://img.shields.io/badge/vue-3.5-green)
![TypeScript](https://img.shields.io/badge/typescript-5.9-blue)
![NestJS](https://img.shields.io/badge/nestjs-11.0-red)
![License](https://img.shields.io/badge/license-UNLICENSED-inactive)

一个基于 **Vue 3 + NestJS** 的全栈问答社交平台，功能完整、架构清晰、细节丰富。

[快速开始](#-快速开始) • [功能介绍](#-核心功能) • [技术栈](#-技术栈) • [项目结构](#-项目结构)

</div>

---

## 📄 项目介绍

这是一个**低仿知乎**的全栈 Web 应用，集合了现代前端框架和后端框架的最佳实践。项目采用前后端完全分离的架构，具备完整的问答系统、用户体系、实时聊天功能，是一个非常好的 Vue 3 + TypeScript + NestJS 学习项目。

### ✨ 项目特色

- 🎨 **页面设计** - 清新大气的 UI 设计，现代化的用户界面
- 📦 **代码组织** - 清晰的文件夹结构，易于维护和扩展
- 🔌 **完整功能** - 从注册、提问、回答到聊天的全业务流程
- 💬 **实时通信** - 基于 WebSocket 的即时私信功能，体验流畅
- 🛡️ **类型安全** - 全栈 TypeScript，从前端到后端完整的类型检查

---

## 🎯 核心功能

### 问答系统
- ❓ **提问管理** - 支持发布、编辑、删除问题
- 💡 **回答功能** - 完整的内容输入和管理
- ⭐ **点赞系统** - 对问题、回答和评论点赞
- 💬 **评论交互** - 追问、评论、讨论功能
- 🏷️ **话题分类** - 问题关联话题标签便于分类浏览

### 用户体系
- 👤 **用户认证** - 注册、登录、JWT 令牌认证
- 👥 **用户关注** - 用户之间的关注功能，构建社交网络
- 📝 **个人资料** - 用户信息展示和编辑
- 🔐 **密码加密** - Bcrypt 加密存储，确保安全性
- 📊 **用户排名** - 基于贡献度的用户排名展示

### 社交互动
- 💌 **实时私信** - 基于 Socket.IO 的即时通讯
- 🔔 **关注推荐** - 关注用户的最新内容推荐
- 👁️ **浏览历史** - 记录用户浏览过的问题

### 内容组织
- 📚 **首页推荐** - 个性化推荐内容展示
- 🔍 **搜索功能** - 快速查找问题和用户

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 说明 |
|------|------|------|
| **Vue** | 3.5 | 渐进式前端框架 |
| **TypeScript** | 5.9 | 类型安全的 JavaScript 超集 |
| **Vite** | 7.2 | 下一代前端构建工具 |
| **Vue Router** | 4.6 | 官方路由管理库 |
| **Pinia** | 3.0 | 新一代状态管理库 |
| **Element Plus** | 2.12 | 企业级 UI 组件库 |
| **Tailwind CSS** | 3.4 | 原子化 CSS 框架 |
| **Axios** | 1.13 | 现代 HTTP 客户端 |
| **Socket.IO Client** | 4.8 | WebSocket 客户端库 |

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| **NestJS** | 11.0 | 渐进式 Node.js 框架 |
| **TypeScript** | 5.9 | 类型安全的 JavaScript 超集 |
| **MySQL** | - | 关系型数据库 |
| **TypeORM** | 0.3 | 对象关系映射库 |
| **JWT** | 11.0 | 无状态身份验证 |
| **Bcrypt** | 6.0 | 密码加密库 |
| **Socket.IO** | 4.8 | 实时通信库 |
| **Class Validator** | 0.14 | DTO 数据验证 |

---

## 📂 项目结构

```
zhihu/
├── client/                          # 前端项目
│   ├── src/
│   │   ├── components/              # 可复用组件
│   │   │   ├── Bubble.vue
│   │   │   ├── FollowButton.vue
│   │   │   ├── SearchInput.vue
│   │   │   └── TopNav/              # 顶部导航组件
│   │   ├── modules/                 # 业务模块（路由级别）
│   │   │   ├── auth/                # 认证模块（登录/注册）
│   │   │   ├── Chat/                # 聊天模块（私信）
│   │   │   ├── Detail/              # 详情模块（问题详情）
│   │   │   ├── post/                # 发布模块（发起问题）
│   │   │   ├── user/                # 用户模块（个人中心）
│   │   │   └── common/              # 公共模块（共享组件）
│   │   ├── layouts/                 # 布局组件
│   │   │   ├── BlankLayout.vue      # 空白布局
│   │   │   └── DefaultLayout.vue    # 默认布局
│   │   ├── router/                  # 路由配置
│   │   │   ├── routes.ts            # 路由定义
│   │   │   ├── guards.ts            # 路由守卫
│   │   │   └── modules/             # 模块路由
│   │   ├── stores/                  # 状态管理（Pinia）
│   │   │   ├── user.ts              # 用户状态
│   │   │   ├── app.ts               # 应用状态
│   │   │   ├── chat.ts              # 聊天状态
│   │   │   ├── answer.ts            # 回答状态
│   │   │   ├── question.ts          # 问题状态
│   │   │   └── topic.ts             # 话题状态
│   │   ├── utils/                   # 工具函数
│   │   │   └── request/             # 请求相关工具
│   │   ├── types/                   # TypeScript 类型定义
│   │   ├── assets/                  # 静态资源
│   │   │   ├── styles/              # 全局样式
│   │   │   └── bg/                  # 背景图片
│   │   ├── App.vue                  # 根组件
│   │   └── main.ts                  # 入口文件
│   ├── vite.config.ts               # Vite 配置
│   ├── tsconfig.json                # TypeScript 配置
│   ├── tailwind.config.js           # Tailwind CSS 配置
│   └── package.json                 # 依赖配置
│
└── server/                          # 后端项目
    ├── src/
    │   ├── auth/                    # 认证模块
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.guard.ts        # JWT 守卫
    │   │   └── auth.module.ts
    │   ├── users/                   # 用户模块
    │   │   ├── users.controller.ts
    │   │   ├── users.service.ts
    │   │   ├── users.module.ts
    │   │   ├── entity/              # 用户实体
    │   │   └── dto/                 # 数据传输对象
    │   ├── question/                # 问题模块
    │   │   ├── question.controller.ts
    │   │   ├── question.service.ts
    │   │   ├── question.module.ts
    │   │   ├── entity/              # 问题实体
    │   │   └── dto/
    │   ├── answer/                  # 回答模块
    │   │   └── ...
    │   ├── comment/                 # 评论模块
    │   │   └── ...
    │   ├── topic/                   # 话题模块
    │   │   └── ...
    │   ├── like/                    # 点赞模块
    │   │   └── ...
    │   ├── follow/                  # 关注模块
    │   │   └── ...
    │   ├── chat/                    # 聊天模块（WebSocket）
    │   │   ├── chat.gateway.ts      # WebSocket 网关
    │   │   ├── chat.service.ts
    │   │   ├── chat.controller.ts
    │   │   └── chat.module.ts
    │   ├── filters/                 # 全局异常过滤器
    │   │   ├── all-exceptions.filter.ts
    │   │   ├── conflict-exception.filter.ts
    │   │   └── database-exception.filter.ts
    │   ├── app.module.ts            # 根模块（导入所有功能模块）
    │   ├── app.controller.ts
    │   ├── app.service.ts
    │   └── main.ts                  # 入口文件
    ├── tsconfig.json                # TypeScript 配置
    ├── nest-cli.json                # NestJS 配置
    └── package.json                 # 依赖配置
```

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0 或 **yarn** >= 1.22
- **MySQL** >= 5.7

### 克隆项目

```bash
git clone <repository-url>
cd zhihu
```

### 安装依赖

#### 前端
```bash
cd client
npm install
```

#### 后端
```bash
cd ../server
npm install
```

### 配置环境变量

#### 后端配置
在 `server/` 目录下创建 `.env` 文件：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=zhihu

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 服务端口
PORT=3000
```

#### 前端配置
在 `client/` 目录下创建 `.env.local` 文件：

```env
# API 服务器地址
VITE_API_URL=http://localhost:3000
# WebSocket 地址
VITE_WS_URL=http://localhost:3000
```

### 启动服务

#### 启动后端服务（开发模式）

```bash
cd server
npm run start:dev
```

后端服务将运行在 `http://localhost:3000`

#### 启动前端开发服务器

```bash
cd client
npm run dev
```

前端应用将运行在 `http://localhost:5173`

---

## 📖 开发命令

### 前端命令

```bash
cd client

# 开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产版本
npm run preview
```

### 后端命令

```bash
cd server

# 开发模式运行
npm run start:dev

# 监视模式运行
npm run start:watch

# 调试模式运行
npm run start:debug

# 生产构建
npm run build

# 生产运行
npm run start:prod

# 代码格式化
npm run format

# Lint 检查
npm run lint

# 运行单元测试
npm run test

# 测试覆盖率
npm run test:cov

# E2E 测试
npm run test:e2e
```

---

## 🎓 技术亮点

### 1. **前后端完全分离**
- 清晰的职责划分，便于维护和扩展
- RESTful API 设计规范
- Axios 统一请求封装

### 2. **全栈 TypeScript**
- 从前端到后端的完整类型系统
- 优秀的开发体验和编辑器支持
- 减少运行时错误

### 3. **实时聊天功能**
- 基于 Socket.IO 的 WebSocket 通信
- 支持实时私信和消息推送
- 双向通信的低延迟体验

### 4. **NestJS 模块化架构**
- 每个功能都独立成模块
- 清晰的依赖注入
- 易于单元测试

### 5. **Vue 3 组件化**
- 使用 Composition API 的现代写法
- 可复用的通用组件
- 清晰的组件职责

### 6. **自动化数据库同步**
- TypeORM 的 synchronize 功能自动建表
- 减少手工 SQL 脚本维护

### 7. **统一异常处理**
- 全局异常过滤器
- 请求/响应拦截器
- 标准化的错误响应格式

### 8. **状态管理持久化**
- Pinia 官方状态管理
- 配合 pinia-plugin-persistedstate 实现数据持久化
- 无需手工保存到 LocalStorage

### 9. **现代化 UI 框架**
- Element Plus 企业级组件
- Tailwind CSS 原子化样式
- 响应式设计支持

### 10. **安全性考虑**
- Bcrypt 密码加密
- JWT 令牌认证
- API 路由守卫验证

---

## 📚 学习价值

这个项目非常适合学习：

- ✅ Vue 3 + TypeScript 前端开发
- ✅ NestJS 后端框架最佳实践
- ✅ 前后端分离式开发
- ✅ 实时通信（WebSocket）
- ✅ 数据库设计与 ORM 使用
- ✅ 认证与授权机制
- ✅ 完整的 Web 应用开发流程

---

## 🔌 相关技术文档

- [Vue 3 官方文档](https://vuejs.org/)
- [NestJS 官方文档](https://docs.nestjs.com/)
- [Element Plus 文档](https://element-plus.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [TypeORM 文档](https://typeorm.io/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Socket.IO 文档](https://socket.io/docs/)
- [TypeScript 文档](https://www.typescriptlang.org/)

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交代码 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

This project is [UNLICENSED](LICENSE).

---

## 👨‍💻 作者

该项目由开发者精心打磨，如有改进建议，欢迎提出！

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**
