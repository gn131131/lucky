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
      maxBoxNum: 0,
      drawTimes: 5,
      activityCode: 'abcd1234',
      showProbability: 0
    },
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    templateList: []
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
  async onShow() {
    await this.getTemplateList();
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

  async getTemplateList() {
    const templateList = await bHttp.template.queryList();
    this.setData({
      templateList: templateList
    });
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.data.formValue[key] = value;
    this.setData({
      formValue: this.data.formValue
    });
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
  },

  onSelectTrueTemplate(event) {
    const index = event.detail.value;
    const templateItem = this.data.templateList[index];

    const probability = [];
    for (let i = templateItem.maxBoxNum; i--;) {
      probability.push(templateItem.probability);
    }

    this.data.formValue.maxBoxNum = +templateItem.maxBoxNum
    this.setData({
      formValue: this.data.formValue,
      probability: probability
    });
  },
  onAddTrueProbability() {
    this.data.probability.push(100);
    this.data.formValue.maxBoxNum = this.data.probability.length;
    this.setData({
      formValue: this.data.formValue,
      probability: this.data.probability
    });
  },
  onSelectShowTemplate(event) {
    const index = event.detail.value;
    const templateItem = this.data.templateList[index];

    this.data.formValue.showProbability = templateItem.probability;
    this.setData({
      formValue: this.data.formValue
    });
  }
})