import { useEffect, useState } from 'react';
import { eventBus } from '@/utils/eventBus'
import './index.less'
import LayerList from './LayerList';
import { RadarChartOutlined, SlidersOutlined } from '@ant-design/icons';
import useMapStore from '@/store/mapStore';
import Sketch from '@geoscene/core/widgets/Sketch';
import GraphicsLayer from '@geoscene/core/layers/GraphicsLayer';

const MapController = ({ isChanged }) => {
    const [isBaseMapVisible, setisBaseMapVisible] = useState(false);
    const { map, mapView } = useMapStore();



    useEffect(() => {
        const handleCloseBaseMap = () => {
            setisBaseMapVisible(false);
            console.log("关闭basemaptable成功", isBaseMapVisible);
        };

        eventBus.on('closeBaseMapTable', handleCloseBaseMap);

        return () => {
            console.log("组件卸载，执行清理");
            setisBaseMapVisible(false);
            eventBus.emit('close-measure-area')
        };
    }, []); // 空依赖数组表示只在挂载/卸载时执行




    // 事件总线汇总
    const eventBusFun = (fun: string) => {
        switch (fun) {
            //       eventBus.emit('open-layer-add')   eventBus.emit('getWeather')  
            case 'open-layer-add':
                eventBus.emit('open-layer-add')
                break;
            case 'getWeather':
                eventBus.emit('getWeather')
                break;
            case 'addLayerInWork':
                // eventBus.emit('addLayerInWork', new FeatureLayer({ url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/%E5%85%AB%E5%8D%81%E5%A4%A9%E7%8E%AF%E6%B8%B8%E5%9C%B0%E7%90%83%E2%80%94%E2%80%94%E8%88%AA%E7%BA%BF/FeatureServer' }))

                break;
            case "open-measure-area":
                eventBus.emit('open-measure-area', true)
                break
            case 'open-layer-filter':
                eventBus.emit('open-layer-filter')
                break
            case "openGeoAi":
                eventBus.emit('openGeoAi')
                break
            case "OpenLayerEdit":
                eventBus.emit('OpenLayerEdit')
                break
        }
    }


    return (
        <>
            <div className={`map-controller-button ${isChanged ? 'collapsed' : ''}`}>
                <button
                    className='geoscene-icon-collection'
                    onClick={() => {
                        console.log('点击添加图层');
                        eventBusFun('open-layer-add')

                    }}
                    title="添加图层">
                </button>

                <button
                    className='geoscene-icon-maps'
                    onClick={() => {
                        console.log('点击前isBaseMapVisible', isBaseMapVisible);
                        const table = document.getElementById('baseMapTable');
                        if (table) {
                            table.style.display = isBaseMapVisible ? 'none' : 'block';
                        }
                        setisBaseMapVisible(!isBaseMapVisible);
                    }}
                    title="设置底图">
                </button>

                <button
                    onClick={() => {
                        let sketch = mapView.ui.find("sketchId");
                        console.log("已移除 sketch 控件", sketch);
                        if (sketch) {
                            mapView.ui.remove(sketch);
                            map.layers?._items.forEach((ly) => {
                                console.log("移除所有测量", ly);
                                if (ly.type == "graphics" || ly.title == null || ly.title == "graphicsLayer") {
                                    map.remove(ly);
                                }
                            })
                            return
                        }
                        console.log("OpenLayerEdit");
                        const graphicsLayer = new GraphicsLayer({
                            title: "graphicsLayer",
                        })
                        mapView.map.add(graphicsLayer);

                        sketch = new Sketch({
                            layer: graphicsLayer,
                            view: mapView,
                            id: "sketchId", // 在创建时指定 id，方便后续查找
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
                        // 创建事件
                        sketch.on("create", (event) => {
                            console.log("create", event);
                            const graphic = event.graphic;
                            switch (event.state) { // start | active | complete | cancel
                                case "start":
                                    console.log("创建开始")
                                    break
                                case "active":
                                    console.log("创建中...")
                                    break
                                case "complete":
                                    console.log("创建结束")
                                    if (event.state === "complete") {

                                        // 根据几何类型设置不同样式
                                        switch (graphic.geometry.type) {
                                            case "point":
                                                graphic.symbol = {
                                                    type: "simple-marker",
                                                    style: "circle",
                                                    color: [231, 64, 50],
                                                    size: "8px",
                                                    outline: {
                                                        color: [255, 255, 255],
                                                        width: 1
                                                    }
                                                };
                                                break;
                                            case "polyline":
                                                graphic.symbol = {
                                                    type: "simple-line",
                                                    color: "dodgerblue",
                                                    width: 2.5,
                                                    style: "solid"
                                                };
                                                break;
                                            case "polygon":
                                                graphic.symbol = {
                                                    type: "simple-fill",
                                                    color: [255, 210, 82, 0.5],
                                                    style: "solid",
                                                    outline: {
                                                        color: "dodgerblue",
                                                        width: 2.5,
                                                    }
                                                };
                                                break;
                                        }
                                    }
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

                        mapView.ui.add(sketch, "top-right")


                    }}
                    className='geoscene-icon-cursor-marquee'
                    title="图形绘制与编辑">
                </button>

                <button
                    onClick={() => {
                        eventBusFun('open-layer-filter');
                    }}
                    className='geoscene-icon-filter'
                    title="过滤查询">
                </button>

                <button
                    className='geoscene-icon-printer'
                    title="出图">
                </button>

                <button
                    className='geoscene-icon-measure-area'
                    onClick={() => {
                        eventBusFun('open-measure-area')
                    }}
                    title="测量">
                </button>

                <button title="空间分析工具" // 使用图标组件
                    onClick={() => {
                        eventBusFun('getWeather')
                    }}>
                    <RadarChartOutlined style={{ fontSize: '19px' }} />
                </button>
                <button className='geoscene-icon-chat' title="GeoAI交互式工具"
                    onClick={() => {
                        eventBusFun('openGeoAi')
                    }}
                >

                </button>
            </div >
            {isChanged || <LayerList></LayerList>}
        </>
    );
};

export default MapController;