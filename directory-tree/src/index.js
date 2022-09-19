// 考点 递归
// css
// px vs em vs rem
class DirectoryTree {
    #fileTypes;
    #fileList;
    #container;

    constructor(fileList) {
        if (!fileList || !fileList.length > 0) {
            throw new TypeError('invalid fileList');
        }

        this.#fileTypes = Object.freeze({
            default: 'fa-brands fa-codepen',
            js: 'fa-brands fa-js',
            html: 'fa-brands fa-html5',
            css: 'fa-brands fa-css3',
            right: 'fa-solid fa-angle-right',
            down: 'fa-solid fa-angle-down',
        });

        this.#fileList = fileList;
        this.#container = null;

        this.#constructWidget();
    }

    #constructWidget() {
        const body = document.querySelector('body');
        this.#container = document.createElement('ul');
        this.#container.classList.add('directory-tree-container');
        this.#createFileList(this.#container, this.#fileList);
        body.appendChild(this.#container);
    }

    #createFileList(root, fileList) {
        for (const val of fileList) {
            const valType = this.#getType(val);

            if (valType === 'String') {
                this.#createFile(root, val);
            } else if (valType === 'Object') {
                const [folderName, folderFiles]= Object.entries(val)[0];
                const list = this.#createFile(root, folderName, 'right');
                const nextRoot = this.#createFolder(list);
                this.#createFileList(nextRoot, folderFiles);
            }
        }
    }

    #createFile(root, fileName, fileTypeName) {
        const list = document.createElement('li');

        const fileType = fileTypeName || fileName.split('.')[1];
        const fileTypeClassNames = this.#fileTypes[fileType] || this.#fileTypes.default;

        const icon = document.createElement('i');
        icon.classList.add(...fileTypeClassNames.split(' '));
        if (fileTypeName === 'right') {
            icon.addEventListener('click', this.#onClick.bind(this));
        }

        const span = document.createElement('span');
        span.textContent = fileName;

        list.appendChild(icon);
        list.appendChild(span);
        root.appendChild(list);

        return list;
    }

    #createFolder(root) {
        const folder = document.createElement('ul');
        folder.classList.add('nested');
        root.appendChild(folder);
        return folder;
    }

    #getType(obj) {
        const type = Object.prototype.toString.call(obj).split(' ')[1];

        return type.substring(0, type.length - 1);
    }

    #onClick(e) {
        const icon = e.currentTarget;
        const folder = icon.parentElement.querySelector('ul.nested');
        folder.style.display = folder.style.display === 'block' ? 'none' : 'block';
        
        if (folder.style.display === 'block') {
            icon.classList.remove(...this.#fileTypes.right.split(' '));
            icon.classList.add(...this.#fileTypes.down.split(' '));
        } else {
            icon.classList.remove(...this.#fileTypes.down.split(' '));
            icon.classList.add(...this.#fileTypes.right.split(' '));
        }
    }
}

const directoryTree = new DirectoryTree([
    {
        app: [
            {
                src: [
                    {
                        styles: ['styles.css'],
                    },
                    {
                        assets: ['test1.png', 'test2.png', 'test3.png'],
                    },
                    'index.js',
                ],
            }, 
            'README.md',
            'LICENSE',
        ],
    },
    'index.html',
    'root.js', 
    'rootStyles.css',
]);