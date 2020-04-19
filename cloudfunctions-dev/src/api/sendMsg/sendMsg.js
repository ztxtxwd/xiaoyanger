const {
  validateToken
} = require('../../utils/validateToken.js')
const db =uniCloud.database()
const collection = db.collection('message')
const dbCmd = db.command

function msgInit(msg){
	let now=new Date()
	msg.createTime= now.toJSON()
	msg.deleteStatus= false
	msg.readableStatus= false
	msg.type= "private"
	msg.viewStatus= false
	return msg
}

async function sendMsg(event) {
	try {
		// let msg={
		// 	color: event.color,
		// 	createTime: new Date().format("yyyy/MM/dd hh:mm:ss"),
		// 	deleteStatus: false,
		// 	duration: event.duration,
		// 	readableStatus: false,
		// 	recipient: event.recipient,
		// 	recipientAvatarUrl: event.recipientAvatarUrl,
		// 	recipientZhishouId: event.recipientZhishouId,
		// 	text: event.text,
		// 	type: "private",
		// 	viewStatus: false,
		// 	writer: event.writer,
		// 	writerAvatarUrl: event.writerAvatarUrl,
		// 	writerZhishouId: event.writerZhishouId
		// }
		event=msgInit(event)
		const tokenValidateResult=await validateToken(event.token)
		let res = await collection.where(dbCmd.and({recipientZhishouId: event.zhishouId}).and({writerZhishouId:event.recipientZhishouId}).and({readableStatus:false})).update({
		  readableStatus: true,
		})
		if(res.affectedDocs>0){
			event.readableStatus=true
		}
		
		if(tokenValidateResult.status==0){
			let res = await collection.add(event)
			return res
		}else{
			return tokenValidateResult
		}
		
	} catch (e) {
	  //TODO handle the exception
	  return e
	}
	
}
exports.main = sendMsg