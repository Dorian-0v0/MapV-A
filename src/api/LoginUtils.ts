import axios from 'axios';
interface account{
    username: string,
    password: string
    remember?: boolean
}
export const loginUtilService = async (account: account) => {
        const response = await axios.post("\login", account);
        console.log("响应数据：", response);
        if (response.data.status === "0") {
            const { addressComponent } = response.data.result;
            const { town, county, city, province, poi, county_code } = addressComponent;

            return {
                town: town,
                county: county,
                city: city,
                province: province,
                poi: poi,
                countyCode: county_code
            };
        } else {
            console.error("逆地理编码服务返回错误：", response.data.msg);
            return null;
        }

  
}

