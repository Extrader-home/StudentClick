const app = getApp();
import list from '../../config';
Page({
  data: {
    integral_list_length: 0,
    integral_list: [],
  },

  // 监听用户下拉动作
	onPullDownRefresh: function(){

  },

  // 监听页面加载
  onLoad: function (){
    var that = this;
    var class_name = wx.getStorageSync('class_name');
    wx.setNavigationBarTitle({
      title: "积分统计"
    });
    return new Promise(function (resolve, reject){
      wx.request({
        url: list[0].api_url+'integral/show_integral.php',
        data: {
          class_name: class_name
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          that.data.integral_list = res.data;
          that.setData({
            integral_list_length: that.data.integral_list.length,
            integral_list: that.data.integral_list
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

  goto_details(e){
    wx.setStorage({
      key: "student_id",
      data: e.currentTarget.dataset.id
    });
    wx.navigateTo({
			url: "./Integral_details/index"
    });
  },

})

