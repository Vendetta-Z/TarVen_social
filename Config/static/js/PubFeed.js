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


function GetPostData(post_id){
    $.ajax({
        url:'get_post',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id':post_id},
        method:'GET',
        success: function(data){
            postData = JSON.parse(data['post']);
            author = JSON.parse(data['author']);
            console.log(author)
            $('.modal').css('display', 'flex');

            $('.modal-content').html(   `
                <div class="tweet-header">
                    <div class="Tweet-avatar-div">
                        <a href="`+ author[0].pk +`"><img  src="`+ author[0].fields.avatar +`" alt="avatar in pub feed popup" class="Tweet-Avatar"></a>
                    </div>
                    <div class="Tweet-Author-div">
                        <a class="tweet-author-name" href="`+ author[0].pk +`">`+ author[0].fields.username +`</a>
                        <a class="tweet-follow-button">Подписаться</a>
                    </div>
                </div>
               <img src="`+ postData[0].fields.PostVidOrImg +`" alt="Tweet Image 1" class="tweet-image">

                <p class="tweet-description">`+ postData[0].fields.description +`</p>

                <span class="tweet-date">`+ postData[0].fields.created +`</span> 

                <div class="comments-section">
                    <p class="comments-title">Блок с комментами</p>
                    <div class="comment">
                        <p>Комментарий 1</p>
                    </div>
                    <div class="comment">
                        <p>Комментарий 2</p>
                    </div>
                    <p class="comments-soon">СКОРО...</p>
                </div>

            `)
        }
    })
}