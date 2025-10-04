# 🌍 GIS 可视化与空间分析平台
## 🚀 项目指令
#### 启动项目

```bash
pnpm run dev
```
#### 构建项目
```bash
pnpm run build
```

#### 运行项目
```bash
pnpm run start
```

#### 运行测试
```bash
pnpm run test
```
---
## 📌 项目介绍
这是一个基于 Web 的 GIS 可视化和空间分析平台，集成了 Agent 智能体功能，支持：
- 多源底图加载与切换
- 昼夜模式切换
- 地图状态管理
- 数据处理与分析
- GIS智能体分析

## 🛠️ 技术栈
- 前端框架: React (根据实际项目填写)
- 样式框架: Ant Design
- 状态管理: Zustand
- 构建工具: pnpm
- GIS 引擎: GeoScene API for JavaScript
- 空间分析工具: Turf

## 📦 具体功能
- 逆地理编码：点击地图上的点进行逆地理编码
- 获取天气：通过视图中心点获取天气
- 矢量要素类
  - 通过geoserver管理
  - 加载矢量要素类
  - 矢量要素弹框显示可以编辑数据或删除
  - 矢量要素弹框可以设置编辑形状和位置
  - 分割线切割
  - 上传shp文件加载（后端处理）
  - 上传geojson文件加载（后端处理）
- 图层列表
  - 查看图层属性
  - 图层的字段列表
  - 图层的要素边框和颜色的渲染
  - 图例的渲染
- 空间分析分析
  - 缓冲区分析(turf，（可以设置距离范围（涉及单个点、线、面））)
  - 最大外界矩形
  -  多边形质心（内部的点）
  -  

## 🔗 相关资源
- [GeoScene API for JavaScript 文档](https://doc.geoscene.cn/javascript/4.29/api-reference/index.html)
- [Antdesign文档](https://ant.design/components/overview-cn)
- [图标库](https://www.iconfont.cn/)
- [高德动图API文档](https://lbs.amap.com/api/webservice/summary)
- [DataV.GeoAtlas地理小工具系列](https://datav.aliyun.com/portal/school/atlas/area_selector)
- [Arcgis api学习-哔哩哔哩视频](https://space.bilibili.com/326281584?spm_id_from=333.337.0.0)
- [GeoScene Online](https://www.geosceneonline.cn/geoscene/webapps/mapViewer)
- [geojson.io | powered by Mapbox](https://geojson.io/#map=2/0/20)
- [DeepSeek - 探索未至之境](https://chat.deepseek.com/)
- [天地图 服务中心 geojson下载](https://cloudcenter.tianditu.gov.cn/administrativeDivision/)
- [个人Blogs: Liao-dorian`s blogs](https://gitee.com/Liao-dorian/myblogs)
- [参考My项目](https://gitee.com/Liao-dorian/umijs-load-map)
- [35个在线地图瓦片URL分享_在线地图接口-CSDN博客](https://blog.csdn.net/mrib/article/details/141326671)
- [哔哩哔哩 (゜-゜)つロ 干杯~-bilibili](https://www.bilibili.com/)
- [快速上手 - SiliconFlow](https://docs.siliconflow.cn/cn/userguide/quickstart)
- [Agent  学习  哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1g4E4zsEoY/?spm_id_from=333.788.player.switch&vd_source=3c46a0d84476a55380be0c2ddd012af1&p=2)

## 🗳 数据库设计

user表：昵称（nickname）、账号（username）、密码（password）、工作单位（work_unit）、个人简介、默认底图URL(base_map_url)、默认底图名称(base_map_name)、中心点(center)、缩放大小(zoom)、头像(avatar)

```sql
CREATE TABLE users (
    -- 主键标识
    id BIGSERIAL PRIMARY KEY,
    
    -- 用户身份信息
    nickname VARCHAR(50) NOT NULL,
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL, -- 增加长度以容纳加密密码
    
    -- 职业信息
    work_unit VARCHAR(100),
    email VARCHAR(100) NOT NULL, -- 标准邮箱长度
    
    -- 个人介绍
    personal_intro TEXT, -- 改为TEXT类型支持更长内容
    
    -- 地图相关偏好设置
    base_map_url VARCHAR(500),
    base_map_name VARCHAR(50), -- 增加长度
    center_x DECIMAL(10, 7) DEFAULT 116.805, -- 修正为北京经度，增加精度
    center_y DECIMAL(10, 7) DEFAULT 34.567, -- 修正为北京纬度
    zoom SMALLINT DEFAULT 4,
    
    -- 头像信息
    avatar VARCHAR(500),
    
    -- 系统管理字段
    status SMALLINT DEFAULT 1,
    is_deleted BOOLEAN DEFAULT FALSE, -- 添加缺失字段
    
    -- 时间戳字段
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 约束条件
    CONSTRAINT chk_status CHECK (status IN (0, 1, 2)),
    CONSTRAINT chk_zoom_range CHECK (zoom >= 0 AND zoom <= 20),
);

-- 创建索引优化查询性能
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 注释
COMMENT ON TABLE users IS '系统用户表，存储用户基本信息、地图偏好设置和认证信息';
COMMENT ON COLUMN users.id IS '用户唯一标识符，自增主键';
COMMENT ON COLUMN users.nickname IS '用户昵称，用于显示，最大长度50字符';
COMMENT ON COLUMN users.username IS '登录账号，必须唯一，最大长度100字符';
COMMENT ON COLUMN users.password IS '加密后的密码，建议使用bcrypt等强加密方式';
COMMENT ON COLUMN users.work_unit IS '工作单位信息，可选字段';
COMMENT ON COLUMN users.personal_intro IS '个人简介，支持长文本内容';
COMMENT ON COLUMN users.base_map_url IS '默认底图URL地址，用于个性化地图显示';
COMMENT ON COLUMN users.base_map_name IS '默认底图名称，如"天地图"、"谷歌卫星图"等';
COMMENT ON COLUMN users.center_x IS '地图中心点X坐标（经度），默认北京经度';
COMMENT ON COLUMN users.center_y IS '地图中心点Y坐标（纬度），默认北京纬度';
COMMENT ON COLUMN users.zoom IS '地图缩放级别，默认10级，范围0-20';
COMMENT ON COLUMN users.avatar IS '头像图片URL地址，支持本地路径或网络地址';
COMMENT ON COLUMN users.email IS '电子邮箱，用于找回密码等操作';
COMMENT ON COLUMN users.status IS '用户状态：0-禁用，1-正常，2-未激活';
COMMENT ON COLUMN users.is_deleted IS '软删除标记：true-已删除，false-正常';
COMMENT ON COLUMN users.created_at IS '记录创建时间';
COMMENT ON COLUMN users.updated_at IS '记录最后更新时间';


-- 创建更新updated_at字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器：在更新数据时自动更新updated_at字段
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

