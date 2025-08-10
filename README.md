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
  - 缓冲区分析(turf)
  - 搜索地址
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

## 📅 前端开发日志

### 📆 2025-07-25
##### ✅ **已完成**  
- 基础底图加载功能  
- 高德地图与天地图底图切换  

---

### 📆 2025-07-26
##### ✅ **已完成**  
- 昼夜模式切换（通过双层滤镜实现夜间图片显示优化）  
- 地图工作台配置组件  
- 用户信息组件  
- 项目介绍组件  

---

### 📆 2025-07-27
##### ✅ **已完成**  
- 使用 Zustand 管理地图状态  
- 路由切换时自动加载地图状态 
- 地图table的显示
- readme文件在项目里显示

##### 🚧 **进行中**
- 调试工具点击跳转并不精确
- 习惯一下vim写代码
##### 🔄 **待完成**
- Ai聊天界面
- 用户设置 - 地图选范围
- 登录界面
- 注册界面
- 后端开始 - 前端集成后端
- 测量功能 
- 导航栏跳转
##### 🔍 **思考**
- 具体要实现什么功能

---

### 📆 2025-07-28
##### ✅ **已完成**  
- 加载点图层，whenLayerView方法
- 要素图层加载（每天上班要写到GA项目里）
  
```JavaScript
    const QueryBySql1 = () => {
        console.log("所有字段信息为：", layers[1].fields.slice(1).map(field => field.name));
        const query = layers[1].createQuery();
        query.where = "矿产地名称 LIKE '%金矿%'"; // 只用于查询出具体的结果，不会返回到地图上
                /**
        * 配置统计分析参数
        * @param statisticType 统计类型，此处设置为"count"表示进行计数统计
        * @param onStatisticField 用于统计的字段名称
        * @param outStatisticFieldName 输出统计结果的字段名称，此处固定为"count"
        */
        query.outStatistics = [{
            statisticType: "count",
            onStatisticField: '矿产地名称',
            outStatisticFieldName: "count"
        }];
        query.groupByFieldsForStatistics = ['矿产地名称'];
        layers[1].queryFeatures(query).then(function (result) {
            const values = result.features.map(feature => feature.attributes['矿产地名称']);
            console.log('字有唯一值:', values);
        });
        layers[1].definitionExpression = "规模 = '小型'";  // definitionExpression = ''   会直接将查询结果返回到layer上
    };
```
##### 🚧 **进行中**

##### 🔄 **待完成**
- 添加图层过滤、字段表

##### 🔍 **思考**

---

### 📆 2025-07-29
##### ✅ **已完成**  
- 底部视图实时状态
- 登录页面
- 控制台按钮排版
- 
##### 🚧 **进行中**

##### 🔄 **待完成**
- 定位相关bug

##### 🔍 **思考**

---

### 📆 2025-07-30
##### ✅ **已完成**  
- 逆地理编码
##### 🚧 **进行中**

##### 🔄 **待完成**

##### 🔍 **思考**

---

### 📆 2025-07-31
##### ✅ **已完成**  
- 条件过滤

##### 🚧 **进行中**

##### 🔄 **待完成**

##### 🔍 **思考**
- 存在bug：切换图层的时候语句会错乱

---

### 📆 2025-08-01
##### ✅ **已完成**  
- ArcGIS图层挺好看的
##### 🚧 **进行中**

##### 🔄 **待完成**

##### 🔍 **思考**

---

### 📆 2025-08-02
##### ✅ **已完成**  
- 优化逆地理编码逻辑，侧边栏收缩
##### 🚧 **进行中**

##### 🔄 **待完成**

##### 🔍 **思考**

---

### 📆 2025-07-27
##### ✅ **已完成**  

##### 🚧 **进行中**

##### 🔄 **待完成**

##### 🔍 **思考**

---

### 📆 2025-07-27
##### ✅ **已完成**  

##### 🚧 **进行中**

##### 🔄 **待完成**

##### 🔍 **思考**

---



✅ **已完成**

🚧 **进行中**

❌ **未完成**

⏸️ **已暂停**

🔍 **待思考**