const {
  validateToken
} = require('../../utils/validateToken.js')
const db = uniCloud.database()
async function getMsgsInDB(event){
	const commonMsgInDB = await db.collection('message4All').get()
	const dbCmd = db.command
	const msgInDB = await db.collection('message').where(dbCmd.or(
		{
			writerZhishouId: event.zhishouId
		},
		{
			recipientZhishouId: event.zhishouId,
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
async function getMessages(event) {
	try {
		let userUpdateResult
		
		let msgs= getMsgsInDB(event)
		let tokenValidateResult=await validateToken(event.token)
		if(tokenValidateResult.status===0){
			return msgs
		}else{
			return tokenValidateResult
		}
	  // let tokenValidateResult=await validateToken(event.token)
	  // if(tokenValidateResult.status===0){
		 //  const commonMsgInDB = await db.collection('message4All').get()
		 //  const dbCmd = db.command
		 //  const msgInDB = await db.collection('message').where(dbCmd.or(
		 //  	{
		 //  		writerZhishouId: event.zhishouId
		 //  	},
		 //  	{
		 //  		recipientZhishouId: event.zhishouId
		 //  	})).get()
		 //  let msgs=commonMsgInDB.data.concat(msgInDB.data)
		 //  msgs.sort(function(a,b){
		 //  	let dateA=new Date(a.createTime).getTime()
		 //  	let dateB=new Date(b.createTime).getTime()
		 //  	return dateB-dateA
		 //  })
		 //  return msgs
	  // }else{
		 //  return tokenValidateResult
	  // }
	} catch (e) {
	  //TODO handle the exception
	  return e
	}
	
}
exports.main = getMessages