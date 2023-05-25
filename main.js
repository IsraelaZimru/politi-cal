

// importing data for stories
let data = undefined;
fetch("./fakeData.json")
    .then(response => {
        return response.json();
    })
    .then(([dbData]) => {
        data = dbData;
        console.log(data);
        new SlideStories("slide");
    })


// -------------------------------------------------------------------------------



class SlideStories {
    constructor(id) {
        this.slide = document.querySelector(`[data-slide=${id}]`);
        this.videoBtn = document.getElementById("video-btn");
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

        this.items.forEach((item, i) => {
            if (i == index && item instanceof HTMLVideoElement) {
                item.play();
                this.videoBtn.style.display = "block";
                document.querySelector("#video-btn img").src = "./images/pause.svg";
                item.currentTime = 0;
                this.autoSlide(item.duration * 1000);
            } else if (item instanceof HTMLVideoElement) {
                item.pause()
            } else {

                this.videoBtn.style.display = "none"
            }
        });


    }

    prev() {
        if (this.active > 0) {
            this.activeSlide(this.active - 1);
        } else {
            this.activeSlide(this.items.length - 1);
        }
    }

    next() {
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

    autoSlide(duration = 5000) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.next, duration);
    }

    init() {
        //adding new slides elements:
        const HTMLcontent = data.stories.map(story => {
            const type = story.type === "image" ? "img" : "video";
            return NewElement(type, [["src", story.src || ""], ["alt", story.alt || ""], ["type", "video/mp4"], ["poster", story.thumbnail || ""]])
        }
        )
        const slideContainer = document.getElementById("slideContainer");
        slideContainer.append(...HTMLcontent)

        // adding user info & update html
        document.getElementById("avatar-img").src = data.user.avatar;
        document.getElementById("user-name").innerText = data.user.name;

        // activate video btn
        this.videoBtn.addEventListener("click",
            () => {
                const currentVideo = this.items[this.active]
                const btnImg = document.querySelector("#video-btn img")
                if (currentVideo.paused) {
                    currentVideo.play()
                    btnImg.src = "./images/pause.svg";
                    console.log("sss");
                } else {
                    currentVideo.pause();
                    btnImg.src = "./images/play.svg";


                }

                this.items.forEach((item, i) => {
                    if (this.active !== i && item instanceof HTMLVideoElement) item.pause()
                })
            });

        // initiate more features:
        this.next = this.next.bind(this);
        this.prev = this.prev.bind(this);
        this.items = this.slide.querySelectorAll(".slide-items > *");
        this.thumb = this.slide.querySelector(".slide-thumb");
        this.addThumbItems();
        this.activeSlide(0);
        this.addNavigation();
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

