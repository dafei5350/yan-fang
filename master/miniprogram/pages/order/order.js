
const db = wx.cloud.database();
const app = getApp()

Page({
  data: {
    _openid: app.globalData._openid,
    masterId: null,
    orderList: [],
    Identity: null,
    xiaoqu: null,
    khName: null,
    kuPhone: null,
    appointment: null,
    homeType: null,
    TabCur: 'untreated',
    scrollLeft: 0,
    loading: true
  },
  onLoad: function (options) {
    this.setData({
      Identity: wx.getStorageSync('Identity'),
      masterId: wx.getStorageSync('masterId')
    })
    if (this.data.Identity === 'admin'){
      wx.showToast({
        title: '欢迎你，管理员',
      })
      this.getOrder()
    } else {
      wx.showToast({
        title: '欢迎你，验房师',
      })
      this.getMasterOrder()
    }
  },
  getOrder(){
    let that = this
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        type: 'admin'
      }
    }).then ( res => {
      that.setData({
        orderList: that.data.orderList.concat(res.result.data),
        loading: false
      })
      wx.setStorageSync('orderNum', res.result.data.length)
    })
  },
  getMasterOrder(){
    let that = this
    let length = that.data.orderList.length
    console.log(length);
    wx.cloud.callFunction({
      name: 'getOrder',
      data: {
        type: 'master',
        masterId: that.data.masterId,
        length: length
      }
    }).then( res => {
      console.log(res);
      let len = res.result.length
      console.log(len);
      if (len != 0){
        that.setData({
          orderList: that.data.orderList.concat(res.result),
          loading: false
        })
        wx.setStorageSync('orderNum', res.result.data.length)
      } else {
        wx.setStorageSync('orderNum', len)
        wx.showToast({
          icon: "none",
          title: "没有更多了"
        })
        that.setData({
          loading: false
        })
      }
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },
  toOrderInfo(event) {
    let id = event.currentTarget.dataset.id
    console.log(id);
    wx.navigateTo({
      url: '/pages/order-info/order-info?id=' + id,
    })
  }
})