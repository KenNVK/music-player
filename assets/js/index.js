const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER";

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isTimeupdate: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Endless Rain",
      singer: " X Japan",
      path: "https://tainhac123.com/download/endless-rain-x-japan.5vjC65VzRZ.html",
      image: "https://data.chiasenhac.com/data/cover/27/26676.jpg",
    },
    {
      name: "Tears",
      singer: " X Japan",
      path: "https://tainhac123.com/download/tears-x-japan.d5OctmkxUlXT.html",
      image: "https://data.chiasenhac.com/data/cover/27/26676.jpg",
    },
    {
      name: "Forever Love",
      singer: " X Japan",
      path: "https://tainhac123.com/download/forever-love-x-japan.mhUYOx4PY0.html",
      image: "https://data.chiasenhac.com/data/cover/27/26676.jpg",
    },
    {
      name: " Nàng thơ ",
      singer: "Hoàng Dũng",
      path: "https://tainhac123.com/download/nang-tho-hoang-dung.Kx3Kbih0rS5z.html",
      image: "https://avatar-nct.nixcdn.com/song/2020/07/31/c/5/8/9/1596188259603.jpg",
    },
    {
      name: "Hai Triệu Năm",
      singer: "Đen Vâu",
      path: "https://tainhac123.com/download/hai-trieu-nam-den-ft-bien.RFuRYI9qpBjs.html",
      image: "https://avatar-nct.nixcdn.com/song/2019/06/20/5/9/0/b/1561001745463.jpg",
    },
    {
      name: "Anh Đếch Cần Gì Nhiều Ngoài Em",
      singer: "Đen,Vũ,Thành Đồng",
      path: "https://tainhac123.com/download/anh-dech-can-gi-nhieu-ngoai-em-den-ft-vu-ft-thanh-dong.VSvhW9JOP9gD.html",
      image: "https://avatar-nct.nixcdn.com/song/2018/11/17/7/e/d/6/1542467262054.jpg",
    },
    {
      name: "Classic Love",
      singer: "Tofu",
      path: "https://tainhac123.com/download/co-dien-classic-love-tofu-ft-vovanduc.ZTbDEh2Ic9es.html",
      image: "https://avatar-nct.nixcdn.com/singer/avatar/2019/07/30/6/0/5/f/1564467469828.jpg",
    },
    {
      name: "Buồn Làm Chi Em Ơi",
      singer: "Đức Tân",
      path:
        "https://tainhac123.com/download/buon-lam-chi-em-oi-cover-duc-tan-ft-hoang-pio-ft-tuan-joe.XLU2sW4C21h9.html",
      image: "https://i.ytimg.com/vi/GL6cUSb1w-U/maxresdefault.jpg",
    },
  ],
  setConfig(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currentIndex ? "active" : ""}" data-index = "${index}">
      <div
      class="thumb"
      style="background-image: url('${song.image}');">
      </div>
      <div class="body">
      <h3 class="title">${song.name}</h3>
      <p class="author">${song.singer}</p>
      </div>
      <div class="animate">
      <span class="bar n1">.</span>
      <span class="bar n2">.</span>
      <span class="bar n3">.</span>
      <span class="bar n4">.</span>
      <span class="bar n5">.</span>
      <span class="bar n6">.</span>
      <span class="bar n7">.</span>
      <span class="bar n8">.</span>
      </div>
      </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },
  handleEvent() {
    const cdWidth = cd.offsetWidth;

    // Xử lý phóng to/ thu nhỏ cd
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý cd quay / dừng
    const cdThumAnimate = cdThumb.animate(
      { transform: "rotate(360deg)" },
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumAnimate.pause();

    // Xử lý khi nhấn playBtn
    playBtn.onclick = () => {
      this.isPlaying ? audio.pause() : audio.play();
      this.isTimeupdate = true;
    };

    // Xử lý khi playing
    audio.onplay = () => {
      this.isPlaying = true;
      player.classList.add("playing");
      cdThumAnimate.play();
      this.activeSong();
    };

    // Xử lý khi pausing
    audio.onpause = () => {
      this.isPlaying = false;
      player.classList.remove("playing");
      cdThumAnimate.pause();
    };

    // Xử lý khi nhấn nextBtn
    nextBtn.onclick = () => {
      this.isRandom ? this.randomSong() : this.nextSong();
      audio.play();
      this.scrollToActiveSong();
    };

    // Xử lý khi nhấn prevBtn
    prevBtn.onclick = () => {
      this.isRandom ? this.randomSong() : this.prevSong();
      audio.play();
      this.scrollToActiveSong();
    };

    // Xử lý khi nhấn random
    randomBtn.onclick = () => {
      this.isRandom = !this.isRandom;
      this.setConfig("isRandom", this.isRandom);
      randomBtn.classList.toggle("active", this.isRandom);
    };

    // Xử lý khi nhấn repeat
    repeatBtn.onclick = () => {
      this.isRepeat = !this.isRepeat;
      this.setConfig("isRepeat", this.isRepeat);
      repeatBtn.classList.toggle("active", this.isRepeat);
    };

    // Xử lý tiến độ bài hát
    audio.ontimeupdate = () => {
      if (audio.duration && this.isTimeupdate) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        const color = `linear-gradient(90deg, var(--primary-color) ${progressPercent}%, #d3d3d3 ${progressPercent}%)`;
        progress.value = progressPercent;
        progress.style.background = color;
      }
    };

    // Xử lý khi click vào bài hát khi
    playlist.onclick = e => {
      const songElement = e.target.closest(".song:not(.active)");
      if (songElement) {
        this.currentIndex = Number(songElement.dataset.index);
        this.loadCurrentSong();
        audio.play();
      }
    };

    // Xử lý khi seeking
    progress.onchange = () => {
      const seekingTime = audio.duration * (progress.value / 100);
      audio.currentTime = seekingTime;
    };
    // seeking với mouse
    progress.onmousedown = () => {
      this.isTimeupdate = false;
    };
    progress.onmouseup = () => {
      this.isTimeupdate = true;
    };
    progress.onmousemove = () => this.completedProgressColor();
    // seeking với touch
    progress.ontouchstart = () => {
      this.isTimeupdate = false;
    };
    progress.ontouchend = () => {
      this.isTimeupdate = true;
    };
    progress.ontouchmove = () => this.completedProgressColor();

    //Xử lý khi audio kết thúc
    audio.onended = () => {
      this.isRepeat ? audio.play() : nextBtn.click();
    };
  },

  completedProgressColor() {
    const position = progress.value;
    const color = `linear-gradient(90deg, var(--primary-color) ${position}%, #d3d3d3 ${position}%)`;
    progress.style.background = color;
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
    this.completedProgressColor();
  },
  loadConfig() {
    // load config random and repeat
    this.config.isRandom ? (this.isRandom = this.config.isRandom) : this.isRandom;
    this.config.isRepeat ? (this.isRepeat = this.config.isRepeat) : this.isRepeat;
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
    this.loadCurrentSong();
  },
  randomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  activeSong() {
    console.log(this.currentIndex);
    [...$$(".song")].find((song, index) => {
      if (song.classList.contains("active")) {
        song.classList.remove("active");
      }
      if (index === this.currentIndex) {
        song.classList.add("active");
      }
    });
  },
  scrollToActiveSong() {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },
  start() {
    // Load config khi ứng dụng chạy
    this.loadConfig();
    // Xử lý các sự kiện
    this.handleEvent();
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();
    // Tủi thông tin bài hát đầu tiên khi chạy ứng dụng
    this.loadCurrentSong();
    // Render list of songs
    this.render();
  },
};
app.start();
