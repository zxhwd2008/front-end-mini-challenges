(function () {
  // Inputs
  // inputs: An array of inputs.
  // limit: The maximum number of operations at any one time.
  // iterateeFn: The async function that should be called with each input to generate the corresponding output. It will have two arguments:
  //      input: The input being processed.
  //      callback: A function that will be called when the input is finished processing. It will be provided one argument, the processed output.
  // callback: A function that should be called with the array of outputs once all the inputs have been processed.

  function getNameById(id, callback) {
    // simulating async request
    const randomRequestTime = Math.floor(Math.random() * 100) + 200;

    setTimeout(() => {
      callback("User" + id)
    }, randomRequestTime);
  }
  
  function mapLimit(inputs, limit, iterateeFn, callback) {
    const result = [];
    let currLimit = 0;
    let index = 0;
    let count = 0;

    function iterateArr() {
      while (currLimit < limit && index < inputs.length && Object.hasOwn(inputs, index)) {
        iterateeFn(inputs[index], cb.bind(null, index));
        index++;
        currLimit++;
      }
    }

    function cb(resultIndex, data) {
      count++;
      result[resultIndex] = data;
      currLimit--;

      if (count < inputs.length) {
        iterateArr();
      } else {
        callback(result);
      }
    }

    iterateArr();
  }
  
  mapLimit([1,2,3,4,5], 2, getNameById, (allResults) => {
    console.log('output:', allResults) // ["User1", "User2", "User3", "User4", "User5"]
  })
})();