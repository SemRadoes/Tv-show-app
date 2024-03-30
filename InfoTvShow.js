const searchParams = new URLSearchParams(window.location.search);
const showID = searchParams.get('id');
const baseURL = `https://api.tvmaze.com/shows/`;
const fillInfo = (element, APIinfo) => {
    if(element === "#showimage"){
        const image = document.querySelector(`${element}`).src = `${APIinfo}`;

    } else {
        if(element === "#aired"){
            const splitted = APIinfo.split("-");
            const aired = `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
            document.querySelector(`${element}`).innerHTML = aired;
        } else if(element === "#showgenres"){
            let genres = "";
            APIinfo.forEach(element => {
                genres += `| ${element} `;
            });
            document.querySelector(`${element}`).innerHTML = genres;
        } else {
            document.querySelector(`${element}`).innerHTML = `${APIinfo}`;
        }
    }
}
const showOfID = async () => {
    const overview = await axios.get(`${baseURL}${showID}`);
    const res = overview.data;
    console.log(res);
    fillInfo("title", res.name );
    fillInfo("#showimage", res.image.original );
    fillInfo("#showname", res.name );
    fillInfo("#showgenres", res.genres );
    fillInfo("#showstars", res.rating.average );
    fillInfo("#aired", res.premiered );
    fillInfo("#showdescription", res.summary );
    
};

const showSeasons = async() => {
    const overview = await axios.get(`${baseURL}${showID}/seasons`);
    const res = overview.data;
    console.log(res);
    fillInfo("#numofseasons", res.length );
}