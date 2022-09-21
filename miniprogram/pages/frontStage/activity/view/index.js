import { fHttp } from "../../../../utils/http";
import { goto, transDate } from "../../../../utils/service";
import { images } from "../../../../utils/constance";

const app = getApp();

// pages/frontStage/activity/view/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogon: false,
    canEnter: false,
    activityId: '',
    activityData: {},
    isParticipate: false,
    defaultAvatar: images.defaultAvatar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      activityId: options.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow () {
    await this.queryActivityById();

    // 全局保存用户信息，无用户信息从数据库拉取
    console.log('全局变量', app.globalData)
    if (app.globalData.userInfo.id) {
      this.setData({
        isLogon: true,
        canEnter: true
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  async queryActivityById() {
    try {
      const data = await fHttp.activity.queryById(this.data.activityId);

      data.activeTimeRange = data.activeTimeRange.split('#').map(item => transDate(item)).join(' 到 ');

      // 如果没有参与，则调用围观接口
      const isParticipate = !!data.participateUserList.find(item => item.userId === app.globalData.userInfo.id);
      console.log('是否参与？', isParticipate);

      this.setData({
        activityData: data,
        isParticipate: isParticipate
      });

      await this.watch();
    } catch (e) {
      console.error(e);
    }
  },

  async goto(event) {
    if (this.data.canEnter) {
      if (this.data.isLogon) {
        goto(event, {isParticipate: this.data.isParticipate, activityId: this.data.activityId, prizeName: this.data.activityData.prizeList[0].name});
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
        await this.watch();
        goto(event, {isParticipate: this.data.isParticipate, activityId: this.data.activityId, prizeName: this.data.activityData.prizeList[0].name});
      }
    }
  },

  async watch() {
    if (this.data.isParticipate) {
    } else {
      if (this.data.isLogon) {
        await fHttp.activity.watch(this.data.activityId, app.globalData.userInfo.id);
      }
    }
  }
})