class LastSeen {
    #startDateTime;
    #widget;
    #oneSec = 1000;
    #oneMinute = 60 * 1000;
    #oneHour = 60 * this.#oneMinute;
    #oneDay = 24 * this.#oneHour;
    #oneMonth = 30 * this.#oneDay;
    #oneYear = 12 * this.#oneMonth

    constructor(dateTime) {
        this.#startDateTime = dateTime;
        this.#widget = null;
        this.#constructWidget();
    }

    #constructWidget() {
        const body = document.querySelector('body');
        this.#widget = document.createElement('div');
        this.#setTimeDiff();
        body.appendChild(this.#widget);
    }

    #setTimeDiff() {
        let result = '';
        let interval = 0;
        const diff = Date.now() - this.#startDateTime.getTime();

        if (diff > this.#oneYear) {
            const numOfYears = Math.floor(diff / this.#oneYear);
            interval = this.#oneYear;
            result = `${numOfYears} ${numOfYears > 1 ? 'years' : 'year'}`;
        } else if (diff > this.#oneMonth) {
            const numOfMonths = Math.floor(diff / this.#oneMonth);
            interval = this.#oneMonth;
            result = `${numOfMonths} ${numOfMonths > 1 ? 'months' : 'month'}`;
        } else if (diff > this.#oneDay) {
            const numOfDays = Math.floor(diff / this.#oneDay);
            interval = this.#oneDay;
            result = `${numOfDays} ${numOfDays > 1 ? 'days' : 'day'}`;
        } else if (diff > this.#oneHour) {
            const numOfHours = Math.floor(diff / this.#oneHour);
            interval = this.#oneHour;
            result = `${numOfHours} ${numOfHours > 1 ? 'hours' : 'hour'}`;
        } else if (diff > this.#oneMinute) {
            const numOfMinutes = Math.floor(diff / this.#oneMinute);
            interval = this.#oneMinute;
            result = `${numOfMinutes} ${numOfMinutes > 1 ? 'minutes' : 'minute'}`;
        } else {
            const numOfSecs = Math.floor(diff / this.#oneSec);
            interval = this.#oneSec;
            result = `${numOfSecs} ${numOfSecs > 1 ? 'seconds' : 'second'}`;
        }

        this.#widget.textContent = `Last seen ${result} ago`;
        setTimeout(() => {
            this.#setTimeDiff();
        }, interval);
    }
}

const lastSeen = new LastSeen(new Date());
const lastSeen2 = new LastSeen(new Date('2021-07-15'));
