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

function AddNewAudio(){
    audio = document.getElementById('AudioFileForAdd').files[0];
    title = document.getElementById('TitleForNewAudio').val;

    var formdata = new FormData()
    formdata.append('Audio', audio);
    formdata.append('Title', title);

    $.ajax({
        url:'/Music/create',
        method: "POST",
        processData: false,
        contentType: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data:formdata,
        success: function(data){
        postData = JSON.parse(data['music']);
        console.log(postData)
            location.reload();
        }
    })
}

function deleteMusic(id){

    $.ajax({
        url:'/Music/delete',
        method: "POST",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        data:{'musicId': id},
        success: function(data){
            location.reload();
        }
    })
}