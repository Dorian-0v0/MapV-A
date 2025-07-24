import MapController from "@/components/MapController"
import MapView from "@/components/MapView"

import { Layout } from "antd"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"

const MapWork = () => {
    const [collapsed, setCollapsed] = useState(false)
    const map = {
        basemap: 'tianditu-vector'
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
                <MapView map={map} view={view}></MapView>
            </Layout>
        </>
    );
}

export default MapWork

