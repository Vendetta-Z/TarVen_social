const Scroll_Controler = {
    DisableScrool(){
        document.body.style.cssText = `
        overflow:hidden;
    `
    },
    EnableScrool(){
        document.body.style.cssText = ''
    }
}

document.addEventListener('keydown', function (e) {
    if(e.key === 'Escape'){
        Scroll_Controler.EnableScrool();
        $('.PopUpForMoreAboutPost').css('display', 'none');
        $('.postVideoPlayer').remove();
        $('.UserData_block').css('display', 'block');
        $('.AuthorPost').css('display', 'block');
    }
  }); 

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


function  open_popup_for_post(post_id, open_in_to){   
    $.ajax({
        url:'/get_post',
        headers: { "X-CSRFToken": getCookie("csrf_token")},
        data:{'post_id': post_id},
        method:'GET',
        contentType: 'application/json',
        dataType:'json',
        success: function(data){
        
            
        var comments = data['comments']
        var post = JSON.parse(data['post'])
        var author = JSON.parse(data['author'])
        var PostMainFile =  post[0]['fields']['PostVidOrImg'];
        var videoPlayerHtml = '<video class="postVideoPlayer" width="630" height="540" controls autoplay> <source id="videoSourceInPopipForMore" type="video/mp4"> </source> </video>'
       
        Scroll_Controler.DisableScrool();
        $('.UserData_block').css('display', 'none')
        $('.AuthorPost').css('display', 'none')
        $('.PopUpForMoreAboutPost').css('display', 'block');
        $('.PopUpForMoreAboutPost__PostImg').attr('src', PostMainFile)
        $('.PopUpForMoreAboutPost__PostAuthor').text(author[0]['fields']['username'])
        $('.PopUpForMoreAboutPost__PostDescription').text(post[0]['fields']['description'])
        $('.PopUpForMoreAboutPost_AuthorInfoDiv__LikeBtn').attr('onclick', 'adding_like_for_post(' + post[0]['pk'] + ')');
        $('.PopUpForMoreAboutPost_AuthorInfoDiv__LikeBtn_img').attr('src',  data['like_icon'] );
        
        $('.add_comment_btn').attr('onclick', 'add_comment('+ post[0]['pk'] +')');
        $('.publication_author_link').attr('href', post[0]['fields']['author']);
        $('.publication_author_link').text( author[0]['fields']['username']);
        $('.save_btn_in_post_more_info_popup').attr('onclick', 'save_post_to_favorite('+ post[0]['pk']+')');
        $('.change_publication_data_btn').attr('onclick', 'change_post_data('+ post[0]['pk'] +')');
        $('.comments_div_in_popup_for_more_info').html('');
        $('.delete_publication_btn').attr('onclick', 'send_data_to_del_pub_('+ post[0]['pk'] +')');


        if (PostMainFile.slice(-3) === 'mp4'){
            $('.PopUpForMoreAboutPost__PostImg').css('display', 'none');
            $('.PopUpForMoreAboutPost').prepend(videoPlayerHtml)
            $('#videoSourceInPopipForMore').attr('src', PostMainFile)
        }
        else{
            $('.PopUpForMoreAboutPost__PostImg').css('display', 'block');
            $('.PopUpForMoreAboutPost__PostImg').attr('src', '/'+ post[0]['fields']['PostVidOrImg'])

        }
        
        
        for (var comm in comments){
            $('.PopUpForMoreAboutPost__CommentsBlock').append(`
            <div class="PopUpForMoreAboutPost__CommentsBlock_comment">
                <img class="PopUpForMoreAboutPost__CommentsBlock_comment_AuthorAvatar" src="` + comments[comm]['author']['avatar'] + `" />
                <a class="PopUpForMoreAboutPost__CommentsBlock_comment_Author">` + comments[comm]['author'] + `</a>
                <a class="PopUpForMoreAboutPost__CommentsBlock_comment_Created">12 december 23y</a>
                <a class="PopUpForMoreAboutPost__CommentsBlock_comment_Text">`+ comments[comm]['text'] +`</a>
            </div> `
            )
        }

        if(open_in_to === 'Pub_feed'){
            $('.submenu_btn_in_post_more_info_popup').remove();
            $('.delete_publication_btn'),attr('onclick', 'remove_post_on_favorites');

            if (data['self_user_follow_author'] === 0){
                $('.sub_unsub_user_btn').attr('onclick' ,'subscribe_to_user('+ post[0]['fields']['author'] +')')
                $('.sub_unsub_user_btn').text('Подписаться')
            }
            else{
                $('.sub_unsub_user_btn').attr('onclick' ,'unsubscribe_user('+ post[0]['fields']['author'] +')')
                $('.sub_unsub_user_btn').text('Отписаться')

            }
            
        }
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

function send_data_to_del_pub_(publication_id){
    $.ajax({
        url:'delete_post',
        type: 'POST',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id': publication_id},
        success: (data) => {
            $('#user_publication_id_'+publication_id).remove();
            $('.popup_for_more_about_post').css('display', 'none');
            $('.publication_submenu_block').css('display', 'none');
            $('.post_id_'+ publication_id).remove()
        }
    })
}

// Отправка лайка на сервер и изменения иконки лайка в зависимости от ответа
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

//изменение данных поста
function GetPostData(post_id){
    $.ajax({
        url:'get_post',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id':post_id},
        method:'GET',
        success: function(data){
            postData = JSON.parse(data['post']);
            openPostEditPopup(postData[0]);
        }
    })
}

function refresh_changed_pub_in_profile(post_id){
    publication_by_id = $('#user_publication_id_'+post_id)
    pub_img = $('#image_for_post_id_'+post_id)
    pub_text = $('#description_for_post_id_'+post_id)

    $.ajax({
        url:'get_post',
        method: 'GET',
        data: {'post_id': post_id},
        enctype: 'multipart/form-data',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        success: (data) => {
            $('.covepPopupChangeStory').css('display', 'none');

        }
    })

}

function send_changed_data_to_back(post_id){
    post_description = $('.DescriptionAreaInPopupEditPost').val();
    post_image = $('#PostChangedImageInPopup')[0].files[0];

    
    var formData = new FormData();
    formData.append('id',post_id);
    formData.append('post_description',post_description);
    formData.append('post_image', post_image);

    $.ajax({
        url:'change_post_data',
        method: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        enctype: 'multipart/form-data',
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken")},

        success: function(data){
            refresh_changed_pub_in_profile(post_id);
        }
    })
}