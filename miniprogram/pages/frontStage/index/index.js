// index.js
import { fHttp } from "../../../utils/http";
import { goto } from "../../../utils/service";

const app = getApp();

Page({
  data: {
    isLogon: false,
    longTap: false,
    timeout: null
  },

  async onShow() {
    this.setData({
      longTap: false
    });

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
          this.setData({
            isLogon: true
          });
        }
      } catch (e) {
        wx.showToast({
          title: '请求失败'
        });
      }
    }
  },

  async goto(event) {
    console.log(app.globalData);
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
      goto(event);
    }
  },

  onlongtap(event) {
    const timeout = setTimeout(() => {
      goto(event);
    }, 1000);
    this.setData({
      longTap: true,
      timeout: timeout
    });
  },
  
  ontouchend() {
    this.data.timeout && clearTimeout(this.data.timeout);
    this.setData({
      longTap: false
    });
  }
});
