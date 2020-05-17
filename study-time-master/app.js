const app = () => {
    const song = document.querySelector('.song');
    const play = document.querySelector('.play');
    const outline = document.querySelector('.moving-outline circle');
    const video = document.querySelector('.vid-container video');
    const sounds = document.querySelectorAll('.sound-picker button');
    const timeDisplay = document.querySelector('.time-display');
    const timeSelect = document.querySelectorAll('.time-select button');
    const outlineLength = outline.getTotalLength();
    let fakeDuration = 1500; //Initial run time timer
    let firstHalfDone = false;
    let breakTime = 300; //Initial break time timer

    outline.style.strokeDasharray = outlineLength;
    outline.style.strokeDashoffset = outlineLength;

    //Pick from the music options
    sounds.forEach(sound =>{
        sound.addEventListener('click', function(){
            song.src = this.getAttribute('data-sound');
            video.src = this.getAttribute('data-video');
            song.play();
            video.play();
            play.src = './svg/pause.svg';
        });
    });

    //Select the overall study and break time
    timeSelect.forEach(option =>{
        option.addEventListener('click', function(){
            fakeDuration = this.getAttribute('data-time');
            breakTime = this.getAttribute('data-button');
            timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(fakeDuration % 60)}`
        });
    });

    //Play or pause music
    play.addEventListener('click', () =>{
        if(song.paused){
            song.play();
            video.play();
            play.src = './svg/pause.svg';
        } else {
            song.pause();
            video.pause();
            play.src = './svg/play.svg';
        }
    });
   
    //Animating circle
    song.ontimeupdate = () => {
        let elapsed = fakeDuration - song.currentTime;
        let seconds = Math.floor(elapsed % 60);
        let minutes = Math.floor(elapsed / 60);

        let progress = outlineLength - (song.currentTime / fakeDuration) * outlineLength;
        outline.style.strokeDashoffset = progress;

        if (minutes < 10 && seconds < 10) {
            timeDisplay.textContent = `0${minutes}:0${seconds}`;
        } else if(minutes < 10){
            timeDisplay.textContent = `0${minutes}:${seconds}`;
        } else if (seconds < 10) {
            timeDisplay.textContent = `${minutes}:0${seconds}`;
        } else {
            timeDisplay.textContent = `${minutes}:${seconds}`;
        }

        if(song.currentTime >= fakeDuration){
            //Did study time just finish?
            if(firstHalfDone == false){
                firstHalfDone = true;
                fakeDuration = breakTime;
                song.currentTime = 0;
                song.src = './sounds/Beautiful.mp3';
                song.play();
            } else {
                song.pause();
                song.currentTime = 0;
                play.src  = './svg/replay.svg';
                video.pause();
            }
            
        }
    };
};

app();