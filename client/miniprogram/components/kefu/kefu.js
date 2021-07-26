Component({
  properties: {},
  data: {
    x: 345, //定位X轴位置
    y: 730 //定位Y轴位置
  },
  pageLifetimes: {
    show: function () {
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          console.log(res);
          that.setData({
            x: res.windowWidth - 40,
            y: res.windowHeight - 80
          })
        },
        fail: function (res) {},
        complete: function (res) {},
      })

    },
    hide: function () {},
    resize: function () {},
  },
  methods: {},

});