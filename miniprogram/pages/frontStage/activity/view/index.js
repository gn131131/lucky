import { fHttp } from "../../../../utils/http";
import { goto, transDate } from "../../../../utils/service";

const app = getApp();

// pages/frontStage/activity/view/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    activityData: {},
    isParticipate: false
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

      if (isParticipate) {
      } else {
        await fHttp.activity.watch(this.data.activityId, app.globalData.userInfo.id);
      }
    } catch (e) {
      console.error(e);
    }
  },

  goto(event) {
    goto(event, {isParticipate: this.data.isParticipate, activityId: this.data.activityId, prizeName: this.data.activityData.prizeList[0].name});
  },
})