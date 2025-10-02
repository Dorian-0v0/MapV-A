import React, { useState, useEffect, useRef } from 'react';

import Point from '@geoscene/core/geometry/Point'; // 补充 Point 的导入
import type MapView from '@geoscene/core/views/MapView';
import { inverseGeoService, weatherService } from '@/api/MapServer';
import "./index.less"
import { Button, notification, Switch, Tooltip } from 'antd';
import { EnvironmentOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { GaodeIcon } from '@/assets/icons';
import { useMap } from '@/store/mapStore';

// 定义 props 类型
interface MapBottomProps {
    view: MapView; // 根据实际使用的 ArcGIS API 类型调整
    baseMapName: string;
}

const MapBottom: React.FC<MapBottomProps> = ({ view, baseMapName }) => {
    const [api, contextHolder] = notification.useNotification();
    const [coordinates, setCoordinates] = useState({
        x: parseFloat(view.center.x.toFixed(6)),
        y: parseFloat(view.center.y.toFixed(6)),
    });
    const [scale, setScale] = useState(view.scale);
    const [center, setCenter] = useState<{ longitude: string; latitude: string } | null>(null);
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [enCodeGeoOpen, setEnCodeGeoOpen] = useState(false);
    // 保存事件处理器的引用
    const [geoCodeClickHandler, setGeoCodeClickHandler] = useState();
    // const { map } = useMapStore()
    const {
        map
    } = useMap();

    // 获取天气情况

    // 定义右下角通知
    const openNotification = async (msg: string, result: string) => {
        if (result === "无信息") {
            console.log("显示通知", result);

            api.info({
                key: 0, // 确保信息不堆积
                message: msg, // 标题
                description: result, // 内容
                placement: "bottomRight", // 位置（右下角）
                // className: "custom-notification", // 自定义 CSS 类名
                duration: 5, // 设置为 0，不会自动关闭
                style: { whiteSpace: "pre-line" }, // 关键：保留换行符
            })
            return
        }
        api.success({
            key: 0, // 确保信息不堆积
            message: msg, // 标题
            description: result, // 内容
            placement: "bottomRight", // 位置（右下角）
            duration: 5, // 设置为 0，不会自动关闭
            style: { whiteSpace: "pre-line", width: "350px" }, // 关键：保留换行符
        });
    };

    const enCodeGeo = async (event) => {
        console.log("逆地理编码开始", enCodeGeoOpen);
        try {
            const result = updatePopupContent(await inverseGeoService(event.mapPoint));
            console.log('逆地理编码结果:', result);
            openNotification("地点", result);
        } catch (error) {
            console.error('逆地理编码失败:', error);
        }
    };

    // 开启/关闭地理编码
    const handleEnCodeGeo = () => {

        const mapContainer = view.container;
        if (!enCodeGeoOpen) {
            console.log("开启状态!!!!");
            // 先移除可能已存在的事件处理器
            setGeoCodeClickHandler(view.on('click', enCodeGeo));
            console.log("dewferfger", geoCodeClickHandler);
            setEnCodeGeoOpen(true);
            mapContainer.style.cursor = 'crosshair'
        } else {
            console.log("关闭状态!!!!");
            // 移除事件监听
            geoCodeClickHandler.remove();
            setEnCodeGeoOpen(false);
            mapContainer.style.cursor = 'default'
        }

    };

    // 监听鼠标移动和比例尺变化
    useEffect(() => {
        if (!view) return;
        view.watch('scale', (newScale) => {
            setScale(newScale);
        });

        view.on('pointer-move', (event) => {
            const point = view.toMap({ x: event.x, y: event.y });
            setCoordinates({
                x: parseFloat(point.x.toFixed(6)),
                y: parseFloat(point.y.toFixed(6))
            });
        });



    }, [view]);

    // 定位功能
    const handleLocate = () => {
        console.log("开始定位", longitude, latitude, view);
        view.graphics.removeAll();
        // 去除弹窗
        view.closePopup();
        if (!longitude || !latitude || !view) return;

        const point = new Point({
            x: parseFloat(longitude),
            y: parseFloat(latitude),
        });

        console.log("point", point);


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
        // 使用新的 openPopup 方法添加弹窗
        view.openPopup({
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


    const updatePopupContent = (res) => {
        if (!view || !res) return "无信息";

        const scale = view.scale;
        console.log("缩放比例", scale);

        let content = "";

        if (scale < 18000) {
            // 显示最详细：省、市、区/县、镇、POI
            content = `${res.province} ${res.city} ${res.county}\n${res.town}\nPOI点：${res.poi}`
            console.log("详细地址为", content);

        } else if (scale >= 18000 && scale < 1150000) {
            // 显示：省、市、区/县、镇
            content = `${res.province} ${res.city} ${res.county}\n${res.town}`
        } else if (scale >= 1150000 && scale < 2400000) {
            // 显示：省、市、区/县
            content = `${res.province} ${res.city} ${res.county}`
        } else if (scale >= 2400000 && scale < 5000000) {
            content = `${res.province} ${res.city}`
        } else if (scale >= 5000000 && scale < 30000000) {
            // 只显示省（如果有）
            content = res.province || "无信息";
        } else if (scale >= 30000000) {
            // 比例尺太大，不显示信息
            content = "无信息";
        }
        return content;
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
            <div style={{ width: '150px', fontSize: '9px', fontFamily: "initial", textAlign: 'center' }}>
                {map?.basemap?.title}
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
                    style={{ width: '80px' }}
                />
                <input
                    placeholder="纬度"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    style={{ width: '80px' }}
                />
                <button
                    style={{ width: '20px', height: '20px', border: 'none', backgroundColor: '#d0d9deff' }}
                    className='geoscene-widget--button geoscene-icon-zoom-to-object'
                    onClick={handleLocate}
                    title='定位并跳转'
                >
                </button>
                <button
                    onClick={handleClear}
                    style={{ width: '20px', height: '20px', border: 'none', backgroundColor: '#d0d9deff' }}
                    className='geoscene-widget--button geoscene-icon-trash'
                    title='清空定位'
                >
                </button>
            </div>
            {contextHolder}
            <Tooltip
                title="逆地理编码功能可以将坐标转换为地址信息"
                placement="top"
                overlayStyle={{ maxWidth: 300 }}
            >
                <span style={{ marginRight: 18 }}>
                    <Switch
                        style={{
                            bottom: 2,
                        }}
                        checked={enCodeGeoOpen}
                        size="small"
                        onChange={() => {
                            handleEnCodeGeo()
                        }}
                        checkedChildren="关闭"
                        unCheckedChildren="开启"
                    />
                </span>
                <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'pointer' }} />
            </Tooltip>
            <Button
                style={{
                    marginLeft: 10,
                    height: 20
                }}
                type="primary"
                icon={<GaodeIcon />}
            >
                高德地图工具箱
            </Button>

        </div>
    );
};

export default MapBottom;


