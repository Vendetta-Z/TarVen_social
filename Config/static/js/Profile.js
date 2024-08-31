window.onclick = function(event) {
    var modal = document.getElementById('modal');
    var covepPopupChangePost = document.getElementById('covepPopupChangePost');

    if ( event.target === modal || event.target === NewPostPopup ||
         event.target === covepPopupChangePost) {
        modal.style.display = 'none';
        covepPopupChangePost.style.display = 'none';
        $('.comments-section').empty();

    }
}

document.addEventListener('keydown', function (e) {
    var covepPopupChangePost = document.getElementById('covepPopupChangePost');
    var modal = document.getElementById('modal');
    var NewPostPopup =  document.getElementById('NewPostPopup');
    if(e.key === 'Escape'){
        covepPopupChangePost.style.display = 'none';
        modal.style.display = 'none';
        NewPostPopup.style.display = 'none';
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

//Подгрузка плееров после окончательной загрузки страницы.
document.addEventListener("DOMContentLoaded", function () {
        const players = Plyr.setup('.plyr');
});

function send_data_for_create_new_post(){
    postFile = document.getElementById('SelectNewFileInput').files[0];
    postPreview = document.getElementById('PreviewInput').files[0];
    postDescription = document.getElementById('DescriptionWriteInput').value;
    postTitle = document.getElementById('TitleWriteInput').value;
    if (document.getElementById("PreviewInput").files.length === 0) {
      postPreview = 'none';
    }
    var formdata = new FormData()
    formdata.append('postFile', postFile);
    formdata.append('postPreview', postPreview);
    formdata.append('postDescription', postDescription);
    formdata.append('postTitle', postTitle);

    $.ajax({
        url:'create_new_post/',
        method: "POST",
        processData: false,
        contentType: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data:formdata,
        success: function(data){
            $('.NewPostPopup').css('display','none');

            var post = JSON.parse(data)
            var div_block_with_new_post = `
                    <div class="tweet post${post[0].pk}" onclick="OpenPostPopup(${post[0].pk})">
                        <p>`+ post[0].fields.description +`</p>
                        <img src=`+ post[0].fields.Preview +` alt="Tweet Image 1" class="tweet-image">
                        <a class="Post_hearth_icon" onclick="adding_like_for_post(${post[0].pk})" ><img src="/Config/static/icons/heart.png"/><a/>
                        <a class="Post_comment_icon" ><img src="/Config/static/icons/message-324.svg"/><a/>
                        <span class="tweet-date">${post[0].fields.created}</span>
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
                                        <img src="`+ postData[0].fields.PostFile +`" alt="Tweet Image 1" class="ChangePostImage"></label>
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
    $('.NewPostPopup').css('display', 'block');
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

function attach(file){
    if(file.files && file.files[0]){
        console.log(file.files);
        if(file.files[0].type == 'image/jpeg'){
            var fr = new FileReader();
            fr.onload = function () {
                $('.LabelForSelectFile').attr('src', fr.result);
            }
            fr.readAsDataURL(file.files[0]);

            $('.SelectNewFileInput-div').css('display', 'none');
            $('.PreviewDiv').css('display', 'none');
            $('.PostInformationSelect-div').css('display', 'block');
        }
        else{
            var fr = new FileReader();
            fr.onload = function () {
                $('.PostFileInputDiv').html(`
                                        <video id="videoPlayer-1" class="plyr" playsinline controls>
                                            <source class="plyrVideoPlayerSource" src="${fr.result}" type="video/mp4">
                                        </video>`)
            }
            fr.readAsDataURL(file.files[0]);
            $('.SelectNewFileInput-div').css('display', 'none');
            $('.PostInformationSelect-div').css('display', 'block');

        }

    }
}

function ChangePreviewInput(file){
    if(file.files && file.files[0]){
        if(file.files[0].type == 'image/jpeg'){
            var fr = new FileReader();
            fr.onload = function () {
                $('.PreviewInputStandartLabel').attr('src', fr.result);
            }
            fr.readAsDataURL(file.files[0]);
            }
    }
}