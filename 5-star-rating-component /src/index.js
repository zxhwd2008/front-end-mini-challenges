// 本题要点
// private fields & private methods
// SVG 可以通过innerHTML来初始化
// event bubbling, we should only set event listenr on parentNode instead of each child element
// eventListner bind(this)
// e.currentTarget vs e.target
// e.target.closest('.star-icon') vs e.target 
// 为什么要用e.target.closest 因为当用户点击在星星外面的时, 我们希望不要触发任何改变，
// e.target.closest('.star-icon') = null 而 e.target = star or container 所以我们用前者可以轻松判断以上情况
// Array.from(e.currentTarget.children)

class StarWidget {
    #starTemplate;
    #maximum;
    #numOfFilled

    constructor(maximum, numOfFilled = 0) {
        if (isNaN(maximum)) {
            throw 'Parameter is missing or not a number!'
        }

        this.#maximum = maximum;
        this.#numOfFilled = numOfFilled;
        this.#starTemplate = `<svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="star"
                                class="star-icon"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2">
                                <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>`;

        this.#constructDomElements()
    }

    #constructDomElements() {  
        const body = document.querySelector('body');
        const container = document.createElement('div');
        container.addEventListener('mouseover', this.#onHover.bind(this));
        container.addEventListener('mouseout', this.#onOut.bind(this));
        container.addEventListener('click', this.#onClick.bind(this));

        // for (let i = 0; i < this.maximum; i++) {
        //     container.innerHTML = container.innerHTML + this.starTemplate;
        // }

        const innerHTML = Array.from({length: this.#maximum}, () => this.#starTemplate).join('');
        container.innerHTML = innerHTML;

        this.#redrawWidget(Array.from(container.children), this.#numOfFilled - 1);

        body.appendChild(container);
    }

    #onHover(e) {
        const [starList, index] = this.#getStarListAndIndex(e);
        if (index === -1) {
            return;
        }
        this.#redrawWidget(starList, index);
    }

    #onOut(e) {
        const starList = this.#getStarList(e);
        this.#redrawWidget(starList, this.#numOfFilled - 1);
    }

    #onClick(e) {
        const [starList, index] = this.#getStarListAndIndex(e);
        if (index === -1) {
            return;
        }
        this.#numOfFilled = index + 1;
        this.#redrawWidget(starList, index);
    }

    #getStarList(e) {
        return Array.from(e.currentTarget.children);
    }

    #getStarListAndIndex(e) {
        const starList = Array.from(e.currentTarget.children);
        const star = e.target.closest('.star-icon');
        const index = starList.indexOf(star);

        return [starList, index]
    }

    #redrawWidget(starList, index) {
        for (let i = 0; i < starList.length; i++) {
            const star = starList[i];

            if (i <= index) {
                star.setAttribute('class', `star-icon star-icon-filled`);
            } else {
                star.setAttribute('class', `star-icon`);
            }
        }
    }
}

const starWidget = new StarWidget(5, 3);
const starWidget2 = new StarWidget(6, 2);
