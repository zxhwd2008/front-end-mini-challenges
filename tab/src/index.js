// width: max-content
// flex-direction: column 可以保证两个child的width是相同的
// 最佳实践 focus & hover apply same style

class TabList {
    #tabs;
    #panels;
    #widget;
    #activeIndex;

    constructor(tabs, panels) {
        if (!Array.isArray(tabs)) {
            throw new TypeError('invalid tabs');
        }

        if (!panels) {
            throw new TypeError('invalid panels');
        }

        this.#tabs = tabs;
        this.#panels = Array.from(panels);
        this.#widget = null;
        this.#activeIndex = null;

        this.#constructWidget();
    }

    #constructWidget() {
        this.#widget = document.createElement('section');
        this.#widget.classList.add('tab-container');

        const tabs = document.createElement('ul');
        this.#tabs.forEach((tab, index) => {
            const { title, isActive } = tab;
            const item = document.createElement('li');
            if (isActive) {
                item.classList.add('active');
                this.#activeIndex = index;
            }

            const anchor = document.createElement('a');
            anchor.setAttribute('href', 'javascript:void(0)');
            anchor.textContent = title;

            item.append(anchor);
            tabs.append(item);
        })
        tabs.addEventListener('click', this.#onClick.bind(this));

        const panels = document.createElement('div');
        panels.classList.add('panels');
        this.#panels.forEach(panel => {
            panels.append(panel);
        });
        this.#panels[this.#activeIndex].classList.add('active-panel');

        this.#widget.append(tabs);
        this.#widget.append(panels);
    }

    #onClick(e) {
        const tabs = Array.from(this.#widget.querySelectorAll('ul li'));
        tabs[this.#activeIndex].classList.remove('active');

        const panels = this.#widget.querySelectorAll('.panels article');
        panels[this.#activeIndex].classList.remove('active-panel');

        this.#activeIndex = tabs.indexOf(e.target.closest('li'));
        tabs[this.#activeIndex].classList.add('active');
        panels[this.#activeIndex].classList.add('active-panel');
    }

    render() {
        return this.#widget;
    }
}

const tabs = new TabList(
    [{title: 'Tab 1'}, {title: 'Tab 2', isActive: true}, {title: 'Tab 3'}, {title: 'Tab 4'}], 
    document.querySelectorAll('.panels article'));

const tabs2 = new TabList(
    [{title: 'Another Tab 1', isActive: true}, {title: 'Another Tab 2'}], 
    document.querySelectorAll('.panels2 article'));

document.querySelector('body').append(tabs.render(), tabs2.render());