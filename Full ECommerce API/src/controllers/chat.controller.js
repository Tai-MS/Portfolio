import chatService from "../services/chat.service.js";

async function updateDb(user, message){
    return chatService.updateDb(user, message)
}

async function returnChat(){
    return chatService.returnChat()
}

export default {
    updateDb,
    returnChat
}