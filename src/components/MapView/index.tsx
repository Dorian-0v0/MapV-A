import React, { useEffect, useRef } from 'react';
import Map from '@geoscene/core/Map';
import MapView from '@geoscene/core/views/MapView';
import Fullscreen from '@geoscene/core/widgets/Fullscreen'
import BasemapGallery from '@geoscene/core/widgets/BasemapGallery'
import Basemap from "@geoscene/core/Basemap";
import Expand from '@geoscene/core/widgets/Expand'
import WebTileLayer from "@geoscene/core/layers/WebTileLayer";
import Home from "@geoscene/core/widgets/Home";
import useMapStore from '@/store/mapStore'
import eventBus from '@/utils/eventBus.js';
import Query from '@geoscene/core/rest/support/Query';
import "./index.less"
import BaseMapPanel from './BaseMapPanel';
interface MapViewProps {
    map: any;
    view?: any;
    layers?: any;
    type?: string;
}

const MapViewComponent: React.FC<MapViewProps> = ({ map, view = {}, layers, type }) => {
    const mapViewRef = useRef<any>(null);
    const mapDivRef = useRef<HTMLDivElement>(null);
    const { addLayerToMapAndStore, updateViewState, updateMapState } = useMapStore()

    let webMap: any = null;
    useEffect(() => {
        if (!mapDivRef.current) return;

        // 初始化地图
        webMap = new Map(map);

        // 初始化视图
        const mapView = new MapView({
            container: mapDivRef.current,
            map: webMap,
            ...view
        });

        mapViewRef.current = mapView;

        mapView.ui.remove("attribution")

        mapView.when(() => {
            console.log("mapView ready", webMap);

            if (type === "work") {
                const homeWidget = new Home({
                    view: mapView
                });

                // 两个天地图底图
                const tiandituVector = Basemap.fromId("tianditu-vector");
                tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png"; // 设置缩略图

                // 定义天地图影像底图
                const tiandituImage = Basemap.fromId("tianditu-image");
                tiandituImage.thumbnailUrl = "./public/images/天地图影像.png"; // 设置缩略图
                // 底图列表控件
                const basemapGallery = new BasemapGallery({
                    container: 'basemapGalleryContainer',
                    view: mapView,
                    // source: [Basemap.fromId("tianditu-vector"), Basemap.fromId("tianditu-image")]
                    source: [
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
                });
                // 底图控件

                webMap.addMany(layers)
                layers.forEach(ly => {
                    mapView.whenLayerView(ly).then(layerView => {
                        console.log("图层加载成功   ppppp", layerView);

                        ly.popupTemplate = {
                            title: '{name}',
                            highlightEable: true,
                            content: [{
                                type: "fields",
                                fieldInfos: (ly.fields || []).map(field => {
                                    return {
                                        fieldName: field.name,
                                        label: field.name,
                                        visible: true
                                    };
                                })
                            }]
                        }
                    });
                });



                mapView.ui.add(homeWidget, "top-left")



                // 注册事件总线要调用的函数
                eventBus.on('addLayerInWork', (layer: any) => {
                    webMap.add(layer)
                    mapView.whenLayerView(layer).then(layerView => {
                        console.log("图层加载成功   ppppp", layerView);

                        layer.popupTemplate = {
                            title: "{name}",
                            highlightEable: true,
                            content: [{
                                type: "fields",
                                fieldInfos: (layer.fields || []).map(field => {
                                    return {
                                        fieldName: field.name,
                                        label: field.name,
                                        visible: true
                                    };
                                })
                            }]
                        }
                    });
                    addLayerToMapAndStore(layer)
                    console.log("图层添加成功", layer, layers);
                });
            }
        })


        // 清理函数
        return () => {
            if (mapViewRef.current) {
                console.log("销毁地图");

                // Get current view state before destroying
                const center = [mapViewRef.current.center.longitude, mapViewRef.current.center.latitude] as [number, number];
                const zoom = mapViewRef.current.zoom;

                // Update store with current state
                updateViewState(center, zoom);
                updateMapState(webMap.basemap);

                // 解除 DOM 引用，但不销毁实例（允许 GC 回收）
                mapViewRef.current.container = null;
                mapViewRef.current = null;
            }
            eventBus.removeAllListeners();
        };
    }, []);

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

    const QueryBySql2 = () => {
        layers[1].definitionExpression = "规模 = '大型'";
    };

    const QueryBySql3 = () => {
        layers[1].definitionExpression = "规模 = '中型'";
    };
    return (
        <div style={{
            height: 'calc(100vh - 35px)',
            width: '100%',
            position: 'relative',  // 父容器需要是相对定位
        }}>
            {/* 地图容器 */}
            <div
                ref={mapDivRef}
                style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    padding: '0',
                    margin: '0',
                }}
            />

            {/* 覆盖在地图上的控制容器 */}

            <BaseMapPanel></BaseMapPanel>
            <button onClick={QueryBySql1}>查询1</button>
            <button onClick={QueryBySql2}>查询2</button>
            <button onClick={QueryBySql3}>查询3</button>
        </div >

    )
};

export default MapViewComponent;