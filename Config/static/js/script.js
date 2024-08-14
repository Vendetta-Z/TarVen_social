// Отправка лайка на сервер и изменения иконки лайка в зависимости от ответа

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

function adding_like_for_post(post_id){
    $.ajax({
        url:'/Like/add_like',
        data:{'post_id': post_id},
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        method:'POST',
        success:function(data){
            if(data['method'] === 'A'){
                $('.Post_hearth_icon').html(('<img src="'+ data['like_icon'] +'"></img>'))
                $('.like_in_pub_feed').html(('<img src="'+ data['like_icon'] +'"></img>'))
            }
            else if(data['method'] === 'R'){
                $('.Post_hearth_icon').html(('<img src="'+ data['like_icon'] +'"></img>'))
                $('.like_in_pub_feed').html(('<img src="'+ data['like_icon'] +'"></img>'))

            }
        }
    })
}

function subscribe_to_user(user_id){
    $.ajax({
        url:'subscribe',
        type: 'POST',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'user_id': user_id},
        success: (data) => {
            $('#sub_unsub_to_user_btn').text('Отписаться');
            $('#sub_unsub_to_user_btn').attr('onclick', 'unsubscribe_user('+ user_id +')');
        }
    })
}

function unsubscribe_user(post_author){
    $.ajax({
        url:'unsubscribe',
        type: 'POST',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'following_user_id': post_author},
        success: (data) => {
            $('#sub_unsub_to_user_btn').text('Подписаться');
            $('#sub_unsub_to_user_btn').attr('onclick', 'subscribe_to_user( '+ post_author +' )');
        }
    })
}

function add_comment(post_id){
    text = $('.comment_text_input').val()
    $.ajax({
        url:'Comments/new_comment',
        data:{'post_id': post_id, 'comm_text': text},
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        method:'POST',
        success:function(data){
            $('.comment_div_in_publication_feed_post').append(`
            <div class="comment_in_publication_feed_post">
                <p>Автор:  ` + data['author'] + `</p>
                <a class="comment_in_publication_feed_post"> Текст комментария:<br/> ` + data['text'] + `</a>
                <p>--------------------------------</p>
            </div>
            `)
        }
    })
}

function save_post_to_favorite(post_id){
    $.ajax({
        url:'/Post/save_post',
        data:{'saved_post_id': post_id},
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        method:'POST',
        success:function(data){
            if(data['post_status'] === 'removed'){
                $('.saved_post_id_'+ post_id).remove();
            }
        }
    })
}