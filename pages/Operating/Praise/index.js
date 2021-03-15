const app = getApp();
import list from '../../../config';
import Dialog from '../../../dist/dialog/dialog';
Page({
  data: {
    studentid: '',
    class_name: wx.getStorageSync('class_name'),
  },

  // 监听用户下拉动作
	onPullDownRefresh: function(){
  },

  // 监听页面加载
  onLoad: function (){
    wx.setNavigationBarTitle({
      title: "表扬操作"
    });
  },

  send_all_praise(){
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
    Dialog.confirm({
      title: '是否确认'+this.data.class_name+'集体表扬？',
    }).then(() => {
      console.log("确认集体表扬");
      wx.request({
        url: list[0].api_url+'integral/praise_integral.php',
        data: {
          class_name: this.data.class_name,
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
              message: "操作失败！" ,
            });
          }else if(res.data == "1"){
            Dialog.confirm({
              title: "提示",
              message: "操作成功！",
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
    }).catch(() => {
      console.log("取消集体表扬");
    });
  },

  id_change(e){
    this.data.studentid = e.detail;
  },

  send_praise(){
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
    Dialog.confirm({
      title: '是否确认表扬该学生？',
    }).then(() => {
      console.log("确认表扬该学生");
      wx.request({
        url: list[0].api_url+'integral/praise_integral.php',
        data: {
          studentid: this.data.studentid,
          class_name: this.data.class_name,
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
              message: "操作失败，请检查输入内容！" ,
            });
          }else if(res.data == "1"){
            Dialog.confirm({
              title: "提示",
              message: "操作成功！",
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
    }).catch(() => {
      console.log("取消表扬该学生");
    });
  },

})

