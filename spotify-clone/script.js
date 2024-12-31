console.log("js running...");
let currentSong = new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}






async function getSongs() {
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text()
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.querySelectorAll("li a");
    // console.log(as);

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }

    }

    return songs;
}

function playMusic(track, pause=false) {
    const playbutton = document.querySelector("#play");
    const pausebutton = document.querySelector("#pause");

    currentSong.src = "/songs/" + track;
    if(!pause){
        currentSong.play();   
        pausebutton.style.display = "block";
        playbutton.style.display = "none";
    }else{
        playbutton.style.display = "block";
        pausebutton.style.display = "none";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


async function main() {
    //get the list of all the songs
    songs = await getSongs()
    // console.log(songs);

    // By default play the first song
    playMusic(songs[0], true);

    // show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    // console.log(songUL);    
    for (const song of songs){
        songUL.innerHTML = songUL.innerHTML + `<li>
                                <i class="ri-music-2-fill svg"></i>
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ")}</div>
                                     <div>swami</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span>
                                    <i class="ri-play-circle-fill"></i>
                                </div>
                          </li>`;
    }

 // Attach an event to event listener to play a each song.
 Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
     element.addEventListener("click",() =>{
         console.log(element.querySelector(".info").firstElementChild.innerHTML.trim());
         playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
        })
 });    

 // Attach an event listener to play, next and pervious buttons
play.addEventListener("click", ()=>{
    currentSong.play();
    play.style.display = "none";
    pause.style.display = "block";
})

pause.addEventListener("click", ()=>{
    currentSong.pause();
    play.style.display = "block";
    pause.style.display = "none";
})

// Listen an event fot time update

currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${ secondsToMinutesSeconds(currentSong.currentTime)} / ${ secondsToMinutesSeconds(currentSong.duration)}`;
    // Update progress bar
    let progressBar = document.querySelector(".circle")
    progressBar.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
})

//Attach an event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

// add an  event listener to hamburger menu
document.querySelector(".hamburger").addEventListener("click",(e)=>{
    document.querySelector(".left").style.left = "0%";
})
// add an  event listener to closing menu
document.querySelector(".close").addEventListener("click",(e)=>{
    document.querySelector(".left").style.left = "-120%";
})


// add an event listener to previous and next buttons

previous.addEventListener("click",(e)=>{
    console.log("previous clicked");
})

next.addEventListener("click",(e)=>{
    console.log("next clicked");
    console.log(currentSong.src);
    console.log(songs);
})


}

main()
