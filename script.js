console.log("js running...");


async function getSongs() {
    let a = await fetch('http://127.0.0.1:5500/songs/')
    let response = await a.text()
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.querySelectorAll("li a");
    console.log(as);
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }

    }

    return songs;
}

async function main() {
    let songs = await getSongs()
    console.log(songs);
}

main()
