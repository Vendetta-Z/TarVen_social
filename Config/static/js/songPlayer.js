let audioPlayer = document.getElementById('audio-player');
let playBtn = document.getElementById('play-btn');
let pauseBtn = document.getElementById('pause-btn');
let nextBtn = document.getElementById('next-btn');
let prevBtn = document.getElementById('prev-btn');
let shuffleBtn = document.getElementById('shuffle-btn');
let repeatBtn = document.getElementById('repeat-btn');
let progressBar = document.getElementById('progress');
let currentTimeElem = document.getElementById('current-time');
let durationElem = document.getElementById('duration');
let trackTitle = document.getElementById('track-title');

let playList = document.getElementById('Music_Playlist');

let volumeSlider = document.getElementById('volume-slider');
let muteBtn = document.getElementById('mute-btn');

let tracks = [];  // Плейлист пользователя
let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;

// Асинхронная загрузка плейлиста
async function loadPlaylist() {
    try {
        let response = await fetch('/Music/getAll', {
            method: 'GET',
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        });
        if (response.ok) {
            let data = await response.json();
            let data_json = JSON.parse(data);
            tracks = data_json.map(track => ({
                title: track.fields.title,
                file: '/' + track.fields.file,
                id: track.pk
            }));
            for (var i = 0; i < tracks.length; i++){
                playList.innerHTML += `
                    <div id="track_id${tracks[i].id}" style="background-color: gray; border: 1px solid #1c1c1c; border-radius: 3px;">
                        <p style="display:inline-block;">${tracks[i].title}</p>
                        <a>1:23</a>
                        <button onclick=(playTrack(${i})) id="play-btn" style="display: inline;">Play</button>
                        <button onclick=(deleteMusic(${tracks[i].id}))>delete</button>
                    </div>
                `
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки плейлиста:', error);
    }
}

// Воспроизведение трека по индексу
function playTrack(index) {
    if (tracks.length === 0) return;

    currentTrackIndex = index;
    let track = tracks[index];
    audioPlayer.src = track.file;
    trackTitle.innerHTML = track.title;
    audioPlayer.play();

    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline';

    audioPlayer.onloadedmetadata = function() {
        progressBar.max = audioPlayer.duration;
        durationElem.textContent = formatTime(audioPlayer.duration);
    };
}

// Форматирование времени трека
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Обновление прогресс-бара
audioPlayer.ontimeupdate = function() {
    progressBar.value = audioPlayer.currentTime;
    currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
};

// Перемотка трека
progressBar.oninput = function() {
    audioPlayer.currentTime = progressBar.value;
};

// Переключение треков
nextBtn.onclick = function() {
    if (isShuffle) {
        playTrack(Math.floor(Math.random() * tracks.length));
    } else {
        if (currentTrackIndex < tracks.length - 1) {
            playTrack(currentTrackIndex + 1);
        }
        else{
            currentTrackIndex = 0;
            playTrack(currentTrackIndex);
        }
    }
};

prevBtn.onclick = function() {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    }
};

// Плей/Пауза
playBtn.onclick = function() {
    audioPlayer.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'inline';
};

pauseBtn.onclick = function() {
    audioPlayer.pause();
    playBtn.style.display = 'inline';
    pauseBtn.style.display = 'none';
};

// Режим повторения
repeatBtn.onclick = function() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
};

// Рандомный выбор трека
shuffleBtn.onclick = function() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
};

// Регулятор громкости
volumeSlider.oninput = function() {
    audioPlayer.volume = volumeSlider.value;
};

// Запускаем загрузку плейлиста при загрузке страницы
document.addEventListener('DOMContentLoaded', loadPlaylist);

// При окончании трека
audioPlayer.onended = function() {
    if (isRepeat) {
        playTrack(currentTrackIndex);
    } else if (isShuffle) {
        playTrack(Math.floor(Math.random() * tracks.length));
    } else if (currentTrackIndex < tracks.length - 1) {
        playTrack(currentTrackIndex + 1);
    }
};

muteBtn.onclick = function() {
    isMuted = !isMuted;
    if(isMuted){
        muteBtn.classList.toggle('active');
        audioPlayer.volume = 0;
    }
    else{
        muteBtn.classList.toggle('-mute');
        audioPlayer.volume = volumeSlider.value;0;
    }

};