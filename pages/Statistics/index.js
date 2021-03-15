const app = getApp();
import list from '../../config';
Page({
  data: {
    absent_student_list: [],
    leave_student_list: [],
  },

  // 监听用户下拉动作
	onPullDownRefresh: function(){
    wx.showLoading({
			title: '加载中',
		});
    this.onLoad();
    wx.hideLoading();
  },

  // 监听页面加载
  onLoad: function (){
    var that = this;
    var class_name = wx.getStorageSync('class_name');
    wx.setNavigationBarTitle({
      title: class_name+"详情统计"
    })
    return new Promise(function (resolve, reject){
      // 获取缺勤学生列表
      wx.request({
        url: list[0].api_url+'absent/absent_statistics.php',
        data: {
          class_name: class_name
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          that.data.absent_student_list = res.data;
          that.setData({
            absent_student_list: that.data.absent_student_list,
            absent_student_list_length: that.data.absent_student_list.length
          });
        },
        fail: function(fail) {  
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      });
      // 获取请假学生列表
      wx.request({
        url: list[0].api_url+'leave/leave_statistics.php',
        data: {
          class_name: class_name
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          that.data.leave_student_list = res.data;
          that.setData({
            leave_student_list: that.data.leave_student_list,
            leave_student_list_length: that.data.leave_student_list.length
          });
        },
        fail: function(fail) {
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      });
      // 获取迟到学生列表
      wx.request({
        url: list[0].api_url+'late/late_statistics.php',
        data: {
          class_name: class_name
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          that.setData({
            d_w_m: res.data,
          });
        },
        fail: function(fail) {
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      });
    });
  },
  // 缺勤学生点击跳转
  absent_click(e){
    wx.setStorage({
      key:"student_id",
      data:e.currentTarget.dataset.id
    });
    wx.navigateTo({
			url: e.target.dataset.url
    });
  },

  // 请假学生点击跳转
  leave_click(e){
    wx.setStorage({
      key:"student_id",
      data:e.currentTarget.dataset.id
    });
    wx.navigateTo({
			url: e.target.dataset.url
    });
  },

  // 日迟到跳转
  goto_day(){
    // console.log("goto day");
    wx.setStorage({
      key:"d_w_m",
      data:"day"
    });
    wx.navigateTo({
			url: "./late_details/index"
    });
  },

  // 周迟到跳转
  goto_week(){
    // console.log("goto week");
    wx.setStorage({
      key:"d_w_m",
      data:"week"
    });
    wx.navigateTo({
			url: "./late_details/index"
    });
  },

  // 月迟到跳转
  goto_month(){
    // console.log("goto month");
    wx.setStorage({
      key:"d_w_m",
      data:"month"
    });
    wx.navigateTo({
			url: "./late_details/index"
    });
  },
})

