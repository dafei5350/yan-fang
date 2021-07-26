const db = wx.cloud.database();
const app = getApp()
Page({
  data: {
    _id: null,
    avatarUrl: null,
    nickName: null,
    createTime: null,
    evaluation: null,
    imgList: [],
    xiaoqu: null,
    watch:null,
    like:null,
    loading: true,
    source: null,
    shareOrder: null,
    orderId: null,
    orderId: null
  },
  onLoad: function (options) {
    if(options.id){
      this.setData({
        _id: options.id,
        source: 'dynamic'
      })
    } else {
      this.setData({
        _id: options.articleID,
        source: 'comment'
      })
    }

    this.getDetailsInfo()
  },
  getDetailsInfo(){
    let that = this
    db.collection('comment')
      .doc(that.data._id)
      .get()
      .then(res =>{
        that.setData({
          avatarUrl: res.data.avatarUrl,
          nickName: res.data.nickName,
          createTime: res.data.createTime,
          evaluation: res.data.evaluation,
          imgList: res.data.imgList,
          xiaoqu: res.data.xiaoqu,
          watch: res.data.watch,
          like: res.data.like,
          loading: false,
          shareOrder: res.data.shareOrder,
          homeType: res.data.homeType,
          orderId: res.data.orderId
        })
        this.watch()
      })
  },
  onLike(){
    let that = this
    db.collection('comment')
      .doc(that.data._id)
      .update({
        data: {
          like: that.data.like  + 1
        }
      })
      .then( res => {
        that.setData({
          like: that.data.like  + 1
        })
      })
      .catch( err =>{
        console.error(err);
      })
  },
  watch(){
    let that = this
    db.collection('comment')
      .doc(that.data._id)
      .update({
        data:{
          watch: that.data.watch + 1
        }
      })
      .then(res =>{
        that.setData({
          watch: that.data.watch + 1
        })
      })
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

  },
  previewImg(){
    let that = this
    wx.previewImage({
      current: that.data.imgList.length, // 当前显示图片的http链接
      urls: that.data.imgList,
      showmenu: true
    })
  },
  toReportInfo(){
    let that = this
		wx.navigateTo({
			url: `/pages/report-info/report-info?orderId=${that.data.orderId}&homeType=${that.data.homeType}`,
		}) 
  },
})