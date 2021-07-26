
const db = wx.cloud.database();
var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());

 
Page({
	data: {
		 _openid: null,
		createTime: DATE,
		orderId: null,
		masterId: null,
		masterInfo: null,
		overall: 0,
		attitude: 0,
		ability: 0,
		evaluation: null,
		imgList: [],
		fileID: [],
		mood: 'satisfaction',
		shareOrder: true,
		masterBad: null,
		masterGood: null,
		dissatisfied: [
			"态度傲慢",
			"敷衍了事",
			"水平不行"
		],
		badList: [],
		badListId: [],
		satisfaction: [
			"认真负责",
			"积极主动",
			"热情耐心",
			"水平不错"
		],
		goodList:[],
		goodListId:[],
		nickName: null,
		gender: null,
		province: null,
		city: null,
		avatarUrl: null,
		xiaoqu: null,
		homeType: null
	},
	onLoad: function (options) {
		console.log(options);
		this.setData({
			_openid: wx.getStorageSync('_openID'),
			orderId: options.orderId,
			masterId: options.masterId,
			xiaoqu: options.xiaoqu,
			homeType: options.homeType
		})
		this.getMasterInfo()
	},
	getMasterInfo() {
		let that = this
		console.log(that.data.masterId);
		db.collection('masterList')
			.doc(that.data.masterId)
			.get().then(res => {
				console.log('师傅信息', res);
				that.setData({
					masterInfo: res.data
				})
			})
	},
	selectNo(event){
		let that = this
		that.setData({
			mood: event.currentTarget.dataset.no,
			masterGood: null
		})
	},
	selectYes(event){
		let that = this
		that.setData({
			mood: event.currentTarget.dataset.yes,
			masterBad: null
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
	// 评价
	onDissatisfied(event){
		let that = this
		that.setData({
			goodList: that.data.goodList.concat(event.currentTarget.dataset.good)
		})
	},
	onSatisfaction(event) {
		console.log(event);
		let that = this
		that.setData({
			goodList: that.data.goodList.concat(event.currentTarget.dataset.good),
			goodListId: that.data.goodListId.concat(event.currentTarget.dataset.index)
		})
	},
	getUserProfile() {
		let that = this
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
				that.setData({
					nickName: res.userInfo.nickName,
					gender: res.userInfo.gender,
					province: res.userInfo.province,
					city: res.userInfo.city,
					avatarUrl: res.userInfo.avatarUrl						
				})
				this.onComment()
      },
			fail: (res) => {
				wx.showModal({
					title: '授权失败',
					content: '是否匿名发送',
					confirmText: '确定',
					success(res) {
						if (res.confirm) {
							this.onComment()
						} else {
						
						}
					}
				})
			}
    })
  },
	onComment(){
		let that = this
		if (that.data.imgList.length) {
			let promiseArr = [];
			for (let i = 0; i < that.data.imgList.length; i++) {
				promiseArr.push(new Promise((reslove, reject) => {
					let item = that.data.imgList[i]
					let suffix = /\.\w+$/.exec(item)[0]
					wx.cloud.uploadFile({
						cloudPath: 'comment/' + new Date().getTime() + suffix, 
						filePath: item, 
						success: res => {
							that.setData({
								fileID: that.data.fileID.concat(res.fileID)
							})
							reslove()
						},
						fail: err=>{
							console.log('[失败]', res);
						}

					})
				}));
			}
			Promise.all(promiseArr).then(res =>{//等数组都做完后做then方法
				db.collection('comment')
				.add({
					data:{
						createTime: that.data.createTime,
						userId: that.data._openid,
						orderId: that.data.orderId,
						masterId: that.data.masterId,
						mood: that.data.mood,
						masterBad: that.data.masterBad,
						masterGood: that.data.masterGood,
						overall: that.data.overall,
						attitude: that.data.attitude,
						ability: that.data.ability,
						evaluation: that.data.evaluation,
						imgList: that.data.fileID,
						shareOrder: that.data.shareOrder,
						nickName: that.data.nickName,
						province: that.data.province,
						city: that.data.city,
						avatarUrl: that.data.avatarUrl,
						xiaoqu: that.data.xiaoqu,
						watch: 0,
						like: 0,
						shareOrder: that.data.shareOrder,
						homeType: that.data.homeType,
						read: false
					}
				}).then(res => {
					console.log("[评论成功]: ", res);
					let articleID = res._id
					wx.showModal({
						title: '提示',
						content: '评论成功',
						confirmText: '确定',
						success(res) {
							if (res.confirm) {
								wx.navigateTo({
									url: `/pages/details-info/details-info?articleID=${articleID}`
								})
							}
						}
					})
				}).catch(err => {
					console.error("[评论失败]: ", err);
				})
			})
		} else {
			console.log("222");
		}
		
	},
  ChooseImage() {
    wx.chooseImage({
      count: 15,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], 
      success: (res) => {
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
		this.data.imgList.splice(e.currentTarget.dataset.index, 1);
		this.setData({
			imgList: this.data.imgList
		})
	},
	onShareOrder(event){
		this.setData({
			shareOrder: event.detail,
		})
	},
	onReady: function () {

	},

	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})