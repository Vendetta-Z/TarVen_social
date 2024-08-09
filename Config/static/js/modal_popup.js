function openModal() {
    document.getElementById('ModalForNewPost').style.display = 'flex';
}


function closeModal() {
    document.getElementById('ModalForNewPost').style.display = 'none';
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
    var modal = document.getElementById('ModalForNewPost');
    var ProfileModal = document.getElementById('covepPopupChangePost');
    var StoryModal = document.getElementById('covepPopupChangeStory');
    if (event.target === modal || event.target === ProfileModal || event.target === StoryModal) {
        modal.style.display = 'none';
        ProfileModal.style.display = 'none';
        StoryModal.style.display = 'none';

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
                    <div class="tweet">
                        <p>`+ post[0].fields.description +`</p>
                        <img src=`+ post[0].fields.PostVidOrImg +` alt="Tweet Image 1" class="tweet-image">
                        <a class="Post_hearth_icon" onclick="adding_like_for_post({{post.pk}})" ><img src=" {% static 'icons/heart.png'%}"/><a/>
                        <a class="Post_comment_icon" ><img src=" {% static 'icons/message-324.svg'%}"/><a/>
                        <span class="tweet-date">{{post.created}}</span>
                    </div>`
            $('.tweets-section').prepend(div_block_with_new_post)

        }
    })
}


function openProfileEditPopup(){
    $('.Profile_data_change_popup').css('display', 'block');
    $('.covepPopupChangePost').css('display', 'block');
}


function openPostEditPopup(postData){
    $('.covepPopupChangeStory').css('display', 'block');
    $('.postsBlockInPopup').html(   `<label for="PostChangedImageInPopup">
                                        <img src="`+ postData.fields.PostVidOrImg +`" alt="Tweet Image 1" class="LabelImg"></label>
                                        <input type="file" id="PostChangedImageInPopup" style="display:none;" name="photo" accept="image/*"></label><br><br>
        
                                    <p>Post description</p>
                                    <input class="DescriptionAreaInPopupEditPost" type="text" value="` + postData.fields.description +`"></input>
                                    <span class="tweet-date">`+ postData.fields.created +`</span> 
                                    <button onclick ="send_changed_data_to_back(`+ postData.pk +`)" >Submit Changes</button>`)
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