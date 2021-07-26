const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxxxxxx',
    resourceAppid: 'xxxxxxxxxx',
    resourceEnv: 'cloud1-xxxxxxxx',
  })
  await c1.init()
  return new Promise(async (resolve, reject) => {
    const db = c1.database()
    console.log(event.type);
    switch (event.type) {
      case 'unread': {
        await db.collection('comment')
          .where({
            read: false
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
      case 'read': {
        await db.collection('comment')
          .where({
            read: true
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
      case 'onPass': {
        await db.collection('comment')
          .doc(event.commentID)
          .update({
            data:{
              read: true
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
      case 'onDel': {
        await db.collection('comment')
          .doc(event.commentID)
          .remove()
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }

      case 'pushComment': {
        console.log(event);
        console.log(event.upAvatarUrl);
        await db.collection('comment')
          .add({
            data:{
              avatarUrl: event.avatarUrl,
              imgList: event.upImgList,
              overall: event.overall,
              attitude: event.attitude,
              ability: event.ability,
              evaluation: event.evaluation,
              nickName: event.nickName,
              xiaoqu: event.xiaoqu,
              createTime: event.createTime,
              like: event.like,
              watch: event.watch,
              virtual: true,
              read: false
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
    }
  })

}