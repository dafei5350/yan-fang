// miniprogram/pages/index/index.js
Page({
  data: {
    userInfo: {},
    loginMsg: '',
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://cdn.dafei110.cn/config/banner02.jpg',
      pathId: '/pages/order-form/order-form'
    }, {
      id: 1,
      type: 'image',
      url: 'https://cdn.dafei110.cn/config/banner.jpg',
      pathId: '/pages/order-form/order-form'
    }]
  },
  onLoad: function (options) {
    this.towerSwiper('swiperList');
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    return{
      title: '匠人验房，您身边的验房专家',
      path: '/pages/index/index',
      imageUrl: 'https://cdn.dafei110.cn/config/banner02.jpg'
    }
  },
  onShareTimeline: function () {
    return {
      title: '匠人验房，您身边的验房专家',
      query: '/pages/index/index',
      imageUrl: 'https://cdn.dafei110.cn/config/banner02.jpg'
    }
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },
  toSwiperPath(enevt){
    let path = enevt.target.dataset.swiper
    console.log(enevt);
    console.log(enevt.target.dataset.swiper);
    wx.switchTab({
      url: path,
    })
  },
  toStandard() {
    wx.navigateTo({
      url: '/pages/standard/standard',
    })
  },
  toRange() {
    wx.navigateTo({
      url: '/pages/range/range',
    })
  },
  toOrderForm() {
    wx.switchTab({
      url: '/pages/order-form/order-form',
    })
  },
  toReport(){
    wx.switchTab({
      url: '/pages/report/report',
    })
  }
})