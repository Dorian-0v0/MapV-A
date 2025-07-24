import MapController from "@/components/MapController"
import MapView from "@/components/MapView"

import { Layout } from "antd"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
const MapWork = () => {
    const layers = [
            new GeoJSONLayer({
                url: 'https://geo.datav.aliyun.com/areas_v3/bound/360900_full.json',
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'simple-fill',
                        color: [227, 139, 79, 0.5],
                        outline: { color: [255, 255, 255], width: 1 }
                    }
                }
            }),
            new GeoJSONLayer({
                url: 'https://geo.datav.aliyun.com/areas_v3/bound/360700_full.json',
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'simple-fill',
                        color: [79, 129, 189, 0.5],
                        outline: { color: [255, 255, 255], width: 1 }
                    }
                }
            })
        ]
    const [collapsed, setCollapsed] = useState(false)
    const map = {
        basemap: 'tianditu-vector',
    };

    const view = {
        center: [116.805, 28.027], // 经度, 纬度
        zoom: 5
    };

    return (
        <>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <MapController />
            </Sider>
            <Layout>
                <MapView map={map} view={view} layers = {layers}></MapView>
            </Layout>
        </>
    );
}

export default MapWork

