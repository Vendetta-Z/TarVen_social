//Переменные для динамического поиска 
const searchInput = document.getElementById('searchInput')
const searchResult = document.getElementById('feed')


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

function Search(){
    let inputText = $('.searchInput').val()
    let OptionToSearchInput = $('.OptionToSearchInput').val();
    if(inputText.length > 1){
        $.ajax({
            url:'/Posts/search',
            data:{'search_param': inputText},
            headers: { "X-CSRFToken": getCookie("csrftoken")},
            method:'GET',
            success:function(data){
                let dataJson = data['result']
                let searchRePostsData = JSON.parse(dataJson.Posts);
                let searchReUsersData = JSON.parse(dataJson.Users);
                console.log(searchReUsersData);
                $('#feed').empty();

                switch(OptionToSearchInput) {
                    case 'Publications':
                        for(var i = 0; i < searchRePostsData.length; i++){
                            $('.feed').prepend(`
                                <div class="post" onclick="OpenPostPopup(${searchRePostsData[i].pk})">
                                    <img src="${searchRePostsData[i].fields.PostFile}" id="imagePlayer-1" alt="Post Image" style="max-width: 100%; height: auto;">
                                </div>
                            `)
                        }
                        break
                    
                    case 'Users':
                        for(var i = 0; i < searchReUsersData.length; i++){
                            $('.feed').prepend(`
                                <div class="UserDivInSearchBlock">
                                    <a href="/${searchReUsersData[i].pk}">
                                        <img  src="${searchReUsersData[i].fields.avatar}">
                                        <a >${searchReUsersData[i].fields.first_name}</a>
                                    </a>
                                </div>
                            `)
                        }
                        
                        break
                    
                    default:
                        console.log('default')
                        break
                }
            }
        })
        
    }
}

function adding_like_for_post(post_id){
    $.ajax({
        url:'/Like/add_like',
        data:{'post_id': post_id},
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        method:'POST',
        success:function(data){
            if(data['method'] === 'A'){
                $('.LikeIconCountTag').html(('<img class="LikeIconPopup"  src="'+ data['like_icon'] +'"></img>'))
                $('.like_in_pub_feed').html(('<img class="LikeIconPopup"  src="'+ data['like_icon'] +'"></img>'))
            }
            else if(data['method'] === 'R'){
                $('.LikeIconCountTag').html(('<img class="LikeIconPopup"  src="'+ data['like_icon'] +'"></img>'))
                $('.like_in_pub_feed').html(('<img class="LikeIconPopup"  src="'+ data['like_icon'] +'"></img>'))

            }
        }
    })
}
//TODO исправить метод добавления лайка
function adding_like_for_post(post_id){
    fetch('/my-ajax-url/')
      .then(response => response.json())  // Обработка ответа...
      .then(data => {
    // Применение данных в вашем интерактивном сценарии 💃
  });
}

function subscribe_to_user(user_id){
    $.ajax({
        url:'subscribe',
        type: 'POST',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'user_id': user_id},
        success: (data) => {
            $('.tweet-follow-button').text('Отписаться');
            $('.tweet-follow-button').attr('onclick', 'unsubscribe_user('+ user_id +')');
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
            $('.tweet-follow-button').text('Подписаться');
            $('.tweet-follow-button').attr('onclick', 'subscribe_to_user('+ post_author +')');
        }
    })
}

function add_comment(post_id){
    
    CommentInput = (document.getElementsByClassName("modal-commentInput")[0].value);
    $.ajax({
        url:'Comments/new_comment',
        data:{'post_id': post_id, 'comm_text': CommentInput},
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        method:'POST',
        success:function(data){
            console.log(data)
            $('.comments-section').append(`
            <div>
                <img class="comments-author-avatar" />
                <p class="Comments-section-author-name">${ data['author'] }</p>
                <p class="Comments-section-comment-text">${ data['text'] }</p>
            </div>
            `)
        }
    })
}

