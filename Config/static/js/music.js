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
    title = document.getElementById('TitleForNewAudio').value;

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
            tracks.push({
                title: postData[0].fields.title,
                file: '/' + postData[0].fields.file,
                id: postData[0].pk
            });
            playList.innerHTML += `
                    <div style="background-color: gray; border: 1px solid #1c1c1c; border-radius: 3px;">
                        <p style="display:inline-block;">${postData[0].fields.title}</p>
                        <a>1:23</a>
                        <button onclick=(playTrack(${tracks.length - 1})) id="play-btn" style="display: inline;">Play</button>
                        <button onclick=(deleteMusic(${postData[0].pk}))>delete</button>
                    </div>
                `
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
            music_div = document.getElementById(`track_id${id}`)
            music_div.remove();
        }
    })
}


