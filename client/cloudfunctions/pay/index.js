const cloud = require('wx-server-sdk')
cloud.init();
const tenpay = require('tenpay');

const config = {
	appid: 'xxxxxxxxxxx',                      //自定义appid
	mchid: 'xxxxxxx',                          //自定义machid
	pfx: require('fs').readFileSync('apiclient_cert.p12'), //退款功能，也可能用不到
	partnerKey: 'xxxxxxxxxxx',                             //自定义partnerKey
	notify_url: 'https://mp.weixin.qq.com',
	spbill_create_ip: '127.0.0.1'
};

exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	// 支付初始化
	const api = tenpay.init(config);
  //调用，想用一个云函数实现全部支付功能，包括支付、退款、查询等
  switch (event.command) {
    case "pay":  //支付功能
      return await api.getPayParams({
        out_trade_no: event.out_trade_no,   //这是商户的订单号，要求商户内唯一
        body: event.body,
        total_fee: event.total_fee,       //订单金额(单位是分),
        openid: wxContext.OPENID   //付款用户的openid，直接拿就行
      })
      break

    case "payOK":    //想利用微信小程序得到付款成功消息后，给云函数来一个通知，解决付结果返回没有服务器的问题
      console.log("payOK:", event.out_trade_no);
      break

    case "refund":    //退款功能
      console.log("refund, event, wxContext.OPENID", event, wxContext.OPENID);
      return await api.refund({
        // transaction_id, out_trade_no 二选一
        // transaction_id: '微信的订单号',
        out_trade_no: event.out_trade_no,    //商户订单号
        out_refund_no: event.out_refund_no,  //商户退款订单号，要求商户内唯一
        total_fee: event.total_fee,  //原单订单金额(单位是分)
        refund_fee: event.refund_fee,
        refund_desc: event.refund_desc
      })
      // 相关默认值:
      // op_user_id - 默认为商户号(此字段在小程序支付文档中出现)
      // notify_url - 默认为初始化时传入的refund_url, 无此参数则使用商户后台配置的退款通知地址
      break
  }
}