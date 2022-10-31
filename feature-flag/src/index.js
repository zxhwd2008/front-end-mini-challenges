class LRUCache {
    constructor(max) {
        if (isNaN(max) || max <= 0) {
            throw new TypeError('invalid max');
        }
        this.max = parseInt(max, 10);
        this.hashMap = new Map();
    }

    get(key) {
        const data = this.hashMap.get(key);
        if (data) {
            this.refreshKey(key, data);
        }

        return data;
    }

    set(key, data) {
        this.refreshKey(key, data);

        if (this.hashMap.size > this.max) {
            this.hashMap.delete(this.first());
        }
    }

    refreshKey(key, data) {
        this.hashMap.delete(key);
        this.hashMap.set(key, data);
    }

    first() {
        return this.hashMap.keys().next().value;
    }
}

class APICache {
    // staleTime represents for valid time period for the cache, every time we make a new api call, we should set updated to Date.now()
    // so that updated + statleTime > Date.now() means it's still a valid cache.

    // cacheTime represents for LRU (least recently used), every time we call load, we should clear the timeout and set a newOne.
    constructor(staleTime, cacheTime) {
        this._staleTime = staleTime;
        this._cacheTime = cacheTime;
        this._cacheMap = {};
    }

    async load(key, callback) {
        const {callback: cachedCB, data, updated, timeoutID} = this._cacheMap[key] || {};

        // first clearTimeout if any
        clearTimeout(timeoutID);
         
        if (!this._cacheMap[key] || cachedCB?.toString() !== callback?.toString() || updated + this._staleTime <= Date.now()) {
            try {
                const response = await callback();
                this._cacheMap[key] = {
                    callback,
                    data: response,
                    updated: Date.now(),
                }
            } catch(err) {
                return err;
            }
        }

        this._cacheMap[key].timeoutID = setTimeout(() => {
            console.log('delete cache');
            delete this._cacheMap[key];
        }, this._cacheTime);

        return data;
    }
}

class FeatureFlag {
    constructor() {
        this._rules = {};
        this.url = 'https://63442eef242c1f347f80a9bc.mockapi.io/feature_flags';
        this.APICache = new APICache(2000, 5000);
    }

    checkUserWithId(idList, user) {
        const userList = new Set(idList);
        return userList.has(user);
    }

    checkPercentOfUsers(percent) {
        const randomPercent = Math.floor(Math.random() * 100 + 1);
        return randomPercent <= parseInt(percent, 10);
    }

    async fetchFeatureFlags() {
        try {
            const t0 = performance.now();
            console.time('apiCall');
            const response = await fetch(this.url);
            console.timeEnd('apiCall')
            const t1 = performance.now();
            // console.log(t1 - t0);
            if (!response.ok) {
                throw new TypeError(`${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid content type')
            }

            const data = await response.json();
            this.createRules(data);
            return data;
        } catch(err) {
            return err;
        }
    }

    async load() {
        return this.APICache.load('featureFlags', this.fetchFeatureFlags.bind(this));
    }

    createRules(data) {
        data.forEach(rule => {
            this._rules[rule.name] = rule;
        });
    }

    isFeatureEnabledForUser(featureName, user) {
        if (!Object.hasOwn(this._rules, featureName)) {
            return false;
        }


        const rule = this._rules[featureName];
        return this.checkStrategies(rule.strategies, user);
    }

    checkStrategies(strategies, user) {
        return strategies.every(strategy => {
            switch(strategy.name) {
                case 'default':
                    return true;
                case 'gradualRolloutUserId':
                    return this.checkPercentOfUsers(strategy.parameters.percentage);
                case 'userWithId':
                    return this.checkUserWithId(strategy.parameters.userIds.split(','), user);
            }
        });
    }

    getFeaturesForUser(user) {
        const result = [];

        for (const feature of Object.keys(this._rules)) {
            if (this.isFeatureEnabledForUser(feature, user)) {
                result.push(feature);
            }
        }

        return result;
    }
}

async function test() {
    const fl = new FeatureFlag();
    await fl.load();

    console.log(fl.getFeaturesForUser('6'));

    setTimeout(async () => {
        await fl.load();
        console.log(1500, fl.getFeaturesForUser('8'));
    }, 1500)

    setTimeout(async () => {
        await fl.load();
        console.log(7000, fl.getFeaturesForUser('1'));
    }, 7000)

    // setTimeout(async () => {
    //     await fl.load();
    //     console.log(6000, fl.getFeaturesForUser('8'));
    // }, 6000)

}

// test();

const cache = new LRUCache(3);
[1, 2, 3, 4, 5].forEach(v => cache.set(v, 'v:'+v));
cache.get(3);
cache.set(6, 'v:6');
console.log(cache);