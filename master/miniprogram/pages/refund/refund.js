
const db = wx.cloud.database();
const app = getApp()
Page({
	data: {
		activeNames: 'untreated',
		untreatedList: [],
		processedList: [],
		loading: true
	},
	onLoad: function (options) {
		this.selectComponent('#tabs').resize();
		this.getUntreatedList()
	},
  onCollapse(event) {
    this.setData({
      activeNames: event.detail,
		});
		if (event.detail.name === 'processed') {
			this.getProcessedList()
		}
  },
	getUntreatedList(){
		let that = this
		wx.cloud.callFunction({
			name: 'getRefund',
			data:{
				type: 'getUntreatedList'
			}
		}).then(res =>{
			console.log(res);
			that.setData({
				untreatedList: res.result.data,
				loading: false
			})
		}).catch(err =>{
			console.error(err);
		})
	},
	getProcessedList(){
		let that = this
		wx.cloud.callFunction({
			name: 'getRefund',
			data:{
				type: 'getProcessedList'
			}
		}).then(res =>{
			console.log(res);
			that.setData({
				processedList: res.result.data
			})
		}).catch(err =>{
			console.error(err);
		})
	},
	toRefundInfo(event){
		let id = event.currentTarget.dataset.id
		wx.navigateTo({
			url: `/pages/refund-info/refund-info?id=${id}`,
		})
	}
})