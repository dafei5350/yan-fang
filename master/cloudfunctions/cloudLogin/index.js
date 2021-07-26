const cloud = require('wx-server-sdk')


exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxxxx',
    resourceAppid: 'xxxxx',
    resourceEnv: 'cloud1-xxxx',
  })

  await c1.init()

  return new Promise(async (resolve, reject) => {

    const db = c1.database()
    switch (event.type){
      case 'admin':{
        await db.collection('admin')
        .where({
          account: event.account
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
      case 'master':{
        await db.collection('masterList')
        .where({
          account: event.account
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
      case 'getMasterInfo': {
        await db.collection('masterList')
          .doc(event.masterId)
          .get()
          .then(res =>{
            resolve(res)
          }).catch(err =>{
            reject(err)
          })
        break
      }
      case 'getAvatar':{
        await c1.getTempFileURL({
          fileList: event.avatar
        }).then(res =>{
          resolve(res)
        }).catch(err =>{
          reject(err)
        })
        break
      }
      case 'getMoney':{
        await db.collection('money')
          .doc('xxxxxxxxxxx')
          .get()
          .then(res =>{
            resolve(res)
          }).catch(err =>{
            reject(err)
          })
        break
      }
      case 'editMooney':{
        await db.collection('money')
          .doc('xxxxxxxxxx')
          .update({
            data:{
              money: event.money
            }
          }).then(res =>{
            resolve(res)
          }).catch(err =>{
            reject(err)
          })
        break
      }
      case 'getScore':{
        await db.collection('comment')
          .where({
            masterId: event.id
          })
          .get()
          .then(res =>{
            resolve(res)
          }).catch(err =>{
            reject(err)
          })
      }
    }
  })

}