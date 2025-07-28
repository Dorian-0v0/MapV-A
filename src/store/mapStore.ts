import Basemap from '@geoscene/core/Basemap';
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
import WebTileLayer from '@geoscene/core/layers/WebTileLayer';
import { create } from 'zustand';

interface MapState {
  basemap: any;
}

interface ViewState {
  center: [number, number];
  zoom: number;
}

interface StoreState {
  map: any;
  view: any;
  layers: any[];
  addLayer: (layer: any) => void;
  updateViewState: (center: [number, number], zoom: number) => void;
  updateMapState: (map: any) => void;
}
const tiandituVector = Basemap.fromId("tianditu-vector");
tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png"; // 设置缩略图

// 定义天地图影像底图
const tiandituImage = Basemap.fromId("tianditu-image");
tiandituImage.thumbnailUrl = "./public/images/天地图影像.png"; // 设置缩略图
const wmtsLayer = [
  tiandituVector, tiandituImage,
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
]
const useMapStore = create((set) => ({
  wmtsLayer,
  map: {
    basemap: wmtsLayer[1],
  },
  view: {
    center: [116.805, 28.027], // 经度, 纬度
    zoom: 4,
  },
  layers: [
    new GeoJSONLayer({
      url: 'https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json',
      popupEnabled: true,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: '#13448280',
          outline: {
            color: '#ff8080',
            width: 2,
          },
        },
      },
    }),
    new GeoJSONLayer({
      url: './public/矿产.geojson',
      popupEnabled: true,
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-marker',
           size: 10,
          color: '#007eff',  
          outline: null
        }
      }
    })
  ],



  addLayerToMapAndStore: (layer: any) => {
    set((state) => {
      //更新状态
      return {
        layers: [...state.layers, layer],
      };
    });
  },


  updateViewState: (center: [number, number], zoom: number) => {
    set({
      view: {
        center,
        zoom,
      },
    });
  },

  updateMapState: (basemap: any) => {
    set({
      map: {
        basemap,
      }
    });
  },

}));

export default useMapStore;