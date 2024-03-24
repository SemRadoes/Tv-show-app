const searchParams = new URLSearchParams(window.location.search);
const showID = searchParams.get('id');
alert(showID);
const baseURL = `https://api.tvmaze.com/shows/`;
const showOfID = async () =>{
    const overview = await axios.get(`${baseURL}${showID}`);
    const res = overview.data;
    console.log(res);
}
showOfID();