function OpenPostPopup(post_id){
    $.ajax({
        url:'/Posts/get_post',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id':post_id},
        method:'GET',
        success: function(data){
            postData = JSON.parse(data['post']);
            author = JSON.parse(data['author']);
            comments = data['comments']
            isSaved = data['isSaved']
            userFollowingBtn = [`subscribe_to_user(${author[0].pk})`, 'Подписаться']
            if(data.self_user_follow_author == 1){
                userFollowingBtn = [`unsubscribe_user(${author[0].pk})`,'Отписаться']
            }

            $('.modal').css('display', 'block');

            $('.Tweet-Avatar').attr('src', `/${author[0].fields.avatar}`);
            $('.Tweet-Avatar-link').attr('href', `/User/${author[0].pk}`);

            $('.tweet-author-name').attr('href', `/User/${author[0].pk}`);
            $('.tweet-author-name').text(author[0].fields.username);
            $('.tweet-follow-button').attr('onclick', userFollowingBtn[0]);
            $('.tweet-follow-button').text(userFollowingBtn[1]);


            var fileType = (postData[0].fields.PostFile).split('.').pop();
            if(fileType == 'mp4'){
                $('.tweet-image').css('display', 'none');
                $('.plyr').css('display', 'block');
                $('.plyrVideoPlayerSource').attr('preload','auto')
                $('.plyrVideoPlayerSource').html(`<source class="plyrVideoPlayerSource" src="/${postData[0].fields.PostFile}"  type="video/mp4">`)
                const players = Plyr.setup('.plyrVideoPlayerSource');

            }
            else{
                $('.plyr').css('display', 'none');
                $('.tweet-image').css('display', 'block');
                $('.tweet-image').attr('src', `/${postData[0].fields.PostFile} `);
            }

            $('.LikeIconCountTag').attr('onclick', `adding_like_for_post(${post_id})`)
            $('.LikeIconPopup').attr('src', `/${data.like_icon}`)

            $('.tweet-comment-link').attr('onclick', `openCommentsPopup(${post_id})`)

            $('.tweet-favorite-link').attr('onclick', `save_post_to_favorite(${post_id})`)
            if(isSaved === 0){
                $('.tweet-favorite-icon').attr('src', '/Config/static/icons/save-instagram-black-lineal-18315.svg');
            }
            else{
                $('.tweet-favorite-icon').attr('src', '/Config/static/icons/black-save-instagram-18316.svg');
            }

            $('.tweet-description').text(postData[0].fields.description)
            $('.tweet-date').text(postData[0].fields.created)
            $('.Modal-CommentSubmitBtn').attr('onclick', `add_comment(${ post_id })`)
            $('.LikeIconCountTag')
            $('.LikeIconCountTag')
            $('.LikeIconCountTag')
            $('.modalChangePostBtn').attr('onclick', `openPostEditPopup(${ post_id })`)  
        }
    })
}

function openCommentsPopup(post_id){

    $.ajax({
        url:'get_post',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id':post_id},
        method:'GET',
        success: function(data){
            $('.modal').css('display', 'none');
            $('.comments-write-section').css('display', 'block');
            $('.comments-modal').css('display', 'block');

            for (comment in comments){
                $('.comments-section').prepend(`
                    <div>
                        <p class="Comments-section-author-name">${ comments[comment].author }</p>
                        <p class="Comments-section-comment-text">${ comments[comment].text }</p>
                    </div>
                    `)
                }
        }})
    
}

function save_post_to_favorite(post_id){
    $.ajax({
        url:'/Post/save_post',
        data:{'saved_post_id': post_id},
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        method:'POST',
        success:function(data){
            if(data['post_status'] === 'removed'){
                $('.tweet-favorite-icon').attr('src', 'Config/static/icons/save-instagram-black-lineal-18315.svg');
            }
            else{
                $('.tweet-favorite-icon').attr('src', 'Config/static/icons/black-save-instagram-18316.svg');
            }
        }
    })
}
