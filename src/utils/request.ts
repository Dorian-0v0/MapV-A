import axios from 'axios';
//定义一个变量,记录公共的前缀
const baseURL = '/api';
const instance = axios.create({ baseURL })
const tiandituKey = '4267820f43926eaf808d61dc07269beb'
export default instance;

const gaodekey = 'a42c844bdcd8035d9d308ba0187ff23c'
export { tiandituKey, gaodekey }