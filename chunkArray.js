exports.chunk = function chunkArray(arr, chunkSize){
  var index = 0;
  var tempArray = [];

  for (index = 0; index < arr.length; index += chunkSize){
    chunked = arr.slice(index, index+chunkSize)
    tempArray.push(chunked);
  }
  return tempArray;
}
