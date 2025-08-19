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
- 优化逆地理编码逻辑，侧边栏收缩

---

### 📆 2025-08-11
- 添加图层
  - 支持WebURL的方式（geojson、Esri等）
    - 从 Arcgis restfil api 创建一个新图层实例。根据 URL，返回的图层类型可能是 FeatureLayer、TileLayer、MapImageLayer、ImageryLayer、ImageryTileLayer、SceneLayer、StreamLayer、IntegratedMeshLayer、IntegratedMesh3DTilesLayer、PointCloudLayer、BuildingSceneLayer、ElevationLayer 或 GroupLayer。
    参考[fromGeoSceneServerUrl](https://doc.geoscene.cn/javascript/4.29/api-reference/geoscene-layers-Layer.html#fromGeoSceneServerUrl) 
    - 支持Geojson 数据源
    - OGC WFS 数据源
    - OGC WMS 数据源
    - OGC WMTS 数据源
  - 支持文件添加
    - shp文件
    - geojson文件
    - csv
    - tif
    - csv
    - gdb
    - gbk
---

### 📆 2025-07-27

import 世界 from '@/WebPublicResource/assets/scalePic/世界.png';
import 乡镇 from '@/WebPublicResource/assets/scalePic/乡镇.png';
import 全国 from '@/WebPublicResource/assets/scalePic/全国.png';
import 县 from '@/WebPublicResource/assets/scalePic/县.png';
import 市 from '@/WebPublicResource/assets/scalePic/市.png';
import 省 from '@/WebPublicResource/assets/scalePic/省.png';
import 街道 from '@/WebPublicResource/assets/scalePic/街道.png';
import DragModal from '@/WebPublicResource/components/AntdExtend/DragModal';
import { getLayerDetail } from '@/WebPublicResource/pages/Analysis/services/portalService';
import { checkPathVisible } from '@/WebPublicResource/utils/checkAuthority';
import dataTypes from '@/components/dataItemDetai_base/dataTypes';
import { getSpatialRefSysDetail } from '@/WebPublicResource/services/workstationService';
import wktParser from '@/WebPublicResource/utils/wktParser';
import {
  AimOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import _ from 'lodash'
import {
  Button,
  Collapse,
  Divider,
  InputNumber,
  Select,
  Slider,
  Tabs,
  Tooltip,
  Input,
  Space,
  AutoComplete,
} from 'antd';


import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useModel } from 'umi';
import { WorkStationContext } from '../../WorkStationContext';
import { getDatasourceDetail } from '../../service';
import styles from './index.less';
import SQLExpression from '@/WebPublicResource/pages/Analysis/InputItems/SQLExpression';



const { Panel } = Collapse;

const LayerAttribute = (props: any, propref: any) => {
  const [activeKey, setActiveKey] = useState('1'); // 默认激活第一个标签页
  const [visible, setVisible] = useState(false);
  const [layer, setLayer] = useState<any>({});
  const [spatialRef, setSpatialRef] = useState<any>({});

  const [isFeature, setIsFeature] = useState(false);
  const [dataItem, setDataItem] = useState<any>(null);
  const [ds, setDs] = useState<any>({});
  const [timeFlag, setTimeFlag] = useState('');
  const [sliderValues, setSliderValues] = useState<any>([0, 6]);
  const [showScales, setShowScales] = useState<any>(['--', '--']);

  const { state } = useContext(WorkStationContext);
  const { map, view } = state;

  const [isShowPath, setIsShowPath] = useState(false);
  const { initialState }: any = useModel('@@initialState');
  // 在组件状态部分添加
  const [fields, setFields] = useState<any[]>([]);  // 过滤字段
  const [fieldValues, setFieldValues] = useState<any[]>([]); // 过滤字段所有的取值
  // 在组件状态部分添加
  const [filterConnections, setFilterConnections] = useState<string[]>(['and']);
  const [filterExpression, setFilterExpression] = useState<any[][]>([['', '', null]]); // 过滤表达式
  // 过滤操作符选项
  const filterOperators = [
    { value: '=', label: '等于' },
    { value: '<>', label: '不等于' },
    { value: '>', label: '大于' },
    { value: '>=', label: '大于等于' },
    { value: '<', label: '小于' },
    { value: '<=', label: '小于等于' },
    { value: 'like', label: '包含' },
    { value: 'not like', label: '不包含' },
    { value: 'in', label: '在列表中' },
    { value: 'not in', label: '不在列表中' },
    { value: 'is null', label: '为空' },
    { value: 'is not null', label: '不为空' },
  ];

  // 级别与比例映射关系
  const levelScaleMap = [
    { level: '世界', scale: 100000000, image: 世界 },
    { level: '全国', scale: 20000000, image: 全国 },
    { level: '省', scale: 4000000, image: 省 },
    { level: '市', scale: 800000, image: 市 },
    { level: '县', scale: 160000, image: 县 },
    { level: '乡镇', scale: 30000, image: 乡镇 },
    { level: '街道', scale: 5000, image: 街道 },
  ];



  // 初始化过滤条件
  const clearAllFilterCondition = () => {
    setFilterExpression([['', '', null]])
    setFilterConnections(['and'])
    setFieldValues([])
  };

  // 添加过滤条件
  const addFilterCondition = () => {
    setFilterExpression([...filterExpression, ['', '', null]]);
    // 添加默认的连接关系
    setFilterConnections([...filterConnections, 'and']);
    setFieldValues([])
  };

  // 删除过滤条件
  const removeFilterCondition = (index: number) => {
    if (filterConnections.length > 1) {
      setFilterExpression(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
      setFilterConnections(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    }
  };

  // 更新过滤条件
  const updateFilterCondition = (index, newvalue, childIndex) => {

    if (childIndex === 3) {
      const newFilterConnections = [...filterConnections];
      newFilterConnections[index - 1] = newvalue;
      setFilterConnections(newFilterConnections);
      return;
    }

    const newFilterExpression = [...filterExpression];
    newFilterExpression[index] = [...filterExpression[index]];
    newFilterExpression[index][childIndex] = newvalue;
    if (childIndex === 0) {
      newFilterExpression[index][1] = '='
      newFilterExpression[index][2] = null
    }
    setFilterExpression(newFilterExpression);
  };

  /**
 * 将Unix时间戳(毫秒)转换为ArcGIS REST API的时间格式
 * @param {number} timestamp - Unix时间戳(毫秒)
 * @returns {string} ArcGIS格式的时间字符串，如 timestamp '2023-07-11 08:59:22.885'
 */
  function convertToArcGISTimeFormat(timestamp) {
    // 验证输入
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new Error('Invalid timestamp: must be a number');
    }

    // 处理秒级时间戳(10位数字)
    const adjustedTimestamp = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;

    // 创建Date对象
    const date = new Date(adjustedTimestamp);

    // 验证日期有效性
    if (isNaN(date.getTime())) {
      throw new Error('Invalid timestamp value');
    }

    // 提取各个时间组件(UTC时间)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    // 组合成ArcGIS格式
    return `timestamp '${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}'`;
  }



  // 获取字段所有值
  const getFieldValues = async (fieldName: string) => {
    try {
      const query = {
        returnDistinctValues: true,
        outFields: [fieldName],
        where: '1=1',
        returnGeometry: false
      }
      let values: any[] = [];
      layer.queryFeatures(query).then(function (result) {
        values = [...new Set(
          result.features.map(feature => feature.attributes[fieldName])
        )];
        // debugger
        const foundFieldtype = fields.find(item => item.name === fieldName)?.type;

        let thisfieldValues: any[] = [];
        if (foundFieldtype === 'date') {
          thisfieldValues = values.map(value => ({
            label: new Date(value).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false // 24 小时制
            }), value: convertToArcGISTimeFormat(value)
          }));
        } else {
          thisfieldValues = values.map(value => ({ label: value, value: value }));
        }


        // console.log("字段所有值（由于渲染）", thisfieldValues);
        setFieldValues(thisfieldValues);
      });
    } catch (error) {
      console.error('获取字段值失败:', error);
      setFieldValues([]);

    }
  };

  // 应用过滤
  const useFilter = () => {
    // console.log("filterExpression", filterExpression);
    if (filterExpression.length == 1 && filterExpression[0][0] == "" && filterExpression[0][2] == null) {
      layer.definitionExpression = '1=1'
      view.goTo({
        target: layer,
      })
      layer.filterExpression = filterExpression
      layer.filterConnections = filterConnections
      return;
    }
    const conditions: any = [];

    for (let i = 0; i < filterExpression.length; i++) {
      const [field, operator, value] = filterExpression[i];

      // 跳过无效条件（字段为空或未定义）
      if (!field || field.trim() === '') continue;

      // 处理NULL相关操作符
      if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
        conditions.push(`${field} ${operator}`);
        continue;
      }

      // 跳过无效值（值为null或undefined且操作符不是处理NULL的）
      if (value === null || value === undefined) continue;

      // 处理不同操作符
      let condition;
      switch (operator) {
        case '=':
        case '<>':
        case '>':
        case '>=':
        case '<':
        case '<=':
          // 处理数字和字符串
          if (typeof value === 'number') {
            condition = `${field} ${operator} ${value}`;
          } else {

            if ((/^timestamp\s+'(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3})'$/).test(value)) {
              condition = `${field} ${operator} ${value}`;
            } else {
              // 字符串需要加引号并转义单引号
              const escapedValue = String(value).replace(/'/g, "''");
              condition = `${field} ${operator} '${escapedValue}'`;
            }


          }
          break;

        case 'like':
        case 'not like':
          // LIKE操作需要处理通配符
          const escapedValue = String(value).replace(/'/g, "''");
          condition = `${field} ${operator} '%${escapedValue}%'`;
          break;

        case 'in':
        case 'not in':
          // 处理数组值
          if (Array.isArray(value)) {
            if (value.length === 0) {
              // 空数组处理
              condition = operator === 'in' ? '1=0' : '1=1';
            } else {
              const formattedValues = value.map(v => {
                if (typeof v === 'number' || (/^timestamp\s+'(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3})'$/).test(v)) return v;
                const escaped = String(v).replace(/'/g, "''");
                return `'${escaped}'`;
              }).join(', ');
              condition = `${field} ${operator} (${formattedValues})`;
            }
          } else {
            // 非数组值当作单元素数组处理
            const formattedValue = typeof value === 'number' ? value : `'${String(value).replace(/'/g, "''")}'`;
            condition = `${field} ${operator} (${formattedValue})`;
          }
          break;

        default:
          // 默认处理为相等比较
          const defaultEscapedValue = String(value).replace(/'/g, "''");
          condition = `${field} = '${defaultEscapedValue}'`;
      }

      conditions.push(condition);
    }

    // 如果没有条件，返回空字符串
    if (conditions.length === 0) return;

    // 组合条件
    let whereClause = '';

    for (let i = 0; i < conditions.length; i++) {
      whereClause += conditions[i];

      // 添加连接符（如果有）
      if (i < conditions.length - 1 && filterConnections[i]) {
        whereClause += ` ${filterConnections[i]} `;
      }
    }
    // console.log("组合的最终条件", whereClause);

    layer.definitionExpression = whereClause
    view.goTo({
      target: layer,
    })
    // console.log("最终条件", filterConnections, filterExpression, layer);
    layer.filterExpression = filterExpression
    layer.filterConnections = filterConnections

  }
  const fetchSpatialRefData = async () => {
    if (!layer?.spatialReference?.wkid) return;
    try {
      const res = await getSpatialRefSysDetail({ srid: layer.spatialReference.wkid });

      if (!res?.data?.[0]?.srtext) return;

      const wktResult = wktParser(res.data[0].srtext);
      const { a, rf } = wktResult || {};
      const b = rf === 0 ? null : a * (1 - 1 / rf);

      setSpatialRef(prev => ({
        ...prev,
        name: wktResult?.name,
        authority: res?.data?.[0].authName,
        unit: `${wktResult?.UNIT?.name} (${wktResult?.UNIT?.convert})`,
        majorSemiAxis: a,
        minorSemiAxis: b,
        flattening: rf,
        primeMeridian: `${wktResult?.GEOGCS?.PRIMEM?.name || wktResult?.PRIMEM?.name} (${Number(wktResult?.GEOGCS?.PRIMEM?.convert || wktResult?.PRIMEM?.convert).toFixed(2)})`,
        datumName: wktResult?.GEOGCS?.DATUM?.name || wktResult?.DATUM?.name,
        gcsName: wktResult?.ellps
      }));
    } catch (error) {
      console.error("空间参考系解析异常", error);
    }
  };

  useEffect(() => {
    if (layer && layer.spatialReference) {
      if (layer.sourceJSON?.sourceSpatialReference) {
        setSpatialRef(layer.sourceJSON?.sourceSpatialReference);
      } else if (layer.customParameters?.dataItemData) {
        getLayerDetail(layer.customParameters?.dataItemData?.id).then(
          (res: any) => {
            if (res?.sourceSpatialReference) {
              setSpatialRef(res.sourceSpatialReference);
            } else {
              setSpatialRef({});
            }
          },
        );
      } else {
        setSpatialRef({});
      }
      getDs(layer);
      if (layer.customParameters?.isDataItem) {
        let data: any;
        if (layer.customParameters?.dataItemData) {
          data = { ...layer.customParameters.dataItemData };
        }

        if (layer.customParameters?.fileData) {
          data = { ...layer.customParameters.fileData };
        }

        setDataItem({ ...data });
        if (data.startTimeField && data.endTimeField) {
          setTimeFlag('2');
        } else if (data.startTimeField) {
          setTimeFlag('1');
        } else {
          setTimeFlag('');
        }
      } else {
        setDataItem(null);
      }

      const isShowPath = checkPathVisible(
        initialState?.currentUser,
        layer.customParameters?.dataSourceInfo,
      );
      setIsShowPath(isShowPath);

      setSliderValues([0, 6]); // 默认值
      setShowScales(['--', '--']); // 默认值
      if (layer.minScale) {
        handleInputChange(layer.minScale, 0);
      }
      if (layer.maxScale) {
        handleInputChange(layer.maxScale, 1);
      }
    }
    // 在第一个useEffect中添加
    if (layer.fields) {
      setFields(layer.fields);
    }
  }, [layer]);

  useEffect(() => {
    if (map && layer) {
      fetchSpatialRefData()
      if (layer.minScale) {
        handleInputChange(layer.minScale, 0);
      }
      if (layer.maxScale) {
        handleInputChange(layer.maxScale, 1);
      }
      // 开启过滤窗口
      console.log("开启过滤窗口", layer);

      setFilterConnections(layer.filterConnections || ["and"]);
      setFilterExpression(layer.filterExpression || [['', '', null]]);
    }
    return () => {
      // 如果关闭组件，那么触发
      if (visible) {
        setActiveKey('1');
      }
    }
  }, [visible]);

  useEffect(() => {
    if (map) {
      let nlayer = map.allLayers.items.find((i) => i.id == layer.id);
      if (nlayer) {
        setLayer(nlayer);
      }
    }
  }, [map]);

  useEffect(() => {
    if (!timeFlag) {
      setDataItem({ ...dataItem, startTimeField: null, endTimeField: null });
    } else if (timeFlag == '1') {
      setDataItem({ ...dataItem, endTimeField: null });
    }
  }, [timeFlag]);

  const getDs = async (l: any) => {
    if (l.customParameters?.isDataItem) {
      setIsFeature(false);
      if (l.customParameters?.dataSourceInfo) {
        setDs(l.customParameters.dataSourceInfo);
      } else {
        let dataItemData =
          l.customParameters.dataItemData || l.customParameters.fileData;

        let res = await getDatasourceDetail(dataItemData.sourceId);
        if (res.success) {
          setDs(res.data);
        }
      }
    } else {
      setIsFeature(true);
    }
  };

  const getLayerUrl = (l: any) => {
    if (l.hasOwnProperty('layerId')) {
      return `${l.url}/${l.layerId}`;
    } else {
      return l.url;
    }
  };

  const init = (p: any) => {
    if (!layer || p.id !== layer.id || Object.keys(layer).length === 0) {
      setLayer(p);
      // 清空过滤条件
      clearAllFilterCondition()
    }
    setVisible(true);
  };

  const checkType = (type: string, d: any, layerType: string) => {
    if (d?.id) {
      if (d.type == 'localfile') {
        return '文件要素类';
      } else {
        return '数据项要素类';
      }
    }

    switch (type) {
      case 'feature':
        return '要素服务要素类';
      default:
        return layerType || '';
    }
  };

  const getDataType = (type: string) => {
    let item = dataTypes.find((i: any) => i.type == type);
    if (item) {
      return item.text;
    } else {
      return '';
    }
  };

  const getPath = () => {
    let path = ds?.path.replaceAll('\\', '/');
    if (!path.endsWith('/')) {
      path += '/';
    }
    path += dataItem.path;
    return path;
  };

  // 根据输入值找到最近的较小比例尺索引
  const findNearestIndex = (value: number) => {
    let nearestIndex = 0;
    for (let i = 0; i < levelScaleMap.length; i++) {
      if (value <= levelScaleMap[i].scale) {
        nearestIndex = i;
      } else {
        break;
      }
    }
    return nearestIndex;
  };

  // 处理滑块变化
  const handleSliderChange = (values: any) => {
    if (values[0] != 0 || showScales[0] != '--') {
      setShowScales((prev: any) => {
        const next = [...prev];
        next[0] = levelScaleMap[values[0]].scale;
        return next;
      });
    }
    if (values[1] != 6 || showScales[1] != '--') {
      setShowScales((prev: any) => {
        const next = [...prev];
        next[1] = levelScaleMap[values[1]].scale;
        return next;
      });
    }
    setSliderValues(values);
  };

  // 生成等间距滑块标记
  const marks = levelScaleMap.reduce((acc: any, cur, index) => {
    acc[index] = {
      label: <div style={{ marginTop: 20 }}>{cur.level}</div>,
    };
    return acc;
  }, {});

  // 处理输入框变化
  const handleInputChange = (value: any, index: number) => {
    if (value === null) return;
    let newIndex;
    if (value == '--' && index == 0) {
      newIndex = 0;
    } else if (value == '--' && index == 1) {
      newIndex = 6;
    } else {
      newIndex = findNearestIndex(value);
    }
    setShowScales((prev: any) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setSliderValues((prev: any) => {
      const next = [...prev];
      next[index] = newIndex;
      return next;
    });
  };

  const getCurrentMapScale = (index: number) => {
    if (index == 1) {
      handleInputChange(Math.floor(view.scale), index); //向下取整
    } else {
      handleInputChange(Math.ceil(view.scale), index); //向上取整
    }
  };

  const onSave = () => {
    layer.minScale = showScales[0];
    layer.maxScale = showScales[1];
    setVisible(false);
  };

  useImperativeHandle(propref, () => ({
    init,
    setVisible,
    switchToTab: (key, ly) => {
      setActiveKey(key);
      init(ly);
    }
  }));


  // 解析图层名字
  const getLayerName = (item) => {
    const title = item.title;
    if (title?.[0] === '%') {
      const name = item?.sourceJSON?.name;
      if (name !== undefined && name !== null) return name;

      try {
        return decodeURIComponent(title);
      } catch (e) {
        return title;
      }
    }
    return title;
  };
  // layer.title = getLayerName(layer);
  // 去除科学计数法
  const convertScientificNotation = (input) => {

    if (_.isEmpty(input)) {
      return;
    }
    const arr = input?.split(' ');
    let full;
    try {
      const fullStr = Number(arr[0])
      full = new Intl.NumberFormat('en-US', {
        useGrouping: false, // 禁用千分位分隔符
        maximumFractionDigits: 40 // 允许足够多的小数位
      }).format(fullStr);
    } catch (e) {
      return input;
    }

    return `${full} ${arr[1]}`;
  }


  return (
    <DragModal
      title={'图层属性：' + getLayerName(layer)}
      width={700}
      visible={visible}
      maskClosable={false}
      destroyOnClose={true}
      styles={{ mask: { display: 'none' } }}
      // maskStyle={{ display: 'none' }}
      wrapClassName={styles.pointerEventsNone}
      resizeable={true}
      footer={null}
      onCancel={() => setVisible(false)}
    >
      <div className={styles.layerAttribute}>
        <div
          className={styles.infos}
          style={{ width: '100%', maxHeight: '75vh' }}
        >
          <Tabs activeKey={activeKey} style={{ height: '100%' }} onChange={setActiveKey}>
            <Tabs.TabPane tab="数据源信息" key="1" style={{ height: '100%' }}>
              <Collapse bordered={false} defaultActiveKey={['1']}>
                <Panel header="数据源" key="1">
                  <ul className={styles.tables}>
                    <li>
                      <div className={styles.tLabel}>数据类型</div>
                      <div className={styles.tValue}>
                        {checkType(layer.type, dataItem, layer?.operationalLayerType)}
                      </div>
                    </li>
                    {isFeature ? (
                      <>
                        <li>
                          <div className={styles.tLabel}>图层Url</div>
                          <div
                            className={styles.tValue}
                            title={getLayerUrl(layer)}
                          >
                            {getLayerUrl(layer)}
                          </div>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <div className={styles.tLabel}>资源池</div>
                          <div className={styles.tValue} title={ds.name}>
                            {ds.name}
                          </div>
                        </li>
                        {(ds.address || ds.path) &&
                          ds.type != 'localfile' &&
                          ds.type != 'arcgisserver' && (
                            <li>
                              <div className={styles.tLabel}>资源池地址</div>
                              <div
                                className={styles.tValue}
                                title={ds.address || ds.path}
                              >
                                {ds.address || ds.path}
                              </div>
                            </li>
                          )}
                        {ds.type == 'arcgisserver' && (
                          <li>
                            <div className={styles.tLabel}>服务地址</div>
                            <div
                              className={styles.tValue}
                              title={dataItem.path}
                            >
                              {dataItem.path}
                            </div>
                          </li>
                        )}
                        {ds.type == 'localfile' && isShowPath && (
                          <li>
                            <div className={styles.tLabel}>资源地址</div>
                            <div className={styles.tValue} title={getPath()}>
                              {getPath()}
                            </div>
                          </li>
                        )}
                        {ds.port && (
                          <li>
                            <div className={styles.tLabel}>资源池端口</div>
                            <div className={styles.tValue} title={ds.port}>
                              {ds.port}
                            </div>
                          </li>
                        )}
                        {ds.schema && (
                          <li>
                            <div className={styles.tLabel}>资源池实例</div>
                            <div className={styles.tValue} title={ds.schema}>
                              {ds.schema}
                            </div>
                          </li>
                        )}
                        {ds.type && (
                          <li>
                            <div className={styles.tLabel}>资源池类型</div>
                            <div
                              className={styles.tValue}
                              title={getDataType(ds.type)}
                            >
                              {getDataType(ds.type)}
                            </div>
                          </li>
                        )}
                        <li>
                          <div className={styles.tLabel}>资源池用户</div>
                          <div
                            className={styles.tValue}
                            title={ds.userName || ds.createName}
                          >
                            {ds.userName || ds.createName}
                          </div>
                        </li>
                      </>
                    )}

                    <li>
                      <div className={styles.tLabel}>名称</div>
                      <div className={styles.tValue} title={getLayerName(layer)}>
                        {getLayerName(layer)}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>要素类型</div>
                      <div className={styles.tValue} title={layer.type}>
                        {layer.type}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>几何类型</div>
                      <div
                        className={styles.tValue}
                        title={
                          layer?.geometryType ||
                          layer?.customParameters?.dataItemData?.geometryType || layer?.sourceJSON?.layers?.[0]?.geometryType || '无'
                        }
                      >
                        {layer?.geometryType ||
                          layer?.customParameters?.dataItemData?.geometryType ||
                          layer?.sourceJSON?.layers?.[0]?.geometryType || "无"}
                      </div>
                    </li>
                    {/* <li>
                      <div className={styles.tLabel}>坐标具有Z值</div>
                      <div className={styles.tValue} title={layer.hasZ || '无'}>
                        {layer.hasZ || '无'}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>坐标具有M值</div>
                      <div className={styles.tValue} title={layer.hasM || '无'}>
                        {layer.hasM || '无'}
                      </div>
                    </li> */}
                  </ul>
                </Panel>
                <Panel header="范围" key="2">
                  <ul className={styles.tables}>
                    <li>
                      <div className={styles.tLabel}>上</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.ymax}
                      >
                        {layer.fullExtent?.ymax}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>下</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.ymin}
                      >
                        {layer.fullExtent?.ymin}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>左</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.xmin}
                      >
                        {layer.fullExtent?.xmin}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>右</div>
                      <div
                        className={styles.tValue}
                        title={layer.fullExtent?.xmax}
                      >
                        {layer.fullExtent?.xmax}
                      </div>
                    </li>
                  </ul>
                </Panel>
                <Panel header="空间参考" key="3">
                  <ul className={styles.tables}>
                    <li>
                      <div className={styles.tLabel}>地理坐标系</div>
                      <div className={styles.tValue} title={spatialRef.name || (layer?.fullExtent?.spatialReference?.isWGS84 ? 'GCS_WGS_1984' : '')}>
                        {spatialRef.name || (layer?.fullExtent?.spatialReference?.isWGS84 ? 'GCS_WGS_1984' : '')}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>WKID</div>
                      <div className={styles.tValue} title={spatialRef.wkid || layer?.spatialReference?.wkid}>
                        {spatialRef.wkid || layer?.spatialReference?.wkid}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>授权</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.authority}
                      >
                        {spatialRef.authority}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>线长度单位</div>
                      <div className={styles.tValue} title={spatialRef.unit}>
                        {spatialRef.unit}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>本初子午线</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.primeMeridian}
                      >
                        {spatialRef.primeMeridian}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>基本面</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.datumName}
                      >
                        {spatialRef.datumName}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>参考椭球体</div>
                      <div className={styles.tValue} title={spatialRef.gcsName}>
                        {spatialRef.gcsName}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>长半轴</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.majorSemiAxis}
                      >
                        {spatialRef.majorSemiAxis}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>短半轴</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.minorSemiAxis}
                      >
                        {spatialRef.minorSemiAxis}
                      </div>
                    </li>
                    <li>
                      <div className={styles.tLabel}>反扁率</div>
                      <div
                        className={styles.tValue}
                        title={spatialRef.flattening}
                      >
                        {spatialRef.flattening}
                      </div>
                    </li>
                  </ul>
                </Panel>
                {layer.type != 'map-image' && (
                  <Panel header="值域、分辨率和容差" key="4">
                    <ul className={styles.tables}>
                      <li>
                        <div className={styles.tLabel}>Y最小值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.minY || layer?.fullExtent?.ymin || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.minY || layer?.fullExtent?.ymin || "无"}
                        </div>
                      </li>
                      <li>
                        <div className={styles.tLabel}>Y最大值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.maxY || layer?.fullExtent?.ymax || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.maxY || layer?.fullExtent?.ymax || "无"}
                        </div>
                      </li>
                      <li>
                        <div className={styles.tLabel}>X最小值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.minX || layer?.fullExtent?.xmin || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.minX || layer?.fullExtent?.xmin || "无"}
                        </div>
                      </li>
                      <li>
                        <div className={styles.tLabel}>X最大值</div>
                        <div
                          className={styles.tValue}
                          title={layer.sourceJSON?.sourceSpatialReference?.maxX || layer?.fullExtent?.xmax || "无"}
                        >
                          {layer.sourceJSON?.sourceSpatialReference?.maxX || layer?.fullExtent?.xmax || "无"}
                        </div>
                      </li>
                    </ul>

                    <ul className={styles.tables} style={{ marginTop: 4 }}>
                      <li>
                        <div className={styles.tLabel}>XY分辨率</div>
                        <div
                          className={styles.tValue} // 解析科学计数法
                          title={
                            convertScientificNotation(layer.sourceJSON?.sourceSpatialReference
                              ?.xyResolution)

                          }
                        >
                          {convertScientificNotation(layer.sourceJSON?.sourceSpatialReference
                            ?.xyResolution)}
                        </div>
                      </li>
                    </ul>

                    <ul className={styles.tables} style={{ marginTop: 4 }}>
                      <li>
                        <div className={styles.tLabel}>XY容差</div>
                        <div
                          className={styles.tValue}
                          title={convertScientificNotation(layer.sourceJSON?.sourceSpatialReference
                            ?.xyTolerance)

                          }
                        >
                          {
                            convertScientificNotation(layer.sourceJSON?.sourceSpatialReference
                              ?.xyTolerance)}
                        </div>
                      </li>
                    </ul>
                  </Panel>
                )}
              </Collapse>
            </Tabs.TabPane>

            <Tabs.TabPane tab="显示范围" key="2" style={{ height: '100%' }}>
              <div style={{ paddingLeft: 14 }}>
                <div style={{ padding: '0 15px 0 9px' }}>
                  <Slider
                    range
                    min={0}
                    max={levelScaleMap.length - 1}
                    value={sliderValues}
                    onChange={handleSliderChange}
                    marks={marks}
                    step={1}
                    tooltip={{
                      formatter: (val: any) => `1:${levelScaleMap[val].scale}`,
                      placement: 'bottom',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    height: 68,
                    justifyContent: 'space-between',
                    margin: '80px 60px 30px 60px',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <div>
                      <h4> 级别：{levelScaleMap[sliderValues[0]].level} </h4>
                      <h4>
                        比例：1:
                        <InputNumber
                          max={levelScaleMap[0].scale}
                          min={levelScaleMap[levelScaleMap.length - 1].scale}
                          value={showScales[0]}
                          controls={false}
                          onChange={(val) => handleInputChange(val, 0)}
                          style={{ width: 100, margin: '0 10px' }}
                        />
                        <Tooltip title="当前级别">
                          <AimOutlined
                            className={styles.setScaleIcon}
                            onClick={() => getCurrentMapScale(0)}
                          />
                        </Tooltip>
                        <Tooltip title="最大级别">
                          <FastBackwardOutlined
                            className={styles.setScaleIcon}
                            onClick={() => {
                              handleInputChange('--', 0);
                            }}
                          />
                        </Tooltip>
                      </h4>
                    </div>
                    <div style={{ marginLeft: 15 }}>
                      <img
                        src={levelScaleMap[sliderValues[0]].image}
                        alt="levelScale"
                      />
                    </div>
                  </div>
                  <Divider
                    type="vertical"
                    style={{ height: '100%', borderColor: 'var(--gabg3)' }}
                  />
                  <div style={{ display: 'flex' }}>
                    <div>
                      <h4>级别：{levelScaleMap[sliderValues[1]].level}</h4>
                      <h4>
                        比例：1:
                        <InputNumber
                          max={levelScaleMap[0].scale}
                          min={levelScaleMap[levelScaleMap.length - 1].scale}
                          value={showScales[1]}
                          controls={false}
                          onChange={(val) => handleInputChange(val, 1)}
                          style={{ width: 100, margin: '0 10px' }}
                        />
                        <Tooltip title="当前级别">
                          <AimOutlined
                            className={styles.setScaleIcon}
                            onClick={() => getCurrentMapScale(1)}
                          />
                        </Tooltip>
                        <Tooltip title="最小级别">
                          <FastForwardOutlined
                            className={styles.setScaleIcon}
                            onClick={() => {
                              handleInputChange('--', 1);
                            }}
                          />
                        </Tooltip>
                      </h4>
                    </div>
                    <div style={{ marginLeft: 15 }}>
                      <img
                        src={levelScaleMap[sliderValues[1]].image}
                        alt="levelScale"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  marginRight: 10,
                }}
              >
                <Button type="primary" onClick={onSave}>
                  保存
                </Button>
              </div>
            </Tabs.TabPane>
            {layer.fields && layer.fields.length > 0 ? (
              <Tabs.TabPane tab="图层过滤" key="3" style={{ height: '100%' }}>
                {filterExpression.map((condition, index) => (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    {index > 0 ? (
                      <Select
                        style={{ width: 80, marginRight: 8 }}
                        value={filterConnections[index - 1]}
                        onChange={(value) => {
                          updateFilterCondition(index, value, 3)
                        }}
                        options={[
                          { value: 'and', label: 'and' },
                          { value: 'or', label: 'or' }
                        ]}
                      />
                    ) : (
                      <span style={{ display: 'inline-block', width: 80, marginRight: 8, textAlign: 'right' }}>where</span>
                    )}
                    <Space>
                      <Select
                        style={{ width: 150 }}
                        placeholder="选择字段"
                        value={condition[0]}
                        showSearch  // 允许搜索，但不允许输入
                        optionFilterProp="label"  // 按 label 搜索
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => {
                          updateFilterCondition(index, value, 0);
                          setFieldValues([])
                          getFieldValues(value)
                        }}
                        options={
                          fields.map(field => ({
                            value: field.name,
                            label: field.name
                          }))
                        }
                      />

                      <Select
                        style={{ width: 110 }}
                        value={condition[1]}
                        onChange={(value) => {
                          // condition[2] = null;
                          updateFilterCondition(index, null, 2)
                          updateFilterCondition(index, value, 1)
                          // 清空右边 
                        }}
                        options={filterOperators.filter(operator => {
                          const selectedField = fields.find(f => f.name === condition[0]);
                          if (!selectedField) return true; // 如果没有选中字段，保留所有运算符
                          const operatorValue = operator.value;
                          // 根据字段类型过滤
                          if (selectedField.type === 'string') {
                            // 字符串类型：去除 >, >=, <, <=
                            return !['>', '>=', '<', '<='].includes(operatorValue);
                          } else if (selectedField.type === 'boolean') {
                            // 只保留等于
                            return [
                              { value: '=', label: '等于' }
                            ]
                          } else {
                            // 非字符串类型（如 number）：去除 LIKE, NOT LIKE
                            return !['like', 'not like'].includes(operatorValue);
                          }
                        })
                        }
                      />

                      {
                        !['is null', 'is not null'].includes(filterExpression[index][1]) && (
                          condition[1] === 'in' || condition[1] === 'not in' ? ( // 多选
                            <Select
                              mode="multiple"
                              style={{ width: 200 }}
                              placeholder="选择值"
                              notFoundContent={"搜索中..."}
                              value={condition[2] ? condition[2] : []}
                              // onFocus={() => {
                              //   // console.log("condition[2] ? condition[2] : []", condition[2] ? condition[2] : []);
                              //   getFieldValues(condition[0]);
                              // }}
                              onChange={(values) => {
                                updateFilterCondition(
                                  index,
                                  values,
                                  2
                                )
                              }}
                              options={fieldValues || []}
                            />
                          ) : ( // 单选
                            <AutoComplete
                              allowClear
                              style={{ width: 200 }}
                              placeholder="输入或选择值"
                              value={condition[2]}
                              onChange={(vals) => {
                                // console.log("输入的值为", vals);
                                updateFilterCondition(index, vals, 2);
                              }}
                              // onFocus={async () => {
                              //   await getFieldValues(condition[0]);
                              // }}
                              options={fieldValues || []}
                            />
                          )
                        )
                      }

                      {
                        filterExpression.length > 1 && (
                          <Button
                            icon={<CloseOutlined />}
                            onClick={() => {
                              removeFilterCondition(index)
                            }}
                          />
                        )
                      }
                    </Space>
                  </div>
                ))}
                <div style={{ padding: '16px' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addFilterCondition}
                    >
                      添加条件
                    </Button>
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={clearAllFilterCondition}
                    >
                      清空全部
                    </Button>
                  </div>
                  <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <Space>
                      <Button onClick={() => setVisible(false)}>取消</Button>
                      <Button type="primary" onClick={() => {
                        useFilter()
                        setVisible(false)
                      }}>应用</Button>
                    </Space>
                  </div>
                </div>
              </Tabs.TabPane>
            ) : null}


          </Tabs>
        </div>
      </div>
    </DragModal>
  );
};

const RefComponent = forwardRef(LayerAttribute);

export default RefComponent;