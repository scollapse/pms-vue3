# 习惯系统API文档

本文档描述了习惯追踪系统的API接口，包括习惯管理、打卡记录、成就系统和奖励兑换等功能。

## 基础URL

所有API请求均以 `/api` 作为基础URL前缀。

## 习惯管理API

### 获取习惯列表

```
GET /habits
```

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "阅读",
      "category": "学习",
      "icon": "book-open",
      "frequency": ["周一", "周二", "周三", "周四", "周五"],
      "points": 5,
      "createdAt": "2023-05-01"
    },
    {
      "id": 2,
      "name": "运动",
      "category": "健康",
      "icon": "fire",
      "frequency": ["周一", "周三", "周五"],
      "points": 10,
      "createdAt": "2023-05-01"
    }
  ]
}
```

### 获取习惯详情

```
GET /habits/{id}
```

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述    |
| ------ | ------ | -------- | ------- |
| id     | number | 是       | 习惯ID  |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "阅读",
    "category": "学习",
    "icon": "book-open",
    "frequency": ["周一", "周二", "周三", "周四", "周五"],
    "points": 5,
    "createdAt": "2023-05-01"
  }
}
```

### 创建习惯

```
POST /habits
```

**请求参数**：

| 参数名     | 类型     | 是否必须 | 描述           |
| ---------- | -------- | -------- | -------------- |
| name       | string   | 是       | 习惯名称       |
| category   | string   | 是       | 习惯类别       |
| icon       | string   | 是       | 图标名称       |
| frequency  | string[] | 是       | 频率（周一至周日或每天）|
| points     | number   | 是       | 完成可获得的积分 |

**请求示例**：

```json
{
  "name": "冥想",
  "category": "健康",
  "icon": "sun",
  "frequency": ["每天"],
  "points": 3
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 3,
    "name": "冥想",
    "category": "健康",
    "icon": "sun",
    "frequency": ["每天"],
    "points": 3,
    "createdAt": "2023-05-10"
  }
}
```

### 更新习惯

```
PUT /habits/{id}
```

**请求参数**：

| 参数名     | 类型     | 是否必须 | 描述                |
| ---------- | -------- | -------- | ------------------- |
| id         | number   | 是       | 习惯ID（路径参数）  |
| name       | string   | 否       | 习惯名称            |
| category   | string   | 否       | 习惯类别            |
| icon       | string   | 否       | 图标名称            |
| frequency  | string[] | 否       | 频率                |
| points     | number   | 否       | 完成可获得的积分    |

**请求示例**：

```json
{
  "name": "冥想修行",
  "points": 5
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 3,
    "name": "冥想修行",
    "category": "健康",
    "icon": "sun",
    "frequency": ["每天"],
    "points": 5,
    "createdAt": "2023-05-10"
  }
}
```

### 删除习惯

```
DELETE /habits/{id}
```

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述              |
| ------ | ------ | -------- | ----------------- |
| id     | number | 是       | 习惯ID（路径参数）|

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": {
    "id": 3,
    "name": "冥想修行",
    "category": "健康",
    "icon": "sun",
    "frequency": ["每天"],
    "points": 5,
    "createdAt": "2023-05-10"
  }
}
```

### 切换习惯状态

```
POST /habits/toggle
```

**请求参数**：

| 参数名  | 类型   | 是否必须 | 描述                 |
| ------- | ------ | -------- | -------------------- |
| habitId | number | 是       | 习惯ID               |
| date    | string | 是       | 日期（YYYY-MM-DD格式）|

**请求示例**：

```json
{
  "habitId": 1,
  "date": "2023-05-10"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "checkin": {
      "id": 10,
      "habitId": 1,
      "date": "2023-05-10",
      "status": "completed"
    },
    "pointsChange": 5
  }
}
```

### 获取打卡记录

```
GET /habits/checkins
```

**请求参数**：

| 参数名    | 类型   | 是否必须 | 描述                  |
| --------- | ------ | -------- | --------------------- |
| startDate | string | 否       | 开始日期（YYYY-MM-DD）|
| endDate   | string | 否       | 结束日期（YYYY-MM-DD）|

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "habitId": 1,
      "date": "2023-05-01",
      "status": "completed"
    },
    {
      "id": 2,
      "habitId": 2,
      "date": "2023-05-01",
      "status": "completed"
    }
  ]
}
```

### 获取热力图数据

```
GET /habits/heatmap
```

**请求参数**：

| 参数名    | 类型   | 是否必须 | 描述                  |
| --------- | ------ | -------- | --------------------- |
| startDate | string | 否       | 开始日期（YYYY-MM-DD）|
| endDate   | string | 否       | 结束日期（YYYY-MM-DD）|

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "date": "2023-04-01",
      "count": 50
    },
    {
      "date": "2023-04-02",
      "count": 75
    },
    {
      "date": "2023-04-03",
      "count": 100
    }
  ]
}
```

### 获取连续打卡天数

```
GET /habits/streak
```

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "streak": 12
  }
}
```

