import React, { useEffect, useRef } from 'react';
import Map from '@geoscene/core/Map';
import MapView from '@geoscene/core/views/MapView';
import Fullscreen from '@geoscene/core/widgets/Fullscreen'
import Home from '@geoscene/core/widgets/Home'
interface MapViewProps {
    map: any;
    view?: any;
}

const MapViewComponent: React.FC<MapViewProps> = ({ map, view = {} }) => {
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
        const fullscreen = new Fullscreen({
            view: view
        })
        mapView.ui.add(fullscreen, "top-right")

        mapView.ui.remove("attribution")

        // 清理函数
        return () => {
            if (mapViewRef.current) {
                mapViewRef.current.destroy();
                mapViewRef.current = null;
            }
        };
    }, [map, view]);

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