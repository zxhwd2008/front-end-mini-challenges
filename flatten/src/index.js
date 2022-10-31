// clarify these questions
// 1. only has array & object besides primitives values? Set & Map?
// 2. is there always a children with empty array if children is empty?

function flatten(arr) {
  const result = [];

  for (const item of arr) {
    result.push({
      value: item.value,
    });

    result.push(...flatten(item.children));
  }

  return result;
}

const example = [{
    value: 'value1',
    children: [{
        value: 'value200',
        children: [{
          value: 'value3',
          children: [],
        }],
      },
      {
      value: 'value4',
      children: []
      }]},
    {
      value: 'value5',
      children: [],
    }];

const getBatch = (index) => {     
  return new Promise((resolve, reject) => {         
    if (index === 1) { 
      setTimeout(() => {
        resolve([                 
          {                     
            value: 'value0',                     
            children: []                 
          }]); 
      }, 1000)                    
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
          },                 
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


  // clarify questions
  // error handling if fromIndex & toIndex are invalid?
  // probably need to extend the getBatch?
  // fromIndex > toIndex?
  const getValueList = async (fromIndex, toIndex) => {
    if (fromIndex > toIndex) {
      throw new TypeError('toIndex must be larger than fromIndex');
    }

    const result = [];

    for (let i = fromIndex; i <= toIndex; i++) {
      // result.push(getBatch(i));

      try {
        const response = await getBatch(i);
        result.push(...flatten(response));
      } catch(err) {
        return err;
      }
    }

    return result;

    // return Promise.all(result)
    // .then(data => {
    //   const result = [];

    //   for (const arr of data) {
    //     result.push(...flatten(arr));
    //   }

    //   return result;
    // })
    // .catch(err => err);
  };

  getValueList(1, 2).then(data => console.log(data)).catch(err => console.log(err));