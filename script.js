console.log("Let the Backend Begin");
let SongList = [];
let AlbumList = [];
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

async function fetchAlbums(link) {
    let response = await fetch(link);
    let responseText = await response.text();

    let div = document.createElement("div");
    div.innerHTML = responseText;

    let ancr = div.getElementsByTagName("a");

    Array.from(ancr).forEach(element => {
        if (element.href.includes('/songs/') && !element.href.includes(".DS_Store")) {
            AlbumList.push(element.href);
        }
    });

    for (let i = 0; i < AlbumList.length; i++) {
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `  <img src="" alt="thumnail">
                            <div class="chead"></div>
                            <div class="cabout"></div>
                            <div class="playbtn"><img src="Assets/logo/play button.svg" alt="playbutton"></div>
                         `

        let url = await fetch(AlbumList[i] + "info.json");
        let info = await url.json();
        let chead = info.title;
        let cabout = info.artist;
        let img = await AlbumList[i] + "cover.jpeg";

        card.querySelector(".chead").innerHTML = chead;
        card.querySelector(".cabout").innerHTML = cabout;
        card.querySelector("img").src = img;
        card.setAttribute("data-folder", chead);

        document.querySelector(".Albums").append(card);
    }
}

async function fetchSongs(link) {
    SongList = [];
    let old = document.querySelectorAll(".playbox");
    old.forEach(element => {
        element.remove();
    });

    let response = await fetch(`assets/songs/${link}`);
    let responseText = await response.text();

    let div = document.createElement("div");
    div.innerHTML = responseText;

    let ancr = div.getElementsByTagName("a");

    for (e of ancr) {
        if (e.href.endsWith(".mp3")) {
            SongList.push(e.href);
        }
    }


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
        song = song.slice(0, song.length - 4)
        song = song.split("/")[1];

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
            document.querySelector(".barSname").innerHTML = element.querySelector(".Sname").innerHTML;
            document.querySelector(".songArtist").innerHTML = element.querySelector(".Sartist").innerHTML;
            document.getElementById("songDuration").innerHTML = element.querySelector(".Sduration").innerHTML;
        })
    });

}

function playSong(track) {
    currentSong.src = track;
    document.getElementById("play-pause").querySelector("img").src = "Assets/logo/pause.svg";
    document.querySelector(".barbuttons img").src = "Assets/logo/pause.svg";

    Array.from(document.querySelectorAll(".Sname")).forEach(element => {
        element.style.color = "#fff";
    })
    document.querySelector(`[data-index="${INDEX}"] .Sname`).style.color = "#1cd760";
    currentSong.play();
    currentSong.volume = 1;
    document.getElementById("volcircle").style.left = "99%";
    document.getElementById("volprogress").style.width = "100%";
}

function pauseSong(track) {
    currentSong.src = track;
    document.getElementById("play-pause").querySelector("img").src = "Assets/logo/play.svg";
    document.querySelector(".barbuttons img").src = "Assets/logo/play.svg";
    currentSong.pause();
}


