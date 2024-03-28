const searchParams = new URLSearchParams(window.location.search);
const showID = searchParams.get('id');
const baseURL = `https://api.tvmaze.com/shows/`;
const showOfID = async () => {
    const overview = await axios.get(`${baseURL}${showID}`);
    const res = overview.data;
    console.log(res);
    document.querySelector('title').innerHTML = `${res.name}`;
    
};

