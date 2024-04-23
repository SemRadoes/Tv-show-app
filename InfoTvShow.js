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
            if(APIinfo.length !== 0){
                APIinfo.forEach(element => {
                    genres += `| ${element} `;
                });
                document.querySelector(`${element}`).innerHTML = genres;
            } else {
                document.querySelector(`${element}`).innerHTML = "| no info available";
            }
        } else {
            document.querySelector(`${element}`).innerHTML = `${APIinfo}`;
        }
    }
}

const createTable
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
    const table = document.querySelector('#seasontable');
    for (let element of res){
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');
        if(element.number === null){
            th.innerHTML = ``;
        } else {
            th.innerHTML = `${element.number}`;
        }
        const image = document.createElement('img');
        if(element.image === null){
            image.src = "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg";
            image.style.height = "295px";
            image.style.width = "210px";
        } else {
            image.src = element.image.medium;
        }
        td1.appendChild(image);
        if(element.premiereDate !== null){
            td2.innerHTML = formatDates(element.premiereDate, "-");
        }else{
            td2.innerHTML = `<p>no date available</p>`
        }
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
        // table.appendChild(tr);
        $(tr).hide().appendTo(table).fadeIn(1000);
    }
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
    $('#episodetable').fadeIn(1000);
    $('#seasontable').hide();
    $('.goBack').show();
}

const showCrew = async () => {
    const overview = await axios.get(`${baseURL}shows/${showID}/crew`);
    const crew = overview.data;
    const names = [];
    let index = 0;
    for (let crewMember of crew){
        if(names.includes(crewMember.person.name)){
            const existingWrapper = document.querySelector(`#crew-function${index - 1}`);
            existingWrapper.innerHTML += `<br>| ${crewMember.type}`;
        } else {
            const crewWrapper = document.querySelector('#crewtab');
            const crewMamberWrapper = document.createElement('div');
            crewMamberWrapper.setAttribute('id', `crew-wrapper${index}`);
            crewMamberWrapper.classList.add(`crew-wrapper`);
            const  crewImage = document.createElement('img');
            const  crewName = document.createElement('p');
            const  crewFunction = document.createElement('p');
            if(crewMember.person.image === null){
                crewImage.src = "images/noimageavailable.gif";
                crewImage.style.height = "382px";
                crewImage.style.width = "272px";
                crewImage.style.borderRadius = "10px";
            } else {
                crewImage.src = crewMember.person.image.medium;
                crewImage.style.height = "382px";
                crewImage.style.width = "272px";
                crewImage.style.borderRadius = "10px";
            }
            crewName.innerHTML = crewMember.person.name;
            crewFunction.innerHTML = `| ${crewMember.type}`;
            crewImage.setAttribute('id', `crew-image${index}`);
            crewImage.classList.add(`crew-image`);
            crewName.setAttribute('id', `crew-name${index}`);
            crewName.classList.add(`crew-name`);
            crewFunction.setAttribute('id',`crew-function${index}`);
            crewFunction.classList.add(`crew-function`);
            crewMamberWrapper.appendChild(crewImage);
            crewMamberWrapper.appendChild(crewName);
            crewMamberWrapper.appendChild(crewFunction);
            crewWrapper.appendChild(crewMamberWrapper);
            names.push(crewMember.person.name);
            index++;
        }
    }
}
const showCast = async () => {
    const overview = await axios.get(`${baseURL}shows/${showID}/cast`);
    const cast = overview.data;
    let index = 0;
    for (let castMember of cast){
        console.log(castMember);
        const castTab = document.querySelector('#casttab');
        const characterWrapper = document.createElement('div');
        characterWrapper.setAttribute('id', `character-wrapper${index}`);
        characterWrapper.classList.add(`character-wrapper`);
        const  characterImage = document.createElement('img');
        const  characterName = document.createElement('p');
        if(castMember.character.image === null){
            characterImage.src = "images/noimageavailable.gif";
            characterImage.style.height = "382px";
            characterImage.style.width = "272px";
            characterImage.style.borderRadius = "10px";
        } else {
            characterImage.src = castMember.character.image.medium;
            characterImage.style.height = "382px";
            characterImage.style.width = "272px";
            characterImage.style.borderRadius = "10px";
        }
        characterName.innerHTML = `<strong>${castMember.person.name}</strong> <br> as  <br><strong>${castMember.character.name}</strong>`;
        characterImage.setAttribute('id', `character-image${index}`);
        characterImage.classList.add(`character-image`);
        characterName.setAttribute('id', `character-name${index}`);
        characterName.classList.add(`character-name`);
        characterWrapper.appendChild(characterImage);
        characterWrapper.appendChild(characterName);
        castTab.appendChild(characterWrapper);
        index++;
    }
};





