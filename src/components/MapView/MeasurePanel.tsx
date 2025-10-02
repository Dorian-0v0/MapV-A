
import { Button, Card, Tabs } from 'antd';
import { CloseOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { eventBus } from '@/utils/eventBus'
import { useEffect, useRef, useState } from 'react';
import AreaMeasurement2D from '@geoscene/core/widgets/AreaMeasurement2D';
import DistanceMeasurement2D from '@geoscene/core/widgets/DistanceMeasurement2D';
import Measurement from '@geoscene/core/widgets/Measurement';
import useMapStore, { useMap } from '@/store/mapStore';
const MeasurePanel = () => {
    const [isBaseMapVisible, setIsBaseMapVisible] = useState(false);
    // const { mapView, map } = useMapStore();
    const { mapView, map } = useMap();
    const [activeKey, setActiveKey] = useState('1');

    const [areaMeasurement, setAreaMeasurement] = useState<any>(null);
    const [distanceMeasurement, setDistanceMeasurement] = useState<any>(null);




    useEffect(() => {
        const handler = () => {
            console.log("打开面积测量???????????????????");
            setIsBaseMapVisible(!isBaseMapVisible);
        };
        eventBus.on('open-measure-area', handler);
        eventBus.on('close-measure-area', () => {
            setDistanceMeasurement(prev => {
                prev?.clear();
            });
            setAreaMeasurement(prev => {
                prev?.clear();
            });

        });

    }, [isBaseMapVisible]); // 注意依赖项


    useEffect(() => {
        if (isBaseMapVisible && mapView) {
            mapView.when(() => {
                console.log('MapView is ready  000000000000000000000000', activeKey);
                // 只在对应标签激活时初始化测量控件
                if (activeKey === '1' && !areaMeasurement) {
                    const measure1 = new Measurement({
                        view: mapView,
                        container: 'areaMeasurementContainer',
                        activeTool: "area"
                    });
  
                    // measure1.clear()
                    setAreaMeasurement(measure1);
                }

                if (activeKey === '2' && !distanceMeasurement) {
                    const measure2 = new Measurement({
                        view: mapView,
                        container: 'distanceMeasurementContainer',
                        activeTool: "distance"
                    });
   
                    // measure2.clear()
                    setDistanceMeasurement(measure2);
                }
            });
        } else {
            // 清理逻辑
            setDistanceMeasurement(prev => {
                prev?.clear();
                return null;
            });
            setAreaMeasurement(prev => {
                prev?.clear();
                return null;
            });
        }
        return (() => {
            // setIsBaseMapVisible(false);
            if (isBaseMapVisible) return;
            setDistanceMeasurement(prev => {
                prev?.clear();
                return null;
            });
            setAreaMeasurement(prev => {
                prev?.clear();
                return null;
            });
            setActiveKey('1');

        })
    }, [isBaseMapVisible, activeKey, areaMeasurement, distanceMeasurement]); // 添加activeKey到依赖项



    return (!isBaseMapVisible ? null : (
        <Card
            id="MeasureTable"
            title="测量"
            size="small"
            extra={
                <Button
                    onClick={() => {
                        setIsBaseMapVisible(false);
                    }} // 通过 props 接收关闭逻辑
                    icon={<CloseOutlined />}
                    type="text"
                />
            }
            style={{
                width: 300,
                padding: 0,
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#ffffffff',
                // zIndex: 1000,
            }}
        >
            <Tabs defaultActiveKey="1" onChange={setActiveKey}>
                <Tabs.TabPane tab="面积测量" key="1">
                    <div id="areaMeasurementContainer">
                    </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="距离测量" key="2">
                    <div id="distanceMeasurementContainer">
                    </div>
                </Tabs.TabPane>
            </Tabs>
        </Card>
    ));
};

export default MeasurePanel;