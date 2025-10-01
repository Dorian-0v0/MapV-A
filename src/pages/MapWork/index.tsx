import MapController from "@/components/MapController"
import MapViewCom from "@/components/MapView"

import { Layout } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react"
import { eventBus } from "@/utils/eventBus"
const MapWork = () => {
  
    const [collapsed, setCollapsed] = useState(false)
    // const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        return () => {
             eventBus.removeAllListeners();
        }
    }, [])
    

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
                <MapViewCom type={"work"}></MapViewCom>
            </Layout>
        </>
    );
}

export default MapWork

