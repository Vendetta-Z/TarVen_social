function RemoveChat(chatId){
    $.ajax({
        url:'/Chat/remove',
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data:{'chatId':chatId},
        success: function(data){
            $('#chatId_'+ chatId).remove();
        }
    })
}

window.onload = function () {
    var messageBlock = document.getElementById("messagesBlock");
    messageBlock.scrollTop = messageBlock.scrollHeight;  // Прокрутка в самый низ
};

// Функция для открытия/закрытия меню
let currentMenuSubmenu = null;
let isReplying = null;
function toggleMenu(messageId) {
    const messageElement = document.getElementById(`messageId_${messageId}`);

    // Если текущее меню уже открыто, закрываем его
    if (currentMenuSubmenu) {
        currentMenuSubmenu.remove();
        currentMenuSubmenu = null;
    }

    // Создаем новое меню
    const submenu = document.createElement('div');
    submenu.classList.add('submenu', 'open');

    submenu.innerHTML = `
        <button onclick="replyToMessageMenu('${messageId}')">Ответить</button>
        <button onclick="DeleteMessageSubMenu(${messageId})">Удалить</button>
    `;

    messageElement.appendChild(submenu);

    // Сохраняем ссылку на текущее меню
    currentMenuSubmenu = submenu;

    // Закрытие меню при клике вне его
    document.addEventListener('click', function closeMenuOutside(event) {
        if (!submenu.contains(event.target) && !event.target.closest('.menu-icon')) {
            submenu.remove();
            currentMenuSubmenu = null;
            document.removeEventListener('click', closeMenuOutside);
        }
    });
}


function replyToMessageMenu(messageId) {
    // Получаем текст и автора сообщения
    const replyingMessageText = document.querySelector(`#messageId_${messageId} p`).innerText;

    // Показываем информацию об ответе в блоке ввода
    document.getElementById("ReplyingMessageText").innerText = replyingMessageText;

    // Сохраняем данные об ответе для дальнейшей отправки
    isReplying = {
        messageId: messageId,
        messageText: replyingMessageText,
    };
}

let currentMenuDelete = null;
function DeleteMessageSubMenu(messageId) {
    // Находим элемент сообщения
    const messageElement = document.getElementById(`messageId_${messageId}`);
    const DelSubmenu = document.createElement('div')
    const submenu = $('.submenu');
    submenu.remove()

    DelSubmenu.innerHTML = `
            <button onclick="DeleteMessageFromAll(${messageId})">Удалить для всех</button>
            <button onclick="DeleteMessageFromUser(${messageId})">Удалить только для себя</button>
        `;
    messageElement.appendChild(DelSubmenu);
}


function DeleteMessageFromAll(messageId){
    chatSocket.send(JSON.stringify({
        type: 'DeleteMessageFromAll',
        isDeleteFromAll: true,
        messageId:messageId
    })
)}
