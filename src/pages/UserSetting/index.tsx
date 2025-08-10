import { Anchor } from 'antd';
import "./index.less"
import MapWorkInit from '@/components/MapWorkInit';
import PeosonInfo from '@/components/PeosonInfo';
import DataStatistics from '@/components/DataStatistics';
import AboutGis from '@/components/AboutGis';
import { useState } from 'react';
// const { Link } = Anchor;

const UserSetting = () => {
  const [activeTab, setActiveTab] = useState('section1');

 return (
    <div style={{ overflowX: 'hidden', display: 'flex', position: 'relative' }}>
      {/* 左侧标签导航 - 固定定位 */}
      <div style={{ 
        width: '190px', 
        position: 'fixed', 
        bottom: 0, 
        height: 'calc(100vh - 35px)', 
        backgroundColor: '#eceff7',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0'
      }}>
        <button 
          style={{
            padding: '10px',
            textAlign: 'left',
            backgroundColor: activeTab === 'section1' ? '#d0d7e7' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('section1')}
        >
          地图工作台自定义配置
        </button>
        <button 
          style={{
            padding: '10px',
            textAlign: 'left',
            backgroundColor: activeTab === 'section2' ? '#d0d7e7' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('section2')}
        >
          个人信息
        </button>
        <button 
          style={{
            padding: '10px',
            textAlign: 'left',
            backgroundColor: activeTab === 'section3' ? '#d0d7e7' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('section3')}
        >
          数据统计
        </button>
        <button 
          style={{
            padding: '10px',
            textAlign: 'left',
            backgroundColor: activeTab === 'section4' ? '#d0d7e7' : 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('section4')}
        >
          关于
        </button>
      </div>

      {/* 右侧内容区域 - 添加左边距避免被标签导航遮挡 */}
      <div className='right-content' style={{ marginLeft: '195px', flex: 1, height: 'calc(100vh - 35px)', marginRight: '3px' }}>
        {activeTab === 'section1' && (
          <div id="section1">
            <MapWorkInit></MapWorkInit>
          </div>
        )}
        {activeTab === 'section2' && (
          <div id="section2">
            <PeosonInfo></PeosonInfo>
          </div>
        )}
        {activeTab === 'section3' && (
          <div id="section3">
            <DataStatistics></DataStatistics>
          </div>
        )}
        {activeTab === 'section4' && (
          <div id="section4">
            <AboutGis></AboutGis>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSetting;