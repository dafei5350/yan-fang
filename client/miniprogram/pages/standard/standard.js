
const db = wx.cloud.database()

Page({
  data: {
    activeNames: ['1'],
    exquisiteList: null,
    roughList: null
  },
  onLoad: function (options) {
    this.getStandard()
  },
  onReady: function (){
    
  },
  onShareAppMessage: function () {

  },
  getStandard(){
    let that = this
    db.collection('standard')
      .where({
        _id: 'xxxxxxxxxxxxxxxxxxxxxxx'  //验房规则 索引 _id
      })
      .get()
      .then(res => {
        console.log(res);
        that.setData({
          exquisiteList: res.data[0].exquisite.exquisite,
          roughList: res.data[0].rough.rough
        })
      })
      .catch(err => {
        console.error(err);
      })
  },
  // onTab(event){
  //   console.log(event);
  //   wx.showToast({
  //     title: `${event.detail.title}`,
  //     icon: 'none',
  //   });
  // },
  onCollapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  toOrderForm() {
    wx.switchTab({
      url: '/pages/order-form/order-form',
    })
  }
})