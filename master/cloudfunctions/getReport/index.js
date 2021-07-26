const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxxxxxxx',
    resourceAppid: 'xxxxxxxxxx',
    resourceEnv: 'cloud1-xxxxxxxxxx',
  })
  await c1.init()
  return new Promise(async (resolve, reject) => {
    const db = c1.database()
    console.log(event.type);
    switch (event.type) {
      case 'exquisite': {
        await db.collection('standard')
          .doc('xxxxxxxxxxx')
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'rough': {
        await db.collection('standard')
          .doc('xxxxxxxxxxxxxxxx')
          .get()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'addImg': {
        await c1.uploadFile({
          cloudPath: event.path,
          fileContent: Buffer.from(event.file, 'base64')
        }).then(res =>{
          console.log(res);
          // resolve(res)
          c1.getTempFileURL({
            fileList: res.fileID.split(),
          }).then(res => {
            console.log(res);
            resolve(res)
          })
        }).catch(err => {
          reject(err)
        })
        break
      }
      case 'upReport': {
        await db.collection('report')
        .add({
          data: {
            exquisite: event.exquisite
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
      case 'changOrder': {
        await db.collection('order')
          .doc(event._id)
          .update({
            data:{
              finish: true,
              status: 'success'
            }
          }).then(res =>{
            resolve(res)
          }).catch(err =>{
            reject(err)
          })
        break
      }
      case 'CopyOrderHistory': {
        await db.collection('order')
          .doc(event._id)
          .get()
          .then(res =>{
            console.log(res);
            db.collection('historyOrder')
              .add({
                data: {
                  masterId: event.masterId,
                  finishTime: event.finishTime,
                  main: res.data
                }
              }).then(res =>{
                resolve(res)
              }).catch(err =>{
                reject(err)
              })
          }).catch(err =>{
            reject(err)
          })
        break
      }
      case 'DelOrder': {
        await db.collection('order')
          .doc(event._id)
          .remove()
          .then(res =>{
            resolve(res)
          }).catch(err =>{
            reject(err)
          })
        break
      }
    }
  })

}