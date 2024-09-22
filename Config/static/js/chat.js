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
let currentMenu = null;

function toggleMenu(messageId) {
    const messageElement = document.getElementById(`messageId_${messageId}`);

    if (currentMenu) {
        currentMenu.remove();
        currentMenu = null;
    }

    const submenu = document.createElement('div');
    submenu.classList.add('submenu', 'open');
    
    submenu.innerHTML = `
        <button onclick="replyToMessage('${messageId}')">Ответить</button>
        <button onclick="deleteMessage('${messageId}')">Удалить</button>
    `;
    
    messageElement.appendChild(submenu);

    currentMenu = submenu;

    document.addEventListener('click', function closeMenuOutside(event) {
        if (!submenu.contains(event.target) && !event.target.closest('.menu-icon')) {
            submenu.remove();
            currentMenu = null;
            document.removeEventListener('click', closeMenuOutside);
        }
    });
}


function replyToMessage(chat){

}

function deleteMessage(chat){
    
}