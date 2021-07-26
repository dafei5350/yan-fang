const cloud = require('wx-server-sdk')
exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxxxxxxx',
    resourceAppid: 'xxxxxxxxxxx',
    resourceEnv: 'cloud1-xxxxxxxxxxxxx',
  })
  await c1.init()
  return new Promise(async (resolve, reject) => {
    const db = c1.database()
    console.log(event.type);
    switch (event.type) {
      case 'orderInfo': {
        await db.collection('order')
          .doc(event.id)
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'masterInfo': {
        await db.collection('masterList')
          .doc(event.masterId)
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'addMaster': {
        await db.collection('order')
          .doc(event._id)
          .update({
            data: {
              masterId: event.masterId,
              status: 'wait',
            }
          })
          .then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err)
          })
        break
      }
      case 'getMasterList': {
        await db.collection('masterList')
        .orderBy("createTime", "desc")
        .get()
        .then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
        break
      }
      case 'avatarImg': {
        const fileList = event.avatarImg
        await c1.getTempFileURL({
          fileList: fileList,
        }).then(res => {
          resolve(res)
        })
        break
      }
      case 'onScan': {
        await db.collection('order')
          .doc(event._id)
          .update({
            data: {
              status: 'chack'
            }
          }).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        break
      }
      case 'toEdit': {
        await db.collection('order')
          .doc(event._id)
          .update({
            data: {
              homeType: event.homeType,
              m2: event.m2,
              inspectionTime: event.inspectionTime,
              remark: event.remark,
              phone: event.phone,
            }
          }).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        break
      }
    }
  })

}