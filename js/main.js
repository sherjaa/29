var $ = function(el){
    return document.querySelector(el);
}
var $$ = function(els){
    return document.querySelectorAll(els);
}

var elMoviesForm = $('.movies-form');
var elMovieNameInput = $('.movies-name');
var elMovieYearInput = $('.movies-year');
var elMovieSelect = $('#category');
var elMovies = $('.movies');
var elMovieTemplate = $('.movie-template').content;

var number = 1;

var movies = movies.map(function(movie){
    return {
        name: movie.Title,
        year: movie.movie_year,
        rating: movie.imdb_rating,
        link: movie.ytid,
        categories: movie.Categories.split('|'),
        number: number++,
        info: movie.summary
    }
});

var movieCategories = [];

movies.forEach(function(movie){
    movie.categories.forEach(function(category){
        if(movieCategories.indexOf(category) === -1){
            movieCategories.push(category);
        }
    })
});

movieCategories.forEach(function(category){
    var categoryOption = document.createElement('option');
    categoryOption.textContent = category;
    categoryOption.value = category.toLowerCase();
    elMovieSelect.appendChild(categoryOption);
})

var printMovies = function(movies){
    elMovies.innerHTML = '';
    var moviesFragment = document.createDocumentFragment();

    movies.forEach(function(movie){
        var movieTemplateClone = elMovieTemplate.cloneNode(true);
        movieTemplateClone.querySelector('.movie__number').textContent = movie.number;
        movieTemplateClone.querySelector('.movie__title').textContent = movie.name;
        movieTemplateClone.querySelector('.movie__rating').textContent = movie.rating;
        movieTemplateClone.querySelector('.movie__year').textContent = movie.year;
        movieTemplateClone.querySelector('.movie__info').dataset.id = movie.number - 1;

        movie.categories.forEach(function(category){
            var categoryItem = document.createElement('li');
            categoryItem.textContent = category;
            movieTemplateClone.querySelector('.movie__categories').appendChild(categoryItem);
        });
    
        movieTemplateClone.querySelector('.movie__trailer').href += movie.link;

        moviesFragment.appendChild(movieTemplateClone);
    });

    elMovies.appendChild(moviesFragment);
}

printMovies(movies.slice(0, 1000));

var reworkInput = function(){
    elMovieNameInput.value = '';
    elMovieYearInput.value = '';
    elMovieNameInput.focus();
}

elMoviesForm.addEventListener('submit', function(e){
    e.preventDefault();

    if(elMovieNameInput.value.trim() === '' && elMovieYearInput.value.trim() === ''){
        alert('Nomni ham, yilni ham kiriting!');
        elMovieNameInput.value = '';
        elMovieYearInput.value = '';
        elMovieNameInput.focus();
        return;
    }

    var searchedMovies = [];

    if(elMovieNameInput.value.trim() !== '' && elMovieYearInput.value.trim() === ''){
        var movieNameKey = new RegExp(elMovieNameInput.value, 'gi');
        
        reworkInput();

        searchedMovies = movies.filter(function(movie){
            return movie.name.toString().match(movieNameKey);
        });
    } else if(elMovieNameInput.value.trim() === '' && elMovieYearInput.value.trim() !== ''){
        var movieYearKey = parseInt(elMovieYearInput.value, 10); 

        reworkInput();

        searchedMovies = movies.filter(function(movie){
            return movie.year === movieYearKey;
        });
    } else {
        var movieNameKey = new RegExp(elMovieNameInput.value, 'gi');
        var movieYearKey = parseInt(elMovieYearInput.value, 10);
        
        reworkInput();

        searchedMovies = movies.filter(function(movie){
            return (movie.name.toString().match(movieNameKey) && movie.year === movieYearKey);
        });
    }

    console.log(searchedMovies.length);

    if(searchedMovies.length === 0){
        var moviesInfoText = document.createElement('p');
        moviesInfoText.classList.add('info');
        moviesInfoText.textContent = 'No movies found! 😐';
        elMovies.textContent = '';
        elMovies.appendChild(moviesInfoText);
    } else {
        printMovies(searchedMovies);
    }
});

var elModalButtons = $$('.movie__info');
// ! modal
var elModalOpen = $('#open');
var elModal = $('.modal');
var elModalClose = $('.modal-close');

elMovies.addEventListener('click', function(e){
    if(e.target.className !== 'movie__info'){
        return;
    }
    var buttonId = e.target.dataset.id;
    elModal.querySelector('.modal-title').textContent = movies[buttonId].name;
    elModal.querySelector('.modal-content').textContent = movies[buttonId].info;
    elModal.classList.add('modal--open');
});
elModalClose.addEventListener('click', function(){
    elModal.classList.remove('modal--open');
});
document.addEventListener('keyup', function(e) {
    if(e.keyCode !== 27){
        return;
    } else {
        elModal.classList.remove('modal--open');
    }
});
elModal.addEventListener('click', function (e) {
    if(!e.target.classList.contains('modal')){
        return;
    } else {
        elModal.classList.remove('modal--open');
    }
});