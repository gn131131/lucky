import { bHttp } from "../../../../utils/http";
import { goto } from "../../../../utils/service";

// pages/backStage/activity/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: {
      pageNum: 1,
      pageSize: 10
    }
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
  onPullDownRefresh() {
    this.data.page.pageNum = 1;
    this.data.list = [];
    this.queryListByPage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
    const res = await bHttp.activity.queryListByPage({page: this.data.page});
    this.setData({
      list: this.data.list.concat(res.records),
      page: res.page
    });
    wx.stopPullDownRefresh();
  },

  goto(event) {
    if (event.currentTarget.dataset.item) {
      const id = event.currentTarget.dataset.item.id;
      goto(event, {id});
    } else {
      goto(event);
    }
  }
})