## 成就系统API

### 获取成就列表

```
GET /achievements
```

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "坚持不懈",
      "description": "连续完成任意习惯10天",
      "icon": "trophy",
      "unlocked": true,
      "progress": 10,
      "total": 10,
      "reward": 50,
      "rewardClaimed": false
    },
    {
      "id": 2,
      "name": "早起鸟",
      "description": "连续一周早起",
      "icon": "sun",
      "unlocked": false,
      "progress": 5,
      "total": 7,
      "reward": 30,
      "rewardClaimed": false
    }
  ]
}
```

### 获取成就详情

```
GET /achievements/{id}
```

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述     |
| ------ | ------ | -------- | -------- |
| id     | number | 是       | 成就ID   |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "坚持不懈",
    "description": "连续完成任意习惯10天",
    "icon": "trophy",
    "unlocked": true,
    "progress": 10,
    "total": 10,
    "reward": 50,
    "rewardClaimed": false
  }
}
```

### 领取成就奖励

```
POST /achievements/{id}/claim
```

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述                |
| ------ | ------ | -------- | ------------------- |
| id     | number | 是       | 成就ID（路径参数）  |

**响应示例**：

```json
{
  "code": 200,
  "message": "领取成功",
  "data": {
    "achievement": {
      "id": 1,
      "name": "坚持不懈",
      "description": "连续完成任意习惯10天",
      "icon": "trophy",
      "unlocked": true,
      "progress": 10,
      "total": 10,
      "reward": 50,
      "rewardClaimed": true
    },
    "pointsAdded": 50
  }
}
```

### 获取已解锁的成就

```
GET /achievements/unlocked
```

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "坚持不懈",
      "description": "连续完成任意习惯10天",
      "icon": "trophy",
      "unlocked": true,
      "progress": 10,
      "total": 10,
      "reward": 50,
      "rewardClaimed": false
    }
  ]
}
```

### 获取未解锁的成就

```
GET /achievements/locked
```

**请求参数**：无

**响应示例**：与获取已解锁成就类似

### 获取已领取奖励的成就

```
GET /achievements/claimed
```

**请求参数**：无

**响应示例**：与获取已解锁成就类似

### 获取未领取奖励的成就

```
GET /achievements/unclaimed
```

**请求参数**：无

**响应示例**：与获取已解锁成就类似

## 奖励系统API

### 获取奖励列表

```
GET /rewards
```

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "看一部电影",
      "description": "给自己放松的时间",
      "icon": "film",
      "cost": 50,
      "redeemed": false,
      "validPeriod": "30天",
      "createdAt": null,
      "redeemedAt": null
    },
    {
      "id": 2,
      "name": "购买一本书",
      "description": "投资自己的知识",
      "icon": "book",
      "cost": 100,
      "redeemed": false,
      "validPeriod": "60天",
      "createdAt": null,
      "redeemedAt": null
    }
  ]
}
```

### 获取奖励详情

```
GET /rewards/{id}
```

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述     |
| ------ | ------ | -------- | -------- |
| id     | number | 是       | 奖励ID   |

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": 1,
    "name": "看一部电影",
    "description": "给自己放松的时间",
    "icon": "film",
    "cost": 50,
    "redeemed": false,
    "validPeriod": "30天",
    "createdAt": null,
    "redeemedAt": null
  }
}
```

### 兑换奖励

```
POST /rewards/{id}/redeem
```

**请求参数**：

| 参数名 | 类型   | 是否必须 | 描述                |
| ------ | ------ | -------- | ------------------- |
| id     | number | 是       | 奖励ID（路径参数）  |

**响应示例**：

```json
{
  "code": 200,
  "message": "兑换成功",
  "data": {
    "reward": {
      "id": 1,
      "name": "看一部电影",
      "description": "给自己放松的时间",
      "icon": "film",
      "cost": 50,
      "redeemed": true,
      "validPeriod": "30天",
      "createdAt": null,
      "redeemedAt": "2023-05-10"
    },
    "pointsDeducted": 50
  }
}
```

### 获取可用奖励

```
GET /rewards/available
```

**请求参数**：无

**响应示例**：与获取奖励列表类似，但只包含用户积分足够兑换且未兑换过的奖励

### 获取已兑换奖励

```
GET /rewards/redeemed
```

**请求参数**：无

**响应示例**：与获取奖励列表类似，但只包含已兑换的奖励

### 获取用户积分

```
GET /user/points
```

**请求参数**：无

**响应示例**：

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "points": 120
  }
}
```

