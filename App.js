
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
const shows = async () => {
    const overview = await axios.get(baseURL);
    console.log(overview.data);
    const res = overview.data;
    const list = res.map(element => {
        return showList ={
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
    const tvShows = document.querySelector('#showlist');
    list.forEach(element => {
        const show = document.createElement('div');
        show.classList.add('show');
        const name = createShowElements('div', 'name', `${element.name}`);
        const genres = createShowElements('div', 'genres', `${element.genres}`);
        const image = createShowElements('img', 'showPoster', `${element.image}`);
        const rating = createShowElements('div', 'rating', `${element.rating}`);
        const premiered = createShowElements('div', 'premiered', `${element.premiered}`);
        const nameRating = document.createElement('div');
        nameRating.classList.add('nameRating');
        nameRating.appendChild(name);
        nameRating.appendChild(rating);
        show.appendChild(image);
        show.appendChild(nameRating);
        show.appendChild(genres);
        show.appendChild(premiered);
        tvShows.appendChild(show);
        show.addEventListener("mouseover", () => {
            show.classList.add("movieScladeOnMouseOver");
        });
        show.addEventListener("click", () => {
            location.href=`/Tv Show Info.html?id=${element.id}`;
        });
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
    if(keyword === "language"){
        let languages = [];
        for( let showLanguage of res){
            if(!languages.includes(showLanguage.language)){
                languages.push(showLanguage.language);
            }
        }
        console.log(languages);
        const select = document.querySelector('#language');
        for ( let language of languages){
            const option = document.createElement('option');
            option.value = language;
            option.innerHTML = language;
            select.append(option);
        }
    };
}

const filterShows = async (keyword) => {
    const overview = await axios.get(baseURL);
    const res = overview.data;
    if(keyword === "genre"){
        if($('#genre').val() === "default"){
            const tvShows = document.querySelector('#showlist');
            $('#showlist').empty();
    const list = res.map(element => {
        return showList ={
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
    list.forEach(element => {
        const show = document.createElement('div');
        show.classList.add('show');
        const name = createShowElements('div', 'name', `${element.name}`);
        const genres = createShowElements('div', 'genres', `${element.genres}`);
        const image = createShowElements('img', 'showPoster', `${element.image}`);
        const rating = createShowElements('div', 'rating', `${element.rating}`);
        const premiered = createShowElements('div', 'premiered', `${element.premiered}`);
        const nameRating = document.createElement('div');
        nameRating.classList.add('nameRating');
        nameRating.appendChild(name);
        nameRating.appendChild(rating);
        show.appendChild(image);
        show.appendChild(nameRating);
        show.appendChild(genres);
        show.appendChild(premiered);
        tvShows.appendChild(show);
        show.addEventListener("mouseover", () => {
            show.classList.add("movieScladeOnMouseOver");
        });
        show.addEventListener("click", () => {
            location.href=`/Tv Show Info.html?id=${element.id}`;
        });
    });
        } else {
            const genre = $('#genre').val();
            console.log(genre);
            const tvShows = document.querySelector('#showlist');
            $('#showlist').empty();
            for (let show of res){
                if(show.genres.includes(genre)){
                    const filteredShow = document.createElement('div');
                    filteredShow.classList.add('show');
                    const name = createShowElements('div', 'name', `${show.name}`);
                    const genres = createShowElements('div', 'genres', `${show.genres}`);
                    const image = createShowElements('img', 'showPoster', `${show.image.medium}`);
                    const rating = createShowElements('div', 'rating', `${show.rating.average}`);
                    const premiered = createShowElements('div', 'premiered', `${show.premiered}`);
                    const nameRating = document.createElement('div');
                    nameRating.classList.add('nameRating');
                    nameRating.appendChild(name);
                    nameRating.appendChild(rating);
                    filteredShow.appendChild(image);
                    filteredShow.appendChild(nameRating);
                    filteredShow.appendChild(genres);
                    filteredShow.appendChild(premiered);
                    tvShows.appendChild(filteredShow);
                    filteredShow.addEventListener("mouseover", () => {
                        filteredShow.classList.add("movieScladeOnMouseOver");
                    });
                    filteredShow.addEventListener("click", () => {
                        location.href=`/Tv Show Info.html?id=${show.id}`;
                    });
                }
            }
        }
    };
    if(keyword === "language"){
        
    };
    if(keyword === "rating"){
        
    };
    
}

