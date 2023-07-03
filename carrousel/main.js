// importing data for stories

fetch(".././fakeData.json")
    .then(response => {
        return response.json();
    })
    .then(([dbData]) => {
        console.log(dbData);
        new CarrouselStories(dbData);
    })


// -------------------------------------------------------------------------------

class CarrouselStories {
    constructor(data) {
        this.data = data;
        this.init();
    }
    init() {
        this.swiper = new Swiper(".mySwiper", {
            slidesPerView: 3,
            spaceBetween: 30,
            grabCursor: true,
        });

        //adding new slides elements:
        const HTMLcontent = this.data.stories.map(story => {
            const type = story.type === "image" ? "img" : "video";
            const parentElement = newElement("div", undefined, "swiper-wrapper")
            const childElement = newElement(type, [["src", story.src || ""], ["alt", story.alt || ""], ["type", "video/mp4"], ["poster", story.thumbnail || ""], ["webkit-playsinline", true], ["playsinline", true]]
            )
            parentElement.append(childElement)
            return parentElement;
        }
        )
        const slideContainer = document.getElementById("swiper-wrapper");
        slideContainer.append(...HTMLcontent)

    }
}

// ------------------------------------------------
// helperFunctions:


function newElement(type, attributeList = [], cssClassLst = []) {
    const temp = document.createElement(type);

    temp.classList.add(...cssClassLst)

    for (let i = 0; i < attributeList.length; i++) {
        const attribute = attributeList[i];
        temp.setAttribute(...attribute);
    }
    return temp
}