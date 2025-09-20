import { Avatar, Button, Dropdown, Layout, Menu, Modal, Switch } from 'antd';
import {
  DatabaseOutlined,
  MessageOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom'; // 路由跳转
import { AvatarIcon, GeoSceneMapIcon, LoGoIcon } from '@/assets/icons';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { eventBus } from '@/utils/eventBus';
import AiChat from '@/components/AiChat';

const { Header } = Layout;

const LayOut = () => {
  const [isAIModalVisible, setAIModalVisible] = useState(false); // AI对话框可见状态
  const [isDarkMode, setIsDarkMode] = useState(false); // 切换暗黑模式
  const navigate = useNavigate();
  useEffect(() => {
    eventBus.on('openGeoAi', () => {
      setAIModalVisible(true);
    });
  }, []);


  const changeGlobalStyle = () => {
    const html = document.documentElement;

    if (html) {
      // 切换dark mode类而不是直接操作style
      if (isDarkMode) {
        html.classList.remove('dark-mode');
      } else {
        html.classList.add('dark-mode');
      }
    }

    setIsDarkMode(!isDarkMode);
  };
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
          background: '#fff'
        }}
      >
        <div style={{ marginRight: 24, display: 'flex', alignItems: 'center' }}>
          <LoGoIcon />
        </div>
        <Menu
          mode="horizontal"
          theme="light"
          defaultSelectedKeys={'1'}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        {/* 右侧功能区 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 25 }}>

          {/* 昼夜模式切换 */}
          <Switch
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            checked={isDarkMode}
            onChange={changeGlobalStyle}
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
            className='avatarA'
          >
            <Avatar
              style={{
                cursor: 'pointer',
              }}
              icon={<AvatarIcon />} // 可选：添加一个默认头
            />
          </Dropdown>
        </div>

        <AiChat
        isAIModalVisible={isAIModalVisible}
        setAIModalVisible={setAIModalVisible}
        ></AiChat>
     

      </Header>

      <Layout style={{ minHeight: 'calc(100vh - 35px)', backgroundColor: '#e6dfdf' }}>
        <Outlet />
      </Layout>

    </Layout>
  );
}

export default LayOut;