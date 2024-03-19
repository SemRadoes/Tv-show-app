const baseURL = `https://api.tvmaze.com/shows`
const shows = async () => {
    const overview = await axios.get(baseURL);
    // console.log(overview.data);
    const res = overview.data;
    const list = res.map(element => {
        const name =  element.name
        const genres =  element.genres
        const language =  element.language
        const duration =  element.runtime
        const image =  element.image.medium
        const summary =  element.summary
        const showList ={
            name: name,
            genres: genres,
            language: language,
            duration: duration,
            image: image,
            summary: summary
        };
        return showList;
    });
    const createShowElements = (element, className, textNode, image, summary) => {
        const para = document.createElement(element);
        para.classList.add(className);
        const text = document.createTextNode(textNode);
        para.appendChild(text);
        return para;
    };
    const tvShows = document.querySelector('#showlist');
    list.forEach(element => {
        console.log(element);
        const name = createShowElements('div', 'name', `${element.name}`);
        const genres = createShowElements('div', 'genres', `${element.genres}`);
        const language = createShowElements('div', 'language', `${element.language}`);
        const duration = createShowElements('div', 'duration', `${element.duration}`);
        tvShows.appendChild(name);
        tvShows.appendChild(genres);
        tvShows.appendChild(language);
        tvShows.appendChild(duration);
        return tvShows;
    });
}


