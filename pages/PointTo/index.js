const app = getApp();
import Dialog from '../../dist/dialog/dialog';
import list from '../../config';
Page({
  data: {
    student_name: '',
    student_message_id: '',
    student_status: '',
    studentid: '',
    leave_pop_up: false,
    leave_reason: '',
    student_list: [],
    show: false,
    update_flag: 0,
    action: [
      {
        name: '正常',
      },
      {
        name: '迟到',
        color: '#8BC34A',
      },
      {
        name: '缺勤',
        color: '#ee0a24',
      },
      {
        name: '请假',
        color: '#1989FA',
      },
    ],
  },

  // 获取studentid
  get_student_name(id){
    for(var i = 0; i < this.data.student_list.length; i++){
      if(id === this.data.student_list[i].studentid){
        return this.data.student_list[i].username;
      }
    }
  },

  // 发送学生状态信息，姓名 状态 消息（请假缘由）
  send_student_status(id, status, reason){
    var student_name = this.get_student_name(id);
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
    console.log(this.data.student_list);
    console.log(student_name, class_name, time);
    if(status === '迟到'){
      wx.request({
        url: list[0].api_url+'late/late.php',
        data: {
          studentid: id,
          username: student_name,
          class_name: class_name,
          time: time
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
    }else if(status === '请假'){
      wx.request({
        url: list[0].api_url+'leave/leave.php',
        data: {
          studentid: id,
          username: student_name,
          class_name: class_name,
          time: time,
          reason: reason
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
    }else if(status === '缺勤'){
      wx.request({
        url: list[0].api_url+'absent/absent.php',
        data: {
          studentid: id,
          username: student_name,
          class_name: class_name,
          time: time,
          reason: reason
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
	// 生命周期回调—监听页面卸载
	onUnload: function(){
		this.data.update_flag =  0;
	},
  // 监听页面加载
  onLoad: function (){
    var that = this;
    if(this.data.update_flag === 0){
      var class_name = wx.getStorageSync('class_name');
      wx.setNavigationBarTitle({
        title: class_name+"点到"
      });
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
  // 监听用户下拉动作
	onPullDownRefresh: function(){
    wx.showLoading({
			title: '加载中',
		});
    this.onLoad();
    wx.hideLoading();
    // console.log(this.data.student_list);
  },
  //取消按钮 
  leave_cancel: function() {
    this.setData({
      leave_pop_up: false
    });
    this.data.leave_reason = '';
    this.setData({
      leave_reason: ''
    });
  },
  //确认 
  leave_confirm: function() {
    this.send_student_status(this.data.student_message_id, this.data.student_status, this.data.leave_reason);
    this.setData({
      leave_pop_up: false
    });
    this.data.leave_reason = '';
    this.setData({
      leave_reason: ''
    });
  },
  // 请假缘由输入框变化
  leave_reason_change: function(e){
    this.data.leave_reason = e.detail;
  },
  onClick(e){
    var status = e.detail.name;
    var studentid = this.data.studentid;
    this.data.student_status = e.detail.name;
    this.data.student_message_id = studentid;
    // console.log(this.data.student_message_id);
    if(status === '请假'){
      console.log("请假");
      this.setData({
        leave_pop_up: true
      });
      this.set_student_status(this, studentid, status);
    }else if(status === '缺勤'){
      console.log("缺勤");
      Dialog.confirm({
        title: '是否确认该学生缺勤？',
        message: '可在详情中删除该记录',
      }).then(() => {
        console.log("确认缺勤");
        this.set_student_status(this, studentid, status)
        this.send_student_status(studentid, status, '');
      }).catch(() => {
        console.log("取消缺勤");
        status = '';
        this.set_student_status(this, studentid, status)
      });
    }else if(status === '正常'){
      console.log("正常");
      this.set_student_status(this, studentid, status);
      this.send_student_status(studentid, status, '');
    }else if(status === '迟到'){
      console.log("迟到");
      Dialog.confirm({
        title: '是否确认该学生迟到？',
        message: '可在详情中删除该记录',
      }).then(() => {
        console.log("确认迟到");
        this.set_student_status(this, studentid, status)
        this.send_student_status(studentid, status, '');
      }).catch(() => {
        console.log("取消迟到");
        status = '';
        this.set_student_status(this, studentid, status)
      });
    }else{
      console.log("status error!");
    }
  },
})