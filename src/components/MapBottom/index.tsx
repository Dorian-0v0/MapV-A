import React, { useState, useEffect } from 'react';
import { Button, Input, Popover, message } from 'antd';
import Point from '@geoscene/core/geometry/Point'; // 补充 Point 的导入
import type MapView from '@geoscene/core/views/MapView';

// 定义 props 类型
interface MapBottomProps {
    view: MapView; // 根据实际使用的 ArcGIS API 类型调整
    baseMapName: string;
}

const MapBottom: React.FC<MapBottomProps> = ({ view, baseMapName }) => {
    console.log("MapBottom 渲染", view);
    ;
    const [coordinates, setCoordinates] = useState({
        x: parseFloat(view.center.x.toFixed(6)),
        y: parseFloat(view.center.y.toFixed(6)),
    });
    const [scale, setScale] = useState(view.scale);
    const [center, setCenter] = useState<{ longitude: string; latitude: string } | null>(null);
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [showCenterPopup, setShowCenterPopup] = useState(false);

    // 监听鼠标移动和比例尺变化
    useEffect(() => {
        if (!view) return;

        console.log("view )))))))", view);

        const handlePointerMove = (event) => {
            console.log("event", event);

            const point = view.toMap({ x: event.x, y: event.y });
            setCoordinates({
                x: parseFloat(point.x.toFixed(6)),
                y: parseFloat(point.y.toFixed(6))
            });
        };

        const scaleHandler = view.watch('scale', (newScale) => {
            setScale(newScale);
        });

        view.on('pointer-move', handlePointerMove);

        return () => {
            //  pointerMoveHandler.remove();
            scaleHandler.remove();
        };
    }, [view]);

    // 定位功能
    const handleLocate = () => {
        if (!longitude || !latitude || !view) return;

        const point = new Point({
            x: parseFloat(longitude),
            y: parseFloat(latitude),
        });

        // 添加点和弹窗
        view.graphics.add({
            geometry: point,
            symbol: {
                type: 'simple-marker',
                color: [226, 119, 40],
                outline: { color: [255, 255, 255], width: 1 }
            }
        });

        // 添加弹窗
        view.popup.open({
            title: '定位点',
            content: `经度: ${point.x.toFixed(6)}, 纬度: ${point.y.toFixed(6)}`,
            location: point
        });

        view.goTo({
            target: point,
            zoom: 15
        });

    };

    // 清空定位
    const handleClear = () => {
        setLongitude('');
        setLatitude('');
        // 这里可以添加清除地图上点和弹窗
        view.graphics.removeAll();
        // 去除弹窗
        view.popup.close();
    };

    // 获取中心点
    const getViewCenter = () => {
        if (!view) return;
        setCenter(null);
        const centerPoint = view.center;
        setCenter({
            longitude: parseFloat(centerPoint.x).toFixed(6),
            latitude: parseFloat(centerPoint.y).toFixed(6)
        });
    }


    return (
        <div style={{
            backgroundColor: 'rgba(255,255,255,0.7)',
            height: '25px',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            display: 'flex',
            fontSize: '12px',
            alignItems: 'center',
            padding: '0 5px',
            gap: '5px'
        }}>
            {/* 底图名称 */}
            <div style={{ minWidth: '150px' }}>
                {baseMapName}
            </div>

            {/* 坐标显示 */}
            <div style={{ minWidth: '230px' }}>
                X: {coordinates.x}, Y: {coordinates.y}
            </div>

            {/* 比例尺显示 */}
            <div style={{ minWidth: '120px' }}>
                比例尺: 1:{Math.round(scale).toLocaleString()}
            </div>

            {/* 定位工具 */}
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center',  }}>
                <input
                    placeholder="经度"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    style={{ width: '100px' }}
                />
                <input
                    placeholder="纬度"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    style={{ width: '100px' }}
                />
                <button  onClick={handleLocate}>
                    跳转
                </button>
                <button onClick={handleClear}>
                    清空
                </button>
            </div>

            {/* 获取中心点按钮 */}
            <Popover
                content={
                    center ? (
                        <div>
                            <p>经度: {center.longitude}</p>
                            <p>纬度: {center.latitude}</p>
                        </div>
                    ) : (
                        <p>加载中...</p>
                    )
                }
                title="视图中心点坐标"
                visible={showCenterPopup}
                onVisibleChange={setShowCenterPopup}
            >
                <button onClick={getViewCenter}>
                    获取中心点
                </button>
            </Popover>
        </div>
    );
};

export default MapBottom;