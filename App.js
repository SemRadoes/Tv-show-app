
const baseURL = `https://api.tvmaze.com/shows`;
const createShowElements = (element, className, content) => {
    let para;
    if (content.slice(0,5) === "https"){
        para = document.createElement(element);
        para.src=`${content}`;
        para.classList.add(className);
    }else {
        if(className === "genres"){
            let genres = "";
            const genreArray = content.split(",");
            genreArray.forEach(element => {
                genres += `| ${element} `;
            });
            para = document.createElement(element);
            para.classList.add(className);
            para.innerHTML = genres;
        } else {
        para = document.createElement(element);
        para.classList.add(className);
        const text = document.createTextNode(content);
        para.appendChild(text);
        }
    }
    return para;
};
const showsWithFiltering = (arg, element) => {
    const filteredShow = document.createElement('div');
    filteredShow.classList.add('show');
    const name = createShowElements('div', 'name', `${arg.name}`);
    const genres = createShowElements('div', 'genres', `${arg.genres}`);
    const image = createShowElements('img', 'showPoster', `${arg.image}`);
    const rating = createShowElements('div', 'rating', `${arg.rating}`);
    const premiered = createShowElements('div', 'premiered', `${arg.premiered}`);
    const nameRating = document.createElement('div');
    nameRating.classList.add('nameRating');
    nameRating.appendChild(name);
    nameRating.appendChild(rating);
    filteredShow.appendChild(image);
    filteredShow.appendChild(nameRating);
    filteredShow.appendChild(genres);
    filteredShow.appendChild(premiered);
    element.appendChild(filteredShow);
    filteredShow.addEventListener("mouseover", () => {
        filteredShow.classList.add("movieScladeOnMouseOver");
    });
    filteredShow.addEventListener("click", () => {
        location.href=`/Tv Show Info.html?id=${arg.id}`;
    });
}
let list = [];
const showInterface = async() => {
    const overview = await axios.get(baseURL);
    console.log(overview.data);
    const res = overview.data;
    list = res.map(element => {
        return interface = {
            id: element.id,
            name: element.name,
            genres: element.genres,
            language: element.language,
            duration: element.runtime,
            image: element.image.medium,
            rating: element.rating.average,
            premiered: element.premiered.slice(0,4),
        };
    });
    console.log(list);
    return list;
}
const shows = async () => {
    await showInterface();
    const tvShows = document.querySelector('#showlist');
    list.forEach(element => {
        showsWithFiltering(element, tvShows);
    });
}

const createDropdowns = async (keyword) => {
    const overview = await axios.get(baseURL);
    const res = overview.data;
    if(keyword === "genre"){
        let genresOfShow = [];
        for (let show of res){
            for( let showGenre of show.genres){
                if(!genresOfShow.includes(showGenre)){
                    genresOfShow.push(showGenre);
                }
            }
        }
        const select = document.querySelector('#genre');
        for ( let genre of genresOfShow){
            const option = document.createElement('option');
            option.value = genre;
            option.innerHTML = genre;
            select.append(option);
        }
    }; 
}

const filterShows = async () => {
    await showInterface();
    $('#showlist').empty();
    const genre = $('#genre').val();
    const rating = $('#rating').val();
    const tvShows = document.querySelector('#showlist');
    for (let show of list){
        if(show.genres.includes(genre) && show.rating >= rating){
            showsWithFiltering(show, tvShows);
        } else if(show.rating >= rating && genre === "default"){
            showsWithFiltering(show, tvShows);
        } else if(rating === "default" && show.genres.includes(genre)){
            showsWithFiltering(show, tvShows);
        }
    }
}

const resetShows = async () => {
    await showInterface();
    $('#showlist').empty();
    const tvShows = document.querySelector('#showlist');
    for (let show of list){
            showsWithFiltering(show, tvShows);
    }
}
