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


const showOfID = async () => {
    const overview = await axios.get(`${baseURL}shows/${showID}`);
    const res = overview.data;
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
    fillInfo("#numofseasons", res.length);
    const table = document.querySelector('#seasontable');
    for (let element of res){
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        if(element.number === null){
            th.innerHTML = `-`;
        } else {
            th.innerHTML = `${element.number}`;
        }
        const image = document.createElement('img');
        if(element.image === null){
            image.src = "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg";
                image.style.height = "295px";
                image.style.width = "210px";
        }else{
                image.src = element.image.medium;
                image.style.height = "295px";
                image.style.width = "210px";
            }
        td1.appendChild(image);
            const episodesbutton = document.createElement('BUTTON');
            episodesbutton.classList.add('btn');
            episodesbutton.classList.add('btn-light');
            episodesbutton.setAttribute('id', `season${element.number}`);
            episodesbutton.innerHTML = `Season ${element.number} episodes`;
            episodesbutton.addEventListener('click', function(){
                showEpisodes(element.id);
            });
            td2.appendChild(episodesbutton);
        if(element.summary === "" || element.summary === null){
            td4.innerHTML = `<p>no summary available</p>`;  
        } else {
            td4.innerHTML = element.summary;  
        }  
        if(element.premiereDate !== null){
            td3.innerHTML = formatDates(element.premiereDate, "-");
        }else{
            td3.innerHTML = `<p>no date available</p>`
        }
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
    $(table).hide();
    $(table).fadeIn(1000);
}

const showEpisodes = async(id) =>{
    const overview = await axios.get(`${baseURL}seasons/${id}/episodes`);
    const res = overview.data;
    const table = document.querySelector('#episodetable');
    let tr = document.createElement('tr');
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    let th3 = document.createElement('th');
    let th4 = document.createElement('th');
    let th5 = document.createElement('th');
    th1.innerHTML = "ID";
    th2.innerHTML = "IMAGE";
    th3.innerHTML = "NAME";
    th4.innerHTML = "AIRED";
    th5.innerHTML = "SUMMARY";
    tr.append(th1, th2, th3, th4, th5);
    table.appendChild(tr);
    for (let element of res){
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        if(element.number === null){
            th.innerHTML = `-`;
        } else {
            th.innerHTML = `${element.number}`;
        }
        const image = document.createElement('img');
        if(element.image === null){
            image.src = "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg";
                image.style.height = "140px";
                image.style.width = "240px";
        }else{
                image.src = element.image.medium;
                image.style.height = "140px";
                image.style.width = "240px";
            }
        td1.appendChild(image);
        if(element.name === "" || element.name === null){
            td2.innerHTML = `<p>no summary available</p>`;  
        } else {
            td2.innerHTML = element.name;  
        }  
        if(element.airdate !== null){
            td3.innerHTML = formatDates(element.airdate, "-");
        }else{
            td3.innerHTML = `<p>no date available</p>`
        }
        if(element.summary === "" || element.summary === null){
            td4.innerHTML = `<p>no summary available</p>`;  
        } else {
            td4.innerHTML = element.summary;  
        }  
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);
    }
    $(table).hide();
    $('#seasontable').hide();
    $('#episodetable').fadeIn(1000);
    $('.goBack').show();
}

const showCrew = async () => {
    const overview = await axios.get(`${baseURL}shows/${showID}/crew`);
    const crew = overview.data;
    const names = [];
    let index = 0;
    const crewWrapper = document.querySelector('#crewtab');
    if(crew.length === 0){
        crewWrapper.innerHTML = "<p style='color: #5D7481; font-size: 20px;'>we couldn't find any data</p>";
    } else {
    for (let crewMember of crew){
        if(names.includes(crewMember.person.name)){
            const existingWrapper = document.querySelector(`#crew-function${index - 1}`);
            existingWrapper.innerHTML += `<br>| ${crewMember.type}`;
        } else {
            const crewMamberWrapper = document.createElement('div');
            crewMamberWrapper.setAttribute('id', `crew-wrapper${index}`);
            crewMamberWrapper.classList.add(`crew-wrapper`);
            const  crewImage = document.createElement('img');
            const  crewName = document.createElement('p');
            const  crewFunction = document.createElement('p');
            if(crewMember.person.image === null){
                crewImage.src = "images/noimageavailable.gif";
            } else {
                crewImage.src = crewMember.person.image.medium;
            }
            crewImage.style.height = "382px";
            crewImage.style.width = "272px";
            crewImage.style.borderRadius = "10px";
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
}
const showCast = async () => {
    const overview = await axios.get(`${baseURL}shows/${showID}/cast`);
    const cast = overview.data;
    let index = 0;
    const castTab = document.querySelector('#casttab');
    if(cast.length === 0){
        castTab.innerHTML = "<p style='color: #5D7481; font-size: 20px;'>we couldn't find any data</p>";
    } else {
    for (let castMember of cast){
        const characterWrapper = document.createElement('div');
        characterWrapper.setAttribute('id', `character-wrapper${index}`);
        characterWrapper.classList.add(`character-wrapper`);
        const  characterImage = document.createElement('img');
        const  characterName = document.createElement('p');
        if(castMember.character.image === null){
            characterImage.src = "images/noimageavailable.gif";
        } else {
            characterImage.src = castMember.character.image.medium;
        }
        characterImage.style.height = "382px";
        characterImage.style.width = "272px";
        characterImage.style.borderRadius = "10px";
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
}
};





