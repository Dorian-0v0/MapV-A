import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React, { useEffect, useState } from 'react'
import { Modal, Layout, Button, Tree, Menu, Dropdown, Tabs, Form, Input, Select, Upload } from 'antd';
import {
  FolderAddOutlined,
  FileOutlined,
  GlobalOutlined,
  CaretDownFilled
} from '@ant-design/icons';
import eventBus from "@/utils/eventBus";
export default function AddLayers() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  
  useEffect(() => {
    eventBus.on('open-layer-add', () => {
      setIsOpen(true);
    })
    return () => {
      setIsOpen(false);
      eventBus.removeAllListeners();
    }
  }, [])
  // 树形数据
  const treeData = [
    {
      title: 'Web服务',
      key: 'web-services',
      selectable: false, // 禁止选中
      icon: <GlobalOutlined />,
      children: [
        { title: 'Arcgis REST API', key: 'arcgis-rest' },
        { title: 'GeoJSON', key: 'geojson-web' },
        { title: 'OGC WFS', key: 'ogc-wfs' },
        { title: 'OGC WMS', key: 'ogc-wms' },
        { title: 'OGC WMTS', key: 'ogc-wmts' },
      ],
    },
    {
      title: '文件数据',
      selectable: false, // 禁止选中
      key: 'file-data',
      icon: <FileOutlined />,
      children: [
        { title: 'Shapefile (SHP)', key: 'shp' },
        { title: 'GeoJSON', key: 'geojson-file' },
        { title: 'CSV', key: 'csv' },
        { title: 'GeoTIFF', key: 'tif' },
        { title: 'File Geodatabase (GDB)', key: 'gdb' },
        { title: 'GeoPackage (GBK)', key: 'gbk' },
      ],
    },
  ];
  const [expandedKeys, setExpandedKeys] = useState(() => {
    return treeData.map(item => item.key);
  });


  

  // 渲染内容区域根据选择的树节点
  const renderContent = () => {
    if (!selectedKeys.length) {
      return <div style={{ padding: 24, color: '#999' }}>请从左侧选择数据源类型</div>;
    }

    const selectedKey = selectedKeys[0];

    // Web服务表单
    if (['arcgis-rest', 'geojson-web', 'ogc-wfs', 'ogc-wms', 'ogc-wmts'].includes(selectedKey)) {
      return (
        <Form 
        layout="vertical"
        form={webServiceForm}
        >
          <Form.Item name="url" label="服务URL" required>
            <Input placeholder="请输入服务地址" />
          </Form.Item>
          <Form.Item label="名称" name="name">
            <Input placeholder="自定义图层名称" />
          </Form.Item>
          {selectedKey === 'arcgis-rest' && (
            <Form.Item label="图层ID" name="layerId">
              <Input placeholder="可选，如果URL未指定具体图层" />
            </Form.Item>
          )}
          {['ogc-wms', 'ogc-wmts'].includes(selectedKey) && (
            <Form.Item label="图层名称">
              <Input placeholder="WMS/WMTS图层名称" />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary">连接</Button>
          </Form.Item>
        </Form>
      );
    }

    // 文件上传表单
    if (['shp', 'geojson-file', 'csv', 'tif', 'gdb', 'gbk'].includes(selectedKey)) {
      const uploadProps = {
        multiple: selectedKey === 'shp', // SHP需要多个文件
        beforeUpload: file => {
          console.log('Selected file:', file);
          return false; // 手动上传
        },
      };

      return (
        <Form layout="vertical">
          <Form.Item label="选择文件" required>
            <Upload.Dragger {...uploadProps}>

              <FolderAddOutlined style={{ fontSize: '30px', color: '#1890ff' }} />

              <p className="ant-upload-text">点击或拖拽文件到此处</p>
              <p>
                {selectedKey === 'shp' && '请上传.shp, .shx, .dbf等配套文件'}
                {selectedKey === 'geojson-file' && '请上传.geojson或.json文件'}
                {selectedKey === 'csv' && '请上传.csv文件(需包含经纬度或WKT字段)'}
                {selectedKey === 'tif' && '请上传.tif或.tiff文件'}
                {selectedKey === 'gdb' && '请上传.gdb文件夹'}
                {selectedKey === 'gbk' && '请上传.gpkg文件'}
              </p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="名称">
            <Input placeholder="自定义图层名称" />
          </Form.Item>
          {selectedKey === 'csv' && (
            <Form.Item label="坐标字段">
              <Input.Group compact>
                <Form.Item name="xField" noStyle>
                  <Input style={{ width: '50%' }} placeholder="经度字段" />
                </Form.Item>
                <Form.Item name="yField" noStyle>
                  <Input style={{ width: '50%' }} placeholder="纬度字段" />
                </Form.Item>
              </Input.Group>
              <span>或</span>
              <Form.Item name="wktField" noStyle>
                <Input placeholder="WKT字段" />
              </Form.Item>
            </Form.Item>
          )}
          <Button type="primary">上传</Button>
        </Form>
      );
    }

    return null;
  };

  return (
    <Modal
      style={{
        bottom: '30px',
        padding: '6px 6px'
      }}
      width={900}
      bodyStyle={{
        height: 400,
        padding: 0,
        display: 'flex'
      }}
      title="添加图层"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isOpen}
      onOk={() => {
        setIsOpen(true);
      }}
      onCancel={() => {
        setIsOpen(false);
      }}
    >
      <Sider
        style={{
          height: '100%',
          backgroundColor: '#ffffff',
          overflow: 'hiden'
        }}
        width={180}
      >
        <div>
          <style>
            {`
          .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
            background-color: #4d6bfe !important;
            color: white !important;
          }
        `}
          </style>
          <Tree
            switcherIcon={<CaretDownFilled style={{ marginRight: '0px' }} />}
            showIcon
            expandedKeys={expandedKeys}
            onExpand={keys => setExpandedKeys(keys)}
            // defaultExpandAll // 这个和expandedKeys一起使用可能会有冲突
            selectedKeys={selectedKeys}
            onSelect={keys => setSelectedKeys(keys)}
            treeData={treeData}
          />
        </div>
      </Sider>
      <Content
        style={{
          margin: '-30px 14px',
          minHeight: 400,
          background: '#fff',
          overflowY: 'auto',
        }}
      >

        {renderContent()}

      </Content>
    </Modal>
  );
}
