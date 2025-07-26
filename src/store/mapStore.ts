    // src/store/mapStore.ts
    import Basemap from '@geoscene/core/Basemap';
    import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
    import WebTileLayer from '@geoscene/core/layers/WebTileLayer';
    import { proxy } from 'valtio';
    
    const tiandituVector = Basemap.fromId("tianditu-vector");
    tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png";
    
    const tiandituImage = Basemap.fromId("tianditu-image");
    tiandituImage.thumbnailUrl = "./public/images/天地图影像.png";
    
    // 提前定义 WMTSLayers 和 layers，避免在 proxy 中使用 this
    const WMTSLayers = [
      tiandituImage,
      tiandituVector,
      {
        baseLayers: [
          new WebTileLayer({
            urlTemplate: "https://webst0{subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
            subDomains: ["0", "1", "2", "3", "4"]
          })
        ],
        title: "高德矢量底图(火星坐标系)",
        id: "gaode-ve-basemap",
        thumbnailUrl: "./public/images/高德地图矢量.png"
      },
      {
        baseLayers: [
          new WebTileLayer({
            urlTemplate: "https://webst0{subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}",
            subDomains: ["0", "1", "2", "3", "4"]
          })
        ],
        title: "高德影像底图(火星坐标系)",
        id: "gaode-im-basemap",
        thumbnailUrl: "./public/images/高德地图影像.png"
      },
      {
        baseLayers: [],
        title: "空白底图",
        id: "empty-basemap",
      }
    ];
    
    const layers = [
      new GeoJSONLayer({
        url: 'https://geo.datav.aliyun.com/areas_v3/bound/360900_full.json',
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [227, 139, 79, 0.5],
            outline: { color: [255, 255, 255], width: 1 }
          }
        }
      }),
      new GeoJSONLayer({
        url: 'https://geo.datav.aliyun.com/areas_v3/bound/360700_full.json',
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [79, 129, 189, 0.5],
            outline: { color: [255, 255, 255], width: 1 }
          }
        }
      })
    ];
    
    export const mapStore = proxy({
      WMTSLayers,
      layers,
      initView: {
        center: [116.805, 28.027],
        zoom: 4
      },
      initMap: {
        baseMap: WMTSLayers[3] // 直接使用变量，避免 this
      }
    });