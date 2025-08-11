import { use, useEffect, useState } from 'react';
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
import eventBus from '@/utils/eventBus.js';
import useMapStore from '@/store/mapStore';
import './index.less'
const MapController = ({ isChanged, map }) => {
    const [isBaseMapVisible, setisBaseMapVisible] = useState(false);

    // 监听事件总线
    useEffect(() => {
        eventBus.on('closeBaseMapTable', () => {
            setisBaseMapVisible(false);
            console.log("关闭basemaptable成功", isBaseMapVisible);
        });
        return () => {
            setisBaseMapVisible(false);
            eventBus.removeAllListeners();
        };
    }, [])
    return (
        <>
            <div className={`map-controller-button ${isChanged ? 'collapsed' : ''}`}>
                <button
                    className='geoscene-icon-collection'
                    onClick={() => {
                        eventBus.emit('open-layer-add')
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
                    onClick={() => { eventBus.emit('open-layer-filter') }}
                    className='geoscene-icon-filter'
                    title="过滤查询">
                </button>

                <button
                    className='geoscene-icon-edit'
                    title="要素编辑">
                </button>

                <button
                    className='geoscene-icon-measure-line'
                    title="测量">
                </button>

                <button className='geoscene-icon-partly-cloudy' title="区域天气"
                    onClick={() => {
                        eventBus.emit('getWeather')
                    }}>

                </button>
                <button className='geoscene-icon-chat' title="GeoAI交互式工具">

                </button>
            </div>
            <div>
                图层列表
            </div>
        </>
    );
};

export default MapController;