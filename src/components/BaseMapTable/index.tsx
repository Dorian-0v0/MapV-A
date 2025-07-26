import Basemap from "@geoscene/core/Basemap";
import WebTileLayer from "@geoscene/core/layers/WebTileLayer";
import BasemapGallery from "@geoscene/core/widgets/BasemapGallery";
import { Button } from "antd";
import { useRef } from "react";

const BaseMapTable = ({ mapView }: any) => {
    console.log("mapView", mapView);
    
    const basemapGalleryContainerRef = useRef<HTMLDivElement>(null);
    const tiandituVector = Basemap.fromId("tianditu-vector");
    tiandituVector.thumbnailUrl = "./public/images/天地图矢量.png";

    const tiandituImage = Basemap.fromId("tianditu-image");
    tiandituImage.thumbnailUrl = "./public/images/天地图影像.png";


    const basemapGallery = new BasemapGallery({
        view: mapView,
        container: basemapGalleryContainerRef.current || undefined,
        source: [
            tiandituVector, tiandituImage,
            {
                baseLayers: [
                    new WebTileLayer({
                        urlTemplate: "https://webst0{subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                        subDomains: ["0", "1", "2", "3", "4"]
                    })
                ],
                title: "高德矢量底图(火星坐标系)",
                id: "gaode-ve-basemap",
                thumbnailUrl: "./public/images/高德地图矢量.png"
            },
            {
                baseLayers: [
                    new WebTileLayer({
                        urlTemplate: "https://webst0{subDomain}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=6&x={x}&y={y}&z={z}",
                        subDomains: ["0", "1", "2", "3", "4"]
                    })
                ],
                title: "高德影像底图(火星坐标系)",
                id: "gaode-im-basemap",
                thumbnailUrl: "./public/images/高德地图影像.png"
            },
            {
                baseLayers: [],
                title: "空白底图",
                id: "empty-basemap",
            }
        ]
    });
    mapView.when(() => {
        mapView.ui.add(basemapGallery, "top-right")
    })

    return (
        <div>
            {/* 自定义底图选择器容器 */}
            <div
                ref={basemapGalleryContainerRef}
            >
                <h3>
                    底图选择器
                </h3>
                <div>
                    <Button>添加新底图</Button>
                </div>
            </div>
        </div>
    )
}

export default BaseMapTable;