// 考点 CSS modal overlay和flex 布局
class Modal {
    #defaults;

    constructor(options) {
        this.#defaults = Object.freeze({
            el: null,
            title: null,
            width: 640,
            height: 480,
            onClose: null,
            onOk: null,
        });
        this.options = options;

        this.#constructWidget();
    }

    #constructWidget() {
        const body = document.querySelector('body');
        this.overlay = document.createElement('div');
        this.overlay.classList.add('modal-overlay');
        this.overlay.style.display = 'none';
        body.appendChild(this.overlay);

        const content = document.createElement('div');
        content.classList.add('modal-content');
        content.style.width = `${this.options.width || this.#defaults.width}px`;
        content.style.height = `${this.options.height || this.#defaults.height}px`;

        this.overlay.appendChild(content);

        // modal header
        if (this.options.title) {
            const header = document.createElement('div');
            header.classList.add('modal-header');
            header.textContent = this.options.title;
            content.appendChild(header);
        }

        // modal body
        if (typeof this.options.el !== 'string' || !this.options.el) {
            throw new TypeError('el must be a valid query selector');
        }
        
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        const modalBodyContent = document.querySelector(this.options.el);
        modalBody.appendChild(modalBodyContent);
        content.appendChild(modalBody);

        // modal footer
        const footer = document.createElement('div');
        footer.classList.add('modal-footer');

        const btnClose = document.createElement('button');
        btnClose.textContent = 'Close';
        btnClose.classList.add('btn-close');
        btnClose.addEventListener('click', this.#onClose.bind(this));

        const btnOk = document.createElement('button');
        btnOk.textContent = 'Ok';
        btnOk.classList.add('btn-ok');
        btnOk.addEventListener('click', this.#onOk.bind(this));
        
        footer.appendChild(btnClose);
        footer.appendChild(btnOk);
        content.appendChild(footer);
    }

    open() {
        this.overlay.style.display = 'flex';
    }

    close() {
        this.overlay.style.display = 'none';
    }

    #onClose() {
        this.close();

        if (this.options.onClose) {
            this.options.onClose();
        }
    }

    #onOk() {
        this.close();

        if (this.options.onOk) {
            this.options.onOk();
        }
    }
}

const modal = new Modal({
    title: 'test modal',
    el: '.test-content',
    onClose: () => alert('close'),
    onOk: () => alert('on OK'),
})

const modal2 = new Modal({
    title: 'test modal 2',
    el: '.test-content-2',
    onClose: () => alert('on close'),
    onOk: () => alert('on OK'),
})

document.querySelector('.test-open-modal').addEventListener('click', () => {
    modal.open();
})

document.querySelector('.test-open-modal-2').addEventListener('click', () => {
    modal2.open();
})