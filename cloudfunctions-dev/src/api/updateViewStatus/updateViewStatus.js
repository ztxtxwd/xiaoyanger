const db = uniCloud.database()

async function updateVuewStatus(event) {
	try {
		const msgUpdateResult= await db.collection('message').doc(event.msgId).update({viewStatus:true})
		
		if(msgUpdateResult.status===0){
			return msgUpdateResult
		}else{
			return msgUpdateResult
		}
	} catch (e) {
	  //TODO handle the exception
	  return e
	}
	
}
exports.main = updateVuewStatus