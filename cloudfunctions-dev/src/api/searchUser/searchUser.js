const {
  validateToken
} = require('../../utils/validateToken.js')
const db = uniCloud.database()


async function getInDB(event){
	
	const user = await db.collection('user').field({ 'nickName': true ,'zhishouId':true,'avatarUrl':true}).where({zhishouId:event}).get()
	
	return user
	// let cp=[]
	
	
}

async function searchUser(event) {
	try {
		let tokenValidateResult=await validateToken(event.token)
		if(tokenValidateResult.status===0){
			return await getInDB(event.zhishouId)
		}else{
			return tokenValidateResult
		}
	} catch (e) {
	  //TODO handle the exception
	  return e
	}
	
}
exports.main = searchUser