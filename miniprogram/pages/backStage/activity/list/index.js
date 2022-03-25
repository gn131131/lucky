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
  onShow: function () {
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

  async queryListByPage() {
    const res = await bHttp.activity.queryListByPage({page: this.data.page});
    this.setData({
      list: res.records,
      page: res.page
    });
  },

  goto(event) {
    if (event.currentTarget.dataset.item) {
      const id = event.currentTarget.dataset.item.id;
      goto(event, {id});
    } else {
      goto(event);
    }
  },

  async deleteItem(event) {
    try {
      const id = event.currentTarget.dataset.item.id;
      await bHttp.activity.deleteById(id);
      wx.showToast({
        title: '删除成功'
      }); 
      await this.queryListByPage();
    } catch (e) {
      console.error(e);
      wx.showToast({
        title: '删除失败'
      }); 
    }
  }
})