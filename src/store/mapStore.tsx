// mapContext.js
import React, { createContext, useContext, useReducer } from 'react';
import Basemap from '@geoscene/core/Basemap';
import WebTileLayer from '@geoscene/core/layers/WebTileLayer';
import Map from '@geoscene/core/Map';

// 初始化天地图
const tiandituVector = Basemap.fromId("tianditu-vector");
tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png";

const tiandituImage = Basemap.fromId("tianditu-image");
tiandituImage.thumbnailUrl = "./public/images/天地图影像.png";

const wmtsLayer = [
  tiandituVector,
  {
    id: "Arcgis-World-Imagery",
    title: "ArcGIS-影像底图",
    thumbnailUrl: "./public/images/ArcGIS-影像.png",
    baseLayers: [
      new WebTileLayer({
        urlTemplate: "https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
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
];

// 初始状态
const initialState = {
  wmtsLayer,
  map: new Map({
    basemap: wmtsLayer[1],
  }),
  mapView: null,
  view: {
    center: [116.805, 34.567],
    zoom: 4,
  },
};

// 创建 Context
const MapContext = createContext();

// Action Types
const ACTION_TYPES = {
  UPDATE_VIEW_STATE: 'UPDATE_VIEW_STATE',
  UPDATE_MAP_VIEW_STATE: 'UPDATE_MAP_VIEW_STATE',
  UPDATE_MAP_STATE: 'UPDATE_MAP_STATE',
  CHANGE_BASEMAP: 'CHANGE_BASEMAP',
};

// Reducer 函数
const mapReducer = (state, action) => {
  console.log("mapReducer", action.type);
  switch (action.type) {
    case ACTION_TYPES.UPDATE_VIEW_STATE:
      return {
        ...state,
        view: {
          center: action.payload.center,
          zoom: action.payload.zoom,
        },
      };
    
    case ACTION_TYPES.UPDATE_MAP_VIEW_STATE:
      return {
        ...state,
        mapView: action.payload,
      };
    
    case ACTION_TYPES.UPDATE_MAP_STATE:
      return {
        ...state,
        map: action.payload,
      };
    
    case ACTION_TYPES.CHANGE_BASEMAP:
      return {
        ...state,
        map: new Map({
          basemap: action.payload,
        }),
      };
    
    default:
      return state;
  }
};

// Provider 组件
export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // Actions
  const updateViewState = (center, zoom) => {
    
    console.log("updateViewState", center, zoom);
    dispatch({
      type: ACTION_TYPES.UPDATE_VIEW_STATE,
      payload: { center, zoom }
    });
  };

  const updateMapViewState = (newMapView) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_MAP_VIEW_STATE,
      payload: newMapView
    });
  };

  const updateMapState = (newMap) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_MAP_STATE,
      payload: newMap
    });
  };

  const changeBasemap = (basemapId) => {
    const basemap = state.wmtsLayer.find(layer => layer.id === basemapId);
    if (basemap) {
      dispatch({
        type: ACTION_TYPES.CHANGE_BASEMAP,
        payload: basemap
      });
    }
  };

  const value = {
    ...state,
    updateViewState,
    updateMapViewState,
    updateMapState,
    changeBasemap,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

// 自定义 Hook
export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export default MapContext;