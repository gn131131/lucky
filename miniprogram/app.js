// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-0g1wolpycd36fec2',
        traceUser: true,
      });
    }

    this.globalData = {
      userInfo: {}
    };

    this.autoUpdate();
  },
  autoUpdate: function(){
    let _this = this
    // 获取小程序更新机制的兼容，由于更新的功能基础库要1.9.90以上版本才支持，所以此处要做低版本的兼容处理
    if(wx.canIUse('getUpdateManager')){
      // wx.getUpdateManager接口，可以获知是否有新版本的小程序、新版本是否下载好以及应用新版本的能力，会返回一个UpdateManager实例
      const updateManager = wx.getUpdateManager()
      // 检查小程序是否有新版本发布，onCheckForUpdate：当小程序向后台请求完新版本信息，会通知这个版本告知检查结果
      updateManager.onCheckForUpdate(function(res){
        // 请求完新版本信息的回调
        if(res.hasUpdate){
          // 检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序',
            success: function(res){
              if(res.confirm){
                // 用户确定更新小程序，小程序下载和更新静默进行
                _this.downLoadAndUpdate(updateManager)
              }else if(res.cancel){
                // 若用户点击了取消按钮，二次弹窗，强制更新，如果用户选择取消后不需要进行任何操作，则以下内容可忽略
                wx.showModal({
                  title: '提示',
                  content: '本次版本更新涉及到新功能的添加，旧版本将无法正常使用',
                  showCancel: false, // 隐藏取消按钮
                  confirmText: '确认更新', // 只保留更新按钮
                  success: function(res){
                    if(res.confirm){
                      // 下载新版本，重启应用
                      _this.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        } 
      })
    } else {
      // 在最新版本客户端上体验小程序
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
      })
    }
  },
  // 下载小程序最新版本并重启
  downLoadAndUpdate: function(updateManager){
    wx.showLoading()
    // 静默下载更新小程序新版本，onUpdateReady：当新版本下载完成回调
    updateManager.onUpdateReady(function(){
      wx.hideLoading()
      // applyUpdate：强制当前小程序应用上新版本并重启
      updateManager.applyUpdate()
    })
    // onUpdateFailed：当新版本下载失败回调
    updateManager.onUpdateFailed(function(){
      // 下载新版本失败
      wx.showModal({
        title: '已有新版本',
        content: '新版本已经上线了，请删除当前小程序，重新搜索打开',
      })
    })
  }
});
