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