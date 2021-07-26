# 匠人验房 

> 本项目分为客户端和师傅端，客户端负责引流、预约等等，管理端负责订单核销、填写验房报告、调整预约价格、虚拟评价、删除评价、师傅增删等等。采用原生开发，后端采用云开发，只需要简单填写一些参数即刻使用本程序



![banner02](C:\Users\hehe123\Desktop\banner02.jpg)



## 在线预览



|                            客户端                            |                            师傅端                            |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="C:\Users\hehe123\Desktop\匠人验房师傅端.png" alt="匠人验房" style="zoom:50%;" /> | <img src="C:\Users\hehe123\Desktop\匠人验房师傅端.png" alt="匠人验房师傅端" style="zoom:50%;" /> |



## 实现功能如下

### 客户端

分享朋友、分享朋友圈、生成分享海报、微信支付、退款、评价、生成报告、分享报告等等

### 管理端

> 管理端分为超级管理员和验房师两种身份，不同身份操作权限不同，验房师傅只能查看管理员分配的订单，没有其他功能的操作权限

订单核销、管理订单、退款审核、添加验房师，验房师管理、身份管理、虚拟评论、评论审核、预约价格调整、修改验房标准等等



## 使用方法

下载本项目，将客户端导入开发者工具，替换掉`xxxxxxxxxxxxxxx`后面均有相应的注释（例如：//自定义appid），选择你的云函数，并在云函数中创建相对应的数据库。相对应的管理端也许替换掉 `xxxxxxxxxx`  额外的你还需要配置自己的七牛云，注意要启用不校验合法域名，后期填写域名后可关闭。



## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/)
- [W3Cschool](https://www.w3cschool.cn/weixinapp/weixinapp-mvg538kd.html)
- [Vant Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)
- [colorUI](http://demo.color-ui.com/)

