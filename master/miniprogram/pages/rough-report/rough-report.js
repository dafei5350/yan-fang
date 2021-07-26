const db = wx.cloud.database()

const token = require('../../utils/qiniu/qntoken')
const qiniuUploader = require("../../utils/qiniu/qiniuUploader.js");
const qiniudelete = require('../../utils/qiniu/qianniudelete.js')

var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());


Page({
  data: {
    addTitle: null,
    loading: true,
    _id: null,
    activeNum: 0,
    imgList: [],
    roughList: [],
    entryList: {
      title: null,
      icon: 'qita',
      index: null,
      isRule: null,
      evaluation: null,
      imgURL: []
    },
    tempNo: {
      title: null,
      icon: null,
      index: null,
      isRule: null,
      evaluation: null,
      imgURL: []
    },
    tempYes: {
      title: null,
      icon: null,
      index: null,
      isRule: null,
    },
    evaluation: null,
    isRule: null,
    index: null,
    isIndex: null,
    rough: {
      list: [],
      info: {
        masterId: null,
        orderId: null,
      },
    },
    tokendata: [], 
    uptoken: '', 
    time: Date.parse(new Date())
  },
  onLoad: function (options) {
    this.gettoken()
    this.setData({
      'rough.info.orderId': options.orderId,
      'rough.info.masterId': options.masterId,
      _id: options._id
    })
    this.getStandard()
  },
  // 获取七牛云Token
	gettoken() {
		var tokendata = []
		tokendata.ak = 'xxxxxxxxxxxxxx-4h'
		tokendata.sk = 'xxxxxxxx-xxxxx-xxxxxxxxxx'
		tokendata.bkt = 'xxxxxxxxxxxx'
		tokendata.cdn = 'https://cdn.xxxxxxxxxxxx.cn/'
		var uptoken = token.token(tokendata)
		this.data.tokendata = tokendata
		this.setData({
			uptoken: uptoken,
		})
	},
  onChange(event) {
    this.setData({
      activeNum: event.detail,
    });
  },
  // 获取毛坯房验房规则
  getStandard() {
    let that = this
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        type: 'rough',
      }
    }).then(res => {
      console.log(res);
      that.setData({
        roughList: res.result.data.rough.rough,
        loading: false
      })
    }).catch(err => {
      console.error(err);
    })
  },
  selectYes(event) {
    console.log(event);
    let that = this
    that.setData({
      'tempYes.title': event.currentTarget.dataset.title,
      'tempYes.isRule': event.currentTarget.dataset.yes,
      'tempYes.icon': event.currentTarget.dataset.icon,
      'tempYes.index': event.currentTarget.dataset.index,
      isRule: event.currentTarget.dataset.yes,
    })
  },
  selectNo(event) {
    console.log(event);
    let that = this
    that.setData({
      'tempNo.title': event.currentTarget.dataset.title,
      'tempNo.isRule': event.currentTarget.dataset.no,
      'tempNo.icon': event.currentTarget.dataset.icon,
      'tempNo.index': event.currentTarget.dataset.index,
      isRule: event.currentTarget.dataset.no,
    })
  },
  yesRule(e) {
    let that = this
    let index = e.target.dataset.index
    that.data.rough.list.push(Object.assign({}, that.data.tempYes))
    that.setData({
      'rough.list': that.data.rough.list,
      isRule: null,
      activeNum: that.data.activeNum + 1,
      'tempNo.title': null,
      'tempNo.icon': null,
      'tempNo.index': null,
      'tempNo.isRule': null
    })
  },
  formSubmit(e) {
    let that = this
    that.setData({
      loading: true
    })
    let promiseArr = [];
    if (that.data.imgList.length) {
      let len = that.data.imgList.length
      for (let i = 0; i < len; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let itemImg = that.data.imgList[i]
          qiniuUploader.upload(itemImg, (res) => {
              console.log(res);
              that.setData({
                'tempNo.evaluation': e.detail.value.evaluation,
                'tempNo.imgURL': that.data.tempNo.imgURL.concat(res.imageURL),
                loading: false
              })
              reslove()
            },
            (error) => { 
              console.log('error: ' + error);
              that.setData({
                loading: false
              })
              reject(error)
            }, {
              region: 'SCN',
              uptoken: that.data.uptoken,
              uploadURL: 'https://upload-z2.qiniup.com',
              domain: that.data.tokendata.cdn,
            },
          )
        }))
      }
      Promise.all(promiseArr).then(res => {
        that.data.rough.list.push(Object.assign({}, that.data.tempNo))
        that.setData({
          'rough.list': that.data.rough.list,
          isRule: null,
          imgList: [],
          activeNum: that.data.activeNum + 1,
          'tempNo.title': null,
          'tempNo.icon': null,
          'tempNo.index': null,
          'tempNo.isRule': null,
          'tempNo.evaluation': null,
          'tempNo.imgURL': [],
          loading: false
        })
      })
    } else {
      wx.showModal({
        title: '失败',
        content: '请上传不符合验房标准的图片'
      })
    }
  },
  onModify(e) {
    console.log(e.detail);
    let that = this
    that.setData({
      'tempNo.evaluation': e.detail
    })
  },
  modifyRule(e) {
    let that = this
    if (that.data.isRule === 'yes') {
      let mobifyYes = that.data.tempYes
      that.setData({
        'rough.list': that.data.rough.list.map(item => item.index === mobifyYes.index ? mobifyYes : item)
      }, () => {
        that.setData({
          activeNum: null
        })
      })
    } else {
      if (that.data.imgList.length) {
        let promiseArr = [];
        for (let i = 0; i < that.data.imgList.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
            let itemImg = that.data.imgList[i]
            qiniuUploader.upload(itemImg, (res) => {
                console.log(res);
                that.setData({
                  'tempNo.evaluation': that.data.tempNo.evaluation,
                  'tempNo.imgURL': that.data.tempNo.imgURL.concat(res.imageURL),
                  loading: false
                })
                reslove()
              },
              (error) => { 
                console.log('error: ' + error);
                that.setData({
                  loading: false
                })
                reject(error)
              }, {
                region: 'SCN',
                uptoken: that.data.uptoken,
                uploadURL: 'https://upload-z2.qiniup.com',
                domain: that.data.tokendata.cdn,
              },
            )
          }))
        }
        Promise.all(promiseArr).then(res => {
          let mobifyNo = that.data.tempNo
          that.setData({
            'rough.list': that.data.rough.list.map(item => item.index === mobifyNo.index ? mobifyNo : item)
          }, () => {
            this.onClose()
          })
        })
      } else {
        wx.showModal({
          title: '失败',
          content: '请上传不符合验房标准的图片'
        })
      }
    }
  },
  onClose(event) {
    let that = this
    that.setData({
      isRule: null,
      'tempYes.title': null,
      'tempYes.icon': null,
      'tempYes.index': null,
      'tempYes.isRule': null,
      'tempNo.title': null,
      'tempNo.icon': null,
      'tempNo.index': null,
      'tempNo.isRule': null,
      imgList: []
    })
  },
  onReport() {
    let that = this
    console.log(that.data.rough.list.length);
    if (that.data.rough.list.length === 26) {
      that.submitReport()
    } else if (that.data.rough.list.length === 0) {
      wx.showModal({
        title: '上传失败',
        content: '未填写任何项目，上传失败'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '系统检测到部分需要检测的项目你没有填写，是否强制提交验房报告？',
        confirmText: '确认提交',
        confirmColor: '#d0021b',
        cancelText: '取消',
        cancelColor: '#39b54a',
        success(res) {
          if (res.confirm) {
            that.submitReport()
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  submitReport() {
    let that = this
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        type: 'upReport',
        rough: that.data.rough
      }
    }).then(res => {
      this.changOrder()
    }).catch(err => {
      console.log('[上传失败]', err);
    })
  },
  changOrder() {
    let that = this
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        type: 'changOrder',
        _id: that.data._id
      }
    }).then(res => {
      console.log('[成功改变订单状态]', res);
      this.CopyOrderHistory()
    }).catch(err => {
      console.error('[订单状态改变失败]', err)
      wx.showModal({
        title: '警告',
        content: '订单状态改变失败，请联系开发者'
      })
    })
  },
  CopyOrderHistory() {
    let that = this
    console.log(that.data.rough.info.masterId);
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        type: 'CopyOrderHistory',
        _id: that.data._id,
        masterId: that.data.rough.info.masterId,
        finishTime: DATE
      }
    }).then(res => {
      console.log('[成功-复制订单]', res);
      this.DelOrder()
    }).catch(err => {
      console.error('[失败-复制订单]', err)
      wx.showModal({
        title: '警告',
        content: '订单复制失败，请联系开发者'
      })
    })
  },
  DelOrder() {
    let that = this
    wx.cloud.callFunction({
      name: 'getReport',
      data: {
        type: 'DelOrder',
        _id: that.data._id
      }
    }).then(res => {
      console.log('[成功-删除订单]', res);
      wx.showModal({
        title: '上传成功',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/order/order'
            })
          }
        }
      })
    }).catch(err => {
      console.error('[失败-删除订单]', err)
      wx.showModal({
        title: '警告',
        content: '订单删除失败，请联系开发者'
      })
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 15,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  addEntry(e) {
    let that = this
    that.setData({
      'entryList.title': that.data.addTitle,
      'entryList.evaluation': that.data.evaluation,

    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImgUrl(e) {
    let that = this
    let delImg = e.currentTarget.dataset.url
    let delIndex = e.currentTarget.dataset.index
    console.log(delIndex);
    let sendtokendata = that.data.tokendata
    sendtokendata.filename = delImg
    qiniudelete.delet(sendtokendata) //调用删除

  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  }
})