import { bHttp } from "../../../../utils/http";

// pages/backStage/activity/add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    probability: [],
    prizeList: [''],
    formValue: {
      name: '活动',
      maxBoxNum: 5,
      drawTimes: 1,
      activityCode: 'abcd1234'
    },
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.data.formValue[key] = value;
    this.setData({
      formValue: this.data.formValue
    });
  },

  calProbability() {
    if (this.data.formValue.maxBoxNum && this.data.prizeList.length > 0) {
      const probability = [];
      for (let i = this.data.formValue.maxBoxNum; i--;) {
        probability.push(0);
      }
      this.recalProbability(probability);

      this.setData({
        probability: probability
      }); 
    }
  },

  recalProbability(probability) {

  },

  onInputProbability(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.data.probability[index] = value;
    this.setData({
      probability: this.data.probability
    });
  },

  addPrize() {
    const prizeList = this.data.prizeList;
    prizeList.push('');
    this.setData({
      prizeList: prizeList
    });
  },

  onInputPrize(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.data.prizeList[index] = value;
    this.setData({
      prizeList: this.data.prizeList
    });
  },

  dateChange(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.setData({
      [key]: value
    });
  },

  async onSave(e) {
    const status = e.currentTarget.dataset.status;

    const params = this.data.formValue;
    params.probability = JSON.stringify(this.data.probability);
    params.prizeList = this.data.prizeList;
    params.publishStatus = +status;
    params.status = 1;
    params.activeTimeRange = `${new Date(`${this.data.startDate} ${this.data.startTime}`).getTime()}#${new Date(`${this.data.endDate} ${this.data.endTime}`).getTime()}`;

    try {
      await bHttp.activity.save(params);

      wx.navigateBack();
    } catch (e) {
      console.error(e);
    }
  }
})