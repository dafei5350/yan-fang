const db = wx.cloud.database();
const app = getApp()

Page({
  data: {
    activeNames: ['1'],
    exquisiteList: null,
    roughList: null,
    loading: true
  },
  onLoad: function (options) {
    console.log(options.homeType);
    if (options.homeType === '精装房') {
      this.getExquisite(options.orderId)
    } else {
      this.getRough(options.orderId)
    }
  },
  getExquisite(orderId){
    let that = this
    db.collection('report')
      .where({
          exquisite:{
            info: {
              orderId: orderId
            }
          }
      }).get()
        .then(res => {
          console.log(res.data);
          that.setData({
            exquisiteList: res.data[0].exquisite,
            loading: false
          })
      }).catch( err => {
        console.log(err);
      })
  },
  getRough(orderId){
    let that = this
    db.collection('report')
      .where({
          rough:{
            info: {
              orderId: orderId
            }
          }
      }).get()
        .then(res => {
          that.setData({
            roughList: res.data.rough,
            loading: false
          })
      }).catch( err => {
        console.log(err);
      })
  },
  onCollapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  viewImg(e){
    let that = this
    let current = e.target.dataset.img
    let currentArr = current.split()
    console.log(currentArr)
    wx.previewImage({
      current: 1,
      urls: currentArr,
      showmenu: true
    });
  },
})