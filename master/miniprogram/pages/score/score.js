// miniprogram/pages/score/score.js
Page({

  data: {
    loading: true,
    masterId: null,
    isScore: null,
    scoreList: []
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      masterId: options.id
    })
    this.getScore()
  },

  getScore(){
    let that = this
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data:{
        type: 'getScore',
        id: that.data.masterId
      }
    }).then(res =>{
      console.log(res);
      that.setData({
        scoreList: res.result.data,
        loading: false
      })
    }).catch(err =>{
      console.error(err);
      that.setData({
        loading: false
      })
    })
  }
  
})