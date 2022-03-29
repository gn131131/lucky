// index.js
import { images } from "../../../utils/constance";
import { fHttp } from "../../../utils/http";
import { goto, transDate } from "../../../utils/service";

const app = getApp();

Page({
  data: {
    isLogon: false,
    longpress: false,
    timeout: null,
    doubleStar: images.doubleStar,
    icon1: images.icon1,
    icon2: images.icon2,
    icon1active: images.icon1active,
    icon2active: images.icon2active,
    iconactive: images.active,
    canEnter: false,
    currentNav: 1,
    nav1Tab: 1,
    nav2Tab: 1,
    nickName: '',

    activity: {
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10
      }
    },

    win: {
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10
      } 
    },

    activityPullDownRefresh: false,
    winPullDownRefresh: false
  },

  async onShow() {
    this.data.activity.page.pageNum = 1;
    this.data.activity.list = [];
    this.data.win.page.pageNum = 1;
    this.data.win.list = [];

    this.setData({
      longpress: false,
      activityPullDownRefresh: true,
      winPullDownRefresh: true
    });

    // 全局保存用户信息，无用户信息从数据库拉取
    console.log('全局变量', app.globalData)
    if (app.globalData.userInfo.id) {
      this.setData({
        isLogon: true,
        nickName: app.globalData.userInfo.nickName
      });
    } else {
      try {
        const isLogon = await fHttp.user.checkLogon();
        if (isLogon) {
          app.globalData.userInfo = isLogon;
        }
        this.setData({
          canEnter: true,
          isLogon: !!isLogon,
          nickName: isLogon ? isLogon.nickName : ''
        });
      } catch (e) {
        wx.showToast({
          title: '请求失败'
        });
      }
    }
  },

  async queryActivityListByPage() {
    const params = {page: this.data.activity.page};
    if (this.data.nav1Tab === 2) {
      params.userId = app.globalData.userInfo.id;
    }
    const res = await fHttp.activity.queryListByPage(params);
    this.setData({
      activity: {
        list: this.data.activity.list.concat(res.records),
        page: res.page
      }
    });
  },

  async queryWinListByPage() {
    const params = {page: this.data.win.page};
    if (this.data.nav2Tab === 2) {
      params.userId = app.globalData.userInfo.id;
    }
    const res = await fHttp.win.queryListByPage(params);
    this.setData({
      win: {
        list: this.data.win.list.concat(res.records).map(item => {
          item.winTime = transDate(item.winTime);
          return item;
        }),
        page: res.page
      }
    });
  },

  onActivityReachBottom() {
    if ((this.data.activity.page.total - this.data.activity.page.pageNum * this.data.activity.page.pageSize) > 0) {
      this.data.activity.page.pageNum++;
      this.queryActivityListByPage();
    } else {
      wx.showToast({
        title: '到底啦！',
        icon: 'error'
      });
    }
  },

  onWinReachBottom() {
    if ((this.data.win.page.total - this.data.win.page.pageNum * this.data.win.page.pageSize) > 0) {
      this.data.win.page.pageNum++;
      this.queryWinListByPage();
    } else {
      wx.showToast({
        title: '到底啦！',
        icon: 'error'
      });
    }
  },

  async goto(event) {
    console.log(app.globalData);
    const id = event.currentTarget.dataset.id;
    if (this.data.canEnter) {
      if (this.data.isLogon) {
        goto(event, {id});
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
        goto(event, {id});
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
  },


  switchNav(e) {
    const type = +e.currentTarget.dataset.type;
    this.setData({
      currentNav: type
    });
  },

  async onActivityPullDownRefresh(e) {
    if (this._freshing_a) return;
    this._freshing_a = true;
    this.data.activity.page.pageNum = 1;
    this.data.activity.list = [];
    await this.queryActivityListByPage();
    this.setData({
      activityPullDownRefresh: false
    });
    this._freshing_a = false;
  },

  async onWinPullDownRefresh() {
    if (this._freshing_w) return;
    this._freshing_w = true;
    this.data.win.page.pageNum = 1;
    this.data.win.list = [];
    await this.queryWinListByPage();
    this.setData({
      winPullDownRefresh: false
    });
    this._freshing_w = false;
  },

  async changeTab(e) {
    const currentNav = +e.currentTarget.dataset.nav;
    const type = +e.currentTarget.dataset.type;

    if (currentNav === 1) {
      this.setData({
        nav1Tab: type
      });
      this.data.activity.list = [];
      this.data.activity.page.pageNum = 1;
      await this.queryActivityListByPage();
    }
    if (currentNav === 2) {
      this.setData({
        nav2Tab: type
      });
      this.data.win.list = [];
      this.data.win.page.pageNum = 1;
      await this.queryWinListByPage();
    }
  }
});
