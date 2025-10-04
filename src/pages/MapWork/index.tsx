import MapController from "@/components/MapController"
import MapViewCom from "@/components/MapView"
import { Layout } from "antd"
import Sider from "antd/es/layout/Sider"
import { useEffect, useState } from "react"
import { eventBus } from "@/utils/eventBus"
import AiChat from "@/components/AiChat"
import DraggableModal from "@/ui/AntdDraggableModal"

const MapWork = () => {
    const [isAIModalVisible, setAIModalVisible] = useState(false); // AI对话框可见状态
    const [collapsed, setCollapsed] = useState(false)
    const [isLayerEditVisible, setLayerEditVisible] = useState(false)
    // const { map, mapView } = useMapStore();
   
    useEffect(() => {
        eventBus.on('openGeoAi', () => {
            setAIModalVisible(true);
        });
  
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
                    <MapController
                        isChanged={collapsed}
                        isLayerEditVisible={isLayerEditVisible}
                        setLayerEditVisible={setLayerEditVisible}
                    />
                </Sider>
                <Layout>
                    {/* {isLayerEditVisible ?   */}
                    <DraggableModal
                        title="图层编辑"
                        visible={isLayerEditVisible}
                        onClose={() => setLayerEditVisible(false)}
                    >
                    </DraggableModal>
                    <MapViewCom type={"work"}></MapViewCom>
                </Layout>
                <AiChat
                    isAIModalVisible={isAIModalVisible}
                    setAIModalVisible={setAIModalVisible}
                ></AiChat>
       
        </>
    );
}

export default MapWork

