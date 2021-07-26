var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());
wx.cloud.init()
const db = wx.cloud.database();
const app = getApp();

Page({
	data: {
		_openid: app.globalData._openid,
		_id: '',
		date: null,
		city: [],
		orderId: null,
		money: 0.1,
		name: null,
		phone: null,
		xiaoqu: null,
		addressInfo: null,
		m2: null,
		time: null,
		remark: null,
		homeType: null,
		status: null,
		masterList: [],
		masterId: '',
		masterInfo: [],
		Identity: null,
		homeList: ['精装房', '毛坯房'],
		index: 0,
		loading: true
	},

	onLoad: function (options) {
		this.setData({
			Identity: wx.getStorageSync('Identity'),
			_id: options.id
		})
		this.readOrderInfo(options.id)
	},
	readOrderInfo(id) {
		let that = this
		wx.cloud.callFunction({
			name: 'getOrderInfo',
			data: {
				type: 'orderInfo',
				id: id
			}
		}).then(res => {
			that.setData({
				date: res.result.data.time,
				city: res.result.data.address,
				orderId: res.result.data.orderId,
				money: res.result.data.money,
				name: res.result.data.name,
				phone: res.result.data.phone,
				xiaoqu: res.result.data.xiaoqu,
				addressInfo: res.result.data.addressInfo,
				m2: res.result.data.m2,
				time: res.result.data.inspectionTime,
				remark: res.result.data.remark,
				homeType: res.result.data.homeType,
				status: res.result.data.status,
				masterId: res.result.data.masterId,
				loading: false
			})
			if (res.result.data.masterId) {
				this.getMasterInfo(res.result.data.masterId)
			}
		})
	},
	// 获取师傅列表
	getMasterList(e) {
		let that =this
		that.setData({
			modalName: e.currentTarget.dataset.target
		})
		wx.cloud.callFunction({
			name: 'getOrderInfo',
			data:{
				type: 'getMasterList'
			}
		}).then(res => {
			that.setData({
				masterList: res.result.data
			})
			this.getMasterInfo()
		}).catch(err => {
			console.log(err);
		})
	},
	// 添加师傅信息
	addMaster(e) {
		let masterId = e.currentTarget.dataset.masterid
		let that = this
		wx.cloud.callFunction({
			name: 'getOrderInfo',
			data: {
				type: 'addMaster',
				masterId: masterId,
				_id: that.data._id
			}
		}).then(res => {
			this.setData({
				modalName: null
			})
		}).catch(err => {
			console.log('[添加失败]', err);
		})
	},
	// 获取师傅信息
	getMasterInfo(masterId) {
		let that = this
		wx.cloud.callFunction({
			name: 'getOrderInfo',
			data:{
				type: 'masterInfo',
				masterId: that.data.masterId
			}
		}).then(res => {
			that.setData({
				masterInfo: res.result.data
			})
			// this.getImage()
		})
	},
	// 图片临时链接
	// getImage(){
	// 	let that = this
	// 	wx.cloud.callFunction({
	// 		name: 'getOrderInfo',
	// 		data: {
	// 			type: 'avatarImg',
	// 			avatarImg: that.data.masterInfo.avatar.split()
	// 		}
	// 	}).then(res =>{
	// 		that.setData({
	// 			'masterInfo.tempFileURL': res.result.fileList[0].tempFileURL
	// 		})
	// 	}).catch(err => {
	// 		console.log(err);
	// 	})
  // },
	// 订单核销
	onScan() {
		let that = this
		wx.scanCode({
			success(res) {
				if (res.result === that.data.masterId) {
					wx.showModal({
						title: '验证成功',
						content: '验房师扫码验证成功，是否开始验房?',
						success(res) {
							if (res.confirm) {
								wx.cloud.callFunction({
									name: 'getOrderInfo',
									data: {
										type: 'onScan',
										_id: that.data._id
									}
								}).then(res => {
									switch (that.data.homeType) {
										case '精装房':
											that.toExquisite()
											break;
										case '毛坯房':
											that.toRough()
											break;
									}
								}).catch(err => {
									console.log(err);
									wx.showModal({
										title: '错误',
										content: '请检查你的网络，或重启本程序'
									})
								})
							}
						}
					})
				} else {
					wx.showModal({
						title: '验证失败',
						content: '二维码有误或者您不是平台指定的验房师',
						success(res) {
							if (res.confirm) {
								console.log(res);
							}
						}
					})
				}
			}
		})
	},
	toEdit() {
		let that = this
		wx.cloud.callFunction({
				name: 'getOrderInfo',
				data: {
					type: 'toEdit',
					_id: that.data._id,
					homeType: parseInt(that.data.index) === 0?'精装房':'毛坯房',
					m2: that.data.m2,
					inspectionTime: that.data.time,
					remark: that.data.remark,
					phone: that.data.phone,
				}
			}).then(res => {
				that.setData({
					modalName: null,
				})
				wx.showToast({
					title: '修改成功',
					icon: 'success'
				})
			})
			.catch(err => {
				console.log(err);
			})
	},
	editOrder(e) {
		let that = this
		that.setData({
			modalName: e.currentTarget.dataset.edit
		})
	},
	DateChange(e) {
		this.setData({
			time: e.detail.value
		})
	},
	homeTypeChange(e) {
		this.setData({
			index: e.detail.value
		})
	},
	playCall(e) {
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.phone
		})
	},
	showModal(e) {
		console.log(e);
		this.setData({
			modalName: e.currentTarget.dataset.target
		})
	},
	hideModal(e) {
		this.setData({
			modalName: null
		})
	},
	toWriteReport() {
		wx.navigateTo({
			url: '/pages/write-report/write-report',
		})
	},
	toExquisite() {
		let that = this
		wx.navigateTo({
			url: `/pages/exquisite-report/exquisite-report?orderId=${that.data.orderId}&masterId=${that.data.masterId}&_id=${that.data._id}&type=${that.data.index}`,
		})
	},
	toRough() {
		let that = this
		wx.navigateTo({
			url: `/pages/rough-report/rough-report?orderId=${that.data.orderId}&masterId=${that.data.masterId}&_id=${that.data._id}&type=${that.data.index}`,
		})
	}
})