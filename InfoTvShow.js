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

const showSeasons = async() => {
    const overview = await axios.get(`${baseURL}shows/${showID}/seasons`);
    const res = overview.data;
    console.log(res);
    fillInfo("#numofseasons", res.length);
    res.forEach((element) => {
        const table = document.querySelector('#seasontable');
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        th.innerHTML = `${element.number}`;
        const image = document.createElement('img');
        if(element.image === null){
            image.src = "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg";
        } else {
            image.src = element.image.medium;
        }
        td1.appendChild(image);
        td2.innerHTML = formatDates(element.premiereDate, "-");
        if(element.summary === "" || element.summary === null){
            td3.innerHTML = `<p>no summary available</p>`;  
        } else {
            td3.innerHTML = element.summary;    
        }

        const episodesbutton = document.createElement('BUTTON');
        episodesbutton.classList.add('btn');
        episodesbutton.classList.add('btn-light');
        episodesbutton.setAttribute('id', `season${element.number}`);
        episodesbutton.innerHTML = `Season ${element.number} episodes`;
        episodesbutton.addEventListener('click', async function(){
            showEpisodes(element.id);
        });

        td4.appendChild(episodesbutton);
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
    )
}

const showEpisodes = async(id) =>{
    
    const overview = await axios.get(`${baseURL}seasons/${id}/episodes`);
    const res = overview.data;
    const table = document.querySelector('#episodetable');
    for (let episode of res){
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        if(episode.number === null){
            th.innerHTML = ``;
        } else {
            th.innerHTML = `${episode.number}`;
        }
        const image = document.createElement('img');
        if(episode.image === null){
            image.src = "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg";
            image.style.height = "140px";
            image.style.width = "250px";
        } else {
            image.src = episode.image.medium;
        }
    
        td1.appendChild(image);
        td2.innerHTML = formatDates(episode.airdate,"-");
        td4.innerHTML = episode.name;
        if(episode.summary === "" || episode.summary === null){
            td3.innerHTML = `<p>no summary available</p>`;  
        } else {
            td3.innerHTML = episode.summary;    
        }

        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td4);
        tr.appendChild(td2);
        tr.appendChild(td3);
        table.appendChild(tr);
    }
    $('#episodetable').show();
    $('#seasontable').hide();
    $('.goBack').show();
}

const showPosters = async () => {
    const overview = await axios.get(`${baseURL}shows/${showID}/images`);
    const res = overview.data;
    for (posters of res){
        console.log(posters);
        const image = document.createElement('img');
        image.src = posters.resolutions.medium;
        const posterTab = document.querySelector('#postertab');
        posterTab.appendChild(image);
    }
    
};





