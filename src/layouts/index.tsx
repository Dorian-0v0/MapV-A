import { Layout, Menu } from 'antd';
import {
  DatabaseOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { GeoSceneMapIcon } from '@/assets/icons';
import { Outlet } from 'react-router-dom';

const { Header } = Layout;

const LayOut = () => {
  const items = [
    { 
      label: '地图工作台', 
      key: '1', 
      icon: <GeoSceneMapIcon /> 
    }, 
    { 
      label: '数据资源', 
      key: '2', 
      icon: <DatabaseOutlined /> 
    }, 
    { 
      label: '个人中心', 
      key: '3', 
      icon: <UserOutlined /> 
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
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
        
      
      </Header>
       <Outlet/>
    </Layout>
  );
}

export default LayOut;