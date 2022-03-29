import { fHttp } from "../../../../utils/http";

const app = getApp();

// pages/frontStage/activity/draw/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isParticipate: false,
    activityCode: '',
    activityId: '',
    showProbability: 0,
    surplusDrawTimes: 0,
    certainTimes: 0,
    prizeName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('是否已参与', options.isParticipate);
    this.setData({
      activityId: options.activityId,
      isParticipate: options.isParticipate === 'true',
      prizeName: options.prizeName
    });

    if (this.data.isParticipate) {
      this.getSurplusDrawTimes();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  },

  onInput(evt) {
    const value = evt.detail.value;
    this.setData({
      activityCode: value
    });
  },

  async verifyActivityCode() {
    try {
      const result = await fHttp.activity.checkCode(this.data.activityId, this.data.activityCode);
      
      if (result) {
        await this.participate();
      } else {
        wx.showToast({
          title: '错误的活动码',
          icon: 'error'
        });
      }
    } catch (e) {
      console.error(e);
    }
  },

  async participate() {
    try {
      await fHttp.activity.participate(this.data.activityId, app.globalData.userInfo.id);

      this.setData({
        isParticipate: true
      });

      await this.getSurplusDrawTimes();
    } catch (e) {
      console.error(e);
    }
  },

  async draw() {
    try {
      await wx.showLoading({
        title: '正在抽奖！',
        mask: true
      });
      if (this.data.surplusDrawTimes === 0) {
        wx.showToast({
          title: '您已无抽奖次数',
          icon: 'error'
        });
        return;
      }
      const result = await fHttp.activity.draw(this.data.activityId, app.globalData.userInfo.id);
      console.log('抽奖结果', result ? '中奖' : '未中奖');
      wx.showToast({
        title: result ? '中奖' : '未中奖',
        icon: result ? 'success' : 'error'
      });

      await this.getSurplusDrawTimes();
    } catch (e) {
      console.error(e);
      wx.showToast({
        title: e
      });
    }
  },

  async getSurplusDrawTimes() {
    try {
      const result = await fHttp.activity.getSurplusDrawTimes(this.data.activityId, app.globalData.userInfo.id);
      
      this.setData({
        surplusDrawTimes: result.surplusDrawTimes,
        showProbability: result.showProbability,
        certainTimes: result.certainTimes
      });
    } catch (e) {
      console.error(e);
      wx.showToast({
        title: e
      });
    }
  }
})