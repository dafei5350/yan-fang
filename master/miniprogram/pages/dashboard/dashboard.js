const db = wx.cloud.database()
Page({
  data: {
    orderNum: null,
    Identity: null,
    masterId: null,
    avatar: null,
    avatarTempURL: null,
    name: null,
    money: null,
    yuan: null,
    refundNum: 0,
    historyNum: 0,
    masterNum: 0
  },

  onLoad: function (options) {
    this.setData({
      orderNum: wx.getStorageSync('orderNum'),
      Identity: wx.getStorageSync('Identity'),
      masterId: wx.getStorageSync('masterId')
    })
    if(this.data.Identity == 'admin'){
      this.getMoney()
      this.getRefund()
      this.getHistoryOrder()
      this.getMasterNum()
    } else {
      this.getMasterInfo()
      this.getMasterHistory()
      
    } 
  },
  onReady: function () {

  },
  getRefund(){
    let that = this
    wx.cloud.callFunction({
      name: 'getOrder',
      data:{
        type: 'getRefund'
      }
    }).then(res=>{
      that.setData({
        refundNum: res.result.total
      })
    })
  },
  getHistoryOrder(){
    let that = this
    wx.cloud.callFunction({
      name: 'getOrder',
      data:{
        type: 'getHistoryOrder'
      }
    }).then(res=>{
      that.setData({
        historyNum: res.result.total
      })
    })
  },
  getMasterHistory(){
    let that = this
    wx.cloud.callFunction({
      name: 'getOrder',
      data:{
        type: 'getMasterHistory',
        masterId: that.data.masterId
      }
    }).then(res=>{
      that.setData({
        historyNum: res.result.total
      })
    })
  },
  getMoney(){
    let that = this
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data:{
        type: 'getMoney',
      }
    }).then(res=>{
      that.setData({
        money: res.result.data.money,
        yuan: res.result.data.money / 100
      })
    }).catch(err =>{
      console.log(err);
    })
  },
  editMooney(){
    let that = this
    let numMoney = +that.data.money
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data:{
        type: 'editMooney',
        money: numMoney
      }
    }).then(res =>{
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        })
        that.setData({
          modalName: null
        })
      })
      .catch(err => {
        console.log('[修改失败]', err);
        that.setData({
          modalName: null
        })
      })
  },
  getMasterInfo(){
    let that = this
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data:{
        type: 'getMasterInfo',
        masterId: that.data.masterId
      }
    }).then(res => {
      console.log(res);
      that.setData({
        avatar: res.result.data.avatar,
        name: res.result.data.name
      })
      if (res.result.data.avatar){
        this.getAvatar()
      }
    })
  },
  getMasterNum(){
    let that = this
    wx.cloud.callFunction({
      name: 'addMaster',
      data:{
        type: 'getMasterNum',
      }
    }).then(res => {
      console.log(res);
      that.setData({
        masterNum: res.result.total
      })
    })
  },
  getAvatar(){

    let that = this
    let avatarImg = that.data.avatar.split()
  
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data: {
        type: 'getAvatar',
        avatar: avatarImg
      }
    }).then(res =>{
      console.log(res);
      that.setData({
        avatarTempURL: res.result.fileList[0].tempFileURL
      })
    })
  },
  changeMoney(event){
    let that = this
    console.log(event.detail);
    that.setData({
      money: event.detail,
      yuan: event.detail / 100
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  toMaster(){
    wx.navigateTo({
      url: '/pages/master/master',
    })
  },
  toComment(){
    wx.navigateTo({
      url: '/pages/comment/comment',
    })
  },
  toOrder(){
    wx.switchTab({
      url: '/pages/order/order',
    })
  },
  toHistoryOrder(){
    let that = this
    if (that.data.Identity == 'admin'){
      wx.navigateTo({
        url: `/pages/history-order/history-order`,
      })
    } else {
      wx.navigateTo({
        url: `/pages/history-order/history-order?id=${that.data.masterId}`,
      })
    }
  },
  toAccount(){
    wx.navigateTo({
      url: '/pages/account/account',
    })
  },
  toRefund(){
    wx.navigateTo({
      url: '/pages/refund/refund',
    })
  },
  toMySelf(e){
    let masterId = this.data.masterId
    wx.navigateTo({
      url: `/pages/my-self/my-self?masterId=${masterId}`,
    })
  },
  toStandard(){
    wx.navigateTo({
      url: '/pages/standard/standard',
    })
  },
  toAbout(){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  goOut(){
    wx.clearStorageSync('Identity')
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }
})