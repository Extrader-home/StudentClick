//app.js
function promisify(api) {
  return (opt, ...arg) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, opt, { success: resolve, fail: reject }), ...arg)
    })
  }
}

App({
  globalData:{
  },
  request: promisify(wx.request),
  getUserInfo: promisify(wx.getUserInfo),
  onLaunch: function(){  // 监听小程序初始化
    wx.cloud.init({
      env: 'smartwinclose',
      traceUser: true,
    });
    // 获取用户信息
    wx.getSetting({  //获取用户的当前设置。
      success: res => {
        if (res.authSetting['scope.userInfo']) {  // 用户授权设置信息，详情参考  scope.userInfo->用户信息
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
})