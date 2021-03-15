const app = getApp();
import Dialog from '../../../dist/dialog/dialog';
import list from '../../../config';
Page({
  data: {
    studentid: '',
    student_list:[],
    update_flag: 0,
    action: [
      {
        name: 'A等',
      },
      {
        name: 'B等',
        color: '#1989FA',
      },
      {
        name: '无回课',
        color: '#ee0a24',
      },
    ],
  },

  // 监听用户下拉动作
	onPullDownRefresh: function(){
    wx.showLoading({
			title: '加载中',
		});
    this.onLoad();
    wx.hideLoading();
    // console.log(this.data.student_list);
  },

  toggle(type) {
    this.setData({
      [type]: !this.data[type]
    });
  },
  toggleActionSheet(e) {
    this.data.studentid = e.currentTarget.dataset.id;
    // console.log(this.data.studentid);
    this.toggle('show');
  },

  // 发送学生状态信息，姓名 状态 消息（请假缘由）
  send_student_status(id, status){
    var class_name = wx.getStorageSync('class_name');
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
    if(status === 'A等'){
      wx.request({
        url: list[0].api_url+'integral/backclass_integral.php',
        data: {
          studentid: id,
          class_name: class_name,
          time: time,
          status: "a"
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          console.log(res.data);
        },
        fail: function(fail) {  
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      })
    }else if(status === 'B等'){
      wx.request({
        url: list[0].api_url+'integral/backclass_integral.php',
        data: {
          studentid: id,
          class_name: class_name,
          time: time,
          status: "b"
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          console.log(res.data);
        },
        fail: function(fail) {  
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      })
    }else if(status === '无回课'){
      wx.request({
        url: list[0].api_url+'integral/backclass_integral.php',
        data: {
          studentid: id,
          class_name: class_name,
          time: time,
          status: "n"
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          console.log(res.data);
        },
        fail: function(fail) {  
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      })
    }else{
      console.log("该学生正常");
    }
  },
  // 设置学生状态信息，姓名 状态
  set_student_status(that, studentid, status){
    for(var i = 0; i < that.data.student_list.length; i++){
      if(studentid === that.data.student_list[i].studentid){
        that.data.student_list[i].status = status;
        that.data.student_status = status;
        // 重新设置学生当前状态值
        that.onLoad();
        break;
      }
    }
  },

  // 监听页面加载
  onLoad: function (){
    if(this.data.update_flag === 0){
      wx.setNavigationBarTitle({
        title: "回课操作"
      });
      var that = this;
      var class_name = wx.getStorageSync('class_name');
      // 获取班级学生列表
      return new Promise(function (resolve, reject){
        wx.request({
          url: list[0].api_url+'get_students.php',
          data: {
            class_name: class_name
          }, 
          method: 'POST', // 声明POST请求  
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          }, // 设置请求的 header
          success: function(res){  
            that.data.student_list = res.data;
            that.setData({
              student_list_length: that.data.student_list.length,
              student_list: that.data.student_list
            });
            that.data.update_flag = 1;
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
    }
    this.setData({
      student_list_length: this.data.student_list.length,
      student_list: this.data.student_list
    });
  },

  onClick(e){
    var status = e.detail.name;
    var studentid = this.data.studentid;
    this.data.student_status = e.detail.name;
    this.data.student_message_id = studentid;
    // console.log(this.data.student_message_id);
    if(status === 'A等'){
      console.log("A等");
      this.set_student_status(this, studentid, status);
      this.send_student_status(studentid, status);
    }else if(status === 'B等'){
      console.log("B等");
      this.set_student_status(this, studentid, status);
      this.send_student_status(studentid, status);
    }else if(status === '无回课'){
      console.log("无回课");
      Dialog.confirm({
        title: '是否确认该学生无回课？',
      }).then(() => {
        console.log("确认无回课");
        this.set_student_status(this, studentid, status)
        this.send_student_status(studentid, status);
      }).catch(() => {
        console.log("取消无回课");
        status = '';
        this.set_student_status(this, studentid, status)
      });
    }else{
      console.log("status error!");
    }
  },
})

