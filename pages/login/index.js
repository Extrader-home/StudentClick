import list from '../../config';
import Dialog from '../../dist/dialog/dialog';
Page({
	data: {
	},
	login: function(e){
		var that = this;
		var wechat_name = ""
		var id = e.detail.value.id;
		var password = e.detail.value.password;
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']) {
					// console.log("已授权")
					wx.getUserInfo({
						success(res) {
							// console.log("获取用户信息成功", res)
							wechat_name = res.userInfo.nickName;
							that.user_login(id, password, wechat_name);
							// console.log(id, password, wechat_name);
						},
						fail(res) {
							// console.log("获取用户信息失败", res);
							that.user_login(id, password, wechat_name);
							// console.log(id, password, wechat_name);
						}
					})
				} else {
					console.log("未授权")
					Dialog.confirm({
						title: '提示！',
						confirmButtonText: '去授权',
						//showCancel: false,  // 可关闭取消按钮
						message: "当前小程序未授权！！！",
						confirmButtonOpenType: "openSetting",
					})
				}
			}
		})
	},
	user_login(id, password, wechat_name){
		// 调用云函数获取openid
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			// console.log("获取openid成功", openid);
			// 获取openid后，openid是对数据库中的openid进行更新操作，进行登录
			wx.request({
				url: list[0].api_url+'login.php',
				data: {
					openid: openid,
					id: id,
					password: password,
					wechat_name: wechat_name
				}, 
				method: 'POST', // 声明POST请求  
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				}, // 设置请求的 header
				success: function(res){  
					// console.log("登录返回结果："+res.data);
					if(res.data == "0"){
						Dialog.confirm({
							title: "提示",
							message: "账号或密码错误!\n若有疑问请联系系统管理员！" ,
						});
					}else if(res.data == "error"){
						Dialog.confirm({
							title: "警告⚠",
							message: "服务器数据无响应，\n请联系管理员检查后台连接" ,
						});
					}else{
						wx.setStorage({
							key:"now_authority",
							data:res.data
						});
						wx.setStorage({
							key:"now_id",
							data:id
						});
						// console.log(res.data);
						wx.reLaunch({
							url: '/pages/index/index',
						});
						// console.log("登录成功");
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
		}).catch(res => {
			console.log("获取openid失败", res);
		})
	},
	// gotoregister: function(e){
	// 	wx.redirectTo({
	// 		url:'../register/index'
	// 	}) 
	// },
});