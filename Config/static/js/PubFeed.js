// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    var modal = document.getElementById('modal');

    if ( event.target === modal) {
        modal.style.display = 'none';
        $('.comments-section').empty();

    }
}

document.addEventListener('keydown', function (e) {
    var modal = document.getElementById('modal');
    
    if(e.key === 'Escape'){
        modal.style.display = 'none';
        $('.comments-section').empty()
        $('.comments-modal').css('display', 'none');
    }
})
