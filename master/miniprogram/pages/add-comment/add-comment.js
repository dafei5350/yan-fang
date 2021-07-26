var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());

const token = require('../../utils/qiniu/qntoken')
const qiniuUploader = require("../../utils/qiniu/qiniuUploader.js");
const qiniudelete = require('../../utils/qiniu/qianniudelete.js')




Page({

	data: {
		avatarUrl: [],
		upAvatarUrl: [],
		imgList: [],
		upImgList:[],
		overall: null,
		attitude: null,
		ability: null,
		evaluation: null,
		nickName: null,
		xiaoqu: null,
		createTime: DATE,
		like: null,
		watch: null,
		virtual:  true,
		tokendata: [],
		uptoken: '', 
		loading: false,
	},
	onLoad: function (options) {
		this.gettoken()
	},
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
	onStarAverall(event) {
		this.setData({
			overall: event.detail,
		});
	},
	onStarAttitude(event) {
		this.setData({
			attitude: event.detail,
		});
	},
	onStarAbility(event) {
		this.setData({
			ability: event.detail,
		});
	},
	addComment(){
		let that = this
		if(that.data.nickName === null){
			wx.showModal({
				title: '请填写虚拟姓名',
				content: '虚拟姓名为必填项',
				showCancel: false,
			})
		} else if(that.data.xiaoqu === null){
			wx.showModal({
				title: '请填写虚拟小区',
				content: '虚拟小区为必填项',
				showCancel: false,
			})
		} else if(that.data.evaluation === null){
			wx.showModal({
				title: '请填写虚拟评论',
				content: '虚拟评论为必填项',
				showCancel: false,
			})
		} else if(that.data.avatarUrl.length == 0){
			wx.showModal({
				title: '请上传虚拟头像',
				content: '虚拟头像为必填项',
				showCancel: false,
			})
		} else {
			that.setData({
				loading: true
			})

			this.pushImg()
			
		}
	},
	pushImg(){
		let that = this
		if (that.data.imgList.length !== 0){
			for (let i = 0; i < that.data.imgList.length; i++){
				let itemImg = that.data.imgList[i]
				qiniuUploader.upload(itemImg, (res) => {
						that.setData({
							upImgList: that.data.upImgList.concat(res.imageURL)
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
				)
			}
			setTimeout(() =>{
				this.pushComment()
			}, 2500)
			
		} else {
			this.pushComment()
		}
	},
	pushComment(){
		let that = this
		wx.cloud.callFunction({
			name: 'getComment',
			data: {
				type: 'pushComment',
				avatarUrl: that.data.avatarUrl,
				upImgList: that.data.upImgList,
				overall: that.data.overall,
				attitude: that.data.attitude,
				ability: that.data.ability,
				evaluation: that.data.evaluation,
				nickName: that.data.nickName,
				xiaoqu: that.data.xiaoqu,
				createTime: that.data.createTime,
				like: that.data.like,
				watch: that.data.watch,
			}
		}).then(res => {
			console.log(res);
			that.setData({
				loading: false
			})
			wx.showModal({
				title: '提示',
				content: '评论添加成功，是否继续添加评论',
				cancelText: '去审核',
				cancelColor: '#02b340',
				confirmText: '再来一条',
				confirmColor: '#f52443',
				success (res) {
					if (res.confirm) {
						that.setData({
							nickName: null,
							xiaoqu: null,
							evaluation: null,
							upImgList: [],
							imgList: [],
							like: null,
							watch: null,
							ability: null,
							attitude:null,
							overall: null,
						})
					} else if (res.cancel) {
						wx.navigateBack({
							delta: 1
						});
					}
				}
			})
		}).catch(err => {
			console.error(err);
		})
	},
	addAvatar(){
		let that = this
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				let tempImg = res.tempFilePaths[0]
				qiniuUploader.upload(tempImg, (res) =>{
					that.setData({
						avatarUrl: res.imageURL
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
		});
	},
	ChooseImage() {
		wx.chooseImage({
			count: 15,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				this.setData({
					imgList: res.tempFilePaths
				})
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
			title: '删除操作',
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
	DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
	onName(e){
		this.setData({
			nickName: e.detail.value
		})
	},
	onXiaoQu(e){
		this.setData({
			xiaoqu: e.detail.value
		})
	},
	onLike(e){
		this.setData({
			like: e.detail.value
		})
	},
	onWatch(e){
		this.setData({
			watch: e.detail.value
		})
	}
})