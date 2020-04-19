const {
  validateToken
} = require('../../utils/validateToken.js')
const db = uniCloud.database()
async function updateUserInfo(event) {
	// validateToken(event).then(function(res){
	// 	if(res.status==0){
	// 		db.collection('user').doc(event.openId).update(event).then(function(res){
	// 			return {
	// 				status:0,
	// 				msg:'更新成功',
	// 				data:event
	// 			}
	// 		})
	// 	}else{
	// 		return {
	// 			status:-1,
	// 			msg:'更新失败，token失效'+JSON.stringify(validateToken(event.token))
	// 		}
	// 	}
	// })
	try {
		let userUpdateResult
	  let tokenValidateResult=await validateToken(event.token)
	  if(tokenValidateResult.status===0){
		  userUpdateResult= await db.collection('user').doc(event.openid).update(event)
		  return userUpdateResult
	  }else{
		  return tokenValidateResult
	  }
	} catch (e) {
	  //TODO handle the exception
	  return e
	}
}
exports.main = updateUserInfo