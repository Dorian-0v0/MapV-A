import useMapStore from '@/store/mapStore';
import React, { useEffect, useState } from 'react';
import { List, Switch, Button, Card, Collapse, message, Modal, Tabs, Table, Descriptions } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Legend from '@geoscene/core/widgets/Legend';
import { eventBus } from '@/utils/eventBus'
import "./index.less"

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
    const [selectLayer, setSelectLayer] = useState(null);
    useEffect(() => {
        eventBus.on('set-button-loading', () => {
            console.log("dewwwwwwwwwwww", map.layers?.items, map);
            // const allLayers = 
            setLayers(prevLayers => [...prevLayers, ...(map.layers?._items)]);

        })
    }, []);

    // 初始化获取所有图层
    useEffect(() => {
        // if(!layersChange)return
        // const allLayers = map.layers?._items
        console.log("allLayers·················", map.layers?._items);

        setLayers(map.layers?._items);

    }, [map.layers?.length]);

    // 解析layer的名字
    const getLayerName = (item) => {
        const title = item.title;
        if (title?.[0] === '%') {
            const name = item?.sourceJSON?.name;
            if (name !== undefined && name !== null) return name;

            try {
                return decodeURIComponent(title);
            } catch (e) {
                return title;
            }
        }
        return title;
    };





    // 切换图层可见性
    const toggleLayerVisibility = (layer) => {
        // const layer = map?.findLayerById(layerId);
        console.log("layer", layer);

        if (layer) {
            layer.visible = !layer.visible;
        }
    };

    // 图层信息可见性
    const checkLayerInfo = (layer) => {
        setSelectLayer(layer)
    };

    return (
        <div style={{ padding: "0px 5px", maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}>
            <List
                dataSource={layers}
                renderItem={(layer) => (
                    <List.Item key={layer.id}>
                        <div style={{ width: '100%' }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
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
                                        }}
                                    >{getLayerName(layer)}</span>
                                </div>

                                <div>
                                    <Switch
                                        defaultChecked
                                        style={{
                                            top: -3
                                        }}
                                        // checked={layer.visible}
                                        onChange={() => toggleLayerVisibility(layer)}
                                        checkedChildren={<EyeOutlined />}
                                        unCheckedChildren={<EyeInvisibleOutlined />}
                                        size='small'
                                    />
                                    <Button
                                        type="text"
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => checkLayerInfo(layer)}
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
            {selectLayer === null ? null : (
                <Modal
                    title={`${getLayerName(selectLayer)} 图层信息`}
                    open={true}
                    width={600}
                    // 没有确定按钮
                    okButtonProps={{ style: { display: 'none' } }}
                    onCancel={() => setSelectLayer(null)}
                // closable={{ 'aria-label': 'Custom Close Button' }}
                >
                    {/* 接下来是两个表：
                    一个是属性表，显示名称、类型、url、所有的字段及字段的类型，范围（xmin，xmax，ymin，ymax），地图服务类型 
                    另一个是参考系表，显示WKID，参考系的wkt，是否为地理坐标系
                    */}
                    <Tabs defaultActiveKey="1">

                        <Tabs.TabPane tab="属性信息" key="1" >
                            <div
                                style={{
                                    height: 300,
                                    overflow: 'auto'
                                }}
                            >
                                <Descriptions bordered column={1} size="small" >
                                    <Descriptions.Item style={{ borderRadius: 0 }} label="名称">{getLayerName(selectLayer) || '未知'}</Descriptions.Item>
                                    <Descriptions.Item label="类型">{selectLayer?.type || '未知'}</Descriptions.Item>
                                    <Descriptions.Item label="URL" span={2}>
                                        <a href={selectLayer?.url} target="_blank" rel="noopener noreferrer">
                                            {selectLayer?.url || '未知'}
                                        </a>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="几何类型">{selectLayer?.sourceJSON?.geometryType || '未知'}</Descriptions.Item>
                                    <Descriptions.Item style={{ borderRadius: 0 }} label="地图数据源类型">{selectLayer?.serviceType || '未知'}</Descriptions.Item>
                                    {/* 接下来展示所有字段和字段类型*/}


                                </Descriptions>
                            </div>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="字段信息" key="2" >
                            <div
                                style={{
                                    height: 300,
                                    overflow: 'auto'

                                }}
                            >
                                <Table
                                    rowClassName={(c, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
                                    dataSource={selectLayer?.fields || []}
                                    columns={[
                                        { title: '字段名', dataIndex: 'name', key: 'name' },
                                        { title: '字段类型', dataIndex: 'type', key: 'type' },
                                        { title: '字段描述', dataIndex: 'alias', key: 'alias' },
                                    ]}
                                    pagination={false}
                                    // bordered
                                    size="small"
                                />
                            </div>

                        </Tabs.TabPane>
                        <Tabs.TabPane tab="范围" key="3">
                            <div style={{ height: 300, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ position: 'relative', width: 500, height: 220 }}>
                                    {/* 水平线 */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: 0,
                                        right: 0,
                                        height: 1,
                                        backgroundColor: '#1890ff',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ transform: 'translateY(-100%)' }}>{selectLayer?.sourceJSON?.extent?.xmin?.toFixed(6) || '未知'}</span>
                                        <span style={{ transform: 'translateY(-100%)' }}>{selectLayer?.sourceJSON?.extent?.xmax?.toFixed(6) || '未知'}</span>
                                    </div>

                                    {/* 垂直线 */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '50%',
                                        top: 0,
                                        bottom: 0,
                                        width: 1,
                                        backgroundColor: '#1890ff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'left'
                                    }}>
                                        <span>{selectLayer?.sourceJSON?.extent?.ymax?.toFixed(6) || '未知'}</span>
                                        <span>{selectLayer?.sourceJSON?.extent?.ymin?.toFixed(6) || '未知'}</span>
                                    </div>

                                    {/* 中心点 */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        backgroundColor: '#ff4d4f',
                                        transform: 'translate(-50%, -50%)'
                                    }} />
                                </div>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="空间参考" key="4">
                            <div
                                style={{
                                    height: 300,
                                    overflow: 'auto'
                                }}
                            >
                                <Descriptions bordered column={1} size="small" >
                                    <Descriptions.Item label="空间参考WKID" span={2}>
                                        {selectLayer?.sourceJSON?.extent?.spatialReference?.wkid || '未知'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="类型">{selectLayer?.type || '未知'}</Descriptions.Item>
                                    <Descriptions.Item label="URL" span={2}>
                                        <a href={selectLayer?.url} target="_blank" rel="noopener noreferrer">
                                            {selectLayer?.url || '未知'}
                                        </a>
                                    </Descriptions.Item>

                                    <Descriptions.Item label="几何类型">{selectLayer?.sourceJSON?.geometryType || '未知'}</Descriptions.Item>
                                    <Descriptions.Item style={{ borderRadius: 0 }} label="地图数据源类型">{selectLayer?.serviceType || '未知'}</Descriptions.Item>
                                    {/* 接下来展示所有字段和字段类型*/}


                                </Descriptions>
                            </div>

                        </Tabs.TabPane>

                    </Tabs>
                </Modal>
            )
            };
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