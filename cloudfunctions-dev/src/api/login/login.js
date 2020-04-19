const crypto = require('crypto')
const jwt = require('jwt-simple')
const {
  loginConfig,
  tokenExp
} = require('../../utils/constants.js')

const db = uniCloud.database()

async function getMessages(zhishouId){
	const commonMsgInDB = await db.collection('message4All').get()
	const dbCmd = db.command
	const msgInDB = await db.collection('message').where(dbCmd.or(
		{
			writerZhishouId: zhishouId
		},
		{
			recipientZhishouId: zhishouId,
			readableStatus:true 
		})).get()
	let msgs=commonMsgInDB.data.concat(msgInDB.data)
	msgs.sort(function(a,b){
		let dateA=new Date(a.createTime).getTime()
		let dateB=new Date(b.createTime).getTime()
		return dateB-dateA
	})
	return msgs
}
function getZhishouId(){
	let zhishouId=Math.ceil(Math.random()*100000); 
	while (db.collection('user').where({
		zhishouId:zhishouId
	}).get().length>0||zhishouId<10000) {
	    zhishouId=Math.ceil(Math.random()*100000); 
	}
	
	return zhishouId; 
}

function getConfig(){
	var config=db.collection('config').get()
	return config[0]
}

async function login(event) {
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
      msg: '微信登录失败'
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
    token = jwt.encode(userInfo, tokenSecret)

  const userInDB = await db.collection('user').where({
    openid
  }).get()

  let userUpdateResult
  let loginState={
	  token,
	  openid:openid
  }
  let loginResult={}
  let zhishouId
  if (userInDB.data && userInDB.data.length === 0) {
	zhishouId=getZhishouId()
	loginState.zhishouId=zhishouId
    userUpdateResult = await db.collection('user').add({
      ...userInfo,
      tokenSecret,
      exp: Date.now() + tokenExp,
	  contactPerson:[],
	  sincerity:0,
	  status:1,
	  zhishouId:zhishouId,
	  _id:openid
    })
  } else {
	loginResult.msgs= await getMessages(userInDB.data[0].zhishouId)
    userUpdateResult = await db.collection('user').doc(userInDB.data[0]._id).set({
      ...userInfo,
      tokenSecret,
      exp: Date.now() + tokenExp
    })
	loginState.zhishouId=userInDB.data[0].zhishouId
	loginResult.userInfo={
		nickName:userInDB.data[0].nickName,
		avatarUrl:userInDB.data[0].avatarUrl,
		zhishouId:userInDB.data[0].zhishouId
	}
  }
  
	loginResult.loginState=loginState
  if (userUpdateResult.id || userUpdateResult.affectedDocs === 1) {
    return {
      status: 0,
      token,
      msg: '登录成功',
	  data: loginResult
    }
  }

  return {
    status: -1,
    msg: '微信登录失败'
  }
}

exports.main = login
