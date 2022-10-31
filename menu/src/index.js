// clarify questions
// 1. dynamic or static?
// 2. click or hover (mouseenter doesn't bubble 注意一下hover的写法)?
// 难点
// 首先最内层要用anchor (a11y) 并且要在anchor上面设置width height之类的，这样才能保证你每次点击最先触发的都是anchor
// nextElementSibling vs e.target.closest('li').querySelector('ul') 的使用
// keep children opened when you click on child's children (this.#onItemClick)
// close opened children when you click on another parent (this.#onItemClick)
class Menu {
    #widget
    #data

    constructor(data) {
        if (!Array.isArray(data)) {
            throw new TypeError('Invalid data');
        }

        this.#widget = null;
        this.#data = data;

        this.#constructWidget();
    }

    #constructWidget() {
        this.#widget = document.createElement('nav');
        const menuWrapper = document.createElement('ul');
        menuWrapper.classList.add('menu-wrapper');
        menuWrapper.addEventListener('click', this.#onItemClick.bind(this));
        this.#widget.append(menuWrapper);

        this.#createMenuItems(menuWrapper, this.#data);
    }

    #createMenuItems(wrapper, data) {
        for (const item of data) {
            const list = document.createElement('li');
            const listContent = document.createElement('a');
            listContent.setAttribute('href', 'javascript:void(0);');
            listContent.textContent = item.name;
            // listContent.addEventListener('mouseenter', this.#onItemClick.bind(this));
            // listContent.addEventListener('mouseleave', this.#onItemClick.bind(this));
            list.append(listContent);
            wrapper.append(list);

            if (!Array.isArray(item.children) || item.children.length === 0) {
                continue;
            }

            const listIcon = document.createElement('i');
            listIcon.classList.add('fa-solid', 'fa-angle-right')
            listContent.append(listIcon);

            const nextWrapper = document.createElement('ul');
            nextWrapper.classList.add('nested');
            list.append(this.#createMenuItems(nextWrapper, item.children));
        }

        return wrapper;
    }

    #onItemClick(e) {
        // if (e.type === 'mouseleave') {
        //     const visibleList = this.#widget.querySelectorAll('.nested.show');
        //     visibleList.forEach((listItem) => {
        //         listItem.classList.remove('show');
        //         this.#toggleIcon(listItem);
        //     });
        //     return;
        // }

        // the child list that triggered by user click should be whether show or hide
        const nextVisibleList = e.target.closest('li').querySelector('ul');
        if (nextVisibleList) {
            nextVisibleList.classList.toggle('show');
            this.#toggleIcon(nextVisibleList);
        }

        // remove show for all elements except the nextVisibleList
        const visibleList = this.#widget.querySelectorAll('.nested.show');
        visibleList.forEach((listItem) => {
            if (listItem !== nextVisibleList) {
                listItem.classList.remove('show');
                this.#toggleIcon(listItem);
            }
        });

        // add show based on event.path
        const menuWrapper = this.#widget.querySelector('ul.menu-wrapper');
        const path = e.path;
        let currIndex = 0;

        while (path[currIndex] !== menuWrapper) {
            const node = path[currIndex];

            if (node.tagName.toLowerCase() === 'ul') {
                node.classList.add('show');

                this.#toggleIcon(node);
            }

            if (node.tagName.toLowerCase() === 'li') {
                node.classList.add('active');
            }
            
            currIndex++;
        }
    }

    #toggleIcon(node) {
        const listContent = node.previousElementSibling;
        const listIcon = listContent.querySelector('i');

        if (node.classList.contains('show')) {
            listIcon.classList.remove('fa-angle-right');
            listIcon.classList.add('fa-angle-down');
        } else {
            listIcon.classList.add('fa-angle-right');
            listIcon.classList.remove('fa-angle-down');
        }
    }

    render() {
        return this.#widget;
    }
}

const menu = new Menu([
    {
        name: 'JavaScript',
        children: [
            {
                name: 'React',
                children: [
                    {
                        name: 'React Hooks',
                    },
                    {
                        name: 'Performance Optimization',
                    }
                ],
            },
            {
                name: 'ES6',
                children: [
                    {
                        name: 'let & const',
                    }, 
                    {
                        name: 'spread syntax',
                    },
                ],
            },
        ],
    },
    {
        name: 'Backend',
        children: [
            {
                name: 'Node.js',
                children: [
                    {
                        name: 'Event Loop',
                    },
                    {
                        name: 'Stream',
                    },
                    {
                        name: 'Async & Await',
                    },
                ],
            },
            {
                name: 'Python',
                children: [
                    {
                        name: 'Flask',
                    },
                ],
            },
        ],
    }
]);

document.querySelector('body').append(menu.render());