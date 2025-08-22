import useMapStore from '@/store/mapStore';
import React, { useEffect, useState } from 'react';
import { List, Switch, Button, Card, Collapse, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Legend from '@geoscene/core/widgets/Legend';
import { eventBus } from '@/utils/eventBus'

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
            setLayersChange(!layersChange);
        })
    }, []);

    // 初始化获取所有图层
    useEffect(() => {
        // if(!layersChange)return
        console.log("dewwwwwwwwwwww", map.layers?.items, map);

        const allLayers = map.layers?.items
        setLayers(allLayers);
        // setLayersChange(false);
    }, [map.layers?.length]);

    // 切换图层可见性
    const toggleLayerVisibility = (layerId: string) => {
        const layer = map?.findLayerById(layerId);
        console.log("layer", layer);

        if (layer) {
            layer.visible = !layer.visible;
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
        <div style={{ padding: "0px 8px" }}>
            <List
                dataSource={layers}
                renderItem={(layer) => (
                    <List.Item key={layer.id}>
                        <div style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',

                                marginBottom: 6,
                                fontSize: 11,
                                border: '1px solid #ccc',
                                padding: '10px 3px',

                                background: '#eaeef6ff',
                                fontWeight: 'bold'
                                // fontFamily: 'UnifrakturMaguntia cursive',
                                // textShadow: "1px 0 0 currentColor, 0.5px 0.5px 0 currentColor"

                            }}>
                                <div style={{
                                        // margin: '0 5px',
                                        width: '60%'
}}>
                                    <span
                                        style={{
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                            overflowWrap: "break-word",
                                            flex: 1,
                                            minWidth: 0
                                        }}
                                    >{layer.title}</span>
                                </div>

                                <div>
                                    <Switch
                                        defaultChecked
                                        // checked={layer.visible}
                                        onChange={(checked) => toggleLayerVisibility(layer.id)}
                                        checkedChildren={<EyeOutlined />}
                                        unCheckedChildren={<EyeInvisibleOutlined />}
                                        // style={{ marginRight: 0 }}
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
                )
                }
            />
        </div >


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