
const db = wx.cloud.database();
const app = getApp()

Page({
  data: {
    _openid: app.globalData._openid,
    orderList: [],
		masterId: null,
		loading: true,
  },
  onLoad: function (options) {
    this.setData({
			masterId: options.id
		})
		if (this.data.masterId){
			this.getMasterHis()
		} else {
			this.getHistory()
		}
  },
	getHistory(){
		let that = this
		wx.cloud.callFunction({
      name: 'getOrder',
      data:{
        type: 'getHistory'
      }
    }).then(res=>{
			console.log(res);
      that.setData({
        orderList: res.result.data,
				loading: false
      })
    })
	},
	getMasterHis(){
		let that = this
		wx.cloud.callFunction({
      name: 'getOrder',
      data:{
        type: 'getMasterHis',
				masterId: that.data.masterId
      }
    }).then(res=>{
			console.log(res);
      that.setData({
        orderList: res.result.data,
				loading: false
      })
    })
	},
	toHisOrderInfo(e){
		let id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: `/pages/history-info/history-info?id=${id}`,
		});
			
	},
	onReady: function () {

	},

	onShow: function () {

	},

})