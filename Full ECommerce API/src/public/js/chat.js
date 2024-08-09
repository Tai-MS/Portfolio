const socket = io()
console.log(username);
document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault()
    const messageInput = document.getElementById("message")
    const message = messageInput.value
    messageInput.value = ""

    socket.emit("chatMessage", message)
})

socket.on("message", (data) => {
    const chatMessages = document.getElementById("chat-messages")
    const errorP = document.getElementById('error')
    const messageElement = document.createElement("div")
    errorP.innerHTML = ''
    messageElement.innerHTML = `<strong>${data.username}:</strong> ${data.message}`
    chatMessages.appendChild(messageElement)
})

socket.on("error", () => {
    const errorP = document.getElementById('error')
    errorP.innerHTML = 'Can´t send empty message'
})

socket.emit("newUser", username)

Swal.fire({
    icon: "success",
    title: "Bienvenido al chat",
    text: `Estas conectado como ${username}`
})
document.getElementById("chat-form").style.display = "block"
