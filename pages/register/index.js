import list from '../../config';
import Dialog from '../../dist/dialog/dialog';
Page({
	data: {
		radio: 'student',
	},
	register: function(e){
		var that = this;
		var username = e.detail.value.username;
		var id = e.detail.value.id;
		var password = e.detail.value.password;
		var confirmpassword = e.detail.value.confirmpassword;
		var class_name = e.detail.value.class_name;
		var Identity = this.data.radio;  //用户身份
		if(password !== confirmpassword){
			Dialog.confirm({
				title: "警告⚠",
				message: "两次输入的密码不一致，请重新输入！" ,
			});
			return;
		}
		if(Identity === 'student'){
			if(class_name === ''){
				Dialog.confirm({
					title: "警告⚠",
					message: "请填写所在班级！" ,
				});
				return;
			}
		}
		wx.getSetting({
			success(res) {
				if (res.authSetting['scope.userInfo']) {
					// console.log("已授权")
					wx.getUserInfo({
						success(res) {
							// console.log("获取用户信息成功", res)
							that.user_register(id, password, Identity, username, class_name);
							console.log(id, password, Identity, username, class_name);
						},
						fail(res) {
							// console.log("获取用户信息失败", res);
							that.user_register(id, password, Identity, username, class_name);
							console.log(id, password, Identity, username, class_name);
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
	user_register(id, password, Identity, username, class_name){
		// 调用云函数获取openid
		wx.cloud.callFunction({
			name: "getopenid",
		}).then(res => {
			let openid = res.result.openid;
			console.log("获取openid成功", openid);
			// 获取openid后，openid是对数据库中的openid进行更新操作，进行登录
			wx.request({
				url: list[0].api_url+'register.php',
				data: {
					openid: openid,
					id: id,
					password: password,
					username: username,
					identity: Identity,
					class_name: class_name
				}, 
				method: 'POST', // 声明POST请求  
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				}, // 设置请求的 header
				success: function(res){  
					console.log("注册返回结果："+res.data);
					if(res.data == "0"){
						Dialog.confirm({
							title: "提示",
							message: "注册信息有误!\n若有疑问请联系系统管理员！" ,
						});
					}else if(res.data == "1"){
						wx.reLaunch({
							url: '/pages/login/index',
						});
						Dialog.confirm({
							title: "提示",
							message: "注册成功!\n请重新登录" ,
						});
					}else if(res.data == "2"){
						Dialog.confirm({
							title: "注意⚠",
							message: "该学号/工号 已被注册" ,
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
		}).catch(res => {
			console.log("获取openid失败", res);
		})
	},
	Identity_change(event){
		this.data.radio = event.detail;
    this.setData({
      radio: event.detail,
		});
	},
});