import { fHttp } from "../../../../utils/http";
import { images } from "../../../../utils/constance";

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
    prizeName: '',
    doubleStar: images.doubleStar,
    cardBack: images.cardBack,
    cardEmpty: images.cardEmpty,
    cardWinArr: [images.card1, images.card2, images.card3, images.card4, images.card5, images.card6, images.card7],
    cardResultImg: images.cardEmpty,
    flipping: false,
    drawing: false,
    drawResult: false,
    flippingEnd: false
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
      this.setData({
        flipping: false,
        flippingEnd: false
      });
      if (this.data.surplusDrawTimes === 0) {
        wx.showToast({
          title: '您已无抽奖次数',
          icon: 'error'
        });
        this.setData({
          drawing: false
        });
        return;
      }
      const result = await fHttp.activity.draw(this.data.activityId, app.globalData.userInfo.id);

      await this.getSurplusDrawTimes();

      this.setData({
        drawing: true,
        drawResult: result,
        cardResultImg: result ? this.data.cardWinArr[Math.floor(Math.random() * this.data.cardWinArr.length)] : this.data.cardEmpty
      });
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
  },

  flip() {
    this.setData({
      flipping: true
    });
    setTimeout(() => {
      wx.showToast({
        title: this.data.drawResult ? '恭喜您！' : '很遗憾！',
        icon: this.data.drawResult ? 'success' : 'error'
      });
      this.setData({
        flippingEnd: true
      });
    }, 3000);
  }
})