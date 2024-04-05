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
// const createEpisodeElements = (element, className, idName, content) => {
//     let para;
//     if (content.slice(0,5) === "https" || content === ""){
//         para = document.createElement(element);
//         para.src=`${content}`;
//         para.classList.add(className);
//     }else {
//         if(className === "genres"){
//             let genres = "";
//             const genreArray = content.split(",");
//             genreArray.forEach(element => {
//                 genres += `| ${element} `;
//             });
//             para = document.createElement(element);
//             para.classList.add(className);
//             para.innerHTML = genres;
//         } else {
//         para = document.createElement(element);
//         para.classList.add(className);
//         const text = document.createTextNode(content);
//         para.appendChild(text);
//         }
//     }
//     return para;
// };
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
let seasonEpisodes = [];

const showSeasons = async() => {
    const overview = await axios.get(`${baseURL}shows/${showID}/seasons`);
    const res = overview.data;
    console.log(res);
    fillInfo("#numofseasons", res.length);
    res.forEach((element) => {
        const table = document.querySelector('#table');
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        th.innerHTML = `${element.number}`;
        const image = document.createElement('img');
        image.src = element.image.medium;
        td1.appendChild(image);
        td3.innerHTML = formatDates(element.premiereDate, "-");
        if(element.summary === ""){
            td4.innerHTML = "no summary available";  
        } else {
            td4.innerHTML = element.summary;    
        }
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
        const name = `Season ${element.number}`;


        seasonInfo.push({
            id: element.number,
            apiSeasonId: element.id,
            aired: formatDates(element.premiereDate, "-"),
            summary: element.summary,
            image: element.image.medium
        });    
    });

}
console.log(seasonInfo);

const showEpisodes = async() =>{
    for ( let season of seasonInfo){
        const overview = await axios.get(`${baseURL}seasons/${season.apiSeasonId}/episodes`);
        const res = overview.data;
        seasonEpisodes.push({
            id: res.number,
            name: res.name,
            summary: res.summary
        })
    }
}





