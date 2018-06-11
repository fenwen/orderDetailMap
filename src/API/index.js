import axios from 'axios';

const getLacation = "http//www.quickxs.com/vcloudwood-gateway/vcloudwood/gateway/query.v";
let localUrl='https://gwt.56linked.com';//本地调接口
let devURL = 'http://testllservice.56linked.cn';//测试环境
let prodURL = 'http://www.quickxs.com';//正式环境
let orgCode = 'fda054f5915d37cd07d7b199331761a8' //测
// let orgCode = '5a6882eb2167ed0860d1967af569f5fd' //正

let util = axios.create({
  baseURL: devURL
});

export {
  getLacation,
  orgCode,
  util
}
