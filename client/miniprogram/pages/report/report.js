const db = wx.cloud.database();

Page({
  data: {
    _openid: null,
    orderList: [],
    commentList: [],
    loading: true
  },
  onLoad: function (options) {
    this.setData({
      _openid: wx.getStorageSync('_openID'),
    })
    this.readOrder()
  
  },
  readOrder() {
    let that = this
    console.log(that.data._openid);
    wx.cloud.callFunction({
      name: 'getClientOrder',
      data: {
        _openid: that.data._openid
      }
    }).then(res =>{
      console.log(res);
      that.setData({
        orderList: res.result.data,
        loading: false
      })
    }).catch(err =>{
      console.log(err);
    })
  },
  getComment(){
    let that = this
    let length = that.data.commentList.length
    db.collection('comment')
      .orderBy('createTime', 'desc')
      .skip(length)
      .limit(15)
      .get()
      .then(res =>{
        console.log(res);
        let len = res.data.length
        if (len !== 0){
          that.setData({
            commentList: that.data.commentList.concat(res.data),
            loading: false
          }) 
        } else {
          wx.showToast({
            icon: "none",
            title: "没有更多了"
          })
          that.setData({
            loading: false
          }) 
        }
      })
      .catch(err =>{
        console.log(err);
      })
  },
  viewImg(event){
    let that = this
    let current = event.target.dataset.img
    let indexImg = event.target.dataset.indeximg
    let currentArr = current.split()
    wx.previewImage({
      current: 1,
      urls: currentArr,
      showmenu: true
    });
  },
  onReachBottom: function () {
    this.getComment()
  },
  onLike(event){
    let that = this
    let _id = event.target.dataset.id
    let index = event.target.dataset.index
    db.collection('comment')
      .doc(_id)
      .update({
        data: {
          like: that.data.commentList[index].like  + 1
        }
      })
      .then( res => {
        console.log(res);
        that.setData({
          [`commentList[${index}].like`]: that.data.commentList[index].like  + 1
        })
      })
      .catch( err =>{
        console.error(err);
      })
  },
  onTab(event){
    let that = this
    if (event.detail.index === 1){
      that.setData({
        loading: true
      })
      this.getComment()
    }
  },
  changeTabs(e) {
    let that = this
    console.log(e.detail.activeKey, e.detail.currentIndex);
    that.setData({
      tabValue: e.detail.activeKey
    })
  },
  toFrom() {
    wx.switchTab({
      url: '/pages/order-form/order-form',
    })
  },
  toDetailInfo(event) {
    let id = event.currentTarget.dataset.commentid
    wx.navigateTo({
      url: '/pages/details-info/details-info?id=' + id,
    })
  },
  toReportInfo(event){
    console.log(event);
    let orderId = event.currentTarget.dataset.orderid
    let homeType = event.currentTarget.dataset.type
		wx.navigateTo({
			url: `/pages/report-info/report-info?orderId=${orderId}&homeType=${homeType}`,
		}) 
  },
  toOrderInfo(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/order-info/order-info?id='+id,
    })
  }
})