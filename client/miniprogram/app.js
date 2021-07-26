//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-8gq9qsdx5bfc90e2',
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      wx.setStorageSync('_openID', res.result.openid)
      this.globalData._openid = res.result.openid
      console.log(this.globalData._openid)
    })
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
  },
  globalData: {
    StatusBar: null,
    _openid: null
  }
})
