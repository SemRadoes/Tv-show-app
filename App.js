
const baseURL = `https://api.tvmaze.com/shows`;
const createShowElements = (element, className, content) => {
    let para;
    if (content.slice(0,5) === "https"){
        para = document.createElement(element);
        para.src=`${content}`;
        para.classList.add(className);
    } else if(content.slice(0,5) === "image") {
        para = document.createElement(element);
        para.src=`${content}`;
        para.classList.add(className);
    }else {
        if(className === "genres"){
            let genres = "";
            para = document.createElement(element);
            para.classList.add(className);
            if(content.length){
                const genreArray = content.split(",");
                genreArray.forEach(element => {
                    genres += `| ${element} `;
                });
                para.innerHTML = genres;
            } else {
                para.innerHTML = "| no genres available";
            }
        } else {
            para = document.createElement(element);
            para.classList.add(className);
            let text;
            if(!content){
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
        location.href=`tv-show-info.html?id=${arg.id}`;
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
                return interface = {
                id: element.show.id,
                language: element.show.language,
                ...(element.show.name && {name: element.show.name}),
                ...(!element.show.name && {name: "no info available"}),
                ...(element.show.runtime && {runtime: element.show.runtime}),
                ...(!element.show.runtime && {runtime: "no info available"}),
                ...(element.show.genres && {genres: element.show.genres}),
                ...(element.show.image && {image: element.show.image.medium}),
                ...(!element.show.image && {image: "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg"}),
                ...(element.show.rating && {rating: element.show.rating.average}),
                ...(!element.show.rating && {rating: "-"}),
                ...(element.show.premiered && {premiered: element.show.premiered.slice(0,4)}),
                ...(!element.show.premiered && {premiered: "no info available"})
                };
        });
    } else {
        overview = await axios.get(baseURL);
        const res = overview.data;
        console.log(overview.data);
        list = res.map(element => {
            return interface = {
                id: element.id,
                language: element.language,
                ...(element.name && {name: element.name}),
                ...(!element.name && {name: "no info available"}),
                ...(element.runtime && {runtime: element.runtime}),
                ...(!element.runtime && {runtime: "no info available"}),
                ...(element.genres && {genres: element.genres}),
                ...(element.image && {image: element.image.medium}),
                ...(!element.image && {image: "images/depositphotos_227724992-stock-illustration-image-available-icon-flat-vector.jpg"}),
                ...(element.rating && {rating: element.rating.average}),
                ...(!element.rating && {rating: "-"}),
                ...(element.premiered && {premiered: element.premiered.slice(0,4)}),
                ...(!element.premiered && {premiered: "no info available"})
            };
        });
    }
    return list;
}
const shows = async () => {
    $("body").css("cursor", "wait");
    await showInterface();
    const tvShows = document.querySelector('#showlist');
    list.forEach(element => {
        showsWithFiltering(element, tvShows);
    });
    $("body").css("cursor", "default");
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
const returnToDefaultValue = (defaultvalue) => {
    if(defaultvalue === "letters"){
        document.querySelector('#starsDefault').selected = 'selected';
    } else {
        document.querySelector('#alphabetDefault').selected = 'selected';
    }
}
const filterShows = async () => {
    $("body").css("cursor", "wait");
    await showInterface();
    $('#showlist').empty();
    const genre = $('#genre').val();
    const rating = $('#rating').val();
    let starOrder = $('#sort-by-stars').val();
    let alphab = $('#sort-by-alphabet').val();
    const tvShows = document.querySelector('#showlist');
    let index = 0;
    if(starOrder !== "default"){
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
    $("body").css("cursor", "default");
}

const resetShows = async () => {
    $("body").css("cursor", "wait");
    await showInterface();
    $('#showlist').empty();
    const tvShows = document.querySelector('#showlist');
    for (let show of list){
            showsWithFiltering(show, tvShows);
    }
    $("body").css("cursor", "default");
}

const searchQuery = async() => {
    $("body").css("cursor", "wait");
    const input = $('#searchQuery').val();
    $('#showlist').empty();
    await showInterface(input);
    const tvShows = document.querySelector('#showlist');
    for (let show of list){
        showsWithFiltering(show, tvShows);
    }
    $("body").css("cursor", "default");
}

