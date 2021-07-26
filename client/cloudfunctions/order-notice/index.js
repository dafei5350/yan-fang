const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: event.openid, 
        page: 'pages/report/report', 
        lang: 'zh_CN',   
        data: {
          name5:{
            value:event.name
          },
          phone_number6:{
            value: event.content
          },
          thing9:{
            value: event.status
          },
          thing7:{
            value: event.remark
          },
          thing2:{
            value: event.remark
          },
        },
        templateId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',  // 自定义templateId
        miniprogramState: 'formal'

      })
    return result
  } catch (err) {
    return err
  }
}