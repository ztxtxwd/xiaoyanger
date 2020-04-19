const loginConfig = {
  AppId: 'wx31ea3c313eafc40d', //微信小程序AppId
  AppSecret: '220fa4bf0001930a50657a1b83b1123e' //微信小程序AppSecret
}

const passSecret = '220fa4bf0001930a50657a1b83b1123e' //用于用户数据库密码加密的密钥，使用一个比较长的随机字符串即可

//上面三个字段非常重要！！！

const tokenExp = 7200000

module.exports = {
  loginConfig,
  passSecret,
  tokenExp
}
