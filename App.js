const baseURL = `https://api.tvmaze.com/shows`
const shows = async () => {
    const overview = await axios.get(baseURL);
    // console.log(overview.data);
    const res = overview.data;
    const list = res.map(element => {
        return showList ={
            name: element.name,
            genres: element.genres,
            language: element.language,
            duration: element.runtime,
            image: element.image.medium,
            summary: element.summary
        };
    });
    const createShowElements = (element, className, content) => {
        let para;
        if (content.slice(0,5) === "https"){
            para = document.createElement(element);
            para.src=`${content}`;
            para.classList.add(className);
        }else {
            para = document.createElement(element);
            para.classList.add(className);
            const text = document.createTextNode(content);
            para.appendChild(text);
        }
        
        return para;
    };
    const tvShows = document.querySelector('#showlist');
    list.forEach(element => {
        console.log(element);
        const show = document.createElement('div');
        console.log(show);
        show.classList.add('show');
        const name = createShowElements('div', 'name', `${element.name}`);
        const genres = createShowElements('div', 'genres', `${element.genres}`);
        const language = createShowElements('div', 'language', `${element.language}`);
        const duration = createShowElements('div', 'duration', `${element.duration}`);
        const image = createShowElements('img', 'showPoster', `${element.image}`);
        const summary = document.createElement('p');
        summary.innerHTML = element.summary;
        show.appendChild(image);
        show.appendChild(name);
        show.appendChild(genres);
        show.appendChild(language);
        show.appendChild(duration);
        show.appendChild(duration);
        show.appendChild(summary);
        tvShows.appendChild(show);
    });
    
}


