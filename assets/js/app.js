/**
 *1. Render songs
 *2. Scroll top
 *3. Play / pause / seek
 *4. CD rotate
 *5. Next / prev
 *6. Random
 *7. Next / Repeat when ended
 *8. Active song
 *9. Scroll active song into view
 *10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "SA_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progressBar = $("#progress");
const timeCurrent = $(".ctrl__progress-time--current");
const timeDuration = $(".ctrl__progress-time--duration");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

let theVolume = 100;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [{
        name: "Make You Look",
        singer: "Meghan Trainor",
        path: "assets/music/MadeYouLook-MeghanTrainor-8438542.mp3",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA6ZKvdU5tBHb_Tb9RH5WIHYQX8Ask-vOILA&usqp=CAU"
    }, {
        name: "Sunroof",
        singer: " Nicky Youre, Dazy",
        path: "assets/music/Sunroof - Nicky Youre_ Dazy.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2022/06/08/0/0/9/1/1654660851398.jpg"
    }, {
        name: "Stay",
        singer: " The Kid LAROI, Justin Bieber",
        path: "assets/music/Stay - The Kid LAROI_ Justin Bieber.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2021/07/09/5/5/8/2/1625815274622.jpg"
    }, {
        name: "We Don't Talk Anymore",
        singer: "Charlie Puth, Selena Gomez",
        path: "assets/music/We Don_t Talk Anymore - Charlie Puth_ Se.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2017/09/27/a/9/e/f/1506480482657.jpg"
    }, {
        name: "Faded",
        singer: "Alan Walker",
        path: "assets/music/Faded-AlanWalker-5919763.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2017/11/20/f/c/e/7/1511141429975.jpg"
    }, {
        name: "Attention",
        singer: "Charlie Puth",
        path: "assets/music/Attention - Charlie Puth.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2017/10/06/e/9/f/a/1507254139869.jpg"
    }, {
        name: "All Falls Down",
        singer: "Alan Walker, Noah Cyrus, Digital Farm Animals, Juliander",
        path: "assets/music/AllFallsDown-AlanWalkerNoahCyrusDigitalFarmAnimalsJuliander-5817723.mp3",
        image: "https://avatar-ex-swe.nixcdn.com/song/2017/10/27/9/d/8/d/1509093543890.jpg"
    }],
    setConfig: function(key, value) {
        this.config[key] = value;
        // (2/2) Uncomment the line below to use localStorage
        // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                         <div class="song ${
                           index === this.currentIndex ? "active" : ""
                         }" data-index="${index}">
                             <div class="thumb"
                                 style="background-image: url('${song.image}')">
                             </div>
                             <div class="body">
                                 <h3 class="title">${song.name}</h3>
                                 <p class="author">${song.singer}</p>
                             </div>
                             <div class="option">
                                 <i class="fas fa-ellipsis-h"></i>
                             </div>
                         </div>
                     `;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{
            transform: "rotate(360deg)"
        }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        // Handles CD enlargement / reduction
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click play
        // Handle when click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        // When the song is played
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        // When the song is pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        // When the song progress changes
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Theo dõi tiến độ bài hát
        audio.addEventListener("timeupdate", function() {
            // method duration trả về độ dài của audio/video
            const audioDuration = audio.duration;
            //   console.log(audio.duration);
            //
            if (!isNaN(audioDuration)) {
                // audio.currentTime trả về thời gian đang chạy của audio/video
                const progressPercent = (audio.currentTime / audio.duration) * 100; // Tính phần trăm chạy của bài hát
                // gán phần trăm bài hát vào thanh progress
                progressBar.value = progressPercent;
            }
            /* ========== Hiển thị thời gian hiện tại của bài hát ========== */
            // Trả về số phút hiện tại của audio/video
            let currentMinutes = Math.floor(audio.currentTime / 60);
            // Trả về số giây hiện tại của audio/video
            let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
            if (currentMinutes < 10) {
                currentMinutes = `0${currentMinutes}`;
            }
            if (currentSeconds < 10) {
                currentSeconds = `0${currentSeconds}`;
            }
            timeCurrent.innerText = `${currentMinutes}:${currentSeconds}`;
        });

        /* ========== Hiển thị thời gian bài hát ========== */
        audio.addEventListener("loadedmetadata", function() {
            // Trả về số phút của audio/video
            let durationMinutes = Math.floor(audio.duration / 60);
            // Trả về số giây của audio/video
            let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

            if (durationMinutes < 10) {
                durationMinutes = `0${durationMinutes}`;
            }

            if (durationSeconds < 10) {
                durationSeconds = `0${durationSeconds}`;
            }

            timeDuration.innerText = `${durationMinutes}:${durationSeconds}`;
        });

        // Xử lý khi tua song
        // Handling when seek
        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        // When next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        // When prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật / tắt random song
        // Handling on / off random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Xử lý lặp lại một song
        // Single-parallel repeat processing
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        // Handle next song when audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        // Listen to playlist clicks
        playlist.onclick = function(e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                // Handle when clicking on the song option
                if (e.target.closest(".option")) {}
            }
        };
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        // Assign configuration from config to application
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        // Defines properties for the object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        // Listening / handling events (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        // Load the first song information into the UI when running the app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        // Display the initial state of the repeat & random button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();