(async function () {
    await fetchAlbums("assets/songs")
    let seekbar = document.getElementById("seekbar");
    let circle = document.getElementById("circle");
    let progress = document.getElementById("progress");

    currentSong.addEventListener("timeupdate", e => {
        document.getElementById("songCurrentTime").innerHTML = secondTominutes(currentSong.currentTime);
        let percentage = topercentage(currentSong.currentTime, currentSong.duration);
        circle.style.left = percentage < 1 ? percentage + "%" : (percentage - 1) + "%";
        progress.style.width = percentage + "%";
        document.querySelector("#barprogress").style.width = percentage + "%";

        if (currentSong.currentTime == currentSong.duration) {
            document.getElementById("forward").click();
        }
    })

    seekbar.oninput = function () {
        progress.style.width = this.value + "%";
        circle.style.left = this.value < 1 ? this.value : (this.value - 1) + "%";
        currentSong.currentTime = (this.value / 100) * currentSong.duration;
    }

    let previous = document.getElementById("previous");
    let play_pause = document.getElementById("play-pause");
    let forward = document.getElementById("forward");

    previous.addEventListener("click", e => {
        if (INDEX > 0) {
            INDEX--;
            playSong(SongList[INDEX]);
            let playbox = document.querySelector(`[data-index = "${INDEX}"`);

            document.querySelector(".songName").innerHTML = playbox.querySelector(".Sname").innerHTML;
            document.querySelector(".barSname").innerHTML = playbox.querySelector(".Sname").innerHTML;
            document.querySelector(".songArtist").innerHTML = playbox.querySelector(".Sartist").innerHTML;
            document.getElementById("songDuration").innerHTML = playbox.querySelector(".Sduration").innerHTML;
        }

        else {
            pauseSong(SongList[INDEX]);
            currentSong.currentTime = 0;
            document.getElementById("progress").style.width = 0 + "%";
            document.getElementById("circle").style.left = 0 + "%";
        }
    })

    forward.addEventListener("click", e => {
        if (INDEX < SongList.length - 1) {
            INDEX++;
            playSong(SongList[INDEX]);
            let playbox = document.querySelector(`[data-index = "${INDEX}"`);

            document.querySelector(".songName").innerHTML = playbox.querySelector(".Sname").innerHTML;
            document.querySelector(".barSname").innerHTML = playbox.querySelector(".Sname").innerHTML;
            document.querySelector(".songArtist").innerHTML = playbox.querySelector(".Sartist").innerHTML;
            document.getElementById("songDuration").innerHTML = playbox.querySelector(".Sduration").innerHTML;
        }

        else {
            pauseSong(SongList[INDEX])
            currentSong.currentTime = 0;
            document.getElementById("progress").style.width = 0 + "%";
            document.getElementById("circle").style.left = 0 + "%";
        }
    })

    play_pause.addEventListener("click", e => {
        if (currentSong.paused) {
            play_pause.querySelector("img").src = "Assets/logo/pause.svg";
            document.querySelector(".barbuttons img").src = "Assets/logo/pause.svg";

            currentSong.play();
        }

        else {
            play_pause.querySelector("img").src = "Assets/logo/play.svg";
            document.querySelector(".barbuttons img").src = "Assets/logo/play.svg";
            currentSong.pause();
        }
    })

    let volseekbar = document.querySelector("#volseekbar input");
    let volprogress = document.getElementById("volprogress");
    let volcircle = document.getElementById("volcircle");

    volseekbar.oninput = function () {
        currentSong.volume = this.value / 100;

        volprogress.style.width = this.value + "%";
        volcircle.style.left = this.value < 1 ? this.value + "%" : (this.value - 1) + "%";
    }

    let CARD = document.querySelectorAll(".card");
    CARD.forEach(element => {
        element.addEventListener("click", async e => {
            INDEX = 0;
            await fetchSongs(element.dataset.folder);
            playSong(SongList[INDEX]);
            document.querySelector(".songName").innerHTML = document.querySelector(`[data-index="${INDEX}"] .Sname`).innerHTML;
            document.querySelector(".barSname").innerHTML = document.querySelector(`[data-index="${INDEX}"] .Sname`).innerHTML;
            document.querySelector(".songArtist").innerHTML = document.querySelector(`[data-index="${INDEX}"] .Sartist`).innerHTML;
            let img = document.querySelector(".Albumhead img");
            let Aname = document.querySelector(".Aname");
            let Aartist = document.querySelector(".Aartist");
            let infoImg = document.querySelector(".info img");
            let barimg = document.querySelector(".barimg img")
            img.src = element.getElementsByTagName("img")[0].src;
            if (element.querySelector(".chead").innerHTML.length > 8) {
                Aname.style.fontSize = "25px";
                if (window.innerWidth <= 1100) {
                    Aname.style.fontSize = "15px";
                }
            }

            else {
                Aname.style.fontSize = "40px";
            }

            Aname.innerHTML = element.querySelector(".chead").innerHTML;
            Aartist.innerHTML = element.querySelector(".cabout").innerHTML;
            infoImg.src = element.getElementsByTagName("img")[0].src;
            barimg.src = element.getElementsByTagName("img")[0].src;

            if (window.innerWidth <= 1100) {
                document.getElementById("hamburger").click()
            }
        })
    });
})()