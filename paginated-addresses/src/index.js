// pagination 的逻辑
// table insertRow, insertCell, createTHead, createTBody, propoties: tBodies, rows, rowIndex, cellIndex etc.
// talbe sort column
// css
// localecompare
class Pagination {
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

class Table {
    #data;
    #head;
    #widget;
    #numPerPage = 5;
    #sorting = [];

    constructor(head, data) {
        if (!data || !Array.isArray(data)) {
            throw new TypeError('invalid data');
        }

        this.#head = head;
        this.#data = data;
        this.#widget = null;

        this.#constructWidget();
    }

    #constructWidget() {
        this.#widget = document.createElement('div');
        this.#widget.classList.add('table-container');

        const table = document.createElement('table');
        this.#createTableHead(table);
        this.#fillTable(table, this.#data.slice(0, this.#numPerPage));

        const pagination = new Pagination(this.#data.length, this.#numPerPage, this.#onPageChange.bind(this));
        this.#widget.append(table, pagination.render());
    }

    #createTableHead(table) {
        const head = table.createTHead();
        const headRow = head.insertRow();
        for (const name of this.#head) {
            const cell = document.createElement('th');
            cell.textContent = name;
            cell.addEventListener('click', this.#sortTableByCol.bind(this));
            headRow.append(cell);
            this.#sorting.push(1);
        }
    }

    #fillTable(table, data) {
        const body = table.querySelector('tbody') || table.createTBody();
        body.innerHTML = '';
        for (const obj of data) {
            const nextRow = body.insertRow();

            for (const val of Object.values(obj)) {
                const cell = nextRow.insertCell();
                cell.textContent = val;
            }
        }
    } 

    #onPageChange(currPage) {
        const table = this.#widget.querySelector('table');

        this.#fillTable(table, this.#data.slice((currPage - 1) * this.#numPerPage, currPage * this.#numPerPage));
    }

    #sortTableByCol(e) {
        const cellIndex = e.target.cellIndex;
        const table = this.#widget.querySelector('table')
        const body = table.tBodies[0];
        const rows = Array.from(body.rows);
        const sort = this.#sorting[cellIndex];

        rows.sort((tr1, tr2) => {
            const text1 = tr1.cells[cellIndex].textContent;
            const text2 = tr2.cells[cellIndex].textContent;
            return sort * text1.localeCompare(text2);
        });

        body.append(...rows);

        this.#sorting[cellIndex] = -this.#sorting[cellIndex];
    }

    render() {
        return this.#widget;
    }
}

const data = [
    {
        "id": 1,
        "Address": "339 Macpherson Lane",
        "customerEmail": "lsallter0@hubpages.com",
        "contact": "191-405-1109"
    },
    {
        "id": 2,
        "Address": "7268 Artisan Alley",
        "customerEmail": "akillbey1@europa.eu",
        "contact": "123-774-0910"
    },
    {
        "id": 3,
        "Address": "618 Vera Center",
        "customerEmail": "sgreenin2@fastcompany.com",
        "contact": "373-145-5025"
    },
    {
        "id": 4,
        "Address": "09494 Tennessee Circle",
        "customerEmail": "atrippick3@newyorker.com",
        "contact": "830-640-2733"
    },
    {
        "id": 5,
        "Address": "23 Marquette Pass",
        "customerEmail": "tsywell4@java.com",
        "contact": "908-558-1070"
    },
    {
        "id": 6,
        "Address": "66590 Eastwood Circle",
        "customerEmail": "llyptratt5@illinois.edu",
        "contact": "445-628-4676"
    },
    {
        "id": 7,
        "Address": "1275 Fulton Crossing",
        "customerEmail": "ebyrne6@dell.com",
        "contact": "164-756-5434"
    },
    {
        "id": 8,
        "Address": "64 Sullivan Trail",
        "customerEmail": "dgilbride7@ed.gov",
        "contact": "706-667-6734"
    },
    {
        "id": 9,
        "Address": "10 Judy Drive",
        "customerEmail": "sweekly8@usatoday.com",
        "contact": "105-875-7448"
    },
    {
        "id": 10,
        "Address": "44 Mcbride Hill",
        "customerEmail": "pkither9@webmd.com",
        "contact": "884-448-8680"
    },
    {
        "id": 11,
        "Address": "0 Lyons Hill",
        "customerEmail": "crebanksa@umich.edu",
        "contact": "781-142-8616"
    },
    {
        "id": 12,
        "Address": "10 Farwell Center",
        "customerEmail": "parnaob@people.com.cn",
        "contact": "272-292-3897"
    },
    {
        "id": 13,
        "Address": "85 Butternut Crossing",
        "customerEmail": "fblankleyc@state.tx.us",
        "contact": "531-647-2172"
    },
    {
        "id": 14,
        "Address": "7 Bunting Parkway",
        "customerEmail": "rmcgrathd@redcross.org",
        "contact": "180-184-4019"
    },
    {
        "id": 15,
        "Address": "6 Melvin Way",
        "customerEmail": "eclutherame@china.com.cn",
        "contact": "996-107-5565"
    },
    {
        "id": 16,
        "Address": "277 Twin Pines Pass",
        "customerEmail": "abatef@photobucket.com",
        "contact": "685-319-9251"
    },
    {
        "id": 17,
        "Address": "83921 Mariners Cove Place",
        "customerEmail": "harmatageg@behance.net",
        "contact": "746-684-6115"
    },
    {
        "id": 18,
        "Address": "8 Moulton Parkway",
        "customerEmail": "sblivenh@webmd.com",
        "contact": "413-481-5962"
    },
    {
        "id": 19,
        "Address": "87490 Melby Terrace",
        "customerEmail": "jcopperi@virginia.edu",
        "contact": "793-871-7819"
    },
    {
        "id": 20,
        "Address": "1 Colorado Hill",
        "customerEmail": "amaclleesej@arstechnica.com",
        "contact": "619-729-4183"
    }];
const table = new Table(['Id', 'Address', 'Contact', 'Customer Email'], data);
document.querySelector('.container').append(table.render());