import React, { useEffect, useRef, useState } from 'react';
import Map from '@geoscene/core/Map';
import MapView from '@geoscene/core/views/MapView';
import Fullscreen from '@geoscene/core/widgets/Fullscreen'
import BasemapGallery from '@geoscene/core/widgets/BasemapGallery'
import Basemap from "@geoscene/core/Basemap";
import ScaleBar from '@geoscene/core/widgets/ScaleBar'
import WebTileLayer from "@geoscene/core/layers/WebTileLayer";
import Home from "@geoscene/core/widgets/Home";
import useMapStore from '@/store/mapStore'
import eventBus from '@/utils/eventBus.js';
import Query from '@geoscene/core/rest/support/Query';
import "./index.less"
import BaseMapPanel from './BaseMapPanel';
import MapBottom from '../MapBottom';
import LayerFilter from '../LayerFilter';
interface MapViewProps {
    map: any;
    view?: any;
    layers?: any;
    type?: string;
}

const MapViewComponent: React.FC<MapViewProps> = ({ map, view = {}, layers, type }) => {
    const mapViewRef = useRef<any>(null);
    const mapDivRef = useRef<HTMLDivElement>(null);
    const { addLayerToMapAndStore, updateViewState, updateMapState, wmtsLayer } = useMapStore();

    // 新增状态：追踪地图是否加载完成
    const [isMapReady, setIsMapReady] = useState(false);
    const [mapViewInstance, setMapViewInstance] = useState<any>(null);
    const [webMapInstance, setWebMapInstance] = useState<any>(null);


    useEffect(() => {
        console.log("layers  pp", layers, map);
        if (!mapDivRef.current) return;

        // 初始化地图
        const webMap = new Map(map);


        // 初始化视图
        const mapView = new MapView({
            container: mapDivRef.current,
            map: webMap,
            ...view
        });

        mapViewRef.current = mapView;
        mapView.ui.remove("attribution");

        mapView.when(() => {
            console.log("mapView ready", webMap);

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

                webMap.addMany(layers);
                layers.forEach(ly => {
                    mapView.whenLayerView(ly).then(layerView => {
                        ly.popupTemplate = {
                            title: '{name}',
                            highlightEable: true,
                            content: [{
                                type: "fields",
                                fieldInfos: (ly.fields || []).map(field => ({
                                    fieldName: field.name,
                                    label: field.name,
                                    visible: true
                                }))
                            }]
                        };
                    });
                });

                mapView.ui.add(homeWidget, "top-left");

                eventBus.on('addLayerInWork', (layer: any) => {
                    webMap.add(layer);
                    mapView.whenLayerView(layer).then(layerView => {
                        layer.popupTemplate = {
                            title: "{name}",
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
                    });
                    addLayerToMapAndStore(layer);
                });
            }

            // 标记地图已加载完成
            setIsMapReady(true);
            setMapViewInstance(mapView);
            setWebMapInstance(webMap);
        });

        return () => {
            if (mapViewRef.current) {
                const center = [mapViewRef.current.center.longitude, mapViewRef.current.center.latitude] as [number, number];
                const zoom = mapViewRef.current.zoom;

                updateViewState(center, zoom);
                updateMapState(webMap.basemap);

                mapViewRef.current.container = null;
                mapViewRef.current = null;
            }
            eventBus.removeAllListeners();
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
            <LayerFilter map={webMapInstance}></LayerFilter>

            <BaseMapPanel />

            {/* 只在 mapView 加载完成后渲染 MapBottom */}

            {isMapReady && (
                <MapBottom
                    view={mapViewInstance}
                    baseMapName={webMapInstance?.basemap?.title || '未知'}
                />
            )}

        </div>
    );
};

export default MapViewComponent;