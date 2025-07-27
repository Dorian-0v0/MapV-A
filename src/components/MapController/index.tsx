import { use, useEffect, useState } from 'react';
import GeoJSONLayer from '@geoscene/core/layers/GeoJSONLayer';
import eventBus from '@/utils/eventBus.js';
import useMapStore from '@/store/mapStore';
const MapController = () => {
    const [isBaseMapVisible, setisBaseMapVisible] = useState(false);

    const { layers } = useMapStore()
    const layer =
        new GeoJSONLayer({
            url: 'https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=330000_full',
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
    return (
        <div>
            <button onClick={addlayer}>
                添加图层
            </button>
            <button onClick={() => {
                 console.log('点击前isBaseMapVisible', isBaseMapVisible);
                // 获取css id 为 baseMapTable 的table
                const table = document.getElementById('baseMapTable');
                // 移除display：none的样式
                if (table) {
                    table.style.display = isBaseMapVisible ? 'none' : 'block';
                }
                setisBaseMapVisible(!isBaseMapVisible);
                

            }}>
                底图
            </button>

    

            llll
        </div>
    );
};

export default MapController;