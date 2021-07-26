const cloud = require('wx-server-sdk')

exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxxxxxxx',
    resourceAppid: 'xxxxxxxxxxxx',
    resourceEnv: 'cloud1-xxxxxxxxxx',
  })
  await c1.init()
  return new Promise(async (resolve, reject) => {
    const db = c1.database()
    console.log(event.type);
    switch (event.type) {
      case 'admin': {
        await db.collection('order')
          .where({
            finish: false
          })
          .field({
            xiaoqu: true,
            name: true,
            phone: true,
            inspectionTime: true,
            homeType: true,
            masterId: true,
          })
          .orderBy('inspectionTime', 'asc')
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'master': {
        await db.collection('order')
        .where({
          masterId: event.masterId
        })
        .field({
          xiaoqu: true,
          name: true,
          phone: true,
          inspectionTime: true,
          homeType: true,
          masterId: true,
          status: true,
        })
        .orderBy('inspectionTime', 'desc')
        .skip(event.length)
        .get()
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
        break
      }
      case 'getRefund':{
        await db.collection('order')
          .where({
            refund: true
          })
          .count()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getHistoryOrder':{
        await db.collection('historyOrder')
          .count()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getMasterHistory':{
        await db.collection('historyOrder')
          .where({
            masterId: event.masterId
          })
          .count()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getHistory':{
        await db.collection('historyOrder')
          .field({
            'main.name': true,
            'main.xiaoqu':  true,
            'main.phone': true,
            'main.homeType': true,
          })
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getMasterHis':{
        await db.collection('historyOrder')
          .where({
            masterId: event.masterId
          })
          .field({
            'main.name': true,
            'main.xiaoqu':  true,
            'main.phone': true,
            'main.homeType': true,
          })
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      // 历史订单详情
      case 'getHistoryInfo':{
        await db.collection('historyOrder')
          .doc(event._id)
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
    }
  })

}