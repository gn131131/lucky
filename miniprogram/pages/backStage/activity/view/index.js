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
    userCount: 1000000,
    timesArr: [],
    proArr: [],
    participateUserList: []
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

      data.activeTimeRange = data.activeTimeRange.split('#').map(item => transDate(item)).join(' 到 ');

      data.participateUserList.forEach(item => {
        item.canUpdate = false;
      });

      this.setData({
        activityData: data,
        participateUserList: data.participateUserList
      });
    } catch (e) {
      console.error(e);
    }
  },

  onInput(e) {
    const times = +e.detail.value;
    this.setData({
      userCount: times
    });
  },

  onInputFormValue(e) {
    const value = e.currentTarget.dataset.type === 'number' ? +e.detail.value : e.detail.value;
    const key = e.currentTarget.dataset.key;
    this.data.activityData[key] = value;
    this.setData({
      activityData: this.data.activityData
    });
  },

  onInputPrizeName(e) {
    const value = e.detail.value;
    const index = e.currentTarget.dataset.index;
    this.data.activityData.prizeList[index].name = value;
    this.setData({
      activityData: this.data.activityData
    });
  },

  async onDisabled(e) {
    const status = e.currentTarget.dataset.status;
    this.data.activityData.status = +status;
    try {
      await bHttp.activity.update(this.data.activityData);
      wx.showToast({
        title: '更新成功'
      });
      await this.queryActivityById();
    } catch (e) {
      console.error(e);
    }
  },

  async onUpdate(e) {
    const status = e.currentTarget.dataset.status;

    this.data.activityData.publishStatus = +status;

    try {
      await bHttp.activity.update(this.data.activityData);
      await wx.showToast({
        title: '更新成功'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  },

  changeSurplusDrawTimes(e) {
    const surplusDrawTimes = +e.detail.value;
    const index = e.currentTarget.dataset.index;
    
    const oldData = this.data.participateUserList[index].surplusDrawTimes;
    const dValue = surplusDrawTimes - oldData;

    const drawTimes = this.data.participateUserList[index].drawTimes + dValue;

    this.data.participateUserList[index].surplusDrawTimes = surplusDrawTimes < 0 ? 0 : surplusDrawTimes;
    this.data.participateUserList[index].drawTimes = drawTimes < 0 ? 0 : drawTimes;
    this.data.participateUserList[index].canUpdate = true;

    this.setData({
      participateUserList: this.data.participateUserList
    });
  },

  async onSaveParticipateUser(e) {
    const index = e.currentTarget.dataset.index;
    this.data.participateUserList[index].canUpdate = false;
    const data = this.data.participateUserList[index];
    console.log(data);
    await bHttp.activity.updateParticipateUser(data);
    await wx.showToast({
      title: '更新成功'
    });
    this.setData({
      participateUserList: this.data.participateUserList
    });
  },

  deleteItem() {
    wx.showModal({
      title: '警告',
      content: '确认删除此活动！',
      confirmColor: '#FF0000',
      success: (res) => {
        if (res.confirm) {
          this.doDeleteItem();
        }
      }
    });
  },

  async doDeleteItem() {
    try {
      await bHttp.activity.deleteById(this.data.activityData.id);
      await wx.showToast({
        title: '删除成功'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (e) {
      console.error(e);
      wx.showToast({
        title: '删除失败'
      }); 
    }
  },

  async batchDraw() {
    await wx.showLoading({
      title: '计算中',
      mask: true
    });
    const res = JSON.parse(JSON.stringify(this.data.activityData));
    // 定剩余抽取次数
    res.surplusDrawTimes = res.drawTimes;
    
    // 按中奖次数统计
    const tempArr = [];
    const summaryArr = [];
    const tempArr2 = []
    for (let i = this.data.userCount; i--;) {
      const params = {
        drawTimes: res.drawTimes,
        surplusDrawTimes: res.surplusDrawTimes,
        probability: res.probability
      };
      const winArr = [];
      this.doDraw(params, tempArr, tempArr2, winArr, true);
      summaryArr.push(winArr);
    }

    const timesArr = [];
    tempArr.forEach(item => {
      const element = timesArr.find(ele => ele.winTimes === item.winTimes);
      if (element) {
        element.count++;
      } else {
        timesArr.push({
          count: 1,
          winTimes: item.winTimes
        });
      }
    });
    const total = {count: 0, winTimes: '统计'};
    timesArr.forEach(item => {
      total.count = item.count + total.count;
    });
    timesArr.push(total);
    timesArr.forEach(item => {
      item.percent = (item.count / this.data.userCount * 100).toFixed(2);
    });

    // 按中奖概率统计
    const tempObj = {};
    summaryArr.forEach(item => {
      item.forEach(e => {
        if (tempObj[e.currentProbability] !== undefined) {
          tempObj[e.currentProbability]++;
        } else {
          tempObj[e.currentProbability] = 1;
        }
      });
    });
    let tempObj2 = {};
    tempArr2.forEach(item => {
      if (tempObj2[item] !== undefined) {
        tempObj2[item]++;
      } else {
        tempObj2[item] = 1;
      }
    });
    const resultProArr = [];
    for (let key in tempObj) {
      resultProArr.push({
        count: tempObj[key],
        currentProbability: key,
        drawTimes: tempObj2[key],
        percent: (tempObj[key] / tempObj2[key] * 100).toFixed(2)
      });
    }
    const totalPro = {count: 0, drawTimes: 0};
    resultProArr.forEach(item => {
      totalPro.count = item.count + totalPro.count;
      totalPro.drawTimes = item.drawTimes + totalPro.drawTimes;
    });
    totalPro.percent = (totalPro.count / (this.data.userCount * this.data.activityData.drawTimes) * 100).toFixed(2);
    resultProArr.push(totalPro);

    this.setData({
      timesArr: timesArr.sort((a, b) => {
        return a.winTimes - b.winTimes
      }),
      proArr: resultProArr.sort((a, b) => {
        return a.currentProbability - b.currentProbability
      }),
    });
    await wx.hideLoading();
  },

  doDraw(result, arr, arr2, winArr, isNew) {
    if (result.surplusDrawTimes > 0) {
      // 当前活动中奖概率
      const probabilityList = result.probability;
      
      // console.log('中奖概率', probabilityList)
      // 当前概率索引，检查之前有没有中奖，中奖的话按最少剩余抽奖次数算当前概率
      let currentDrawIndex = 0;
      if (winArr.length > 0) {
        const lastWinSurplusDrawTimes = winArr.sort((a, b) => {
          return a.surplusDrawTimes - b.surplusDrawTimes;
        })[0].surplusDrawTimes;
        currentDrawIndex = lastWinSurplusDrawTimes - result.surplusDrawTimes;
      } else {
        currentDrawIndex = result.drawTimes - result.surplusDrawTimes;
      }
      // console.log('概率索引', currentDrawIndex)
      // 索引超长，从头计算
      if (currentDrawIndex > probabilityList.length - 1) {
        currentDrawIndex = currentDrawIndex - probabilityList.length;
        // console.log('索引超长，重新计算索引', currentDrawIndex)
      }

      // 当前抽奖概率
      const currentProbability = +probabilityList[currentDrawIndex];

      arr2.push(currentProbability);

      // 随机数
      const randomNum = Math.ceil(Math.random() * 100);
      // console.log('当前概率', currentProbability + '%')
      // console.log('随机数', randomNum)
      // console.log('是否中奖', randomNum <= currentProbability)
      result.surplusDrawTimes--;
      if (isNew) { // 首次进行抽奖
        if (randomNum <= currentProbability) { // 中奖
          arr.push({
            winTimes: 1
          });
          winArr.push({
            surplusDrawTimes: result.surplusDrawTimes,
            currentProbability: currentProbability
          });
        } else {
          arr.push({
            winTimes: 0
          });
        }
      } else { // 非首次抽奖
        if (randomNum <= currentProbability) { // 中奖
          arr[arr.length - 1].winTimes++;
          winArr.push({
            surplusDrawTimes: result.surplusDrawTimes,
            currentProbability: currentProbability
          });
        }
      }
      this.doDraw(result, arr, arr2, winArr, false);
    }
  },

  onInputProbability(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.data.activityData.probability[index] = +value;
    this.setData({
      activityData: this.data.activityData
    });
  },

  onInputShowProbability(e) {
    console.log(e);
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.data.activityData.showProbability[index] = +value;
    this.setData({
      activityData: this.data.activityData
    });
  },

  onAddProbability() {
    this.data.activityData.probability.push(100);
    this.data.activityData.showProbability.push(100);
    this.setData({
      activityData: this.data.activityData
    });
  },
  onRemoveProbability() {
    this.data.activityData.probability.pop();
    this.data.activityData.showProbability.pop();
    this.setData({
      activityData: this.data.activityData
    });
  }
})