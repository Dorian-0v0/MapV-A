import useMapStore from '@/store/mapStore';
import React, { useEffect, useState } from 'react';
import { List, Switch, Button, Card, Collapse } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Legend from '@geoscene/core/widgets/Legend';
import {eventBus} from '@/utils/eventBus'

const { Panel } = Collapse;

interface LayerInfo {
    id: string;
    title: string;
    layer: any;
    visible: boolean;
    legendVisible: boolean;
}

export default function LayerList() {
    const { map } = useMapStore();
    const [layers, setLayers] = useState<LayerInfo[]>([]);
    const [activeKey, setActiveKey] = useState<string | string[]>([]);
    const [layersChange, setLayersChange] = useState(false);
    useEffect(() => {
        eventBus.on('set-button-loading', () => {
            setLayersChange(true);
        })
        return () => {
            eventBus.removeAllListeners();
        }

    }, []);

    // 初始化获取所有图层
    useEffect(() => {
        if (!map) return;
        const allLayers = map.layers?.items
        setLayers(allLayers);
        console.log('ma||||||||||||||||\\p', map);

    }, [map.layers.length]);

    // 切换图层可见性
    const toggleLayerVisibility = (layerId: string, visible: boolean) => {
        const layer = map?.findLayerById(layerId);
        if (layer) {
            layer.visible = visible;
            setLayers(prev => prev.map(l =>
                l.id === layerId ? { ...l, visible } : l
            ));
        }
    };

    // 切换图例可见性
    const toggleLegendVisibility = (layerId: string) => {
        setLayers(prev => prev.map(l => {
            if (l.id === layerId) {
                return { ...l, legendVisible: !l.legendVisible };
            }
            return l;
        }));

        // 更新折叠面板状态
        if (activeKey.includes(layerId)) {
            setActiveKey(activeKey.filter(key => key !== layerId));
        } else {
            setActiveKey([...activeKey, layerId]);
        }
    };

    return (
        <div style={{ padding: "0px 8px"}}>
            <List
                dataSource={layers}
                renderItem={(layer) => (
                    <List.Item key={layer.id}>
                        <div style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 8,
                                fontSize: 11,
                                // fontFamily: "fantasy"
                                border: '1px solid #ccc',
                                padding: '4px 8px',
                             
                                background: '#f6eaeaff',
                    
                                fontFamily: 'fantasy'
                            
                            }}>
                                <span>{layer.title}</span>
                                <div>
                                    <Switch
                                        checked={layer.visible}
                                        onChange={(checked) => toggleLayerVisibility(layer.id, checked)}
                                        checkedChildren={<EyeOutlined />}
                                        unCheckedChildren={<EyeInvisibleOutlined />}
                                        style={{ marginRight: 8 }}
                                        size='small'
                                    />
                                    <Button
                                        type="text"
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => toggleLegendVisibility(layer.id)}
                                    />
                                </div>
                            </div>

                            <Collapse
                                activeKey={activeKey}
                                onChange={setActiveKey}
                                bordered={false}
                                ghost
                            >
                                <Panel
                                    key={layer.id}
                                    header={null}
                                    showArrow={false}
                                    style={{
                                        display: layer.legendVisible ? 'block' : 'none',
                                        padding: 0
                                    }}
                                >
                                    <div
                                        id={`legend-${layer.id}`}
                                        style={{
                                            background: '#fff',
                                            padding: '8px',
                                            borderRadius: 4,
                                            marginTop: 8
                                        }}
                                    />
                                    <LegendComponent
                                        layer={layer.layer}
                                        containerId={`legend-${layer.id}`}
                                    />
                                </Panel>
                            </Collapse>
                        </div>
                    </List.Item>
                )}
            />
        </div>


    );
}

// 单独的图例组件
function LegendComponent({ layer, containerId }: { layer: __esri.Layer, containerId: string }) {
    const { map } = useMapStore();

    useEffect(() => {
        if (!map) return;

        const legend = new Legend({
            view: map.view,
            layerInfos: [{
                layer,
                title: ''
            }],
            container: containerId
        });

        return () => {
            legend.destroy();
        };
    }, [layer, containerId, map]);

    return null;
}