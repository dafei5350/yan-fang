let uuid = function () {
  let random = ''
  let datetime = Date.now()
  for (var i = 0; i < 3; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return uuid = random + datetime
}
// 需要导出
module.exports = {
    uuid
}