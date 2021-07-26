/*
* bug 没有做分页，最多请求20个，暂时不需要做
*/

const db = wx.cloud.database();
Page({
	data: {
		masterList: [],
		loading: true
	},
	onLoad: function (options) {
		this.getMasterList()
	},
	onReady: function () {

	},
	onShow: function () {

	},
	getMasterList(){
		let that =this
		wx.cloud.callFunction({
			name: 'addMaster',
			data:{
				type: 'getMasterList',
			}
		}).then(res =>{
			console.log(res);
			that.setData({
				masterList: res.result.data,
				loading: false
			})
			// this.getAvatarImg()
		})
	},
	// 获取头像   不在调用，用七牛云
	// getAvatarImg(){
	// 	let that = this
	// 	let avatarList = that.data.masterList.map(function(item) {
	// 		return item.avatar
	// 	})
	// 	wx.cloud.callFunction({
	// 		name: 'addMaster',
	// 		data:{
	// 			type: 'getMasterAvater',
	// 			filelist: avatarList
	// 		}
	// 	}).then(res =>{
	// 		let avaterList = res.result.fileList
	// 		console.log(avaterList);
	// 		that.data.masterList.forEach(function(item){
	// 			avaterList.forEach(function(index){
	// 				if (index.fileID == item.avatar){
	// 					item.tempFileURL = index.tempFileURL
	// 				}
	// 			})
	// 		})
	// 		that.setData({
	// 			masterList: that.data.masterList
	// 		})
	// 	}).catch(err =>{
	// 		console.error(err)
	// 	})
	// },
	delMaster(e){
		let that = this
		wx.showModal({
			title: '提醒',
			content: '该操作会彻底删除该验房师，账号无法恢复，是否继续操作？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#bdc3c7',
			confirmText: '确定',
			confirmColor: '#f52443',
			success: (result) => {
				if (result.confirm) {
					wx.cloud.callFunction({
						name: 'addMaster',
						data: {
							type: 'delMaster',
							masterId: e.currentTarget.dataset.id
						}
					}).then(res =>{
						this.getMasterList()
						wx.showModal({
							title: '删除成功',
							showCancel: false
						})
					})
				}
			},
			fail: () => {},
			complete: () => {}
		});
			
	},
	onPullDownRefresh: function () {
    this.getMasterList()
    wx.stopPullDownRefresh()
  },
	toMySelf(e){
		let id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/my-self/my-self?id=' + id,
		})
	},
	toScore(e){
		let id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/score/score?id=' + id,
		})
	}

})