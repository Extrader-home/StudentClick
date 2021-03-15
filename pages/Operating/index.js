const app = getApp();
import Dialog from '../../dist/dialog/dialog';
import list from '../../config';
Page({
  data: {
    show_add_points: false,
    show_minus_points: false,
    reason: '',
    points: '',
    student_id: '',
    class_name : wx.getStorageSync('class_name'),
  },

  // 监听用户下拉动作
	onPullDownRefresh: function(){
  },

  // 监听页面加载
  onLoad: function (){
    wx.setNavigationBarTitle({
      title: "积分操作"
    });
  },

  // 模块跳转
  goto_mode(e){
    wx.navigateTo({
			url: e.target.dataset.url
    });
  },

  // 加分
  add_points(){
    this.setData({
      show_add_points: true
    });
  },
  
  // 减分
  minus_points(){
    this.setData({
      show_minus_points: true
    });
  },
  add_points_confirm(){
    this.setData({
      show_add_points: false
    });
    var reason = this.data.reason;
    var points = this.data.points;
    var student_id = this.data.student_id;
    var class_name = this.data.class_name;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var Hours = date.getHours();
    var Minutes = date.getMinutes();
    var Seconds = date.getSeconds();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var time = year + '-' + month + '-' + day + ' ' + Hours + ':' + Minutes + ':' + Seconds;   
    wx.request({
      url: list[0].api_url+'integral/add_integral.php',
      data: {
        reason: reason,
        points: points,
        studentid: student_id,
        class_name: class_name,
        time: time,
      }, 
      method: 'POST', // 声明POST请求  
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function(res){  
        if(res.data == "0"){
          Dialog.confirm({
            title: "提示",
            message: "加分失败，请检查输入内容！" ,
          });
        }else if(res.data == "1"){
          Dialog.confirm({
            title: "提示",
            message: "加分成功！",
          });
        }else if(res.data == "2"){
          Dialog.confirm({
            title: "提示",
            message: "该班级无该学号学生！",
          });
        }else{
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器错误" ,
          });
        }
      },
      fail: function(fail) {  
        Dialog.confirm({
          title: "警告⚠",
          message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
        });
      },  
      complete: function(arr) { },
    })
    this.setData({
      reason: '',
      points: '',
    });
  },
  add_points_cancel(){
    this.setData({
      show_add_points: false
    });
    this.setData({
      reason: '',
      points: '',
    });
  },
  minus_points_confirm(){
    this.setData({
      show_minus_points: false
    });
    var reason = this.data.reason;
    var points = this.data.points;
    var student_id = this.data.student_id;
    var class_name = this.data.class_name;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var Hours = date.getHours();
    var Minutes = date.getMinutes();
    var Seconds = date.getSeconds();
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var time = year + '-' + month + '-' + day + ' ' + Hours + ':' + Minutes + ':' + Seconds;   
    wx.request({
      url: list[0].api_url+'integral/add_integral.php',
      data: {
        reason: reason,
        points: points,
        studentid: student_id,
        class_name: class_name,
        time: time,
      }, 
      method: 'POST', // 声明POST请求  
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function(res){  
        if(res.data == "0"){
          Dialog.confirm({
            title: "提示",
            message: "减分失败，请检查输入内容！" ,
          });
        }else if(res.data == "1"){
          Dialog.confirm({
            title: "提示",
            message: "减分成功！",
          });
        }else if(res.data == "2"){
          Dialog.confirm({
            title: "提示",
            message: "该班级无该学号学生！",
          });
        }else{
          Dialog.confirm({
            title: "提示",
            message: "服务器未响应",
          });
        }
      },
      fail: function(fail) {  
        Dialog.confirm({
          title: "警告⚠",
          message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
        });
      },  
      complete: function(arr) { },
    })
    this.setData({
      reason: '',
      points: '',
    });
  },
  minus_points_cancel(){
    this.setData({
      show_minus_points: false
    });
    this.setData({
      reason: '',
      points: '',
    });
  },
  reason_change: function(e){
    this.data.reason = e.detail;
  },
  points_change: function(e){
    this.data.points = e.detail;
  },
  id_change: function(e){
    this.data.student_id = e.detail;
  },
})

