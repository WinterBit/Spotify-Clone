console.log("Let the Backend Begin");
let SongList = [];

function secondTominutes(seconds) {
    let minute = Math.floor(seconds / 60);
    let second = Math.floor(seconds % 60) < 10 ? "0" + Math.floor(seconds % 60) : Math.floor(seconds % 60);
    return minute + ":" + second;
}

async function fetchSongs(link) {
    let response = await fetch(link);
    let responseText = await response.text();

    let div = document.createElement("div");
    div.innerHTML = responseText;

    let ancr = div.getElementsByTagName("a");

    for (e of ancr) {
        if (e.href.endsWith(".mp3")) {
            SongList.push(e.href);
        }
    }
}

(async function () {
    await fetchSongs("http://192.168.1.4:3000/assets/songs/");
    console.log(SongList);

    for (let i = 0; i < SongList.length; i++) {
        let playbox = document.createElement("div");
        playbox.className = "playbox";

        playbox.innerHTML = `<div class="index"></div>
                        <div class="Splay flex justifycenter aligncenter"><img class="invertcolor" src="Assets/logo/play.svg" alt=""></div>
                        <div class="Sname"></div>
                        <div class="Sartist"></div>
                        <div class="Sduration"></div>`;

        let song = SongList[i].split("/songs/")[1];
        song = song.replaceAll("%20", " ")
        song = song.slice(0, song.length - 4);
        let Sname = song.split(" - ")[0];
        let Sartist = song.split(" - ")[1];

        playbox.querySelector(".Sname").innerHTML = Sname;
        playbox.querySelector(".Sartist").innerHTML = Sartist;
        playbox.querySelector(".index").innerHTML = i + 1;
        let aud = new Audio(SongList[i]);

        aud.addEventListener("loadedmetadata", e => {
            let Sduration = secondTominutes(aud.duration)
            playbox.querySelector(".Sduration").innerHTML = Sduration;
        })

        document.querySelector(".Album").insertAdjacentElement("beforeend", playbox)
    }

})()