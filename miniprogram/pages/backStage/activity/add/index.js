import { bHttp } from "../../../../utils/http";

// pages/backStage/activity/add/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    probability: [],
    showProbability: [],
    prizeList: ['礼物'],
    formValue: {
      name: '活动',
      drawTimes: 5,
      activityCode: 'abcd1234'
    },
    startDate: '1900/01/01',
    startTime: '00:00:00',
    endDate: '2099/12/31',
    endTime: '00:00:00',
    templateList: [],
    saving: false
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
    const dataType = e.currentTarget.dataset.type;
    this.data.formValue[key] = dataType === 'number' ? +value : value;
    this.setData({
      formValue: this.data.formValue
    });
  },

  onInputProbability(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.data.probability[index] = +value;
    this.setData({
      probability: this.data.probability
    });
  },

  onInputShowProbability(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.data.showProbability[index] = +value;
    this.setData({
      showProbability: this.data.showProbability
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
    if (!this.data.saving) {
      this.setData({
        saving: true
      });
      const status = e.currentTarget.dataset.status;

      const params = this.data.formValue;
      params.probability = this.data.probability;
      params.showProbability = this.data.showProbability;
      params.prizeList = this.data.prizeList;
      params.publishStatus = +status;
      params.status = 1;
      params.activeTimeRange = `${new Date(this.data.startDate+' '+this.data.startTime).getTime()}#${new Date(this.data.endDate+' '+this.data.endTime).getTime()}`;
      try {
        await bHttp.activity.save(params);
  
        wx.navigateBack();
      } catch (e) {
        console.error(e);
        this.setData({
          saving: false
        });
      }
    }
  },

  onSelectTemplate(event) {
    const index = event.detail.value;
    const templateItem = this.data.templateList[index];

    const probability = [];
    const showProbability = [];
    for (let i = templateItem.maxNum; i--;) {
      probability.push(templateItem.probability);
      showProbability.push(100);
    }

    const data = {
      formValue: this.data.formValue,
      probability: probability,
      showProbability: showProbability
    };
    if (this.data.showProbability.length > 0) {
      delete data.showProbability;
    }
    this.setData(data);
  },
  onSelectShowTemplate(event) {
    const index = event.detail.value;
    const templateItem = this.data.templateList[index];

    const probability = [];
    const showProbability = [];
    for (let i = templateItem.maxNum; i--;) {
      probability.push(100);
      showProbability.push(templateItem.probability);
    }

    const data = {
      formValue: this.data.formValue,
      probability: probability,
      showProbability: showProbability
    };
    if (this.data.probability.length > 0) {
      delete data.probability;
    }
    this.setData(data);
  },
  onAddProbability() {
    this.data.probability.push(100);
    this.data.showProbability.push(100);
    this.setData({
      probability: this.data.probability,
      showProbability: this.data.showProbability
    });
  },
  onRemoveProbability() {
    this.data.probability.pop();
    this.data.showProbability.pop();
    this.setData({
      probability: this.data.probability,
      showProbability: this.data.showProbability
    });
  }
})