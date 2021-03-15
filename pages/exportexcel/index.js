const app = getApp();
import list from '../../config';
import Dialog from '../../dist/dialog/dialog';
Page({
  data: {
    show: false,
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  time_confirm(event){
    var class_name = wx.getStorageSync('class_name');
    var time = Math.floor(event.detail / 1000);
    this.setData({ show: false });
    wx.setClipboardData({
      data: list[0].api_url+'exportexcel/attendance_excel.php?class_name='+class_name+'&time='+time,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        });
        Dialog.confirm({
          title: "提示",
          message: "已将链接复制到剪切板\n请使用浏览器打开下载" ,
        });
      }
    })  
  },
  time_cancel(event){
    this.setData({
      currentDate: new Date().getTime(),
      show: false
    });
  },

  // 监听页面加载
  onLoad: function (){
    wx.setNavigationBarTitle({
      title: "数据导出"
    })
  },

  export_integral(){
    var class_name = wx.getStorageSync('class_name');
    console.log("integral");
    wx.setClipboardData({
      data: list[0].api_url+'exportexcel/integral_excel.php?class_name='+class_name,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        });
        Dialog.confirm({
          title: "提示",
          message: "已将链接复制到剪切板\n请使用浏览器打开下载" ,
        });
      }
    })  
  },

  export_Attendance(){
    console.log("Attendance");
    this.setData({ show: true });
  }
})