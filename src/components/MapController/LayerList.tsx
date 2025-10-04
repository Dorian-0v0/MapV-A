import useMapStore, { useMap } from '@/store/mapStore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { List, Button, Modal, Tabs, Table, Descriptions, Dropdown, Menu } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, InfoCircleOutlined, TableOutlined, DeleteOutlined, FullscreenExitOutlined, MoreOutlined, ProfileOutlined, BgColorsOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import Legend from '@geoscene/core/widgets/Legend';
import { eventBus } from '@/utils/eventBus'
import "./index.less"

interface LayerInfo {
    id: string;
    title: string;
    layer: any;
    visible: boolean;
    legendVisible: boolean;
}

export default function LayerList() {
    const {
        map,
        mapView,
    } = useMap();
    // const { map, mapView } = useMapStore();
    const [layers, setLayers] = useState<LayerInfo[]>([]);
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
    useLayoutEffect(() => {
        // if(!layersChange)return
        // const allLayers = map.layers?._items
        console.log("allLayers·················", map.layers?._items);

        const filteredLayers = map.layers?._items.filter((ly) => {
            console.log("处理图层", ly);

            // 如果你的条件是要保留的图层
            if (ly.type !== "graphics" && ly.title != null) {
                return true; // 保留这个图层
            }
            return false; // 过滤掉这个图层
        });

        setLayers(filteredLayers);

    }, [map.layers?.length, layersChange]);

    // 解析layer的名字
    const getLayerName = (item) => {
        console.log("item解析layer的名字", item);
        const title = item.title;
        if (title?.[0] === '%') {
            const name = item?.sourceJSON?.name;
            if (name !== undefined && name !== null) {
                item.title = name;
                return name;
            }
            console.log("title", decodeURIComponent(title));
            item.title = decodeURIComponent(title);
            return decodeURIComponent(title);

        }
        console.log("title", decodeURIComponent(title));
        return title;
    };



    const toggleLegendVisibility = async (layer) => {
        // setSelectLayer(layer)
        layer.legendVisible = !layer.legendVisible;

        if (layer.legendVisible) {

            const legend = new Legend({
                view: mapView,
                layerInfos: [{
                    layer: layer,
                    title: null // 设置为null不显示图层名称
                }],
                container: `${layer.id}-legend`,
            });
            const legendElement = document.getElementById(`${layer.id}-legend`);
            if (legendElement) {
                legendElement.style.maxHeight = '140px';
            }

        } else {
            const legendElement = document.getElementById(`${layer.id}-legend`);
            if (legendElement) {
                legendElement.innerHTML = '';
            }

        }

    };

    // 切换图层可见性
    const toggleLayerVisibility = (layer) => {
        // const layer = map?.findLayerById(layerId);
        console.log("layer", layer);
        if (layer) {
            layer.visible = !layer.visible;
            setLayersChange(prev => !prev)
        }
    };

    // 图层信息可见性
    const checkLayerInfo = (layer) => {
        setSelectLayer(layer)
    };

    // 从map里移除layer
    const removeLayer = (layer) => {
        map.remove(layer);
        setLayersChange(prev => !prev)
    };

    useEffect(() => {
        return () => {
            console.log("销毁图例");

            map.layers?._items.forEach(layer => {
                layer.legendVisible = false
            })
        }
    }, [])
    return (
        <div style={{ padding: "0px 5px", maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}>
            <List
                dataSource={layers}
                renderItem={(layer) => (
                    <List.Item key={layer.id} style={{ padding: "0px 0px", margin: "2px 0px" }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column', // 改为垂直排列
                            fontSize: 11,
                            border: '1px solid #ccc',
                            padding: '0px 2px',
                            width: '100%',
                            background: '#eaeef6ff',
                            fontWeight: 'bold'
                        }}>
                            {/* 图层名称 - 顶部 */}
                            <div style={{ width: '100%' }}>
                                <span>{getLayerName(layer)}</span>
                            </div>

                            {/* 按钮组 - 底部 */}
                            <div style={{
                                width: '100%',
                                // textAlign: 'center', // 按钮居中
                                marginTop: 5 // 添加顶部间距
                            }}>
                                <Button
                                    className='btn-group'
                                    type="text"
                                    title="查看图层属性"
                                    // size='small'
                                    icon={layer.visible == true ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                    onClick={() => toggleLayerVisibility(layer)}
                                />
                                <Button
                                    type="text"
                                    className='btn-group'
                                    title="查看图层属性"
                                    icon={<ProfileOutlined />}
                                    onClick={() => checkLayerInfo(layer)}
                                />
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<BgColorsOutlined />}
                                    onClick={() => toggleLegendVisibility(layer)}
                                    title={"图例"}
                                />

                                <Button
                                    className='btn-group'
                                    type="text"
                                    title="删除"
                                    icon={<DeleteOutlined />}
                                    onClick={() => {
                                        removeLayer(layer)
                                    }}
                                />
                                <Button
                                    className='btn-group'
                                    type="text"
                                    title="缩放至图层"
                                    icon={<FullscreenExitOutlined />}
                                    onClick={() => {
                                        // 使用 goTo 方法缩放到该范围
                                        eventBus.emit('map_zoomToExtent', layer.fullExtent || layer.layers.items[0].fullExtent)
                                    }}
                                />
                                <Dropdown overlay={
                                    <Menu>
                                        <Menu.Item key="1" onClick={() => console.log('查看图例')} icon={<TableOutlined />}>切换字段值表</Menu.Item>
                                        <Menu.Item key="2" onClick={() => console.log('要素编辑')} icon={<EditOutlined />}>要素编辑</Menu.Item>
                                        <Menu.Item key="3" onClick={() => console.log('数据导出')} icon={<ExportOutlined />}>数据导出</Menu.Item>
                                    </Menu>
                                } trigger={['click']}>
                                    <Button
                                        className="btn-group"
                                        type="text"
                                        title="更多操作"
                                        icon={<MoreOutlined />}
                                    />
                                </Dropdown>
                            </div>



                            <div id={`${layer.id}-legend`} style={{
                                padding: 0,
                                width: '100%',
                                overflowX: 'hidden', // 关键属性：隐藏水平滚动条并禁止水平滑动
                                overflowY: 'auto',   // 允许垂直滚动（如果需要）
                                boxSizing: 'border-box' // 确保padding和border不增加额外宽度
                            }}></div>


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
                                        <span style={{ transform: 'translateY(-100%)' }}>Xmin:{selectLayer?.sourceJSON?.extent?.xmin?.toFixed(6) || '未知'}</span>
                                        <span style={{ transform: 'translateY(-100%)' }}>Xmax:{selectLayer?.sourceJSON?.extent?.xmax?.toFixed(6) || '未知'}</span>
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
                                        alignItems: 'center'
                                    }}>
                                        <span>Ymax:{selectLayer?.sourceJSON?.extent?.ymax?.toFixed(6) || '未知'}</span>
                                        <span>Ymin:{selectLayer?.sourceJSON?.extent?.ymin?.toFixed(6) || '未知'}</span>
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
            }
        </div >


    );
}


