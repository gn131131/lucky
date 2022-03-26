// index.js
import { images } from "../../../utils/constance";
import { fHttp } from "../../../utils/http";
import { goto } from "../../../utils/service";

const app = getApp();

Page({
  data: {
    isLogon: false,
    longpress: false,
    timeout: null,
    doubleStar: images.doubleStar,
    canEnter: false
  },

  async onShow() {
    this.setData({
      longpress: false
    });

    // 全局保存用户信息，无用户信息从数据库拉取
    console.log('全局变量', app.globalData)
    if (app.globalData.userInfo.id) {
      this.setData({
        isLogon: true
      });
    } else {
      try {
        const isLogon = await fHttp.user.checkLogon();
        if (isLogon) {
          app.globalData.userInfo = isLogon;
        }
        this.setData({
          canEnter: true,
          isLogon: !!isLogon
        });
      } catch (e) {
        wx.showToast({
          title: '请求失败'
        });
      }
    }
  },

  async goto(event) {
    console.log(app.globalData);
    if (this.data.canEnter) {
      if (this.data.isLogon) {
        goto(event);
      } else {
        const profile = await wx.getUserProfile({desc: '用于完善会员资料'});
        const userId = await fHttp.user.save({
          nickName: profile.userInfo.nickName,
          avatarUrl: profile.userInfo.avatarUrl
        });
        const userInfo = profile.userInfo;
        userInfo.id = userId;
        app.globalData.userInfo = userInfo;
        this.setData({
          isLogon: true
        });
        goto(event);
      }
    }
  },

  onlongpress(event) {
    const timeout = setTimeout(() => {
      goto(event);
    }, 1000);
    this.setData({
      longpress: true,
      timeout: timeout
    });
  },
  
  ontouchend() {
    this.data.timeout && clearTimeout(this.data.timeout);
    this.setData({
      longpress: false
    });
  }
});
