// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
const MAX_LIMIT = 2
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  console.log(event._openid);
  const wxContext = cloud.getWXContext()
  const countResult = await db.collection('order').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('order')
                      .where({ inspectionTime : event.date })
											.skip(i * MAX_LIMIT)
                      .limit(MAX_LIMIT)
                      .get()
    tasks.push(promise)
  }

  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}