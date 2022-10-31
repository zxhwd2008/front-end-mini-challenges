class LikeButton {
    #container;
    #heartTemplate;
    #onClickCB;

    constructor(container, width, height, onClickCB) {
        this.#container = container;
        // can also use font awesome
        this.#heartTemplate = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16"> 
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path> 
        </svg>
        `;
        this.#onClickCB = onClickCB;
        this.width = width;
        this.height = height;
        this.#constructLikeButton();
    }

    #constructLikeButton() {
        const btn = document.createElement('button');
        btn.classList.add('like-btn');
        const span = document.createElement('span');
        span.textContent = 'Like';
        const spinner = document.createElement('i');
        spinner.classList.add('fa', 'fa-spinner', 'fa-spin', 'hide');

        btn.addEventListener('click', this.#onClick.bind(this));

        btn.innerHTML = this.#heartTemplate;
        btn.appendChild(spinner);
        btn.appendChild(span);
        this.#container.appendChild(btn);
    }

    #onClick(e) {
        if (!this.#onClickCB || Object.prototype.toString.call(this.#onClickCB) !== '[object Function]') {
            e.currentTarget.classList.toggle('liked');
            return;
        }
        
        const btn = e.currentTarget;
        const svg = btn.querySelector('svg');
        const spinner = btn.querySelector('.fa-spinner');
        btn.classList.toggle('liked');
        svg.classList.add('hide');
        spinner.classList.remove('hide');

        this.#onClickCB()
            .then(() => {
                svg.classList.remove('hide');
                spinner.classList.add('hide');
            })
            .catch(err => {
                alert(err);
            })
    }
}

const btn = new LikeButton(document.querySelector('body'), 120, 40, () => new Promise((resolve, reject) => setTimeout(() => {
    resolve('success');
}, 1000)));