// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    var modal = document.getElementById('modal');
    var covepPopupChangePost = document.getElementById('covepPopupChangePost');
    var ModalForNewPost = document.getElementById('ModalForNewPost');

    if ( event.target === modal || event.target === ModalForNewPost ||
         event.target === covepPopupChangePost) {
        modal.style.display = 'none';
        covepPopupChangePost.style.display = 'none';
        ModalForNewPost.style.display = 'none';
        $('.comments-section').empty();

    }
}

document.addEventListener('keydown', function (e) {
    var covepPopupChangePost = document.getElementById('covepPopupChangePost');
    var modal = document.getElementById('modal');
    var ModalForNewPost = document.getElementById('ModalForNewPost');
    if(e.key === 'Escape'){
        covepPopupChangePost.style.display = 'none';
        modal.style.display = 'none';
        ModalForNewPost.style.display = 'none';
        $('.comments-section').empty()
        $('.comments-modal').css('display', 'none');
    }
})

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

function send_data_for_create_new_post(){
    postImage = document.getElementById('post_image_in_new_post_popup_id').files[0]
    postDescription = document.getElementById('description_textarea_for_new_post').value

    var formdata = new FormData()
    formdata.append('postImage', postImage);
    formdata.append('postDescription', postDescription);
    $.ajax({
        url:'create_new_post/',
        method: "POST",
        processData: false,
        contentType: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data:formdata,
        success: function(data){
            $('.ModalForNewPost').css('display','none');

            var post = JSON.parse(data)
            console.log(post)
            var div_block_with_new_post = `
                    <div class="tweet post`+ post[0].pk +`" onclick="GetPostData(`+ post[0].pk + `)">
                        <p>`+ post[0].fields.description +`</p>
                        <img src=`+ post[0].fields.PostVidOrImg +` alt="Tweet Image 1" class="tweet-image">
                        <a class="Post_hearth_icon" onclick="adding_like_for_post({{post.pk}})" ><img src="/Config/static/icons/heart.png"/><a/>
                        <a class="Post_comment_icon" ><img src="/Config/static/icons/message-324.svg"/><a/>
                        <span class="tweet-date">`+ post[0].fields.created +`</span>
                    </div>`
            $('.tweets-section').prepend(div_block_with_new_post)

        }
    })
}

function openProfileEditPopup(){
    $('.Profile_data_change_popup').css('display', 'block');
    $('.covepPopupChangePost').css('display', 'block');
}

function openPostEditPopup(post_id){
    $.ajax({
        url:'get_post',
        headers: { "X-CSRFToken": getCookie("csrftoken")},
        data:{'post_id':post_id},
        method:'GET',
        success: function(data){
            postData = JSON.parse(data['post']);
            $('.modal').css('display', 'block');
            $('.change-content').html(`<label for="PostChangedImageInPopup">
                                        <img src="`+ postData[0].fields.PostVidOrImg +`" alt="Tweet Image 1" class="ChangePostImage"></label>
                                        <input type="file" id="PostChangedImageInPopup" style="display:none;" name="photo" accept="image/*"></label><br><br>
                
                                        <p>Post description</p>
                                        <input class="DescriptionAreaInPopupEditPost" type="text" value="` + postData[0].fields.description +`"></input>
                                        <span class="tweet-date">`+ postData[0].fields.created +`</span> 
                                        <button onclick ="send_changed_data_to_back(`+ postData[0].pk +`)" >Submit Changes</button>
                                        <button onclick ="deletePublication(`+ postData[0].pk +`)" >Delete Publication</button>`)
                                }
            })
}

function openNewPostPopup(){
    $('.ModalForNewPost').css('display', 'block');
    $('.modal-content').html(`<span class="close" onclick="closeModal()">&times;</span>
            <h2>Новая публикация</h2>
            <div>
                <label for="post_image_in_new_post_popup_id">Выберите фотографию:</label>
                <input type="file" id="post_image_in_new_post_popup_id" name="photo" accept="image/*"><br><br>
                <label for="description_textarea_for_new_post">Описание:</label>
                <textarea id="description_textarea_for_new_post" name="description" rows="4" cols="50"></textarea><br><br>
                <button  onclick="send_data_for_create_new_post()">Опубликовать</button>
            </div>`)
}

function sendDataToChangeProfile(){
    var username = document.getElementById('username');
    var email = document.getElementById('email');
    var status = document.getElementById('status');
    var avatar = document.getElementById('profile-picture');
    var age;
    
    var formdata = new FormData()
    formdata.append('username', username);
    formdata.append('email', email);
    formdata.append('avatar', avatar.files[0]);
    formdata.append('status', status);

    $.ajax({
        url:'change_user_data/',
        method: "POST",
        processData: false,
        contentType: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data:formdata,
        success: function(data){

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
            location.reload();
        }
    })
}

function deletePublication(postId){
    parentTweetBlock = $('.tweets-section');
    childTweetBlock = $('.post'+postId);
    if (confirm ('Вы уверены?')){
        $.ajax({
            url:'delete_post',
            method: 'POST',
            data: {'postId':postId},
            headers: { "X-CSRFToken": getCookie("csrftoken")},
    
            success: function(data){
                childTweetBlock.remove();
                $('.modal').css('display', 'none');
            }
        })
    }
    
}