import { Avatar, Button, Dropdown, Layout, Menu, Modal, Switch } from 'antd';
import {
  DatabaseOutlined,
  MessageOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // 路由跳转
import { AvatarIcon, GeoSceneMapIcon, LoGoIcon } from '@/assets/icons';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

const { Header } = Layout;

const LayOut = () => {
  const [theme, setTheme] = useState('light'); // 主题状态
  const [isAIModalVisible, setAIModalVisible] = useState(false); // AI对话框可见状态
  const navigate = useNavigate();
  const items = [
    {
      label: '地图工作台',
      key: '1',
      icon: <GeoSceneMapIcon />,
      onClick: () => navigate('/mapwork')
    },
    {
      label: '数据资源',
      key: '2',
      icon: <DatabaseOutlined />,
      onClick: () => navigate('/datacenter')
    },
    {
      label: '个人中心',
      key: '3',
      icon: <UserOutlined />,
      onClick: () => navigate('/user'),
    }
  ];

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          lineHeight: '35px',
        }}
      >
        <div style={{ marginRight: 24, display: 'flex', alignItems: 'center' }}>
          <LoGoIcon />
        </div>
        <Menu
          mode="horizontal"
          theme='dark'
          defaultSelectedKeys={['1']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        {/* 右侧功能区 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>
          {/* AI 对话框按钮 */}
          <Button
            type="primary"
            shape="circle"
            icon={<MessageOutlined />}
            onClick={() => setAIModalVisible(true)}
            size="small"
          />

          {/* 昼夜模式切换 */}
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            size="small"
            style={{
              border: '2px solid #d9d9d9',
              height: '20px',
              width: '40px',
              // 关键样式：通过 padding 和 lineHeight 控制垂直居中
              lineHeight: '16px', // 与 height 计算匹配（height - 2*border = 20-4=16）
            }}
          />

          {/* 头像框 */}
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="profile">个人中心</Menu.Item>
                <Menu.Item key="settings">设置</Menu.Item>
                <Menu.Item key="logout">退出登录</Menu.Item>
              </Menu>
            }
          >
            <Avatar
              style={{
                cursor: 'pointer',
              }}
              icon={<AvatarIcon />} // 可选：添加一个默认头
            />
          </Dropdown>
        </div>

        {/* AI 对话框 */}
        <Modal
          title="AI 助手"
          visible={isAIModalVisible}
          onCancel={() => setAIModalVisible(false)}
          footer={null}
          width={800}
        >
          <div style={{ height: '500px' }}>
            {/* 这里放置你的 AI 对话框内容 */}
            <p>这里是 AI 对话框的内容区域</p>
          </div>
        </Modal>

      </Header>

      <Layout style={{ minHeight: 'calc(100vh - 35px)' }}>
        <Outlet />
      </Layout>

    </Layout>
  );
}

export default LayOut;