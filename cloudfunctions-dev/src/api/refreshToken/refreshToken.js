const crypto = require('crypto')
const jwt = require('jwt-simple')
const {
  loginConfig,
  tokenExp
} = require('../../utils/constants.js')

const db = uniCloud.database()
async function refreshToken(event) {
  let data = {
    appid: loginConfig.AppId,
    secret: loginConfig.AppSecret,
    js_code: event.code,
    grant_type: 'authorization_code'
  }

  const res = await uniCloud.httpclient.request('https://api.weixin.qq.com/sns/jscode2session', {
    method: 'GET',
    data,
    dataType: 'json'
  })

  const success = res.status === 200 && res.data && res.data.openid
  if (!success) {
    return {
      status: -1,
      msg: '更新TOKEN失败'
    }
  }

  const {
    openid,
    //session_key 暂不需要session_key
  } = res.data

  let userInfo = {
    openid
  }

  let tokenSecret = crypto.randomBytes(16).toString('hex'),
  token= jwt.encode(userInfo, tokenSecret)
  const userUpdateResult = await db.collection('user').doc(event.openid).set({
    ...userInfo,
    tokenSecret,
    exp: Date.now() + tokenExp
  })
  if (userUpdateResult.id || userUpdateResult.affectedDocs === 1) {
    return {
      status: 0,
      token,
      msg: '更新TOKEN成功'
    }
  }
  
  return {
    status: -1,
    msg: '更新TOKEN失败'
  }

  
  
}

exports.main = refreshToken
