exports.get = async function convertDate(data) {
      try{
        var date = await data.substr(0,data.lastIndexOf("T")).split("-");
        var result = await date[1]+"/"+date[2]+"/"+date[0];
        return result;
    }catch(error){return(error)}
}
