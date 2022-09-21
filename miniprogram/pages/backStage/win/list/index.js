import { bHttp } from "../../../../utils/http";
import { transDate } from "../../../../utils/service";

// pages/backStage/win/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    userId: '',
    page: {
      pageNum: 1,
      pageSize: 10
    },
    pullDownRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId: options.userId
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
  onShow() {
    this.data.page.pageNum = 1;
    this.data.list = [];
    this.queryListByPage();
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
  async onPullDownRefresh() {
    if (this._freshing) return;
    this._freshing = true;
    this.data.page.pageNum = 1;
    this.data.list = [];
    await this.queryListByPage();
    this.setData({
      pullDownRefresh: false
    });
    this._freshing = false;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if ((this.data.page.total - this.data.page.pageNum * this.data.page.pageSize) > 0) {
      this.data.page.pageNum++;
      this.queryListByPage();
    } else {
      wx.showToast({
        title: '已加载完全部数据',
        icon: 'error'
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  async queryListByPage() {
    const res = await bHttp.win.queryListByPage({page: this.data.page, userId: this.data.userId});
    this.setData({
      list: this.data.list.concat(res.records).map(item => {
        item.winTime = transDate(item.winTime);
        return item;
      }),
      page: res.page
    });
    wx.stopPullDownRefresh();
  },
})