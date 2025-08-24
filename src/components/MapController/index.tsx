import { use, useEffect, useState } from 'react';
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
import { eventBus } from '@/utils/eventBus'
import useMapStore from '@/store/mapStore';
import './index.less'
import FeatureLayer from '@geoscene/core/layers/FeatureLayer';
import { message } from 'antd';
import LayerList from './LayerList';
import { RadarChartOutlined, SlidersOutlined } from '@ant-design/icons';

const MapController = ({ isChanged }) => {
    const [isBaseMapVisible, setisBaseMapVisible] = useState(false);

    // 监听事件总线
    useEffect(() => {
        eventBus.on('closeBaseMapTable', () => {
            setisBaseMapVisible(false);
            console.log("关闭basemaptable成功", isBaseMapVisible);
        });
        return () => {
            console.log("关闭basemaptable成功||||||||||||||||||||");
            // eventBus.removeAllListeners();
            setisBaseMapVisible(false);
            eventBus.removeAllListeners();
        };
    }, [])


    // 事件总线汇总
    const eventBusFun = (fun: string) => {
        switch (fun) {
            //       eventBus.emit('open-layer-add')   eventBus.emit('getWeather')  
            case 'open-layer-add':
                eventBus.emit('open-layer-add')
                break;
            case 'getWeather':
                eventBus.emit('getWeather')
                break;
            case 'addLayerInWork':
                // eventBus.emit('addLayerInWork', new FeatureLayer({ url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/%E5%85%AB%E5%8D%81%E5%A4%A9%E7%8E%AF%E6%B8%B8%E5%9C%B0%E7%90%83%E2%80%94%E2%80%94%E8%88%AA%E7%BA%BF/FeatureServer' }))

                break;
            case 'open-layer-filter':
                eventBus.emit('open-layer-filter')
        }
    }


    return (
        <>
            <div className={`map-controller-button ${isChanged ? 'collapsed' : ''}`}>
                <button
                    className='geoscene-icon-collection'
                    onClick={() => {
                        console.log('点击添加图层');
                        eventBusFun('open-layer-add')

                    }}
                    title="添加图层">
                </button>

                <button
                    className='geoscene-icon-maps'
                    onClick={() => {
                        console.log('点击前isBaseMapVisible', isBaseMapVisible);
                        const table = document.getElementById('baseMapTable');
                        if (table) {
                            table.style.display = isBaseMapVisible ? 'none' : 'block';
                        }
                        setisBaseMapVisible(!isBaseMapVisible);
                    }}
                    title="设置底图">
                </button>

                <button
                    className='geoscene-icon-cursor-marquee'
                    title="图形绘制">
                </button>

                <button
                    onClick={() => {
                        eventBusFun('open-layer-filter');
                    }}
                    className='geoscene-icon-filter'
                    title="过滤查询">
                </button>

                <button
                    className='geoscene-icon-printer'
                    title="出图">
                </button>

                <button
                    className='geoscene-icon-measure-area'
                    title="测量">
                </button>

                <button title="空间分析工具" // 使用图标组件
                    onClick={() => {
                        eventBusFun('getWeather')
                    }}>
                    <RadarChartOutlined style={{ fontSize: '19px' }} />
                </button>
                <button className='geoscene-icon-chat' title="GeoAI交互式工具"
                    onClick={() => {
                        eventBusFun('addLayerInWork')
                    }}
                >

                </button>
            </div >
            {isChanged || <LayerList></LayerList>}
        </>
    );
};

export default MapController;