const {
  validateToken
} = require('../../utils/validateToken.js')
const db = uniCloud.database()
const dbCmd = db.command

async function getInDB(event){
	let cp=[]
	const user = await db.collection('user').doc(event.openid).get()
	
	return user
	// let cp=[]
	
	
}
async function getUsersInDB(cp){
	
	const users = await db.collection('user').field({ 'nickName': true ,'zhishouId':true,'avatarUrl':true}).where({zhishouId: dbCmd.in(cp)}).get()
	
	return users
	// let cp=[]
}

async function getContactPerson(event) {
	try {
		
		
		let user= await getInDB(event)
		let tokenValidateResult=await validateToken(event.token)
		if(tokenValidateResult.status===0){
			return await getUsersInDB(user.data[0].contactPerson)
		}else{
			return tokenValidateResult
		}
	} catch (e) {
	  //TODO handle the exception
	  return e
	}
	
}
exports.main = getContactPerson