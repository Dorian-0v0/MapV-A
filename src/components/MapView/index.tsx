import React, { useEffect, useRef } from 'react';
import Map from '@geoscene/core/Map';
import MapView from '@geoscene/core/views/MapView';
import Fullscreen from '@geoscene/core/widgets/Fullscreen'
import BasemapGallery from '@geoscene/core/widgets/BasemapGallery'
import Basemap from "@geoscene/core/Basemap";
import Expand from '@geoscene/core/widgets/Expand'
import WebTileLayer from "@geoscene/core/layers/WebTileLayer";
import Home from "@geoscene/core/widgets/Home";

interface MapViewProps {
    map: any;
    view?: any;
    layers?: any;
}

const MapViewComponent: React.FC<MapViewProps> = ({ map, view = {}, layers }) => {
    const mapViewRef = useRef<any>(null);
    const mapDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
        // 全屏控件
        const fullscreen = new Fullscreen({
            view: mapView
        })
        const homeWidget = new Home({
            view: mapView
        });

        // adds the home widget to the top left corner of the MapView


        // 两个天地图底图
        const tiandituVector = Basemap.fromId("tianditu-vector");
        tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png"; // 设置缩略图

        // 定义天地图影像底图
        const tiandituImage = Basemap.fromId("tianditu-image");
        tiandituImage.thumbnailUrl = "./public/images/天地图影像.png"; // 设置缩略图
        // 底图列表控件
        const basemapGallery = new BasemapGallery({
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
        const bgExpand = new Expand({
            view: mapView,
            content: basemapGallery,
            expandIcon: "basemap", // 图标
            expandTooltip: "切换底图", // 鼠标悬停提示,
            autoCollapse: true,

        });


        mapView.ui.remove("attribution")


        mapView.when(() => {
            // 添加图层列表控件

            // 添加图层
            mapView.map.addMany(layers)
            mapView.ui.add(fullscreen, "top-right")
            mapView.ui.add(bgExpand, "top-right")
            mapView.ui.add(homeWidget, "top-left")
        })


        // 清理函数
        return () => {
            if (mapViewRef.current) {
                mapViewRef.current.destroy();
                mapViewRef.current = null;
            }
        };
    }, [map, view]); // 监听 map 和 view 的变化

    return (<div style={{
        height: 'calc(100vh - 35px)',
        width: '100%',
        position: 'relative',  // 容器需要是相对定位
        bottom: '0',
    }}>
        <div
            ref={mapDivRef} // 使用ref而不是id
            style={{
                position: 'relative',
                height: '100%',
                width: '100%',
                padding: '0',
                margin: '0',
            }}
        />
    </div>
    )
};

export default MapViewComponent;