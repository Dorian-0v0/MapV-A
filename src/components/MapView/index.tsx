import React, { useEffect, useRef, useState } from 'react';
import Map from '@geoscene/core/Map';
import MapView from '@geoscene/core/views/MapView';
import Fullscreen from '@geoscene/core/widgets/Fullscreen'
import BasemapGallery from '@geoscene/core/widgets/BasemapGallery'
import Basemap from "@geoscene/core/Basemap";
import ScaleBar from '@geoscene/core/widgets/ScaleBar'
import { weatherService } from '@/api/MapServer'
import Home from "@geoscene/core/widgets/Home";
import useMapStore from '@/store/mapStore'
import { eventBus } from '@/utils/eventBus'
import Editor from '@geoscene/core/widgets/Editor'
import Sketch from '@geoscene/core/widgets/Sketch'
import "./index.less"
import BaseMapPanel from './BaseMapPanel';
import MapBottom from '../MapBottom';
import LayerFilter from '../LayerFilter';
import AddLayers from '../AddLayers';
import { message } from 'antd';
import Legend from "@geoscene/core/widgets/Legend.js";
import MeasurePanel from './MeasurePanel';
import GraphicsLayer from "@geoscene/core/layers/GraphicsLayer"
import Graphic from "@geoscene/core/Graphic"
interface MapViewProps {
    type?: string;
}

