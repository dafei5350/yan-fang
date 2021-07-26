const cloud = require('wx-server-sdk')


exports.main = async (event, context) => {

  var c1 = new cloud.Cloud({
    appid: 'xxxxxxxxxxxxxxx',
    resourceAppid: 'xxxxxxxxxxxxx',
    resourceEnv: 'cloud1-xxxxxxxxxxxx',
  })
  const config = {
    appid: 'xxxxxxxxxx',
    mchid: 'xxxxxxxxxxxxx',
    pfx: require('fs').readFileSync('apiclient_cert.p12'), //退款功能，也可能用不到
    partnerKey: 'xxxxxxxxxxxxxxxxxxxxx',
    notify_url: 'https://mp.weixin.qq.com',
    spbill_create_ip: '127.0.0.1'
  };
  await c1.init()
  const tenpay = require('tenpay');
	const api = tenpay.init(config);
  return new Promise(async (resolve, reject) => {
    const db = c1.database()
    console.log(event.type);
    switch (event.type) {
      case 'getUntreatedList': {
        await db.collection('refund')
          .where({
            status: 'application'
          })
          .get()
          .then(res => {
            console.log(res);
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getProcessedList': {
        await db.collection('refund')
          .where({
            status: 'success'
          })
          .get()
          .then(res => {
            console.log(res);
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case 'getUntreatedInfo':{
        await db.collection('refund')
          .doc(event.id)
          .get()
          .then(res =>{
            console.log(res);
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        break
      }
      case "refund":  {

        return await api.refund({
          out_trade_no: event.out_trade_no, 
          out_refund_no: event.out_refund_no, 
          total_fee: event.total_fee, 
          refund_fee: event.refund_fee,
        }).then(res =>{
          resolve(res)
        }).catch(err =>{
          reject(err)
        })
        break
      }
    }
  })

}