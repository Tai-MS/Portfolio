import ticketClass from "../persistence/ticket.persistence.js";

async function generateTicket(fields){
    return await ticketClass.generateTicket(fields)
}

function verifyStock(fields){

}

function dateTime(){

}

export default {
    generateTicket,
    dateTime,
    verifyStock
}
