import * as projection from "@geoscene/core/geometry/projection"

export function graphicsToJson(graphics: any) {

    graphics.forEach(function (graphic, index) {
        const geometry = projection.project(graphic.geometry, { wkid: 4326 })
        if (geometry) {

            console.log(`图形 ${index + 1} 的几何类型:`, geometry.type);

            switch (geometry.type) {
                case "point":
                    // 点几何：包含 x, y 坐标
                    const point = geometry;
                    console.log("点坐标:", point.x, point.y);
                    break;

                case "polyline":
                    // 线几何：包含 paths 数组，每个路径是一系列点坐标
                    const polyline = geometry;
                    console.log("线路径:", polyline.paths);
                    // paths 结构示例: [[[x1, y1], [x2, y2], ...], ...]
                    break;

                case "polygon":
                    // 面几何：包含 rings 数组，每个环是一系列点坐标（首尾点相同以闭合）
                    const polygon = geometry;
                    console.log("面环:", polygon.rings);
                    break;
                default:
                    console.log("其他几何类型:", geometry.type);
            }
        }
    });
}