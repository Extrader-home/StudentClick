//index.js
//获取应用实例
const app = getApp()
import list from '../../../config';
import Dialog from '../../../dist/dialog/dialog';
Page({
  data: {
    now_authority:wx.getStorageSync('now_authority') || 'student',
    now_id: wx.getStorageSync('now_id') || '无',
    user_list: [],
    show_txt: false,
    txt: '',
    show_pass: '',
    old_pass: '',
    new_pass: '',
    confirm_new_pass: '',
  },
  // 生命周期回调—监听页面加载  页面加载时触发。
  onLoad: function () {
    this.setData({
      token: wx.getStorageSync('now_authority')
    });
    let that = this;
    return new Promise(function (resolve, reject) {
      wx.request({
        url: list[0].api_url+'userinfo/get_userinfo.php',
        data: {
          id: that.data.now_id,
          authority: that.data.now_authority
        },  //这里是可以填写服务器需要的参数  
        method: 'POST', // 声明POTS请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header，GET请求可以不填  
        success: function(res){  
          console.log(res.data);
          that.setData({
            user_list: res.data
          });
        },
        fail: function(fail) {
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      });
    });
  },

  txt_confirm(){
    this.setData({
      show_txt: false
    });
    var txt = this.data.txt;
    var mod = wx.getStorageSync('modify') || 'error';
    var that = this;
    if(mod === 'username'){
      wx.request({
        url: list[0].api_url+'userinfo/modify_username.php',
        data: {
          id: this.data.now_id,
          authority: this.data.now_authority,
          username: txt
        },  //这里是可以填写服务器需要的参数  
        method: 'POST', // 声明POTS请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header，GET请求可以不填  
        success: function(res){  
          console.log(res.data);
          if(res.data == "0"){
            Dialog.confirm({
              title: "警告⚠",
              message: "修改错误，请联系系统管理员！" ,
            });
          }else{
            Dialog.confirm({
              title: "提示",
              message: "用户名修改成功",
            });
          }
          that.onLoad();
        },
        fail: function(fail) {
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      });
    }else if(mod === 'class'){
      wx.request({
        url: list[0].api_url+'userinfo/modify_class.php',
        data: {
          id: this.data.now_id,
          authority: this.data.now_authority,
          class: txt
        },  //这里是可以填写服务器需要的参数  
        method: 'POST', // 声明POTS请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header，GET请求可以不填  
        success: function(res){  
          console.log(res.data);
          if(res.data == "0"){
            Dialog.confirm({
              title: "警告⚠",
              message: "修改错误，请联系系统管理员！" ,
            });
          }else{
            Dialog.confirm({
              title: "提示",
              message: "班级修改成功",
            });
          }
          that.onLoad();
        },
        fail: function(fail) {
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器数据无响应，请联系管理员检查后台连接" ,
          });
        },  
        complete: function(arr) { },
      });
    }else{
      Dialog.confirm({
        title: "警告⚠",
        message: "mod error!!!" ,
      });
    }
    this.setData({
      txt: '',
    });
  },

  pass_confirm(){
    this.setData({
      show_pass: false
    });
    var old_pass = this.data.old_pass;
    var new_pass = this.data.new_pass;
    var confirm_new_pass = this.data.confirm_new_pass;
    if(new_pass !== confirm_new_pass){
			Dialog.confirm({
				title: "警告⚠",
				message: "两次输入的密码不一致，请重新输入！" ,
			});
			return;
    }
    wx.request({
      url: list[0].api_url+'userinfo/modify_pass.php',
      data: {
        id: this.data.now_id,
        authority: this.data.now_authority,
        new_pass: this.data.new_pass,
        old_pass: this.data.old_pass
      },  //这里是可以填写服务器需要的参数  
      method: 'POST', // 声明POTS请求  
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header，GET请求可以不填  
      success: function(res){  
        console.log(res.data);
        if(res.data == "0"){
          Dialog.confirm({
            title: "警告⚠",
            message: "修改错误，请联系系统管理员！" ,
          });
        }else if(res.data == "1"){
          Dialog.confirm({
            title: "警告⚠",
            message: "原密码错误，请联系教师修改！" ,
          });
        }else if(res.data == "error"){
          Dialog.confirm({
            title: "警告⚠",
            message: "服务器错误，请联系系统管理员！" ,
          });
        }else{
          Dialog.confirm({
            title: "提示",
            message: "密码修改成功",
          });
        }
      },
      fail: function(fail) {
        Dialog.confirm({
          title: "警告⚠",
          message: "服务器数据无响应，请联系管理员检查后台连接" ,
        });
      },  
      complete: function(arr) { },
    });
    this.setData({
      old_pass: '',
      new_pass: '',
      confirm_new_pass: '',
    });
  },
  pass_cancel(){
    this.setData({
      show_pass: false
    });
    this.setData({
      old_pass: '',
      new_pass: '',
      confirm_new_pass: '',
    });
  },

  txt_cancel(){
    this.setData({
      show_txt: false
    });
    this.setData({
      txt: '',
    });
  },

  txt_change: function(e){
    this.data.txt = e.detail;
  },
  old_pass_change: function(e){
    this.data.old_pass = e.detail;
  },
  new_pass_change: function(e){
    this.data.new_pass = e.detail;
  },
  confirm_new_pass_change: function(e){
    this.data.confirm_new_pass = e.detail;
  },

  modify_username(){
    this.setData({
      show_txt: true
    });
    wx.setStorage({
      key:"modify",
      data:"username"
    });
  },

  modify_class(){
    this.setData({
      show_txt: true
    });
    wx.setStorage({
      key:"modify",
      data:"class"
    });
  },

  modify_pass(){
    this.setData({
      show_pass: true
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

  onUnload(){
    this.setData({
      user_list:[]
    });
  }

})

