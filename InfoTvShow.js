const searchParams = new URLSearchParams(window.location.search);
const showID = searchParams.get('id');
const baseURL = `https://api.tvmaze.com/`;
const formatDates = (APIinfo, splitter) =>{
    const splitted = APIinfo.split(splitter);
    return `${splitted[2]}/${splitted[1]}/${splitted[0]}`;
}
const fillInfo = (element, APIinfo) => {
    if(element === "#showimage"){
        document.querySelector(`${element}`).src = `${APIinfo}`;

    } else {
        if(element === "#aired"){
            document.querySelector(`${element}`).innerHTML = formatDates(APIinfo,"-");
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
    const overview = await axios.get(`${baseURL}shows/${showID}`);
    const res = overview.data;
    console.log(res);
    fillInfo("title", res.name );
    fillInfo("#showimage", res.image.original );
    fillInfo("#showname", res.name );
    fillInfo("#showgenres", res.genres );
    fillInfo("#showstars", res.rating.average );
    fillInfo("#country", res.network.country.name );
    fillInfo("#aired", res.premiered );
    fillInfo("#showdescription", res.summary );
    
};

let seasonInfo = [];
const showEpisodes = async(id) =>{
        const overview = await axios.get(`${baseURL}shows/${id}/episodes`);
        const res = overview.data;
        console.log(res);
}
const showNumOfSeasons = async() => {
    const overview = await axios.get(`${baseURL}shows/${showID}/seasons`);
    const res = overview.data;
    console.log(res);
    fillInfo("#numofseasons", res.length);
    res.forEach((element) => {
        seasonInfo.push({
            id: element.number,
            apiSeasonId: element.id,
            aired: formatDates(element.premiereDate, "-"),
            summary: element.summary,
            image: element.image.medium
        });
        showEpisodes(element.id);
    });
    console.log(seasonInfo);
}




