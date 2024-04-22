
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
            para = document.createElement(element);
            para.classList.add(className);
            if(content.length !== 0){
                const genreArray = content.split(",");
                genreArray.forEach(element => {
                    genres += `| ${element} `;
                });
                para.innerHTML = genres;
            } else {
                para.innerHTML = genres += "| no info available";
            }
        } else {
            para = document.createElement(element);
            para.classList.add(className);
            let text;
            if(content === "null" || content === ""){
                text = document.createTextNode("-");
            } else {
                text = document.createTextNode(content);
            }
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
    $(filteredShow).hide().appendTo(element).fadeIn(1000);
    filteredShow.addEventListener("mouseover", () => {
        filteredShow.classList.add("movieScladeOnMouseOver");
    });
    filteredShow.addEventListener("click", () => {
        location.href=`/Tv Show Info.html?id=${arg.id}`;
    });
}
let list = [];
const showInterface = async(arg) => {
    let overview;
    if(arg){
        overview = await axios.get(`https://api.tvmaze.com/search/shows?q=${arg}`);
        const res = overview.data;
        console.log(overview.data);
        list = res.map(element => {
            if(element.show.image !== null || element.show.genres.length || element.show.runtime !== null || element.show.rating.average !== null || element.show.premiered !== null){
                return interface = {
                id: element.show.id,
                name: element.show.name,
                genres: element.show.genres,
                language: element.show.language,
                duration: element.show.runtime,
                image: element.show.image.medium,
                rating: element.show.rating.average,
                premiered: element.show.premiered.slice(0,4)
                };
            } else {
                return interface = {
                    id: element.show.id,
                    name: element.show.name,
                    genres: "unknown",
                    language: element.show.language,
                    duration: "unknown",
                    image: "unknown",
                    rating: "unknown",
                    premiered: "unknown"
                    };
            }
        });
    } else {
        overview = await axios.get(baseURL);
        const res = overview.data;
        console.log(overview.data);
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
    }
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
    let starOrder = $('#sort-by-stars').val();
    let alphab = $('#sort-by-alphabet').val();
    const tvShows = document.querySelector('#showlist');
    let index = 0;
    if(starOrder !== "default"){
        alphab = "default";
        document.querySelector('#alphabetDefault').selected = 'selected';
        switch(starOrder){
            case "ascending":
                list.sort((a, b) => a.rating - b.rating);
                break
            case "descending":
                list.sort((a, b) => b.rating - a.rating);
                break
            default:
                break
        }
    } else if(alphab !== "default"){
        starOrder = "default";
        document.querySelector('#starsDefault').selected = 'selected';
    switch(alphab){
        case "A-Z":
            list.sort((a, b) => {
                const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
              
                // names must be equal
                return 0;
              });
            break
        case "Z-A":
            list.sort((a, b) => {
                const nameA = a.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA > nameB) {
                  return -1;
                }
                if (nameA < nameB) {
                  return 1;
                }
              
                // names must be equal
                return 0;
              });
            break
        default:
            break
    }
}
    for (let show of list){
        if(show.genres.includes(genre) && show.rating >= rating){
            showsWithFiltering(show, tvShows);
            index++;
        } else if(show.rating >= rating && genre === "default"){
            showsWithFiltering(show, tvShows);
            index++;
        } else if(rating === "default" && show.genres.includes(genre)){
            showsWithFiltering(show, tvShows);
            index++;
        } else if(rating === "default" && genre === "default"){
            showsWithFiltering(show, tvShows);
            index++;
        }
    }
    if(index === 0){
        tvShows.innerHTML = "<h3 style='color: rgb(93, 116, 129);'>No search results</h3>";
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

const searchQuery = async() => {
    const input = $('#searchQuery').val();
    $('#showlist').empty();
    await showInterface(input);
    const tvShows = document.querySelector('#showlist');
    for (let show of list){
        showsWithFiltering(show, tvShows);
    }
}

