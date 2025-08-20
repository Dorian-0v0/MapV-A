// src/components/BaseMapPanel.jsx
import React, { useEffect } from 'react';
import { Button, Card } from 'antd';
import { CloseOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {eventBus} from '@/utils/eventBus'
const BaseMapPanel = () => {

  // useEffect(() => {
  //   return () => {
  //     // 这里放置组件销毁时需要执行的代码
  //     console.log('BaseMapPanel 组件被销毁');
  //     eventBus.emit('closeBaseMapTable'); // 如果需要通知其他组件

  //     // 可以在这里执行其他清理操作，比如取消事件监听等
  //   };
  // }, []); //
  return (
    <Card
      id="baseMapTable"
      title="底图切换"
      size="small"
      extra={
        <Button
          onClick={() => {
            const table = document.getElementById('baseMapTable');
            if (table) {
              table.style.display = 'none';
              eventBus.emit('closeBaseMapTable');
            }
          }} // 通过 props 接收关闭逻辑
          icon={<CloseOutlined />}
          type="text"
        />
      }
      style={{
        width: 200,
        padding: 0,
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#ffffff',
        zIndex: 1000,
      }}
    >
      <div
        id="basemapGalleryContainer"
        style={{
          height: '320px',
          width: '100%',
          zIndex: 3,
          outline: 'none',
        }}
      />
      <hr />
      <Button type="link" style={{ padding: '0', color: '#1890ff', fontSize: '12px' }}>
        <PlusOutlined /> 添加自定义底图
      </Button>
      <br />
      <Button type="link" style={{ padding: '0', color: '#1890ff', fontSize: '12px' }}>
        <InfoCircleOutlined /> 底图信息
      </Button>
    </Card>
  );
};

export default BaseMapPanel;