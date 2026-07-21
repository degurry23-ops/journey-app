# Journey — AI Travel Journal PRD V2.0

> 更新日期：2026-07-20 | 基于 V1.0 实施后同步

---

## 一、产品定位

Journey 是面向自由行用户的 **AI 旅行规划 + 手帐记录** 产品。覆盖旅行前（AI规划）→ 旅行中（Timeline/地图/记账/Today）→ 旅行后（日志/分享）全生命周期。

**差异化：** 不是攻略 App、不是地图、不是记账软件，而是以时间轴组织的 AI 旅行伙伴。

---

## 二、当前架构

```
前端：纯 HTML/CSS/JS（9 个页面 + 共享组件）
后端：Node.js Express + JSON 文件数据库
AI  ：支持 OpenAI / Claude / Mock 三模式
部署：Dockerfile 就绪，可一键部署 Railway/Render
```

| 层 | 技术 | 说明 |
|----|------|------|
| 前端 | HTML/CSS/JS | 9 页 SPA，localStorage + API 双写 |
| 后端 | Express | REST API，JSON 原子写入 |
| AI | OpenAI/Claude | 行程生成 + 日志总结 |
| 数据 | JSON file | 单文件，零依赖，易迁移 |

---

## 三、页面清单 & 完成度

| 页面 | 状态 | 核心功能 |
|------|------|----------|
| **index.html** 首页 | ✅ V4 | AI 状态卡、下一旅程 Hero、进行中旅程卡、旅行足迹、记忆卡片、AI 浮动按钮 |
| **journeys.html** 旅行列表 | ✅ | 全部/计划/进行/完成 Tab 筛选、空状态 CTA |
| **create.html** AI 创建 | ✅ V2 | 对话式创建、目的地推荐卡片、Chip 选择（天数/人数/预算/风格） |
| **trip-detail.html** 行程详情 | ✅ | 动态准备度、成员邀请、行李清单、天气摘要 |
| **today.html** 今日旅程 | ✅ NEW | 问候语、天气、路线时间轴、预算进度、AI 提醒、快捷拍照 |
| **day-timeline.html** 日程 | ✅ | Weather bar、地点时间轴、添加地点 Sheet、路线优化 |
| **map.html** 地图 | ✅ | Leaflet、Day 筛选、颜色标记、Polyline 连线 |
| **expenses.html** 记账 | ✅ V2 | 总消费、分类统计、AA 分摊、预算预警进度条 |
| **journal.html** 日志 | ✅ V2 | 封面、每日回顾、AI 总结、ECharts 饼图、照片墙、分享卡片 |
| **settings.html** 设置 | ✅ | 数据导出/导入/清空、示例数据加载 |

---

## 四、API 端点

```
GET    /api/trips                 行程列表
GET    /api/trips/:id             行程详情（含天数/地点/记账/照片）
POST   /api/trips                 创建行程（含天数+地点嵌套）
PUT    /api/trips/:id             更新行程
DELETE /api/trips/:id             删除行程（级联）
GET    /api/trips/:id/expenses    记账列表
POST   /api/trips/:id/expenses    添加记账
POST   /api/trips/:id/photos      上传照片
POST   /api/ai/plan-trip          AI 行程生成
POST   /api/ai/journal            AI 日志生成
GET    /api/health                健康检查
```

---

## 五、AI 能力

| 功能 | 状态 | 说明 |
|------|------|------|
| AI 行程规划 | ✅ | 目的地+日期+天数+人数+预算+风格 → 完整行程 |
| AI 日志总结 | ✅ | 根据行程数据生成旅行总结 |
| AI 路线优化 | ✅ | 按时间排序优化当日路线 |
| AI 今日提醒 | ✅ | Today 页面每日提示 |
| 行李清单生成 | ✅ | 根据目的地/天气/天数智能生成 |

**AI Provider：** 默认 Mock（本地数据），配置 API Key 后可切换 OpenAI/Claude

---

## 六、数据模型

```
Trip {
  id, name, destination, startDate, endDate,
  members, status(planning|traveling|completed),
  readiness, emoji, budget, preferences,
  summary, tags, days[], expenses[], photos[]
}

Day {
  id, tripId, date, weather, tip, places[]
}

Place {
  id, dayId, name, category, time, duration, fee, lat, lng
}

Expense {
  id, tripId, category, amount, note, payer, date, dayId
}

Photo {
  id, tripId, dataUrl, created
}
```

---

## 七、示例数据

| 旅行 | 日期 | 天数 | 状态 |
|------|------|------|------|
| 东京之旅 | 2026-08-02 ~ 08-08 | 7天 | 计划中 |
| 成都之旅 | 2026-07-18 ~ 07-22 | 5天 | 进行中 |
| 上海之旅 | 2026-05-10 ~ 05-13 | 4天 | 已完成 |
| 大理之旅 | 2026-03-05 ~ 03-07 | 3天 | 已完成 |

---

## 八、Roadmap

### V2.0 ✅ 当前
- 全功能原型（9 页 + API + AI）
- 首页 V4（AI 优先设计）
- Today 页面
- 创建流程卡片化
- 预算预警、分享卡片

### V2.1 🔜 短期
- 真实天气 API 接入
- 用户登录系统
- 图片云存储
- PWA 离线支持

### V2.2 📋 中期
- 多人实时协作
- 小红书风格分享海报
- AI 每日自动总结
- 多语言支持

### V3.0 🎯 远期
- 社区/模板市场
- AI 旅行视频生成
- OTA 接入
- 会员订阅

---

## 九、成功指标

| 指标 | MVP 目标 |
|------|----------|
| 创建旅行完成率 | > 60% |
| AI 规划使用率 | > 50% |
| 日志生成率 | > 30% |
| 次日留存 | > 25% |

---

## 十、运行方式

```bash
cd server
npm install
npm run seed      # 初始化示例数据
npm start         # http://localhost:3001
```

**部署：** `docker build -t journey . && docker run -p 3001:3001 journey`
