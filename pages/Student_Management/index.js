const app = getApp();
import list from '../../config';
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    student_list: [],
    show: false,
    studentid: '',
    action: [
      {
        name: '设为助教',
      },
      {
        name: '取消助教', 
        color: '#42A5F5',
      },
      {
        name: '删除用户',
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

  // 监听页面加载
  onLoad: function (){
    wx.setNavigationBarTitle({
      title: "学生管理"
    });
    // 监听页面加载
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
          console.log(that.data.student_list);
        },
        fail: function(fail) {
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，\n请联系管理员检查后台连接",
          });
        },  
        complete: function(arr) { },
      })
    });
  },

  // 取消助教
  cancel_s_student(student_id){
    wx.request({
      url: list[0].api_url+'s_student/cancel_s_student.php',
      data: {
        studentid: student_id
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
          message: "服务器数据无响应，\n请联系管理员检查后台连接",
        });
      },  
      complete: function(arr) { },
    }) 
  },

  // 设置助教
  set_s_student(student_id){
    wx.request({
      url: list[0].api_url+'s_student/set_s_student.php',
      data: {
        studentid: student_id
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
          message: "服务器数据无响应，\n请联系管理员检查后台连接",
        });
      },  
      complete: function(arr) { },
    }) 
  },

  // 删除学生用户
  delete_student(student_id){
    wx.request({
      url: list[0].api_url+'delete/delete_student.php',
      data: {
        studentid: student_id
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
          message: "服务器数据无响应，\n请联系管理员检查后台连接",
        });
      },  
      complete: function(arr) { },
    }) 
  },

  set_student_status(that, studentid, status){
    for(var i = 0; i < that.data.student_list.length; i++){
      if(studentid === that.data.student_list[i].studentid){
        that.data.student_list[i].authority = status;
        // 重新设置学生当前状态值
        that.onLoad();
        break;
      }
    }
  },

  onClick(e){
    var status = e.detail.name;
    var studentid = this.data.studentid;
    console.log(studentid);
    if(status === '设为助教'){
      console.log("设为助教");
      Dialog.confirm({
        title: '是否确认设置该学生为助教？',
      }).then(() => {
        console.log("确认设为助教");
        this.set_s_student(studentid);
        status = "1";
        this.set_student_status(this, studentid, status);
      }).catch(() => {
        console.log("取消设为助教");
      });
    }else if(status === '取消助教'){
      console.log("取消助教");
      Dialog.confirm({
        title: '是否确认取消该学生的助教？',
      }).then(() => {
        console.log("确认取消助教");
        this.cancel_s_student(studentid);
        status = "0";
        this.set_student_status(this, studentid, status);
      }).catch(() => {
        console.log("取消取消助教");
      });
    }else if(status === '删除用户'){
      console.log("删除用户");
      Dialog.confirm({
        title: '是否确认删除改用户？',
      }).then(() => {
        console.log("确认删除用户");
        this.delete_student(studentid);
        this.onLoad();
      }).catch(() => {
        console.log("取消删除用户");
      });
    }else{
      console.log("status error!");
    }
  },
})

