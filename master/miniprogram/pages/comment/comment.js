

Page({
  data: {
    active: 'unread',
    commentList: [],
    readList: [],
    loading: true,
  },
  onLoad: function (options) {
    this.getComment()
    this.selectComponent('#tabs').resize();
  },
  getComment(){
    let that = this
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        type: 'unread'
      }
    }).then(res =>{
      console.log('[评论读取成功]', res);
      that.setData({
        commentList: res.result.data,
        loading: false
      })
    }).catch(err =>{
      console.log('[评论读取失败]', err);
    })
  },
  getReadComment(){
    let that = this
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        type: 'read'
      }
    }).then(res =>{
      console.log('[评论读取成功]', res);
      that.setData({
        readList: res.result.data,
        loading: false
      })
    }).catch(err =>{
      console.log('[评论读取失败]', err);
    })
  },
  onChange(event) {
    let that = this
    that.setData({
      readList: event.detail.name
    })
    if(event.detail.name == 'read'){
      that.setData({
        loading: true,
      })
      this.getReadComment()
    }
  },
  onReady: function () {

  },
  onPass(e){
    let that = this
    let commentID = e.currentTarget.dataset.commentid
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        type: 'onPass',
        commentID: commentID
      }
    }).then(res =>{
      console.log(res);
      wx.showToast({
        title: '操作成功',
        icon: 'success',
      })
      let newCommentList = that.data.commentList
      newCommentList.splice(newCommentList.findIndex(item => item._id == commentID), 1)
      that.setData({
        commentList: newCommentList
      })
    }).catch(err=>{
      console.error(err);
      wx.showToast({
        title: '操作失败',
        icon: 'fail',
      })
    })
  },
  onDel(e){
    let that = this
    let commentID = e.currentTarget.dataset.commentid
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        type: 'onDel',
        commentID: commentID
      }
    }).then(res =>{
      wx.showToast({
        title: '已删除',
        icon: 'success',
      })
      let newCommentList = that.data.commentList
      newCommentList.splice(newCommentList.findIndex(item => item._id == commentID), 1)
      that.setData({
        commentList: newCommentList
      })
    }).catch(err=>{
      console.error(err);
      wx.showToast({
        title: '操作失败',
        icon: 'fail',
      })
    })
  },
  onDelPass(e){
    let that = this
    let commentID = e.currentTarget.dataset.commentid
    wx.cloud.callFunction({
      name: 'getComment',
      data: {
        type: 'onDel',
        commentID: commentID
      }
    }).then(res =>{
      wx.showToast({
        title: '已删除',
        icon: 'success',
      })
      let newReadList = that.data.readList
      newReadList.splice(newReadList.findIndex(item => item._id == commentID), 1)
      that.setData({
        readList: newReadList
      })
    }).catch(err=>{
      console.error(err);
      wx.showToast({
        title: '操作失败',
        icon: 'fail',
      })
    })
  },
  toAddComment(){
    wx.navigateTo({
      url: '/pages/add-comment/add-comment',
    })
  }
})