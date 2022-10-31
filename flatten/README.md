// getBatch(index)
// The function makes a request call to the backend to fetch the data.
// It returns a promise which can be resolved to the same JSON structure as Part 1.
// Mock implementation
const getBatch = (index) => {
    return new Promise((resolve, reject) => {
        if (index === 1) {
            resolve([
                {
                    value: 'value0',
                    children: []
                }
            ]);
        } else if (index === 2) {
            resolve([
                {
                    value: 'value1',
                    children: [
                        {
                            value: 'value2',
                            children: [
                                {
                                    value: 'value3',
                                    children: []   
                                }
                            ]
                        },
                        {
                            value: 'value4',
                            children: []
                        }
                    ]
  ‍‍‍‌‍‍‌‌‌‌‍‌‍‌‍‍‍‌‍‌              },
                {
                    value: 'value5',
                    children: [],
                }
            ]);
        } else if (index === 3) {
            resolve([
                {
                    value: 'value6',
                    children: []
                }
            ]);
        }
    });
};
// Task: Implement getValueList(fromIndex, toIndex) such that it combines successive calls
// to getBatch(index) to produce a Promise containing the result shown below:
const getValueList = (fromIndex, toIndex) => {
    // Code here
};
getValueList(1, 3).then(result => console.log(result));
const expected = [
    { value: 'value0' },
    { value: 'value1' },
    { value: 'value2' },
    { value: 'value3' },
    { value: 'value4' },
    { value: 'value5' },
    { value: 'value6' }
];
