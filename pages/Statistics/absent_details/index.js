const app = getApp();
import list from '../../../config';
import Dialog from '../../../dist/dialog/dialog';
Page({
  data: {
    absent_detail_list: [],
    now_authority:wx.getStorageSync('now_authority') || 'student',
  },
  // 监听页面加载
  onLoad: function (){
    var that = this;
    var student_id = wx.getStorageSync('student_id') || 'B20180305101';
    wx.setNavigationBarTitle({
      title: "缺勤详情"
    })
    // console.log(student_id);
    return new Promise(function (resolve, reject){
      wx.request({
        url: list[0].api_url+'absent/absent_details.php',
        data: {
          studentid: student_id
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){  
          that.data.absent_detail_list = res.data;
          that.setData({
            absent_detail_list: that.data.absent_detail_list,
            absent_detail_list_length: that.data.absent_detail_list.length
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

  // 监听用户下拉动作
	onPullDownRefresh: function(){
    wx.showLoading({
			title: '加载中',
		});
    this.onLoad();
    wx.hideLoading();
  },

  send_delete(student_id, time){
    return new Promise(function (resolve, reject){
      wx.request({
        url: list[0].api_url+'delete/delete_absent.php',
        data: {
          studentid: student_id,
          time: time
        }, 
        method: 'POST', // 声明POST请求  
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          console.log(res.data);
          this.onLoad();
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

  // 删除按钮点击触发
  delete_click(e){
    if(this.data.now_authority === 'student'){
      Dialog.confirm({
        title: "警告⚠",
        message: "无权限进行此操作" ,
      }).then(() => {
      }).catch(() => {
      });
      return;
    }
    const { position, instance } = e.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close();
          this.send_delete(e.currentTarget.dataset.id, e.currentTarget.dataset.time)
          // console.log(e.currentTarget.dataset.id);
          // console.log(e.currentTarget.dataset.time);
        }).catch(() => {
          instance.close();
          console.log("取消删除");
        });
        break;
    }
  }
})

