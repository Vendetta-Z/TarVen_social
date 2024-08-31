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
            $('.comments-section').append(`
            <div>
                <img class="comments-author-avatar" />
                <p class="Comments-section-author-name">${ comments[comment].author }</p>
                <p class="Comments-section-comment-text">${ comments[comment].text }</p>
            </div>
            `)
        }
    })
}

function OpenPostPopup(post_id){
    $.ajax({
        url:'get_post',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id':post_id},
        method:'GET',
        success: function(data){
            postData = JSON.parse(data['post']);
            author = JSON.parse(data['author']);
            comments = data['comments']
            
            userFollowingBtn = [`subscribe_to_user(${author[0].pk})`, 'Подписаться']
            if(data.self_user_follow_author == 1){
                userFollowingBtn = [`unsubscribe_user(${author[0].pk})`,'Отписаться']
            }

            $('.modal').css('display', 'block');

            $('.Tweet-Avatar').attr('src', author[0].fields.avatar);
            $('.Tweet-Avatar-link').attr('href', author[0].pk);

            $('.tweet-author-name').attr('href', author[0].pk);
            $('.tweet-author-name').text(author[0].fields.username);
            $('.tweet-follow-button').attr('onclick', userFollowingBtn[0]);
            $('.tweet-follow-button').text(userFollowingBtn[1]);

            var fileType = (postData[0].fields.PostFile).split('.').pop();
            if(fileType == 'mp4'){
                $('.tweet-image').css('display', 'none');
                $('.plyr').css('display', 'block');
                $('.plyrVideoPlayerSource').attr('preload','auto')
                $('.plyrVideoPlayerSource').html(`<source class="plyrVideoPlayerSource" src="${postData[0].fields.PostFile}"  type="video/mp4">`)
                const players = Plyr.setup('.plyrVideoPlayerSource');

            }
            else{
                $('.plyr').css('display', 'none');
                $('.tweet-image').css('display', 'block');
                $('.tweet-image').attr('src', postData[0].fields.PostFile);
            }

            $('.tweet-image').attr('src', postData[0].fields.PostFile)
            $('.LikeIconCountTag').attr('onclick', `adding_like_for_post(${post_id})`)
            $('.LikeIconPopup').attr('src', data.like_icon)

            $('.tweet-comment-link').attr('onclick', `openCommentsPopup(${post_id})`)
            $('.tweet-comment-icon').attr('src', 'Config/static/icons/message-324.svg')

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
                $('.saved_post_id_'+ post_id).remove();
            }
        }
    })
}

