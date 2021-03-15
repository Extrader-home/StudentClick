Page({
	data: {
    active: null,
    list:[
      {
        "url": "/pages/index/index",
        "icon": "apps-o",
        "text": "首页"
      },
      {
        "url": "/pages/user/index",
        "icon": "user-circle-o",
        "text": "我的"
      },
    ]
  },

  onChange(event) {
    const nextIndex = event.detail;
    wx.switchTab({
      url: this.data.list[nextIndex].url
    });
  },


  // 在页面的 onLoad 周期设置对应的活跃 tabbar 项
  onLoad: function (options) {
    this.getTabBar().setData({
      // CURRENT_ACTIVE_TABBAR: 自定义常量, 当前页面对应的活跃 tabbar 项
      "tabbars.active": CURRENT_ACTIVE_TABBAR
    });
  },

})