const MapViewComponent: React.FC<MapViewProps> = ({ type }) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const { map, updateViewState, updateMapState, wmtsLayer, view, updateMapViewState } = useMapStore();

    // 新增状态：追踪地图是否加载完成
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapViewInstance, setMapViewInstance] = useState<any>(null);


    useEffect(() => {
        console.log("layers  pp", map);
        if (!mapDivRef.current) return;



        // 初始化视图
        const mapView = new MapView({
            container: mapDivRef.current,
            map: map,
            ...view
        });

        mapView.ui.remove("attribution");

        mapView.when(() => {
            console.log("mapView ready", map);

            // 添加比例尺控件
            mapView.ui.add(new ScaleBar({
                view: mapView,
                unit: "dual",
                style: "line"
            }), {
                position: "bottom-left"
            });

            if (type === "work") {


                // 您原有的工作地图初始化逻辑...
                const homeWidget = new Home({ view: mapView });
                const basemapGallery = new BasemapGallery({
                    container: 'basemapGalleryContainer',
                    view: mapView,
                    // source: [Basemap.fromId("tianditu-vector"), Basemap.fromId("tianditu-image")]
                    source: wmtsLayer
                });
                // 底图控件
                mapView.ui.add(homeWidget, "top-left");



                // 添加图层
                eventBus.on('addLayerInWork', (layer: any) => {
                    mapView.whenLayerView(layer).then(layerView => {
                        layer.popupTemplate = {
                            highlightEable: true,
                            content: [{
                                type: "fields",
                                fieldInfos: (layer.fields || []).map(field => ({
                                    fieldName: field.name,
                                    label: field.name,
                                    visible: true
                                }))
                            }]
                        };
                        layer.legendVisible = false
                    }).catch(error => {
                        message.error(`无法展示弹框${error.message}`);
                    })
                });

                eventBus.on("map_zoomToExtent", (extent) => {
                    mapView.goTo(extent);
                })
                // 图层编辑
                eventBus.on('OpenLayerEdit', () => {
                    console.log("OpenLayerEdit");
                    const graphicsLayer = new GraphicsLayer({ title: "graphicsLayer" })

                    const coordArr = [
                        [103.164036, 33.087548],
                        [104.596743, 27.652101],
                        [116.0584, 33.087548],
                    ]

                    let pointsGraphic = []

                    coordArr.forEach((coord) => {
                        pointsGraphic.push(new Graphic({
                            geometry: {
                                type: "point",
                                longitude: coord[0],
                                latitude: coord[1]
                            },
                            symbol: {
                                type: "simple-marker",
                                style: "square",
                                color: "red",
                                size: "18px",
                                outline: {
                                    color: [255, 255, 0],
                                    width: 3
                                }
                            }
                        }))
                    })

                    graphicsLayer.addMany(pointsGraphic)

                    const sketch = new Sketch({
                        layer: graphicsLayer,
                        view: mapView,
                        // creationMode: "update", // 创建模式
                        defaultCreateOptions: {
                            mode: 'hybrid' // click(点击) | freehand(自由) | hybrid(混合)
                        },
                        visibleElements: {
                            // createTools: { // 创建工具
                            //   point: false, // 点
                            //   polyline: false, // 折线
                            //   polygon: true, // 多边形
                            //   rectangle: false, // 矩形
                            //   circle: false, // 圆形
                            // },
                            // selectionTools: { // 选择工具
                            //   "rectangle-selection": false, // 矩形框选
                            //   "lasso-selection": false, // 套索选择
                            // },
                            undoRedoMenu: true, // 重做按钮
                            settingsMenu: false, // 设置按钮
                        },
                    })

                    mapView.ui.add(sketch, "top-right")

                    // 创建事件
                    sketch.on("create", (event) => {
                        switch (event.state) { // start | active | complete | cancel
                            case "start":
                                console.log("创建开始")
                                break
                            case "active":
                                console.log("创建中...")
                                break
                            case "complete":
                                console.log("创建结束")
                                break
                            default:
                                console.log("创建取消")
                        }
                    })

                    // 重做事件
                    sketch.on("redo", (event) => {
                        if (event.type === "redo") {
                            console.log("redo")
                        }
                    })

                    // 撤消
                    sketch.on("undo", (event) => {
                        if (event.type === "undo") {
                            console.log("undo")
                        }
                    })

                    // 删除事件
                    sketch.on("delete", (event) => {
                        if (event.type === 'delete') {
                            console.log("删除结束")
                        }
                    })

                    // 更新事件
                    sketch.on("update", (event) => {
                        if (event.aborted) { // 取消操作，一般按下 ESC 触发触发
                            return
                        }
                        switch (event.state) { // start | active | complete
                            case "start":
                                console.log("更新开始")
                                break
                            case "active":
                                console.log("更新中...")
                                break
                            default:
                                console.log("更新结束")
                        }
                        switch (event.toolEventInfo && event.toolEventInfo.type) {
                            case "reshape-stop":
                                console.log("修改形状结束")
                                break
                            case "move-stop":
                                console.log("移动结束")
                                break
                            case "scale-stop":
                                console.log("缩放结束")
                                break
                            case "rotate-stop":
                                console.log("旋转结束")
                                break
                            case "vertex-add":
                                console.log("添加控制点")
                                break
                            case "vertex-remove": // 右键移除
                                console.log("移除控制点")
                                break
                        }
                    })

                })


                // 获取天气
                // 获取天气状况
                eventBus.on('getWeather', async () => {
                    console.log('getWeather')
                    if (!mapView) return "无信息";
                    const scale = mapView.scale;
                    if (scale < 160000) {
                        console.log('getWeatheewwewwwwr')
                        const res = await weatherService(`${mapView.center.latitude},${mapView.center.longitude}`);
                        console.log("天气查询结果：", res);

                        return res
                    } else {
                        return "无信息"
                    }
                });

            }

            // 标记地图已加载完成
            setIsMapReady(true);
            setMapViewInstance(mapView);
            updateMapViewState(mapView)
            updateMapState(map)

        });

        return () => {
            // 移除
            console.log("地图销毁", mapView);
            map.layers?._items.forEach((ly) => {
                console.log("移除所有测量", ly);
                if (ly.type == "graphics" || ly.title == null) {
                    map.remove(ly);
                }
            })
            const center = [mapView?.center.longitude, mapView?.center.latitude] as [number, number];
            const zoom = mapView?.zoom;
            updateViewState(center, zoom);
            eventBus.removeAllListeners();
            if (mapDivRef) {
                console.log("地图销毁");
            }

        };
    }, []);

    return (
        <div style={{
            height: 'calc(100vh - 35px)',
            width: '100%',
            position: 'relative',
        }}>
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
            <LayerFilter map={map}></LayerFilter>
            <AddLayers map={map}></AddLayers>
            <BaseMapPanel />
            <MeasurePanel></MeasurePanel>

            {/* 只在 mapView 加载完成后渲染 MapBottom */}

            {isMapReady && (
                <MapBottom
                    view={mapViewInstance}
                    baseMapName={map?.basemap?.title || '未知'}
                />
            )}

        </div>
    );
};

export default MapViewComponent;