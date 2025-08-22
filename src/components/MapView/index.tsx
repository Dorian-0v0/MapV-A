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
import Query from '@geoscene/core/rest/support/Query';
import "./index.less"
import BaseMapPanel from './BaseMapPanel';
import MapBottom from '../MapBottom';
import LayerFilter from '../LayerFilter';
import AddLayers from '../AddLayers';
import { message } from 'antd';
interface MapViewProps {
    type?: string;
}

const MapViewComponent: React.FC<MapViewProps> = ({ type }) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const { map, updateViewState, updateMapState, wmtsLayer, view } = useMapStore();

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

                // 加载所有图层
                // map.addMany(layers);
                // layers.forEach(ly => {
                //     mapView.whenLayerView(ly).then(layerView => {
                //         ly.popupTemplate = {
                //             title: '{name}',
                //             highlightEable: true,
                //             content: [{
                //                 type: "fields",
                //                 fieldInfos: (ly.fields || []).map(field => ({
                //                     fieldName: field.name,
                //                     label: field.name,
                //                     visible: true
                //                 }))
                //             }]
                //         };
                //     });
                // });



                // 添加图层
                eventBus.on('addLayerInWork', (layer: any) => {
                    console.log("                    message.success('添加成功')");

                    map.add(layer);
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
                        eventBus.emit('set-button-loading')

                    })
       
                });


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
            updateMapState(map)
        });

        return () => {
            console.log("地图销毁", mapView);

            const center = [mapView?.center.longitude, mapView?.center.latitude] as [number, number];
            const zoom = mapView?.zoom;
            updateViewState(center, zoom);
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