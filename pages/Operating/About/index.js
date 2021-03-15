const app = getApp();
import list from '../../../config';
Page({
  data: {

  },

  // 监听用户下拉动作
	onPullDownRefresh: function(){
  },

  // 监听页面加载
  onLoad: function (){
    wx.setNavigationBarTitle({
      title: "关于积分操作"
    });
  },


})

