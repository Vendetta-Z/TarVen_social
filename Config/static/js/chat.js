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