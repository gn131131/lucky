import { fHttp } from "./http";

const app = getApp();

export const utilsService = {
  http: (url, data) => {
    return new Promise((resolve, reject) => {
      const type = url.slice(0, 3);
      const functionName = type === '/b/' ? "backStageFunctions" : "frontStageFunctions";
      const innerUrl = url.slice(2);

      wx.cloud.callFunction({
        name: functionName,
        data: {
          url: innerUrl,
          data: data ? data : {}
        }
      }).then(res => {
        if (res.result.success) {
          resolve(res.result.data);
        } else {
          reject(res.result.errMsg);
        }
      }).catch(e => {
        reject(e.errMsg);
      });
    });
  }
};

// 跳转，可带参数
export const goto = (event, params) => {
  let url = typeof event === 'string' ? event : event.currentTarget.dataset.url;
  if (params) {
    url += '?';
    for (let key in params) {
      url += `${key}=${params[key]}&`;
    }
    url = url.substring(0, url.length - 1);
  }
  console.log('navigateTo:', url);
  wx.navigateTo({
    url: `/pages/${url}`,
  });
};

export const transDate = (timestamp) => {
  if (timestamp) {
    const date = new Date(+timestamp);
    const year = date.getFullYear();
    const month = zeroFilling(date.getMonth() + 1);
    const day = zeroFilling(date.getDate());
    const hours = zeroFilling(date.getHours());
    const minutes = zeroFilling(date.getMinutes());
    const seconds = zeroFilling(date.getSeconds());
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return '';
};

export const zeroFilling = (num) => {
  return num.toString().padStart(2, '0');
};