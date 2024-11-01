console.log("Let the Backend Begin");
let SongList = [];
let INDEX = 0;
let currentSong = new Audio();

function secondTominutes(seconds) {
    let minute = Math.floor(seconds / 60);
    let second = Math.floor(seconds % 60) < 10 ? "0" + Math.floor(seconds % 60) : Math.floor(seconds % 60);
    return minute + ":" + second;
}

function topercentage(num, total) {
    return (num / total) * 100;
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

function playSong(track) {
    currentSong.src = track;
    document.getElementById("play-pause").querySelector("img").src = "Assets/logo/pause.svg";
    currentSong.play();
}

function pauseSong(track) {
    currentSong.src = track;
    document.getElementById("play-pause").querySelector("img").src = "Assets/logo/play.svg";
    currentSong.pause();
}

(async function () {
    await fetchSongs("http://192.168.1.5:3000/assets/songs/");
    console.log(SongList);

    for (let i = 0; i < SongList.length; i++) {
        let playbox = document.createElement("div");
        playbox.className = "playbox";
        playbox.dataset.index = i;

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

    let playbox = document.querySelectorAll(".playbox");

    playbox.forEach(element => {
        element.addEventListener("click", e => {
            let num = Number(element.querySelector(".index").innerHTML);
            INDEX = num - 1;
            playSong(SongList[INDEX]);

            document.querySelector(".songName").innerHTML = element.querySelector(".Sname").innerHTML;
            document.querySelector(".songArtist").innerHTML = element.querySelector(".Sartist").innerHTML;
            document.getElementById("songDuration").innerHTML = element.querySelector(".Sduration").innerHTML;
        })
    });

    let seekbar = document.getElementById("seekbar");
    let circle = document.getElementById("circle");
    let progress = document.getElementById("progress");

    currentSong.addEventListener("timeupdate", e => {
        document.getElementById("songCurrentTime").innerHTML = secondTominutes(currentSong.currentTime);
        let percentage = topercentage(currentSong.currentTime, currentSong.duration);
        circle.style.left = percentage < 1 ? percentage + "%" : (percentage - 1) + "%";
        progress.style.width = percentage + "%";

        if (currentSong.currentTime == currentSong.duration) {
            document.getElementById("forward").click();
        }
    })

    seekbar.oninput = function () {
        progress.style.width = this.value + "%";
        circle.style.left = this.value < 1 ? this.value : (this.value - 1) + "%";
        console.log(this.value);

        currentSong.currentTime = (this.value / 100) * currentSong.duration;
    }

    let previous = document.getElementById("previous");
    let play_pause = document.getElementById("play-pause");
    let forward = document.getElementById("forward");

    previous.addEventListener("click", e => {
        if (INDEX > 0) {
            INDEX--;
            console.log(INDEX);
            playSong(SongList[INDEX]);
            let playbox = document.querySelector(`[data-index = "${INDEX}"`);

            document.querySelector(".songName").innerHTML = playbox.querySelector(".Sname").innerHTML;
            document.querySelector(".songArtist").innerHTML = playbox.querySelector(".Sartist").innerHTML;
            document.getElementById("songDuration").innerHTML = playbox.querySelector(".Sduration").innerHTML;
        }

        else {
            pauseSong(SongList[INDEX]);
            currentSong.currentTime = 0;
        }
    })

    forward.addEventListener("click", e => {
        if (INDEX < SongList.length - 1) {
            INDEX++;
            playSong(SongList[INDEX]);
            let playbox = document.querySelector(`[data-index = "${INDEX}"`);

            document.querySelector(".songName").innerHTML = playbox.querySelector(".Sname").innerHTML;
            document.querySelector(".songArtist").innerHTML = playbox.querySelector(".Sartist").innerHTML;
            document.getElementById("songDuration").innerHTML = playbox.querySelector(".Sduration").innerHTML;
        }

        else {
            pauseSong(SongList[INDEX])
            currentSong.currentTime = 0;
        }
    })

    play_pause.addEventListener("click", e => {
        if (currentSong.paused) {
            play_pause.querySelector("img").src = "Assets/logo/pause.svg";
            currentSong.play();
        }

        else {
            play_pause.querySelector("img").src = "Assets/logo/play.svg";
            currentSong.pause();
        }
    })
})()