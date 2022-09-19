// CSS的animation和其他的
// scrol的算法
class ImageSlider {
    #options;
    #default;
    #curr;

    constructor(options) {
        if (!options.images || !options.images.length > 0) {
            throw new TypeError('iinvalid images');
        }

        this.#default = Object.freeze({
            width: 850,
            height: 350,
        });

        this.#options = options;
        this.#curr = 0;
        this.slider = null;

        this.#constructWidget();
    }

    #constructWidget() {
        const body = document.querySelector('body');
        this.slider = document.createElement('div');
        this.slider.classList.add('slider-container');
        this.slider.style.maxWidth = `${this.#options.width || this.#default.width}px`;
        this.slider.style.height = `${this.#options.height || this.#default.height}px`;

        this.#options.images.forEach(imgSrc => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            
            const img = document.createElement('img');
            img.src = imgSrc;

            slide.appendChild(img);
            this.slider.appendChild(slide);
        });

        const btnScrollLeft = document.createElement('i');
        btnScrollLeft.classList.add('fa', 'fa-chevron-left', 'fa-2x', 'btn-scroll-left');
        btnScrollLeft.addEventListener('click', this.#scroll.bind(this, -1));

        const btnScrollRight = document.createElement('i');
        btnScrollRight.classList.add('fa', 'fa-chevron-right', 'fa-2x', 'btn-scroll-right');
        btnScrollRight.addEventListener('click', this.#scroll.bind(this, 1));

        this.slider.appendChild(btnScrollLeft);
        this.slider.appendChild(btnScrollRight);

        body.appendChild(this.slider);
    }

    #scroll(direction,e) {
        const slides = this.slider.querySelectorAll('.slide');
        this.#curr -= direction;

        if (this.#curr === slides.length) {
            this.#curr = 0;
        } else if (this.#curr === -1) {
            this.#curr = slides.length - 1;
        }

        slides.forEach((slide) => {
            slide.style.transform = `translateX(${-this.#curr * 100}%)`;
        });
    }
}

const slider = new ImageSlider({
    images: [
        'https://source.unsplash.com/random?landscape,mountain',
        'https://source.unsplash.com/random?landscape,city',
        'https://source.unsplash.com/random?landscape,night',
        'https://source.unsplash.com/random?landscape,morning',
    ]
});