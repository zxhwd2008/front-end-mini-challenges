// css: pointer-events, flex-box
// debounce
// manipulate list options
// Element.before()
// event: input vs change vs keyup
// event.dispatchEvent(Event);
// how to trigger an event when setting value programmatically line:153, 154. (event.dispatchEvent);

function debounce(func, interval) {
    let debounceId = null;

    return function(...args) {
        if (debounceId) {
            clearTimeout(debounceId);
        }

        debounceId = setTimeout(() => {
            func.call(this, ...args);
        }, interval);
    }
}

class Chip {
    #img;
    #name;
    #widget;
    #onClickCB;

    constructor(img, name, onClick) {
        this.#img = img;
        this.#name = name;
        this.#onClickCB = onClick;
        this.#widget = null;

        this.#constructWidget();
    }

    #constructWidget() {
        this.#widget = document.createElement('chip');
        this.#widget.classList.add('chip');

        const img = document.createElement('img');
        img.setAttribute('src', this.#img);

        const name = document.createElement('div');
        name.textContent = this.#name;

        const delBtn = document.createElement('i');
        delBtn.classList.add('fa-solid', 'fa-xmark', 'remove');
        delBtn.addEventListener('click', this.#onClick.bind(this));

        this.#widget.appendChild(img);
        this.#widget.appendChild(name);
        this.#widget.appendChild(delBtn);
    }

    #onClick(e) {
        if (!this.#onClickCB) {
            return;
        }

        this.#onClickCB(e);
    } 

    render() {
        return this.#widget;
    }
}

class AutoSuggestChips {
    #options;
    #widget;
    #selectedOptions;

    constructor(options) {
        if (!options || !options.length > 0) {
            throw new TypeError('invalid options');
        }

        this.#options = options;
        this.#widget = null;
        this.#selectedOptions = new Set();

        this.#constructWidget();
    }

    #constructWidget() {
        this.#widget = document.createElement('div');
        this.#widget.classList.add('chips-container');

        const searchWrapper = document.createElement('div');
        searchWrapper.classList.add('search-wrapper');

        const searchInput = document.createElement('input');
        searchInput.classList.add('search-chips');
        searchInput.setAttribute('autofocus', true);
        const debounceSearch = debounce(this.#search, 500);
        searchInput.addEventListener('input', debounceSearch.bind(this));

        const searchOptions = document.createElement('div');
        searchOptions.classList.add('search-options');
        searchOptions.style.display = 'none';

        searchWrapper.appendChild(searchInput);
        searchWrapper.appendChild(searchOptions);
        this.#widget.appendChild(searchWrapper);
    }

    #createSearchOptions(container, options) {
        options.forEach(option => {
            const searchRow = document.createElement('div');
            searchRow.classList.add('search-row');
            if (this.#selectedOptions.has(option.name)) {
                searchRow.classList.add('selected');
            }
            searchRow.addEventListener('click', this.#createChipFromOption.bind(this, option));

            const img = document.createElement('img');
            img.setAttribute('src', option.img);

            const name = document.createElement('div');
            name.textContent = option.name;

            searchRow.appendChild(img);
            searchRow.appendChild(name);
            container.appendChild(searchRow);
        });
    }

    #search(e) {
        const input = e.target.value.toLowerCase();
        const searchOptionsElem = this.#widget.querySelector('.search-options');

        const filteredOptions = this.#options.filter(option => option.name.toLowerCase().indexOf(input) !== -1);

        if (filteredOptions.length === 0 || input === '') {
            searchOptionsElem.style.display = 'none';
        } else {
            searchOptionsElem.innerHTML = '';
            searchOptionsElem.style.display = 'block';
            this.#createSearchOptions(searchOptionsElem, filteredOptions);
        }
    }

    #createChipFromOption(option) {
        const searchWrapperElem = this.#widget.querySelector('.search-wrapper');
        const chip = new Chip(option.img, option.name, this.#onChipRemove.bind(this, option));
        searchWrapperElem.before(chip.render());
        this.#selectedOptions.add(option.name);

        const inputElem = this.#widget.querySelector('.search-chips');
        inputElem.value = '';
        inputElem.dispatchEvent(new Event('input'));
        inputElem.focus();
    }

    #onChipRemove(option, e) {
        const chip = e.target.parentElement;
        chip.remove();
        this.#selectedOptions.delete(option.name);

        const inputElem = this.#widget.querySelector('.search-chips');
        this.#search({
            target: inputElem,
        });
    }

    render() {
        return this.#widget;
    }
}

const autoSuggestion = new AutoSuggestChips([
    {img: 'https://i.pravatar.cc/25?img=1', name: 'Xiaohang Zou'},
    {img: 'https://i.pravatar.cc/25?img=2', name: 'Danyang Zhao'},
    {img: 'https://i.pravatar.cc/25?img=3', name: 'Daniel'},
    {img: 'https://i.pravatar.cc/25?img=6', name: 'Xiaohang2 Zou2'},
    {img: 'https://i.pravatar.cc/25?img=4', name: 'Max Paen'},
    {img: 'https://i.pravatar.cc/25?img=5', name: 'Mozile wtf'},
]);

document.querySelector('body').appendChild(autoSuggestion.render());