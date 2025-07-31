import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Popover, message } from 'antd';
import Point from '@geoscene/core/geometry/Point'; // 补充 Point 的导入
import type MapView from '@geoscene/core/views/MapView';
import { inverseGeoService } from '@/api/MapServer';

// 定义 props 类型
interface MapBottomProps {
    view: MapView; // 根据实际使用的 ArcGIS API 类型调整
    baseMapName: string;
}

const MapBottom: React.FC<MapBottomProps> = ({ view, baseMapName }) => {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const [coordinates, setCoordinates] = useState({
        x: parseFloat(view.center.x.toFixed(6)),
        y: parseFloat(view.center.y.toFixed(6)),
    });
    const [scale, setScale] = useState(view.scale);
    const [center, setCenter] = useState<{ longitude: string; latitude: string } | null>(null);
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [popupContent, setPopupContent] = useState('');

    // 监听鼠标移动和比例尺变化
    useEffect(() => {
        if (!view) return;

        const scaleHandler = view.watch('scale', (newScale) => {
            setScale(newScale);
        });

        view.on('pointer-move', (event) => {

            const point = view.toMap({ x: event.x, y: event.y });
            setCoordinates({
                x: parseFloat(point.x.toFixed(6)),
                y: parseFloat(point.y.toFixed(6))
            });
        });

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
            content: `
    <table style="width:100%; border-collapse: collapse;">
      <tr>
        <td style="border:1px solid #ddd; padding:8px;">经度 (X)</td>
        <td style="border:1px solid #ddd; padding:8px;">${point.x.toFixed(6)}</td>
      </tr>
      <tr>
        <td style="border:1px solid #ddd; padding:8px;">纬度 (Y)</td>
        <td style="border:1px solid #ddd; padding:8px;">${point.y.toFixed(6)}</td>
      </tr>
    </table>
  `,
            location: point
        });

        view.goTo({
            target: point,
            zoom: 7
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
    const getViewCenter = async () => {
        if (!view) return;
        setCenter(null);
        const centerPoint = view.center;
        setCenter({
            longitude: parseFloat(centerPoint.longitude).toFixed(6),
            latitude: parseFloat(centerPoint.latitude).toFixed(6)
        });
        const res = await inverseGeoService(centerPoint)
        console.log("结果为", res);
        // 数据渲染
        updatePopupContent(res)
    }

    const updatePopupContent = (res) => {
        if (!view || !res) return "";

        const scale = view.scale;
        console.log("缩放比例", scale);

        let content = "";

        if (scale < 5000) {
            // 显示省、市、县、镇
            content = [
                res.province,
                res.city,
                res.county,
                res.town,
                res.poi
            ].filter(Boolean).join("\n");
        } else if (scale >= 5000 && scale < 30000) {
            // 显示省、市、县、镇
            content = [
                res.province,
                res.city,
                res.county,
                res.town
            ].filter(Boolean).join("\n");
        } else if (scale >= 30000 && scale < 160000) {
            // 显示省、市、县
            content = [
                res.province,
                res.city,
                res.county
            ].filter(Boolean).join("\n");
        } else if (scale >= 160000 && scale < 800000) {
            // 显示省、市
            content = [
                res.province,
                res.city
            ].filter(Boolean).join("\n");
        } else if (scale >= 800000 && scale < 4000000) {
            // 显示省
            content = res.province || "无省份信息";
        } else {
            // 默认情况
            content = "无信息";
        }
        setPopupContent(content);
    };



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
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', }}>
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
                <button
                    style={{ width: '20px', height: '20px', border: 'none' }}
                    className='geoscene-widget--button geoscene-icon-zoom-to-object'
                    onClick={handleLocate}
                    title='定位并跳转'
                >
                </button>
                <button
                    onClick={handleClear}
                    style={{ width: '20px', height: '20px', border: 'none' }}
                    className='geoscene-widget--button geoscene-icon-trash'
                    title='清空定位'
                >


                </button>
            </div>

            {showPopup && (
                <div
                    ref={popupRef}
                    style={{
                        position: 'absolute',
                        bottom: '100%', // 显示在按钮上方
                        right: '0',
                        marginBottom: '8px', // 与按钮的间距
                        backgroundColor: '#ffffff',
                        border: '1px solid #ccc',
                        padding: '10px',
                        width: '250px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <div style={{
                            top: '0px',
                            left: '0px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}>
                            地点
                            <div style={{
                                left: '0px',
                                fontSize: '12px',
                                fontWeight: 'normal',
                                height: '50px',
                                marginTop: '8px',
                            }}>
                                {popupContent}
                            </div>
                        </div>



                        <button
                            onClick={() => {
                                setShowPopup(false);
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                marginLeft: '10px',
                            }}
                        >
                            ❎
                        </button>
                    </div>
                </div>
            )}
            <button
                style={{ width: '130px', height: '20px', border: 'none' }}
                className='geoscene-widget--button geoscene-icon-map-pin'
                onClick={() => {
                    getViewCenter()
                    setShowPopup(true)
                }}
            >
                <span>获取中心点信息</span>
            </button>


        </div>
    );
};

export default MapBottom;


