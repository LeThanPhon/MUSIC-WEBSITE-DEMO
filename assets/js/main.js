const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'PLAYER'
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Có chắc yêu là đây",
            singer: "Sơn Tùng M-TP",
            path: "assets/music/CoChacYeuLaDay-SonTungMTP.mp3",
            image: "assets/img/Son_Tung_M-TP.jpeg"
        },
        {
            name: "Mất kết nối",
            singer: "Dương Domic",
            path: "assets/music/MatKetNoi-DuongDomic.mp3",
            image: "assets/img/Duong_Domic.jpeg"
        },
        {
            name: "Cao ốc 20",
            singer: "Bray",
            path: "assets/music/CaoOc20-Bray.mp3",
            image: "assets/img/Bray.jpeg"
        },
        {
            name: "Thằng Hầu",
            singer: "Nhật Phong",
            path: "assets/music/ThangHau-NhatPhong.mp3",
            image: "assets/img/Nhat_Phong.jpg"
        },
        {
            name: "Khó Vẽ Nụ Cười",
            singer: "Đạt G, Du Uyên",
            path: "assets/music/KhoVeNuCuoi-DatGDuUyen.mp3",
            image: "assets/img/Dat_G_Du_Uyen.jpg"
        },
        {
            name: "Độ Ta Không Độ Nàng",
            singer: "Khánh Phương",
            path: "assets/music/DoTaKhongDoNang-KhanhPhuong.mp3",
            image: "assets/img/Khanh_Phuong.jpg"
        },
        {
            name: "Cô Thắm Không Về",
            singer: "Phát Hồ, Jokes Bii, Sinike",
            path: "assets/music/CoThamKhongVe-PhatHoJokesBiiThien.mp3",
            image: "assets/img/Phat_Ho_JokeS_Bii_Sinike.jpg"
        },
        {
            name: "Mạnh Bà",
            singer: "Diệu Kiên",
            path: "assets/music/ManhBa-DieuKien.mp3",
            image: "assets/img/Dieu_Kien.jpg"
        },
        {
            name: "Tự Hào Màu Áo Lính",
            singer: "Thái Học",
            path: "assets/music/TuHaoMauAoLinhTuRemix-ThaiHoc.mp3",
            image: "assets/img/Thai_Hoc.jpg"
        },
        {
            name: "Hoa Cỏ Lau",
            singer: "Phong Max",
            path: "assets/music/HoaCoLauOfficialRemix-PhongMax.mp3",
            image: "assets/img/Phong_Max.jpg"
        },
        {
            name: "Thế Giới Ảo Tình Yêu Thật",
            singer: "Minh Vương M4U, Trịnh Đình Quang",
            path: "assets/music/TheGioiAoTinhYeuThat-MinhVuongM4UTrinhDinhQuang.mp3",
            image: "assets/img/Trinh_Dinh_Quang.jpg"
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
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
            `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this /* app */, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
                duration: 10000, // 10s
                iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay  = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song được pause
        audio.onpause  = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.oninput = function() {
            const seekTime = audio.duration / 100 * progress.value
            audio.currentTime = seekTime
        }

        // Xủ lý khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            // _this.render()
            _this.updateActiveSong()
            _this.scrollToActiveSong()
        }

        // Xủ lý khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            // _this.render()
            _this.updateActiveSong()
            _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        
        // Xử lý lặp lại một song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //  Xử lý next/ repeat song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // Lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    // _this.render()
                    _this.updateActiveSong()
                }
                if(e.target.closest('.option')) {

                }
            }
        }
    },

    // scrollToActiveSong: function() {
    //     setTimeout(() => {
    //         $('.song.active').scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'nearest',
    //         })
    //     }, 300)
    // },

    scrollToActiveSong: function name(params) {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }, 500)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
            this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
            if(this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    updateActiveSong: function () {
        // Xóa class 'active' khỏi bài hát hiện tại
        const currentActive = $('.song.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // Thêm class 'active' vào bài hát mới
        const newActive = $$('.song')[this.currentIndex];
        if (newActive) {
            newActive.classList.add('active');
        }
    },

    start: function () {
        // Gán cấu hình từ config vào app
        this.loadConfig()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button repeat & random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start()

/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */