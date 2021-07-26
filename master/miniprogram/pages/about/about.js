// miniprogram/pages/about/about.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},
	viewPraise(){
		wx.previewImage({
			current: 1,
      urls: ['https://cdn.dafei110.cn/config/zanshang.png'],
      success: function (res) { 

			}
		})
	},
	copyGithub(){
		wx.setClipboardData({
			data: 'https://github.com/dafei5350',
			success(res){
				wx.getClipboardData({
          success(res) {
            wx.showToast({
							title: '复制成功',
							icon: 'success'
            })
          }
        })
			}
		})
	},
	copyMail(){
		wx.setClipboardData({
			data: '535027650@qq.com',
			success(res){
				wx.getClipboardData({
          success(res) {
            wx.showToast({
							title: '复制成功',
							icon: 'success'
            })
          }
        })
			}
		})
	},
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})