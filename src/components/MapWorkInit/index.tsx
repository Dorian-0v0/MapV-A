import React, { useState } from 'react';
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    Card,
    Row,
    Col,
    Divider,
    Table,
    Tag,
    message,
    InputNumber,
    Checkbox
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Option } = Select;

const MapWorkInit = () => {
    const [form] = Form.useForm();
    const [mapModalVisible, setMapModalVisible] = useState(false);
    const [wmtsModalVisible, setWmtsModalVisible] = useState(false);
    const [editingWmts, setEditingWmts] = useState(null);
    const [wmtsList, setWmtsList] = useState([]);

    // 默认配置
    const [config, setConfig] = useState({
        center: [116.404, 39.915],
        zoom: 10,
        wmtsServices: []
    });

    const handleMapSelect = (center, zoom) => {
        setConfig({
            ...config,
            center,
            zoom
        });
        setMapModalVisible(false);
    };

    const handleAddWmts = () => {
        setEditingWmts(null);
        form.resetFields();
        setWmtsModalVisible(true);
    };

    const handleEditWmts = (record) => {
        setEditingWmts(record);
        form.setFieldsValue(record);
        setWmtsModalVisible(true);
    };

    const handleDeleteWmts = (url) => {
        setWmtsList(wmtsList.filter(item => item.url !== url));
        setConfig({
            ...config,
            wmtsServices: config.wmtsServices.filter(item => item.url !== url)
        });
    };

    const handleWmtsSubmit = () => {
        form.validateFields().then(values => {
            const newWmts = {
                url: values.url,
                name: values.name || '未命名WMTS',
                subDomains: values.subDomains ? values.subDomains.split(',') : null
            };

            if (editingWmts) {
                // 更新现有WMTS
                const updatedList = wmtsList.map(item =>
                    item.url === editingWmts.url ? newWmts : item
                );
                setWmtsList(updatedList);
                setConfig({
                    ...config,
                    wmtsServices: updatedList
                });
            } else {
                // 添加新WMTS
                setWmtsList([...wmtsList, newWmts]);
                setConfig({
                    ...config,
                    wmtsServices: [...config.wmtsServices, newWmts]
                });
            }

            setWmtsModalVisible(false);
            message.success(editingWmts ? 'WMTS服务更新成功' : 'WMTS服务添加成功');
        });
    };

    const columns = [
        {
            title: '服务名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'SubDomains',
            dataIndex: 'subDomains',
            key: 'subDomains',
            render: (subDomains) => (
                subDomains ? (
                    <div>
                        {subDomains}
                    </div>
                ) : <span>-</span>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (record) => (
                <span>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditWmts(record)}
                    />
                    <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteWmts(record.url)}
                        danger
                    />
                </span>
            ),
        },
    ];

    return (
        <div>
            <Card title="地图工作台配置">
                <Form>
                    <Divider orientation="left" style={{ marginTop: '-60px', marginBottom: '-20px' }}><h3>视图设置</h3></Divider>

                    <div>

                        <span>地图中心点：</span>
                        <Input
                            style={{ width: '150px', marginLeft: '10px' }}
                            value={config.center[0]}
                            size='small'
                            disabled
                        />
                        <Input
                            style={{ width: '150px', marginLeft: '10px' }}
                            value={config.center[1]}
                            size='small'
                            disabled
                        />
                    </div>
                    <div>
                        <span>缩放等级</span>
                        <Input
                            // value={config.zoom}
                            // onChange={}
                            // type="number"
                            size='small'
                            style={{ width: '150px', marginLeft: '10px' }}
                        />
                    </div>
                    <div>
                        <Button
                            type="primary"
                            size='small'
                            icon={<EnvironmentOutlined />}
                            onClick={() => setMapModalVisible(true)}
                        >
                            通过地图配置
                        </Button>
                    </div>





                    <Divider orientation="left" style={{ marginBottom: '-20px' }}><h3>自定义WMTS底图</h3></Divider>

                    <Table
                        columns={columns}
                        dataSource={wmtsList}
                        rowKey="url"
                        pagination={false}
                        bordered
                        size="small"
                        locale={{
                            emptyText: '--'
                        }}
                    />

                    <Button
                        type="dashed"
                        onClick={handleAddWmts}
                        icon={<PlusOutlined />}
                        style={{ marginTop: '16px', width: '100%' }}
                    >
                        添加WMTS服务
                    </Button>
                </Form>
            </Card>

            {/* WMTS配置模态框 */}
            <Modal
                title={editingWmts ? '编辑WMTS服务' : '添加WMTS服务'}
                visible={wmtsModalVisible}
                onOk={handleWmtsSubmit}
                onCancel={() => setWmtsModalVisible(false)}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="底图名称"
                        rules={[{ required: true, message: '请输入服务名称' }]}
                    >
                        <Input placeholder="例如：天地图影像" />
                    </Form.Item>

                    <Form.Item
                        name="wmtsUrls"
                        label="WMTS服务URL（如果多个要换行）"
                        rules={[
                            { required: true, message: '请输入至少一个WMTS服务URL' },
                            {
                                validator: (_, value) => {
                                    const urls = value.split('\n').filter(url => url.trim());
                                    console.log("urls", urls);
                                    
                                    const isValid = urls.every(url => {
                                        try {
                                            new URL(url.trim());
                                            return true;
                                        } catch {
                                            return false;
                                        }
                                    });
                                    return isValid
                                        ? Promise.resolve()
                                        : Promise.reject(new Error('包含无效的URL'));
                                }
                            }
                        ]}
                    >
                        <Input.TextArea
                            placeholder={`例如：
https://t{s}.tianditu.gov.cn/img_w/wmts
https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer`}
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="subDomains"
                        label="SubDomains (可选)"
                        tooltip="如果需要轮询子域名，请用英文逗号分隔多个子域名"
                    >
                        <Input placeholder="例如：1,2,3,4" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 地图选择模态框 */}
            <Modal
                title="选择地图中心点"
                visible={mapModalVisible}
                onCancel={() => setMapModalVisible(false)}
                width="80%"
                style={{ top: 20 }}
            >
                <div style={{ height: '60vh', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        background: '#f0f2f5'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3>地图组件区域</h3>
                            <p>点击地图选择中心点，滚轮缩放</p>
                            <Button
                                type="primary"
                                onClick={() => handleMapSelect([116.404, 39.915], 10)}
                            >
                                使用当前视图
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MapWorkInit;