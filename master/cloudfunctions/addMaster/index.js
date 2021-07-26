const cloud = require('wx-server-sdk')

exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxx',
    resourceAppid: 'xxxxxx',
    resourceEnv: 'xxxxxxxxxxx',
  })
  await c1.init()
  return new Promise(async (resolve, reject) => {
    const db = c1.database()
    console.log(event.type);
    switch (event.type) {
      case 'addMasterAvatar': {
        await c1.uploadFile({
          cloudPath: event.path,
          fileContent: new Buffer(event.file, 'base64')
        }).then(res => {
          console.log(res);
          resolve(res)
        }).catch(err => {
          reject(err)
        })
        break
      }
      case 'addMasterInfo': {
        await db.collection('masterList')
          .add({
            data: {
              avatar: event.avatar,
              name: event.name,
              phone: event.phone,
              account: event.account,
              pwd: event.pwd,
              createTime: event.createTime,
              identity: event.identity
            }
          })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getMasterList': {
        await db.collection('masterList')
          .where({
            identity: 'master'
          })
          .orderBy("createTime", "desc")
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getMasterAvater': {
        await c1.getTempFileURL({
          fileList: event.filelist,
        }).then(res => {
          resolve(res)
        }).catch(err =>{
          reject(err)
        })
        break
      }
      case 'getMasterNum':{
        await db.collection('masterList')
          .count()
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
          .field({
            name: true,
            phone: true
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
      case 'modifyInfo': {
        await db.collection('masterList')
          .doc(event.data.masterId)
          .update({
            data: {
              avatar: event.data.imageURL,
              name: event.data.name,
              phone: event.data.phone,
              pwd: event.data.pwd,
            }
          })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }

      case 'delMaster': {
        console.log(event.masterId);
        await db.collection('masterList')
          .doc(event.masterId)
          .remove()
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