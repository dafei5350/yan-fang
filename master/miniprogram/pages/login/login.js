const db = wx.cloud.database()
Page({
  data: {
    user: null,
    password: null,
    remember: false,
    identity: 'master',
    loading: false,
    onPassword: 'password'
  },
  onLoad: function (options) {
    this.setData({
      remember: wx.getStorageSync('remember')
    })
    if (this.data.remember){
      this.setData({
        identity: wx.getStorageSync('identity'),
        user: wx.getStorageSync('user'),
        password: wx.getStorageSync('password'),
      })
    }
    this.selectComponent('#tabs').resize();
  },
  onChange(event) {
    let that = this
    that.setData({      
      identity: event.detail.name
    })
  },
  // 登入
  loging() {
    let that = this
    const fromDate = that.data
    if (!fromDate.user){
      wx.showToast({
        title: '请填写您的账号',
        icon: 'none',
      })
    } else if (!fromDate.password){
      wx.showToast({
        title: '请填写您的密码',
        icon: 'none',
      })
    } else {
      that.setData({
        loading: true
      })
      if (that.data.identity == 'master'){
        this.isMaster(fromDate)
      } else {
        this.isAdmin(fromDate)
      }
    }

  },
  isAdmin(fromDate){
    let that = this
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data:{
        account: fromDate.user,
        type: 'admin'
      }
    }).then(res => {
      console.log(res);
      let prove = res.result
      if (!prove.data.length){
        } else if(fromDate.user == prove.data[0].account && fromDate.password == prove.data[0].pwd){
        wx.setStorageSync('Identity', 'admin')
        this.tempRemember()
        wx.switchTab({
          url: '/pages/order/order',
        })
      } else {
        wx.showToast({
          title: '账号或密码错误',
          icon: 'error'
        })
        that.setData({
          loading: false
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },
  isMaster(fromDate){
    let that = this
    wx.cloud.callFunction({
      name: 'cloudLogin',
      data:{
        account: fromDate.user,
        type: 'master'
      }
    }).then(res => {
      console.log(res);
      let prove = res.result
      let masterId = prove.data[0]._id
      if (fromDate.user == prove.data[0].account && fromDate.password == prove.data[0].pwd){
        wx.setStorageSync('Identity', 'master')
        this.tempRemember()
        wx.switchTab({
          url: '/pages/order/order',
          success(res){
            wx.setStorageSync('masterId', masterId)
          }
        })
      } else {
        wx.showToast({
          title: '账号或密码错误',
          icon: 'error'
        })
        that.setData({
          loading: false
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },
  // 新增管理员
  addUser(e){
    let that = this
    const fromDate = e.detail.value
    db.collection('admin')
      .add({
        data: {
          user: fromDate.user,
          password: fromDate.password
        }
      })
      .then(res => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
      }).catch(err => {
        wx.showToast({
          title: '添加失败',
          icon: 'error'
        })
      })
  },
  identityChange(e){
    let that = this
    this.setData({
      index: e.detail.value
    })
    wx.setStorageSync('identity', that.data.identity)
  },
  tempRemember(){
    let that = this
    wx.setStorageSync('identity', that.data.identity)
    wx.setStorageSync('user', that.data.user)
    wx.setStorageSync('password', that.data.password)
  },
  onRemember(){
    let that = this
    that.setData({
      remember: !that.data.remember
    })
    if (that.data.remember){
      wx.setStorageSync('remember', true)
      wx.setStorageSync('identity', that.data.identity)
      wx.setStorageSync('user', that.data.user)
      wx.setStorageSync('password', that.data.password)
    } else {
      wx.setStorageSync('remember', false)
      wx.setStorageSync('identity', null)
      wx.setStorageSync('user', null)
      wx.setStorageSync('password', null)
    }

  },
  // 换取文件临时链接
  getImage(){
    let that = this
    wx.cloud.getTempFileURL({
      fileList: that.data.fileList,
      success: res =>{
        console.log(res);
      },
      fail: console.error
    })
  },
  onReady: function () {

  },
  closedEye(){
    console.log("111");
    let that = this
    that.setData({
      onPassword: 'password'
    })
  },
  openEye(){
    let that = this
    that.setData({
      onPassword: 'text'
    })
  },
  toOrder(){
    wx.switchTab({
      url: '/pages/order/order',
    })
  }
})