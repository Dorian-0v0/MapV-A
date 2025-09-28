import { tenxunkey, tiandituKey } from "@/utils/request";
import instance from "@/utils/request";
export const inverseGeoService = async (location) => {
    const { longitude, latitude } = location;
    console.log("逆地理编码服务参数：", location);
// http://api.tianditu.gov.cn/geocoder
        const response = await instance.get("http://api.tianditu.gov.cn/geocoder", {
            params: {
                postStr: JSON.stringify({
                    lon: longitude,
                    lat: latitude,
                    ver: 1
                }),
                type: 'geocode',
                tk: tiandituKey
            }
        });
        console.log("响应数据：", response);
        if (response.status == 0) {
            const { addressComponent } = response.result;
            const { town, county, city, province, poi, county_code } = addressComponent;
            console.log("逆地理编码服务返回数据：", addressComponent);
            return {
                town: town,
                county: county,
                city: city,
                province: province,
                poi: poi,
                countyCode: county_code
            };
        } else {
            console.error("逆地理编码服务返回错误：", response.result.msg);
            return null;
        }

  
}

// 获取天气状况
export const weatherService = async (locationCode: string) => {
    try {
        const response = await instance.get(`https://apis.map.qq.com/ws/weather/v1/`, {
            params: {
                location: locationCode,
                key: tenxunkey
            }
        });
        console.log("响应数据：", response);
        if (response.data.status != 0) {
            console.error("获取", response.data.msg);
        }

    } catch (error) {
        console.error("获取数据时发生错误：", error);
    }
}