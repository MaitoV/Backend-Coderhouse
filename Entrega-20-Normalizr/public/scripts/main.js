const socket = io.connect();
socket.emit('getProducts');

/* Conexion socket que crea y actualiza el listado de productos*/
let titleValue;
let priceValue;
let thumbnailValue;
const tableBody = document.getElementById('tbody');

function createNewProduct () {
    const productDetails = {
        title: titleValue,
        price: priceValue,
        thumbnail: thumbnailValue
    }
    socket.emit('create', productDetails);
}

function submitForm (e) {
    e.preventDefault();
    titleValue = document.getElementById('title').value;
    priceValue = document.getElementById('price').value;
    thumbnailValue = document.getElementById('thumbnail').value;
    createNewProduct()
}

socket.on('productList', (data) => {
    const htmlData = data.map((value) => {
        return `
            <tr>
                <td>${value.title}</td>
                <td>${value.price}</td>
                <td><img class='img-thumbnail' src='${value.thumbnail}'> </td>
            </tr> `
        }).join(' ');

    tableBody.innerHTML = htmlData;
})

/* Conexion Socket para el chat*/
//Boton del formulario del ingreso del email
const submitInitChat = document.getElementById('initChat');
//Contenedor del inicio del chat para colocar tu mail
const wrapperInitChat = document.getElementById('initChatWrapper');
//Div que contiene todo el chat
const chatWrapper = document.getElementById('chat-wrapper');
//Contenedor de las burbujas de chat
const messagesWrapper = document.getElementById('messagesWrapper');
//Contenedor de los usuarios conectados
const usersListContainer = document.getElementById('usersList');
//Boton de enviar nuevo mensaje
const btnNewMessage = document.getElementById('submitMessage');
// input del mensaje
let inputMessage = document.getElementById('inputMessage');
let userEmail;

submitInitChat.addEventListener('click', () => {
    userEmail = document.getElementById('email').value;
    chatWrapper.classList.toggle('none');
    wrapperInitChat.style.setProperty("display", "none", "important");
    //Emite el evento de unirse al chat
    socket.emit('initChat', userEmail);
    //Escucha evento del mensaje del bienvenida al usuario que se esta uniendo
    socket.on('welcome', (data) => {
      console.log(data);
        messagesWrapper.innerHTML += `
        <div class="rigth media w-50 ml-auto mb-3">
          <div class="media-body">
          <span class="user-email">${data.author.email}</span>
            <div class="bg_primary rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-white">${data.txt}</p>
            </div>
            <p class="small text-muted">${data.time}</p>
          </div>
        </div>`
    })
    //Evento que avisa a todos los usuarios conectados que se unio un nuevo usuario
    socket.on('userJoin', (data) => {
        messagesWrapper.innerHTML += `
        <div class="rigth media w-50 ml-auto mb-3">
          <div class="media-body">
          <span class="user-email">${data.author.email}</span>
            <div class="bg_primary rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-white">${data.txt}</p>
            </div>
            <p class="small text-muted">${data.time}</p>
          </div>
        </div>`
    })
    //Evento que actualiza el listado de usuarios online a todos
    socket.on('getUsers', (arrayUsers) => {
        let usersList = arrayUsers.map((aValue) => {
            return `<div class="list-group-item list-group-item-action active text-white rounded-0">
            <div class="media"><img src="${aValue.avatar}.png" alt="user" width="50" class="rounded-circle">
              <div class="media-body ml-4">
                <div class="d-flex align-items-center justify-content-between mb-1" id="userOnline"> 
                  <h6 class="mb-0">${aValue.email}</h6>
                </div>
              </div>
            </div>
          </div> `
        }).join(' ')
        usersListContainer.innerHTML = usersList;
    })
})
//Evento que escucha cada vez que alguien sumitea un nuevo mensaje en el chat
btnNewMessage.addEventListener('click', (e) => {
    e.preventDefault();
    let message = inputMessage.value;
    //Socket que emite un nuevo mensaje
    socket.emit('newMessage', message);
    //Elimina el texto escrito en el input
    inputMessage.value = ' ';
})
//Socket que recibe la llegada de nuevos mensajes a todos los usuarios
socket.on('updateMessages', (msg) => {
    messagesWrapper.innerHTML += `
        <div class=" media w-50 mb-3">
        <img src="${msg.author.avatar}.png" alt="user" width="50" class="rounded-circle">
            <span class="user-email">${msg.author.email}</span>
          <div class="media-body ml-3">
            <div class="bg-light rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-muted">${msg.text}</p>
            </div>
            <p class="small text-muted">${msg.time}</p>
          </div>
        </div>`;
})









