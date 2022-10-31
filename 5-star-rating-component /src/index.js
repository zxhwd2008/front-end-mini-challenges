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
        this.#starTemplate = document.createElement('i');
        this.#starTemplate.classList.add('fa-regular', 'fa-star', 'fa-2x');

        this.#constructDomElements()
    }

    #constructDomElements() {  
        const body = document.querySelector('body');
        const container = document.createElement('div');
        container.addEventListener('mouseover', this.#onHover.bind(this));
        container.addEventListener('mouseout', this.#onOut.bind(this));
        container.addEventListener('click', this.#onClick.bind(this));

        for (let i = 0; i < this.#maximum; i++) {
            container.append(this.#starTemplate.cloneNode(true));
        }

        // const innerHTML = Array.from({length: this.#maximum}, () => this.#starTemplate.cloneNode(true)).join('');
        // container.innerHTML = innerHTML;

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
        const star = e.target.closest('.fa-star');
        const index = starList.indexOf(star);

        return [starList, index]
    }

    #redrawWidget(starList, index) {
        for (let i = 0; i < starList.length; i++) {
            const star = starList[i];

            if (i <= index) {
                star.classList.remove('fa-regular');
                star.classList.add('fa-solid', 'yellow');
            } else {
                star.classList.add('fa-regular');
                star.classList.remove('fa-solid', 'yellow');
            }
        }
    }
}

const starWidget = new StarWidget(5, 3);
const starWidget2 = new StarWidget(6, 2);
