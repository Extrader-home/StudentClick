import list from '../../config';
import Dialog from '../../dist/dialog/dialog';
const app = getApp()
Page({
	data: {
		list,
		// token为登录判断，2 为加载，1为登录成功，0 Wie登录失败则可点击按键跳转到登录页面
		token:2
  },
  // 点击触发
	onClick(event) {
    wx.setStorage({
      key:"features",
      data:event.currentTarget.dataset.features
    });
		wx.navigateTo({
			url: event.target.dataset.url
		});
	},

	//goto登录界面
	gotologin(){
		wx.reLaunch({
			url: '/pages/login/index',
		});
	},

	//获取用户的openid,并判断是否在数据库中存在,存在则跳转到index，不存在则跳转到登录页面
	getOpenid() {
		var that = this;
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			// console.log("获取openid成功", openid);
			// this.send(openid,caveattime);
			return new Promise(function (resolve, reject) {
				wx.request({
					url: list[0].api_url+'checkopenid.php',
					data: {
						openid: openid
					},  //这里是可以填写服务器需要的参数  
					method: 'POST', // 声明POTS请求  
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}, // 设置请求的 header，GET请求可以不填  
					success: function(res){  
						// console.log(res.data);
						if(res.data == "0"){
							that.setData({ token:0 });
							Dialog.confirm({
								title: "提醒",
								message: "初次使用点击右下角\"我的\"授权用户信息\n授权后即可登录" ,
							});
						}else if(res.data == "error"){
							Dialog.confirm({
								title: "警告⚠",
								message: "服务器数据无响应，请联系管理员检查后台连接" ,
							});
						}else{
							wx.setStorage({
								key:"now_authority",
								data:res.data
							});
							that.setData({ token:res.data });
							that.setid();
						}
						// that.AlarmStatus(openid)
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
		}).catch(res => {
			console.log("获取openid失败", res);
		})
	},

	setid(){
		var that = this;
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			return new Promise(function (resolve, reject) {
				wx.request({
					url: list[0].api_url+'setid.php',
					data: {
						openid: openid
					},  //这里是可以填写服务器需要的参数  
					method: 'POST', // 声明POTS请求  
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}, // 设置请求的 header，GET请求可以不填  
					success: function(res){  
						// console.log(res.data);
						if(res.data == "0"){
							Dialog.confirm({
								title: "警告⚠",
								message: "用户错误！" ,
							});
						}else{
							wx.setStorage({
								key:"now_id",
								data:res.data
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
			});
		}).catch(res => {
			console.log("获取openid失败", res);
		})
	},

	// 先判断是否有登录，在判断时候显示未关和故障标签
	onLoad: function (){
		this.getOpenid();
		console.log(wx.getStorageSync('now_id'),wx.getStorageSync('now_authority'))
		// console.log(list);
	},
})
