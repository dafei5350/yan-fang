
var wxbarcode = require('../../utils/qr/index.js');
const db = wx.cloud.database();
const util = require('../../utils/uuid.js');
var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());

Page({
	data: {
		_openid: wx.getStorageSync('_openID'),
		_id: null,
		date: DATE,
    city: [],
    orderId: null,
		money: null,
		name: null,
		phone: null,
		xiaoqu: null,
		addressInfo: null,
		m2: null,
		time: null,
		remark: null,
		homeType: null,
		status: null,
		masterId: '',
		loading: true,
		isComment: true,
		refund: null,
		refundStstus: null
	},
	onLoad: function (options) {
		this.setData({
			_openid: wx.getStorageSync('_openID'),
			_id: options.id
		})
		this.readOrderInfo(options.id)
	},
	readOrderInfo(id) {
		let that = this
		db.collection('order')
			.doc(id)
			.get()
			.then(res => {
				console.log(res);
				that.setData({
					date: res.data.time,
					city: res.data.address,
					orderId: res.data.orderId,
					money: res.data.money / 100,
					name: res.data.name,
					phone: res.data.phone,
					xiaoqu: res.data.xiaoqu,
					addressInfo: res.data.addressInfo,
					m2: res.data.m2,
					time: res.data.inspectionTime,
					remark: res.data.remark,
					homeType: res.data.homeType,
					status: res.data.status,
					masterId: res.data.masterId,
					loading: false,
					refund: res.data.refund
				})
				
				if (that.data.masterId && !res.data.refund){
					this.getMasterInfo()
					wxbarcode.qrcode('qrcode', that.data.masterId, 420, 420);
					this.isComment()
				}
				if (res.data.refund) {
					this.getRefund()
				} 
			})
	},
	isComment(){
		let that = this
		db.collection('comment')
			.where({
				orderId: that.data.orderId
			})
			.get()
			.then(res =>{
				if(res.data.length){
					that.setData({
						isComment: true
					})
				} else {
					that.setData({
						isComment: false
					})
				}
			}).catch(err =>{
				console.error(err);
			})
	},
	getMasterInfo(){
		let that =this
		console.log(that.data.masterId);
		db.collection('masterList')
			.doc(that.data.masterId)
			.get().then(res=>{
				console.log('师傅信息', res);
				that.setData({
					masterInfo: res.data
				})
			})
	},
	playCall(e){
		wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
	},
	getRefund(){
		let that = this
		db.collection('refund')
			.where({
				orderId: that.data.orderId
			})
			.get()
			.then(res =>{
				console.log(res);
				that.setData({
					refundStstus: res.data[0].status
				})
				console.log(that.data.refundStstus);
			})
	},
	toRefund(){
		let that = this
		wx.showModal({
			title: '提示',
			content: '正在申请退款，是否继续？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#c0392b',
			success: (result) => {
				if (result.confirm) {
					this.upRefund()
					that.setData({
						loading: true
					})
				}
			},
			fail: () => {},
			complete: () => {}
		});
			
	},
	upRefund(){
		let that = this
		let refundId = util.uuid()
		db.collection('refund')
			.add({
				data:{
					refundTime: DATE,
					that_openid: that.data._openid,
					name: that.data.name,
					phone: that.data.phone,
					homeType: that.data.homeType,
					m2: that.data.m2,
					xiaoqu: that.data.xiaoqu,
					city: that.data.city,
					address: that.data.addressInfo,
					remark:that.data.remark,
					masterId: that.data.masterId,
					orderTime: that.data.time,
					refundId: refundId,
					orderId: that.data.orderId,
					money: that.data.money * 100,
					status: 'application',
				}
			}).then(res=>{
				db.collection('order')
					.doc(that.data._id)
					.update({
						data:{
							refund: true
						}
					}).then(res=>{
						that.setData({
							loading: false,
						})
						wx.showModal({
							content: '申请成功，请耐心等候平台审核',
							showCancel: false,
						})
					})
			})
	},
	toComment() {
		let that = this
		wx.navigateTo({
			url: `/pages/comment/comment?orderId=${that.data.orderId}&masterId=${that.data.masterId}&xiaoqu=${that.data.xiaoqu}&homeType=${that.data.homeType}`,
		})
	},
	toReportInfo(){
		let that = this
		wx.navigateTo({
			url: `/pages/report-info/report-info?orderId=${that.data.orderId}&homeType=${that.data.homeType}`,
		}) 
	}
})