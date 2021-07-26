var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());

const token = require('../../utils/qiniu/qntoken')
const qiniuUploader = require("../../utils/qiniu/qiniuUploader.js");
const qiniudelete = require('../../utils/qiniu/qianniudelete.js')



const db = wx.cloud.database();
Page({
			data: {
				imgList: [],
				name: null,
				phone: null,
				account: null,
				pwd: null,
				createTime: DATE,
				loading: false,
				tokendata: [], 
				uptoken: '', 
				time: Date.parse(new Date())

			},
			onLoad: function (options) {
				this.gettoken()
			},
			// 获取七牛云Token
			gettoken() {
				var tokendata = []
				tokendata.ak = 'xxxxxxxxxxxxxxxxxx-4h'
				tokendata.sk = 'xxxxxxxx-xxxxxx-xxxxxxxxxxx'
				tokendata.bkt = 'xxxxxxxxxx'
				tokendata.cdn = 'https://cdn.dafei110.cn/'
				var uptoken = token.token(tokendata)
				this.data.tokendata = tokendata
				this.setData({
					uptoken: uptoken,
				})
			},
			isImage(str) {
				var reg = /\.(png|jpg|gif|jpeg|webp)$/;
				return reg.test(str);
			},
			onPhone(e) {
				let that = this
				that.setData({
					account: e.detail.value
				})
			},
			formSubmit(e) {
				let formDate = e.detail.value
				let that = this
				let reName = Date.now() + '.' + this.data.imgList[0].split('.')[this.data.imgList[0].split('.').length - 1]
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
						content: '您还没有添加验房师傅的头像',
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
				} else if (formDate.account.length <= 5) {
					wx.showModal({
						title: '提示',
						content: '账号最低需要输入6位',
						showCancel: false,
						confirmText: '确定',
					})
					return
				} else if (formDate.pwd.length <= 5) {
					wx.showModal({
						title: '提示',
						content: '密码最低需要输入6位',
						showCancel: false,
						confirmText: '确定',
					})
					return
				} else {
					let itemImg = that.data.imgList[0]
					qiniuUploader.upload(itemImg, (res) => {
							wx.cloud.callFunction({
								name: 'addMaster',
								data: {
									type: 'addMasterInfo',
									avatar: res.imageURL,
									name: formDate.name,
									phone: formDate.phone,
									account: formDate.account,
									pwd: formDate.pwd,
									createTime: that.data.createTime,
									identity: 'master'
								}
							}).then(res => {
								console.log('[添加成功]', res);
								that.setData({
									loading: false
								})
								wx.showModal({
									title: '提示',
									content: '添加成功',
									cancelText: '再来一个',
									confirmText: '确定',
									success(res) {
										if (res.confirm) {
											wx.navigateTo({
												url: '/pages/account/account',
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
							}).catch(err => {
								console.log('[添加失败]', err);
							})
						},
						(error) => { 
							console.log('error: ' + error);
							that.setData({
								loading: false
							})
						}, {
							region: 'SCN',
							uptoken: that.data.uptoken,
							uploadURL: 'https://upload-z2.qiniup.com',
							domain: that.data.tokendata.cdn,
						},
					)}
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
								this.isImage(res.tempFilePaths)
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