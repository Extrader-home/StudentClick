const app = getApp();
import list from '../../config';
Page({
  data: {
    class_list: [],
  },

  // 监听页面加载
  onLoad: function (){
    var that = this;
    return new Promise(function (resolve, reject){
      wx.request({
        url: list[0].api_url+'get_class.php',
        method: 'GET', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          that.data.class_list = res.data;
          that.setData({
            class_list_length: res.data.length,
            class_list: res.data,
            features: wx.getStorageSync('features')
          });
        },
        fail: function(fail) {  
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      })
    });
  },

  set_class(e){
    wx.setStorage({
      key:"class_name",
      data:e.currentTarget.dataset.class
    });
    wx.navigateTo({
			url: e.target.dataset.url
    });
    // console.log(e);
  },
})