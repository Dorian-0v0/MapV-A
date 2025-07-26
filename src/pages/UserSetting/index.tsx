import { Anchor } from 'antd';
import "./index.less"
import MapWorkInit from '@/components/MapWorkInit';
import PeosonInfo from '@/components/PeosonInfo';
import DataStatistics from '@/components/DataStatistics';
import AboutGis from '@/components/AboutGis';
const { Link } = Anchor;

const UserSetting = () => {
  return (
    <div style={{ overflowX: 'hidden', display: 'flex', position: 'relative'}}>
      {/* 左侧锚点 - 固定定位 */}
      <div style={{ 
        width: '190px', 
        position: 'fixed', 
        bottom: 0, 
        height: 'calc(100vh - 35px)', 
        backgroundColor: '#eceff7',
      }}>
        <Anchor>
          <Link href="#section1" title="地图工作台自定义配置" />
          <Link href="#section2" title="个人信息" />
          <Link href="#section3" title="数据统计" />
          <Link href="#section4" title="关于" />
        </Anchor>
      </div>

      {/* 右侧内容区域 - 添加左边距避免被锚点遮挡 */}
      <div className='right-content'>
        <div id="section1">
          <MapWorkInit></MapWorkInit>
        </div>
        <div id="section2">
          <PeosonInfo></PeosonInfo>
        </div>
        <div id="section3">
           <DataStatistics></DataStatistics>
        </div>
        <div id="section4">
          <AboutGis></AboutGis>
        </div>
      </div>
    </div>
  );
};

export default UserSetting;