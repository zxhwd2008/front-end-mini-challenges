export default class Pagination {
    #total; 
    #numPerPage;
    #currPage;
    #widget;
    #pageChangeCB;

    constructor(total, numPerPage = 5, pageChangeCB) {
        this.#total = total;
        this.#numPerPage = numPerPage;
        this.#currPage = 1;
        this.#pageChangeCB = pageChangeCB;
        this.#widget = null;

        this.#constructWidget();
    } 

    #constructWidget() {
        this.#widget = document.createElement('div');
        this.#widget.classList.add('pagination');

        const leftBtn = document.createElement('button');
        leftBtn.classList.add('left', 'disabled');

        const leftIcon = document.createElement('i');
        leftIcon.classList.add('fa-solid', 'fa-angle-left');
        leftBtn.append(leftIcon);
        leftBtn.addEventListener('click', this.#changePage.bind(this, -1));

        const rightBtn = document.createElement('button');
        rightBtn.classList.add('right');
        const rightIcon = document.createElement('i');
        rightIcon.classList.add('fa-solid', 'fa-angle-right');
        rightBtn.append(rightIcon);
        rightIcon.addEventListener('click', this.#changePage.bind(this, 1));
        
        const currPage = document.createElement('span');
        currPage.textContent = `Current page: ${this.#currPage}`;

        this.#widget.append(leftBtn, currPage, rightBtn);
    }

    #changePage(direction, e) {
        const btn = e.target.closest('button');
        if (btn.classList.contains('disabled')) {
            return;
        }

        const lastPage = Math.ceil(this.#total / this.#numPerPage);
        this.#currPage = this.#currPage + direction;

        const leftBtn = this.#widget.querySelector('button.left');
        const rightBtn = this.#widget.querySelector('button.right');
        leftBtn.classList.remove('disabled');
        rightBtn.classList.remove('disabled');

        if (this.#currPage === 1) {
            leftBtn.classList.add('disabled');
        } else if (this.#currPage === lastPage) {
            rightBtn.classList.add('disabled');
        }

        const currPage = this.#widget.querySelector('span');
        currPage.textContent = `Current page: ${this.#currPage}`;

        if (this.#pageChangeCB) {
            this.#pageChangeCB(this.#currPage, this.#numPerPage, this.#total);
        }
    }

    render() {
        return this.#widget;
    }
}