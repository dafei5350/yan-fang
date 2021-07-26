var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());
const db = wx.cloud.database();

const token = require('../../utils/qiniu/qntoken')
const qiniuUploader = require("../../utils/qiniu/qiniuUploader.js");
const qiniudelete = require('../../utils/qiniu/qianniudelete.js')



Page({
	data: {
		masterId: null,
		imgList: [],
		name: null,
		phone: null,
		account: null,
		pwd: null,
		createTime: DATE,
		tokendata: [],
    uptoken: '',
	},
	onLoad: function (options) {
		this.setData({
			masterId: options.masterId
		})
		this.gettoken()
	},
	// 获取七牛云Token
	gettoken() {
		var tokendata = []
		tokendata.ak = 'xxxxxxxxxxxxxx-4h'
		tokendata.sk = 'xxxxxxxx-xxxxx-xxxxxxxxxx'
		tokendata.bkt = 'xxxxxxxxxxxx'
		tokendata.cdn = 'https://cdn.xxxxxxxxxxxx.cn/'
		var uptoken = token.token(tokendata)
		this.data.tokendata = tokendata
		this.setData({
			uptoken: uptoken,
		})
	},
	
	formSubmit(e) {
		let formDate = e.detail.value
		let that = this
		if (formDate.name.length === 0) {
			wx.showModal({
				title: '提示',
				content: '您还没有输入验房师的姓名',
				showCancel: false,
				confirmText: '确定',
			})
			return
		} else if (that.data.imgList.toString().length == 0) {
			wx.showModal({
				title: '提示',
				content: '您还没有上传头像',
				showCancel: false,
				confirmText: '确定',
			})
			return
		} else if (formDate.phone.length !== 11) {
			wx.showModal({
				title: '提示',
				content: '您输入的手机号有误，请重新输入',
				showCancel: false,
				confirmText: '确定',
			})
			return
		}  else if (formDate.pwd.length <= 5) {
			wx.showModal({
				title: '提示',
				content: '密码最低需要输入6位',
				showCancel: false,
				confirmText: '确定',
			})
			return
		} else {
			let upImg = this.data.imgList[0]
			qiniuUploader.upload(upImg, (res) => {
				console.log(that.data.masterId);
				wx.cloud.callFunction({
					name: 'addMaster',
					data: {
						type: 'modifyInfo',
						data: {
							masterId: that.data.masterId,
							avatar: res.imageURL,
							name: formDate.name,
							phone: formDate.phone,
							pwd: formDate.pwd,
						}
					}
				}).then(res =>{
					wx.showModal({
						title: '提示',
						content: '修改成功',
						showCancel: true,
						confirmText: '确定',
						success (res) {
							if (res.confirm) {
								wx.switchTab({
									url: '/pages/dashboard/dashboard',
								})
							} else if (res.cancel) {
								that.setData({
									imgList: [],
									name: null,
									phone: null,
									account: null,
									pwd: null,
								})
							}
						}
					})
				}).catch(err =>{
					wx.showModal({
						title: '提示',
						content: '修改失败，请联系开发者',
						showCancel: true,
						confirmText: '确定',
						success (res) {
							if (res.confirm) {
								wx.navigateTo({
									url: '/pages/dashboard/dashboard',
								})
							} else if (res.cancel) {
								that.setData({
									imgList: [],
									name: null,
									phone: null,
									account: null,
									pwd: null,
								})
							}
						}
					})
				})

			},
			(error) => { 
				console.log('error: ' + error);
			}, {
				region: 'SCN',
				uptoken: that.data.uptoken,
				uploadURL: 'https://upload-z2.qiniup.com',
				domain: that.data.tokendata.cdn,
			},
		)
		}
	},
	ChooseImage() {
		wx.chooseImage({
			count: 15,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				console.log(res);
				if (this.data.imgList.length != 0) {
					this.setData({
						imgList: this.data.imgList.concat(res.tempFilePaths)
					})
				} else {
					this.setData({
						imgList: res.tempFilePaths
					})
				}
			}
		});
	},
	ViewImage(e) {
		wx.previewImage({
			urls: this.data.imgList,
			current: e.currentTarget.dataset.url
		});
	},
	DelImg(e) {
		wx.showModal({
			title: '删除头像',
			content: '确定要删除这张图片吗？',
			cancelText: '取消',
			confirmText: '确定',
			success: res => {
				if (res.confirm) {
					this.data.imgList.splice(e.currentTarget.dataset.index, 1);
					this.setData({
						imgList: this.data.imgList
					})
				}
			}
		})
	},
})