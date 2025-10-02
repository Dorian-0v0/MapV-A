import Basemap from '@geoscene/core/Basemap';
import WebTileLayer from '@geoscene/core/layers/WebTileLayer';
import VectorTileLayer from '@geoscene/core/layers/VectorTileLayer';
import { create } from 'zustand';
import Map from '@geoscene/core/Map'

const tiandituVector = Basemap.fromId("tianditu-vector");
tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png"; // 设置缩略图

// 定义天地图影像底图
const tiandituImage = Basemap.fromId("tianditu-image");
tiandituImage.thumbnailUrl = "./public/images/天地图影像.png"; // 设置缩略图
const wmtsLayer = [
  tiandituVector,
  {
    id: "Arcgis-World-Imagery",
    title: "ArcGIS-影像底图",
    thumbnailUrl: "./public/images/ArcGIS-影像.png",
    baseLayers: [
      new WebTileLayer({
        urlTemplate: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
        // urlTemplate: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
        // subDomains: ["a", "b", "c"]
      })
    ]
  },
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
        subDomains: ["0", "1", "2", "3", "4"],
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
  map: new Map({
    basemap: wmtsLayer[1],
  }),
  mapView : null,
  view: {
    center: [116.805, 34.567], // 经度, 纬度
    zoom: 4,
  },


  updateViewState: (center: [number, number], zoom: number) => {
    set({
      view: {
        center,
        zoom,
      },
    });
  },

  updateMapViewState: (newmapView: any) => set({ mapView: newmapView }),

  updateMapState: (newmap: any) => set({ map: newmap }),

}));

export default useMapStore;