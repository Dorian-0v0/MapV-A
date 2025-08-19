import MapController from "@/components/MapController"
import MapViewCom from "@/components/MapView"

import { Layout } from "antd"
import Sider from "antd/es/layout/Sider"
import { useState } from "react"
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
import useMapStore from "@/store/mapStore"
const MapWork = () => {
    const { map, view, layers} = useMapStore()
  
    const [collapsed, setCollapsed] = useState(false)
    // const [isChanged, setIsChanged] = useState(false)

    

    return (
        <>
            <Sider 
            collapsible 
            collapsed={collapsed} 
            width={200}
            collapsedWidth={50}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
            >
                <MapController isChanged={collapsed} />
            </Sider>
            <Layout>
                <MapViewCom map={map} view={view} layers = {layers} type = {"work"}></MapViewCom>
            </Layout>
        </>
    );
}

export default MapWork

