
const db = wx.cloud.database()

Page({
  data: {
    active: 'exquisite',
    activeNames: ['1'],
    exquisiteList: null,
    roughList: null,
    loading: true,
  },
  onLoad: function (options) {
    this.selectComponent('#tabs').resize();
    this.getExquisite()

  },
  onReady: function (){
    
  },
  onShareAppMessage: function () {

  },
  getExquisite(){
    let that = this
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        type: 'exquisite'
      }
    }).then(res =>{
      that.setData({
        exquisiteList: res.result.data.exquisite.exquisite,
        loading: false,
      })
    })
  },
  getRough(){
    let that = this
    wx.cloud.callFunction({
      name: 'getRepoet',
      data: {
        type: 'rough'
      }
    }).then(res =>{
      that.setData({
        roughList: res.result.data.rough.rough,
        loading: false,
      })
    })
  },
  onTab(event){
    let that = this
    that.setData({
      active: event.detail.name
    })
    if (that.data.active == 'rough'){
      that.setData({
        loading: true,
      })
      this.getRough()
    }
  },
  onCollapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  }
})