function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    var PubFeedModal = document.getElementById('modal');
    if (event.target === PubFeedModal ) {
        PubFeedModal.style.display = 'none'
    }
}


document.addEventListener('keydown', function (e) {
    var PubFeedModal = document.getElementById('modal');
    if(e.key === 'Escape'){
        PubFeedModal.style.display = 'none'
    }
})
