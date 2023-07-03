

// importing data for stories

fetch("./fakeData.json")
    .then(response => {
        return response.json();
    })
    .then(([dbData]) => {
        console.log(dbData);
        new SlideStories(dbData);
    })


// -------------------------------------------------------------------------------



class SlideStories {
    constructor(data) {
        this.slide = document.querySelector(`[data-slide=slide]`);
        this.data = data;
        this.active = 0;
        this.init();
    }

    activeSlide(index) {
        this.active = index;
        this.items.forEach((item) => {
            item.classList.remove("active");
        });
        this.items[index].classList.add("active");
        this.thumbItems.forEach((item) => {
            item.classList.remove("active");
        });
        this.thumbItems[index].classList.add("active");

        // Like button update:
        this.likeBtnImg.src = this.data.stories[this.active].like ? "https://static.wixstatic.com/shapes/7ce4e9_eb5a29ec85e8458ea116d432812424b9.svg" : "https://static.wixstatic.com/shapes/7ce4e9_992298828a284b3c86d1355056e8bb9a.svg";
        this.likeBtn.style.backgroundColor = this.data.stories[this.active].like ? "#31356E" : "white";

        // story with video:
        this.items.forEach((item, i) => {
            if (i == index && item instanceof HTMLVideoElement) {
                item.play();
                this.videoBtn.style.display = "block";
                this.audioBtn.style.display = "block";
                document.querySelector("#video-btn img").src = "https://static.wixstatic.com/shapes/7ce4e9_3b0a624b75664888b22bb44d3da8ad44.svg";
                item.currentTime = 0;
                item.addEventListener("ended", this.next)
                // this.autoSlide(item.duration * 1000);
            } else if (item instanceof HTMLVideoElement) {
                item.pause()
            } else {

                this.videoBtn.style.display = "none";
                this.audioBtn.style.display = "none";
            }
        });


    }

    prev() {
        clearTimeout(this.timeout);
        if (this.active > 0) {
            this.activeSlide(this.active - 1);
        } else {
            this.activeSlide(this.items.length - 1);
        }
    }

    next() {
        clearTimeout(this.timeout);
        if (this.active < this.items.length - 1) {
            this.activeSlide(this.active + 1);
        } else {
            this.activeSlide(0);
        }
    }

    addNavigation() {
        const nextBtn = this.slide.querySelector(".slide-next");
        const prevBtn = this.slide.querySelector(".slide-prev");
        nextBtn.addEventListener("click", this.next);
        prevBtn.addEventListener("click", this.prev);
    }

    addThumbItems() {
        this.items.forEach(() => (this.thumb.innerHTML += `<span></span>`));
        this.thumbItems = Array.from(this.thumb.children);
    }

    autoSlide(duration = 0) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.next, duration);
    }

    resetVideos() {
        this.videoBtn.addEventListener("click",
            () => {
                const currentVideo = this.items[this.active]
                const btnImg = document.querySelector("#video-btn img")
                btnImg.classList.toggle("m-10");
                if (currentVideo.paused) {
                    currentVideo.play()
                    btnImg.src = "https://static.wixstatic.com/shapes/7ce4e9_3b0a624b75664888b22bb44d3da8ad44.svg";
                } else {
                    currentVideo.pause();
                    btnImg.src = "https://static.wixstatic.com/shapes/7ce4e9_72a25fa15911459484eb52ca67d8ccdc.svg";


                }

                this.items.forEach((item, i) => {
                    if (this.active !== i && item instanceof HTMLVideoElement) item.pause()
                })
            });
    }

    resetAudio() {
        this.audioBtn.addEventListener("click",
            () => {
                const currentVideo = this.items[this.active]
                const btnImg = document.querySelector("#audio-btn img")
                if (currentVideo.muted) {
                    currentVideo.muted = false;
                    btnImg.src = "./images/not_mute.svg";
                } else {
                    currentVideo.muted = true;
                    btnImg.src = "./images/mute.svg";


                }

                this.items.forEach((item, i) => {
                    if (this.active !== i && item instanceof HTMLVideoElement) item.pause()
                })
            });
    }

    likeUpdate() {
        // todo - send db like requset !!
        this.data.stories[this.active].like = !this.data.stories[this.active].like;

        this.likeBtnImg.src = this.data.stories[this.active].like ? "https://static.wixstatic.com/shapes/7ce4e9_eb5a29ec85e8458ea116d432812424b9.svg" : "https://static.wixstatic.com/shapes/7ce4e9_992298828a284b3c86d1355056e8bb9a.svg";
        this.likeBtn.style.backgroundColor = this.data.stories[this.active].like ? "#31356E" : "white";
    }

    init() {
        //adding new slides elements:
        const HTMLcontent = this.data.stories.map(story => {
            const type = story.type === "image" ? "img" : "video";
            return NewElement(type, [["src", story.src || ""], ["alt", story.alt || ""], ["type", "video/mp4"], ["poster", story.thumbnail || ""], ["webkit-playsinline", true], ["playsinline", true]]
            )
        }
        )
        const slideContainer = document.getElementById("slideContainer");
        slideContainer.append(...HTMLcontent)

        // adding user info & update html
        document.getElementById("avatar-img").src = this.data.user.avatar;
        document.getElementById("user-name").innerText = this.data.user.name;


        // initiate more features:
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.items = this.slide.querySelectorAll(".slide-items > *");
        this.thumb = this.slide.querySelector(".slide-thumb");
        this.videoBtn = document.getElementById("video-btn");
        this.audioBtn = document.getElementById("audio-btn");
        this.likeBtnImg = document.getElementById("like-btn-img");
        this.likeBtn = document.getElementById("like-btn");
        this.addThumbItems();
        this.activeSlide(0);
        this.likeBtn.addEventListener("click", this.likeUpdate.bind(this))
        this.addNavigation();
        this.resetVideos();
        this.resetAudio()
    }
}

// ------------------------------------------------
// helperFunctions:


function NewElement(type, attributeList = [], cssClassLst = []) {
    const temp = document.createElement(type);

    temp.classList.add(...cssClassLst)

    for (let i = 0; i < attributeList.length; i++) {
        const attribute = attributeList[i];
        temp.setAttribute(...attribute);
    }
    return temp
}

