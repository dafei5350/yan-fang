var date = require('../../utils/time.js')
var DATE = date.formatDate(new Date());

const util = require('../../utils/uuid.js');
const db = wx.cloud.database();
 

Page({
  data: {
    _openid: null,
    date: DATE,
    show: false,
    region: ['河南省', '郑州市', '二七区'],
    orderId: null,
    index: 0,
    homeList: ['精装房', '毛坯房'],
    payForm: {
      money: null,
      name: '',
      phone: '',
      xiaoqu: '',
      addressInfo: '',
      m2: '',
      inspectionTime: '',
      remark: '',
    },
    loading: false,
    formatter(day) { return day },
  },

  onLoad: function (options) {
    this.setData({
      _openid: wx.getStorageSync('_openID')
    })
    this.getMoney()
  },

  onDisplay(date) {
    let that = this
    this.setData({ show: true });
    wx.cloud.callFunction({
      name: 'getTime',
      data: {
        date: that.data.date
      }
      }).then((res) => {
        console.log(res);
        that.setData({ 
          formatter(day){
            let startDate = new Date(); 
            let endDate = new Date(); 
            let num = startDate.getDate(); 
            endDate.setDate(num + 30); 
            console.log(that.data.date)
            // const date = day.date.getDate();
            if (startDate == startDate){
              if (res.result.data.length < 36) {
                day.bottomInfo = '可预约';
              } else {
                day.topInfo = '约满';
              }
            }
          return day
          }
        })
      })
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    let Year = date.getFullYear();//ie火狐下都可以
    let Month = date.getMonth()+1;
    let Day = date.getDate();
    let CurrentDate = Year + "-";
    if (Month >= 10 ){
     CurrentDate += Month + "-";
    }else {
     CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10 ){
     CurrentDate += Day ;
    } else {
     CurrentDate += "0" + Day ;
    }
    return CurrentDate;
  },
  onConfirm(event) {
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  getMoney(){
    let that = this
    db.collection('money')
      .doc('xxxxxxxxxxx')   //自定义 你的云数据库定义money的索引_id
      .get()
      .then(res =>{
        console.log(res);
        that.setData({
          'payForm.money': res.data.money
        })
      })
      .catch(err =>{
        console.log(err);
      })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  homeTypeChange(e){
    this.setData({
      index: e.detail.value
    })
  },
  paySubmit(event) {
    let that = this
    let orderId = util.uuid()
    that.setData({
      orderId: orderId
    })
    if (!that.data.xiaoqu){
      wx.showToast({
        title: '请填写您的小区名称',
        icon: 'none',
      });
    } else if (!that.data.m2){
      wx.showToast({
        title: '请填写您的验房面积',
        icon: 'none',
      })
    } else if (!that.data.addressInfo){
      wx.showToast({
        title: '请填写您的楼号 + 房号',
        icon: 'none',
      })
    } else if (!that.data.name){
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none',
      })
    } else if (!that.data.phone){
      wx.showToast({
        title: '请填写您的联系电话',
        icon: 'none',
      })
    } else{
      that.setData({
        loading: true
      })
      wx.cloud.callFunction({
        name: "pay",
        data: {
          command: "pay",
          out_trade_no: orderId,
          body: '预约验房',
          total_fee: that.data.payForm.money
        },
        success(res){
          console.log("云函数pay提交成功：", res.result)
          that.pay(res.result, event)
          that.setData({
            loading: false
          })
        },
        fail(err) {
          console.log("云函数pay提交失败：", err)
          that.setData({
            loading: false
          })
        },
        complete: (err) => {
          that.setData({
            loading: false
          })
        }
      })
    }
  },
  //支付
  pay(payData, event) {
    let that = this
    const formatDate = event;
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: 'MD5',
      paySign: payData.paySign,

      success(res) {
        console.log("支付成功：", res)
        wx.cloud.callFunction({
          name: "pay",
          data: {
            command: "payOK",
            out_trade_no: "test0004"
          },
        })
        db.collection('order')
        .add({
          data: {
            address: that.data.region,
            inspectionTime: that.data.date,
            homeType: that.data.index?'毛坯房':'精装房',
            orderTime: Date.now(),
            orderId: that.data.orderId,
            money: that.data.payForm.money,
            phone: that.data.phone,
            addressInfo: that.data.addressInfo,
            xiaoqu: that.data.xiaoqu,
            m2: that.data.m2,
            name: that.data.name,
            remark: that.data.remark,
            finish: false,
            status: 'order'
          }
        }).then(res => {
          console.log("支付成功", res);
          wx.switchTab({
            url: '/pages/report/report',
          })
          wx.requestSubscribeMessage({
            tmplIds: ['xxxxxxxxxxxxxxxxxxxx'],  //自定义 tmplIds
            success(res){
              wx.cloud.callFunction({
                name:'order-notice',
                data:{
                  openid: that.data._openid,
                  name:'匠人验房',
                  content: that.data.index?'毛坯房':'精装房',
                  status: '等待平台分配验房师傅',
                  remark: that.data.remark
                },
                success(res){
                  console.log('成功',res);
                },
                fail(res){
                  console.log('失败',res);
                }
              })
            }
          })
        }).catch(err => {
          console.log(err);
        })
      },
      fail(res) {
        console.log("支付失败：", res)
      },
     complete(res) {
        console.log("支付完成：", res)
      }
    })
  },
  requestSubscribe(){
    let that = this
    const templateId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx'  //自定义 模板消息templateId
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success(res){
        wx.cloud.callFunction({
          name:'order-notice',
          data:{
            name5: that.data.name,
            phone_number6: that.data.phone,
            thing9: that.data.homeType,
            thing7: that.data.xiaoqu,
            thing2: that.data.remark
          },
          success(res){
            console.log('成功',res);
          },
          fail(res){
            console.log('失败',res);
          }
        })
      },
    })
  },
  onNum(event){
    let that = this
    if(!/^\d{1,}$/.test(event.detail)){
      wx.showToast({
        title: '请输入数字',
        icon: 'none',
      });
      that.setData({
        m2: null
      })
    }
  },
  onNumPhone(event){
    let that = this
    if(!/^\d{1,}$/.test(event.detail)){
      wx.showToast({
        title: '请输入数字',
        icon: 'none',
      });
      that.setData({
        phone: null
      })
    }
  },
    // getUserProfile() {
  //   wx.getUserProfile({
  //     desc: '用于完善会员资料',
  //     success: (res) => {
  //       db.collection('user')
  //         .add({
  //           data: {
  //             nickName: res.userInfo.nickName,
  //             gender: res.userInfo.gender,
  //             province: res.userInfo.province,
  //             city: res.userInfo.city,
  //             avatarUrl: res.userInfo.avatarUrl
  //           }
  //         }).then(res => {
  //           wx.setStorageSync('isLogin', true)

  //           wx.showToast({
  //             title: '登入成功',
  //             type: 'success',
  //             duration: 1500,
  //           })
  //         }).catch(err => {
  //           wx.showToast({
  //             title: '登入失败',
  //             type: 'error',
  //             duration: 1500,
  //           })
  //         })
  //     }
  //   })
  // },
})