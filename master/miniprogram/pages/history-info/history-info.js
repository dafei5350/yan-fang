const db = wx.cloud.database()
Page({
  data: {
    _id: null,
		city: [],
		orderId: null,
		money: 0.1,
		name: null,
		phone: null,
		xiaoqu: null,
		addressInfo: null,
    inspectionTime: null,
		m2: null,
		time: null,
		remark: null,
		homeType: null,
		status: null,
    masterId: null,
    finishTime: null,
    masterName: null,
    masterPhone: null,
    loading: true,
  },
  onLoad: function (options) {
    this.setData({
      _id: options.id,
    })
    this.getHistoryInfo()
  },
  getHistoryInfo(){
    let that = this
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        type: 'getHistoryInfo',
        _id: that.data._id
      }
    }).then(res =>{
      that.setData({
        orderId: res.result.data.main.orderId,
        inspectionTime: res.result.data.main.inspectionTime,
        money: res.result.data.main.money,
        city: res.result.data.main.address,
        name: res.result.data.main.name,
        phone: res.result.data.main.phone,
        xiaoqu: res.result.data.main.xiaoqu,
        addressInfo: res.result.data.main.addressInfo,
        m2: res.result.data.main.m2,
        remark: res.result.data.main.remark,
        homeType: res.result.data.main.homeType,
        status: res.result.data.main.status,
        masterId: res.result.data.main.masterId,
        finishTime: res.result.data.finishTime,
        
      })
      this.getMaster();
    }).catch(err =>{
      console.error(err);
    })
  },
  getMaster(){
    let that = this
    wx.cloud.callFunction({
      name: 'addMaster',
      data:{
        type: 'getMasterInfo',
        masterId: that.data.masterId
      }
    }).then(res =>{
      that.setData({
        masterName: res.result.data.name,
        masterPhone: res.result.data.phone,
        loading: false
      })
    }).catch(err =>{
      console.log(err)
    })
  }
  
})