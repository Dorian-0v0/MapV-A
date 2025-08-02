import { use, useEffect, useState } from 'react';
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
import eventBus from '@/utils/eventBus.js';
import useMapStore from '@/store/mapStore';
import './index.less'
const MapController = ({isChanged}) => {
    const [isBaseMapVisible, setisBaseMapVisible] = useState(false);
    
    const { layers, map} = useMapStore()
    const layer =
        new GeoJSONLayer({
            url: 'https://geo.datav.aliyun.com/areas_v3/bound/360000_full.json',
            renderer: {
                type: 'simple',
                symbol: {
                    type: 'simple-fill',
                    color: [227, 139, 79, 0.5],
                    outline: {
                        color: [255, 255, 255],
                        width: 1,
                    },
                },
            },
        })

    const addlayer = () => {
        eventBus.emit('addLayerInWork', layer);
        console.log(layers);
    };

    // 监听事件总线
    useEffect(() => {
        eventBus.on('closeBaseMapTable', () => {
            setisBaseMapVisible(false);
            console.log("关闭basemaptable成功", isBaseMapVisible);
        });
        return () => {
            setisBaseMapVisible(false);
            console.log('ziid');

            eventBus.removeAllListeners();
        };
    }, [])
    // ${isChanged ? 'changed' : ''}
    return (
        <div className={`map-controller-button ${isChanged ? 'collapsed' : ''}`}>
            <button
                className='geoscene-icon-collection'
                onClick={addlayer}
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
                onClick={() =>{eventBus.emit('open-layer-filter')}}
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

            <button className='geoscene-icon-partly-cloudy' title="区域天气">

            </button>
            <button className='geoscene-icon-chat' title="GeoAI交互式工具">

            </button>


        </div>
    );
};

export default MapController;