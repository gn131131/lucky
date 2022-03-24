import { bHttp } from "../../../../utils/http";
import { transDate } from "../../../../utils/service";

// pages/backStage/activity/view/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    activityData: {},
    batchDrawTimes: 0,
    resultArr: []
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
  async onShow() {
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
      const data = await bHttp.activity.queryById(this.data.activityId);

      data.activeTimeRange = data.activeTimeRange.split('#').map(item => transDate(item)).join(' ');

      this.setData({
        activityData: data
      });
    } catch (e) {
      console.error(e);
    }
  },

  onInput(e) {
    const times = +e.detail.value;
    this.setData({
      batchDrawTimes: times
    });
  },

  async batchDraw() {
    const result = await bHttp.activity.queryById(this.data.activityId);
    console.log(result);

    const res = JSON.parse(JSON.stringify(result));
    res.surplusDrawTimes = result.drawTimes;
    
    const tempArr = [];
    for (let i = this.data.batchDrawTimes; i--;) {
      const params = {
        drawTimes: res.drawTimes,
        surplusDrawTimes: res.surplusDrawTimes,
        probability: res.probability
      };
      this.doDraw(params, tempArr, true);
    }

    const resultArr = [];
    tempArr.forEach(item => {
      const element = resultArr.find(ele => ele.winTimes === item.winTimes);
      if (element) {
        element.count++;
      } else {
        resultArr.push({
          count: 1,
          winTimes: item.winTimes
        });
      }
    });

    this.setData({
      resultArr: resultArr.sort((a, b) => {
        return a.winTimes - b.winTimes
      })
    });
  },

  doDraw(result, arr, isNew) {
    if (result.surplusDrawTimes > 0) {
      // 当前活动抽奖概率
      const probabilityList = JSON.parse(result.probability || '[]');
      // 当前抽取次数
      const currentDrawIndex = result.drawTimes - result.surplusDrawTimes;
      // 当前抽奖概率
      const currentProbability = +probabilityList[currentDrawIndex];
      // 随机数
      const randomNum = Math.ceil(Math.random() * 100);
      
      result.surplusDrawTimes--;
      if (isNew) {
        if (randomNum <= currentProbability) {
          arr.push({
            winTimes: 1
          });
        } else {
          arr.push({
            winTimes: 0
          });
        }
      } else {
        if (randomNum <= currentProbability) {
          arr[arr.length - 1].winTimes++;
        }
      }
      this.doDraw(result, arr, false);
    }
  }
})