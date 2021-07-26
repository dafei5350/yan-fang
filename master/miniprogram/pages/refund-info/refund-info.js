// miniprogram/pages/refund-info/refund-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: null,
    _openid: null,
    xiaoqu: null,
    status: null,
    remark: null,
    refundTime: null,
    refundId: null,
    phone: null,
    orderTime: null,
    orderId: null,
    name: null,
    money: null,
    m2: null,
    homeType: null,
    city: [],
    address: null,
		loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _id: options.id
    })
    this.getUntreatedInfo()
  },

  cellPhone(event){
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone
    })
  },
  getUntreatedInfo(){
    let that = this
    wx.cloud.callFunction({
      name: 'getRefund',
      data:{
        type: 'getUntreatedInfo',
        id: that.data._id
      }
    }).then(res =>{
      console.log(res);
      that.setData({
        _openid: res.result.data._openid,
        xiaoqu: res.result.data.xiaoqu,
        status: res.result.data.status,
        remark: res.result.data.remark,
        refundTime: res.result.data.refundTime,
        refundId: res.result.data.refundId,
        phone: res.result.data.phone,
        orderTime: res.result.data.orderTime,
        orderId: res.result.data.orderId,
        name: res.result.data.name,
        money: res.result.data.money,
        m2: res.result.data.m2,
        homeType: res.result.data.homeType,
        city: res.result.data.city,
        address: res.result.data.address,
        loading: false
      })
    }).catch(err =>{
      console.error(err);
    })
  },
  agree(){
		wx.showModal({
			title: '提示',
			content: '正在进行同意退款操作，是否继续？',
			showCancel: true,
			cancelText: '取消',
			cancelColor: '#000000',
			confirmText: '确定',
			confirmColor: '#c0392b',
			success: (result) => {
				if (result.confirm) {
					this.agreeRefund()
				}
			},
    });
  },
  agreeRefund(){
    let that = this
    wx.cloud.callFunction({
      name: 'getRefund',
      data:{
        type: 'refund',
        out_trade_no: that.data.orderId,
        out_refund_no: that.data.refundId,
        total_fee: that.data.money,
        refund_fee: that.data.money,
      }
    }).then(res =>{
      console.log('退款成功',res);
    }).catch(err =>{
      console.log('退款失败',err);
      that.setData({
        loading: false
      })
    })
  },
  changeRefund(){
    let that = this
    wx.cloud.callFunction({
      name: 'getRefund',
      data:{
        type: 'editRefundStatus',
      }
    }).then(res =>{
      that.setData({
        loading: false
      })
    })
  }
})