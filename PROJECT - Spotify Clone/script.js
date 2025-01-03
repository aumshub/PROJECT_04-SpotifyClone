console.log("js running...");
let currentSong = new Audio();
let songs;
let currFolder;
const volumeRange = document.querySelector('.range');




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


// Add an event listener to previous and next buttons

// function attachNextPreviousListeners() {
//     previous.addEventListener("click", () => {
//         console.log("Previous clicked");
//         console.log("Current Song Source: ", currentSong.src);

//         // Extract only the filename from the current song's src
//         let currentTrack = currentSong.src.split("/").slice(-1)[0]; // Extract filename
//         console.log("Current Track: ", currentTrack);

//         let index = songs.indexOf(currentTrack); // Find the index in the songs array
//         if (index > 0) {
//             playMusic(songs[index - 1]); // Play the previous track
//         } else {
//             alert("No previous song available");
//         }
//     });

//     next.addEventListener("click", () => {
//         console.log("Next clicked");

//         // Extract only the filename from the current song's src
//         let currentTrack = currentSong.src.split("/").slice(-1)[0]; // Extract filename
//         console.log("Current Track: ", currentTrack);

//         let index = songs.indexOf(currentTrack); // Find the index in the songs array
//         if (index >= 0 && (index + 1) < songs.length) {
//             playMusic(songs[index + 1]); // Play the next track
//         } else {
//             alert("This is the last song");
//         }
//     });
// }



async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
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
            songs.push(element.href.split(`/${folder}/`)[1]);
        }

    }

    // show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = " ";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                    <i class="ri-music-2-fill svg"></i>
                                    <div class="info">
                                        <div>${song.replaceAll("%20", " ")}</div>
                                         <div>swami</div>
                                    </div>
                                    <div class="playnow">
                                        <span>Play Now</span>
                                       <i class="ri-play-large-fill"></i>
                                    </div>
                              </li>`;

    }

    // Attach an event to event listener to play a each song.
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", () => {
            console.log(element.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });


}

function playMusic(track, pause = false) {
    const playbutton = document.querySelector("#play");
    const pausebutton = document.querySelector("#pause");

    currentSong.src = `${currFolder}/` + track;

    // console.log(currentSong.src);   
    if (!pause) {
        currentSong.play();
        pausebutton.style.display = "block";
        playbutton.style.display = "none";
    } else {
        playbutton.style.display = "block";
        pausebutton.style.display = "none";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";


}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text()
    let cardcontainer = document.querySelector(".cardcontainer");
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    // console.log(anchors);
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if (element.href.includes("/songs/")) {
            let folder = element.href.split("/").slice(-1)[0];

            try {
                let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
                if (!a.ok) throw new Error("Failed to load metadata.");
                let response = await a.json();
                // console.log(response);
                // Append to card container
                cardcontainer.innerHTML += `  
                    <div data-folder="/songs/${folder}" class="card">
                        <div class="play">
                            <div><i class="ri-play-large-fill"></i></div>
                        </div>
                        <img src="/songs/${folder}/cover.jpeg" alt="cover img">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
            } catch (error) {
                console.error("Error fetching metadata:", error);
            }
        }

        
    // add an event listener to previous and next buttons

    previous.addEventListener("click", (e) => {
        console.log("Previous clicked");
        console.log("Current Song Source: ", currentSong.src);
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`).slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        } else {
            alert("No previous song available");
        }
    });


    next.addEventListener("click",(e)=>{
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`).slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }else{
            alert("This is the last song");
        }
    })



    }


    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
        })
    })

}

async function main() {



    // Get the list of all the songs
    await getSongs("songs/cs");


    // By default play the first song
    playMusic(songs[0], true);

    displayAlbums();

    // Desplay all the albums on the page


    // Attach an event listener to play, next and pervious buttons
    play.addEventListener("click", () => {
        currentSong.play();
        play.style.display = "none";
        pause.style.display = "block";
    })

    pause.addEventListener("click", () => {
        currentSong.pause();
        play.style.display = "block";
        pause.style.display = "none";
    })

    // Listen an event fot time update

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
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
    document.querySelector(".hamburger").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0%";
    })
    // add an  event listener to closing menu
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-120%";
    })


    // add an event listener to previous and next buttons

    previous.addEventListener("click", (e) => {
        console.log("Previous clicked");
        console.log("Current Song Source: ", currentSong.src);
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`).slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        } else {
            alert("No previous song available");
        }
    });


    next.addEventListener("click",(e)=>{
        console.log("next clicked");
        let index = songs.indexOf(currentSong.src.split(`${currFolder}/`).slice(-1)[0]);
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }else{
            alert("This is the last song");
        }
    })

    // Add an event to volume control
    document.querySelector(".volumecont").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value);
        // console.log("Setting volume to: ", e.target.value, "/100");
        currentSong.volume = (e.target.value) / 100;
        

            
    if(e.target.value > 0){
        mutebutton.style.display = "none";
        volumebutton.style.display = "block";
        
    }else{
        mutebutton.style.display = "block";
        volumebutton.style.display = "none";
    }


    })


    // addevent listener to mute the volume control

    document.querySelector(".volumecont").getElementsByTagName("i")[0].addEventListener("click", (e) => {
        console.log("Mute/Unmute clicked");
    
        const volumebutton = document.querySelector("#volumebtn");
        const mutebutton = document.querySelector("#mutebtn");    
        if (currentSong.muted) {
            // Unmute the audio and toggle buttons
            currentSong.muted = false;
            volumebutton.style.display = "block";
            mutebutton.style.display = "none";
            volumeRange.value = currentSong.volume * 100;
            // console.log("Audio unmuted");
            
        } else {
            // Mute the audio and toggle buttons
            volumeRange.value = 0
            currentSong.muted = true;
            volumebutton.style.display = "none";
            mutebutton.style.display = "block";
            // console.log("Audio muted");
        }        

    });

    document.querySelector(".volumecont").getElementsByTagName("i")[1].addEventListener("click", (e) => {
        console.log("Mute/Unmute clicked");
    
        const volumebutton = document.querySelector("#volumebtn");
        const mutebutton = document.querySelector("#mutebtn");    

            // Unmute the audio and toggle buttons
            currentSong.muted = false;
            volumebutton.style.display = "block";
            mutebutton.style.display = "none";
            volumeRange.value = currentSong.volume * 100;
            // console.log("Audio unmuted");
    
    });




    




}

main()