## 数据库设计

### 习惯表 (habits)

| 字段名      | 类型         | 描述              |
| ----------- | ------------ | ----------------- |
| id          | int          | 主键              |
| name        | varchar(50)  | 习惯名称          |
| category    | varchar(20)  | 习惯类别          |
| icon        | varchar(30)  | 图标名称          |
| frequency   | json         | 频率（周几或每天）|
| points      | int          | 完成获得积分      |
| created_at  | datetime     | 创建时间          |
| updated_at  | datetime     | 更新时间          |
| user_id     | int          | 用户ID（外键）    |

### 打卡记录表 (habit_checkins)

| 字段名     | 类型         | 描述              |
| ---------- | ------------ | ----------------- |
| id         | int          | 主键              |
| habit_id   | int          | 习惯ID（外键）    |
| date       | date         | 打卡日期          |
| status     | enum         | 状态（completed/pending）|
| created_at | datetime     | 创建时间          |
| updated_at | datetime     | 更新时间          |
| user_id    | int          | 用户ID（外键）    |

### 成就表 (achievements)

| 字段名         | 类型         | 描述              |
| -------------- | ------------ | ----------------- |
| id             | int          | 主键              |
| name           | varchar(50)  | 成就名称          |
| description    | varchar(200) | 成就描述          |
| icon           | varchar(30)  | 图标名称          |
| total          | int          | 目标值            |
| reward         | int          | 奖励积分          |
| created_at     | datetime     | 创建时间          |
| updated_at     | datetime     | 更新时间          |

### 用户成就表 (user_achievements)

| 字段名          | 类型         | 描述              |
| --------------- | ------------ | ----------------- |
| id              | int          | 主键              |
| user_id         | int          | 用户ID（外键）    |
| achievement_id  | int          | 成就ID（外键）    |
| progress        | int          | 当前进度          |
| unlocked        | tinyint(1)   | 是否解锁          |
| reward_claimed  | tinyint(1)   | 是否领取奖励      |
| unlocked_at     | datetime     | 解锁时间          |
| claimed_at      | datetime     | 领取奖励时间      |
| created_at      | datetime     | 创建时间          |
| updated_at      | datetime     | 更新时间          |

### 奖励表 (rewards)

| 字段名         | 类型         | 描述              |
| -------------- | ------------ | ----------------- |
| id             | int          | 主键              |
| name           | varchar(50)  | 奖励名称          |
| description    | varchar(200) | 奖励描述          |
| icon           | varchar(30)  | 图标名称          |
| cost           | int          | 所需积分          |
| valid_period   | varchar(20)  | 有效期            |
| created_at     | datetime     | 创建时间          |
| updated_at     | datetime     | 更新时间          |

### 用户奖励表 (user_rewards)

| 字段名         | 类型         | 描述              |
| -------------- | ------------ | ----------------- |
| id             | int          | 主键              |
| user_id        | int          | 用户ID（外键）    |
| reward_id      | int          | 奖励ID（外键）    |
| redeemed       | tinyint(1)   | 是否已兑换        |
| redeemed_at    | datetime     | 兑换时间          |
| created_at     | datetime     | 创建时间          |
| updated_at     | datetime     | 更新时间          |

### 用户积分表 (user_points)

| 字段名         | 类型         | 描述              |
| -------------- | ------------ | ----------------- |
| id             | int          | 主键              |
| user_id        | int          | 用户ID（外键）    |
| points         | int          | 当前积分          |
| created_at     | datetime     | 创建时间          |
| updated_at     | datetime     | 更新时间          |

## 后端控制器设计

### HabitController

- `index()`: 获取习惯列表
- `show($id)`: 获取单个习惯详情
- `store(Request $request)`: 创建新习惯
- `update(Request $request, $id)`: 更新习惯
- `destroy($id)`: 删除习惯
- `toggle(Request $request)`: 切换习惯状态
- `getCheckins(Request $request)`: 获取打卡记录
- `getHeatmap(Request $request)`: 获取热力图数据
- `getStreak()`: 获取连续打卡天数

### AchievementController

- `index()`: 获取成就列表
- `show($id)`: 获取单个成就详情
- `claim($id)`: 领取成就奖励
- `getUnlocked()`: 获取已解锁成就
- `getLocked()`: 获取未解锁成就
- `getClaimed()`: 获取已领取奖励的成就
- `getUnclaimed()`: 获取未领取奖励的成就

### RewardController

- `index()`: 获取奖励列表
- `show($id)`: 获取单个奖励详情
- `redeem($id)`: 兑换奖励
- `getAvailable()`: 获取可用奖励
- `getRedeemed()`: 获取已兑换奖励

### UserController

- `getPoints()`: 获取用户积分 