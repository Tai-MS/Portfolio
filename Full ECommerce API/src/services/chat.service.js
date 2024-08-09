import chatPersistence from "../persistence/chat.persistence.js";

async function updateDb(user, message){
    return chatPersistence.updateDb(user, message)
}

async function returnChat(){
    return chatPersistence.returnChat()
}

export default {
    updateDb,
    returnChat
}