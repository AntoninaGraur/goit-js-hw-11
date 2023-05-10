






// const form = document.querySelector('#search-form');
// const gallery = document.querySelector('.gallery');
// const API_KEY = '36223855-9729aa23392660264fa235b58';

// class PixabayhAPI {
//     #BASE_URL = "https://pixabay.com/api/";
//     #API_KEY = "36223855-9729aa23392660264fa235b58";

//     #page;
//     #searchQuery;


//     #searchParams = new URLSearchParams({
//         q: "searchQuery",
//         image_type: "photo",
//         orientation: "horizontal",
//         safesearch: "true",
//     });


//     constructor() {
//         this.#page = 1;
//         this.#searchQuery = "";
//     }


//     getImages() {

//     }
// }


// 
// import Notiflix from 'notiflix';
// import axios from 'axios';


// const form = document.querySelector('#search-form');
// const input = form.querySelector('input');

// async function searchImages(query) {
//   try {
//     const response = await axios.get('https://pixabay.com/api/', {
//       params: {
//         key: '36223855-9729aa23392660264fa235b58',
//         q: query,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//       },
//     });
    
//     const images = response.data.hits;
    
//     if (images.length === 0) {
//       throw new Error('No images found');
//     }
    
//     return images;
//   } catch (error) {
//     throw error;
//   }
// }
// form.addEventListener('submit', async (event) => {
//   event.preventDefault();
  
//   try {
//     const query = input.value.trim();
    
//     if (!query) {
//       throw new Error('Enter a search term');
//     }
    
//     const images = await searchImages(query);
//     const gallery = document.querySelector('.gallery');
//     gallery.innerHTML = '';
    
//     // create new search results
//     // ...
    
//   } catch (error) {
//     Notiflix.Notify.failure(error.message);
//   }
// });

// JavaScript
// import axios from 'axios';
// import Notiflix from 'notiflix';

// const API_KEY = '36223855-9729aa23392660264fa235b58';
// const BASE_URL = 'https://pixabay.com/api/?';

// const form = document.querySelector('#search-form');
// const gallery = document.querySelector('.gallery');

// form.addEventListener('submit', handleFormSubmit);

// async function handleFormSubmit(event) {
//   event.preventDefault();
  
//   const searchQuery = event.currentTarget.elements.searchQuery.value;
  
//   if (searchQuery.trim() === '') {
//     Notiflix.Notify.warning('Please enter a search query.');
//     return;
//   }
  
//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         key: API_KEY,
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//       },
//     });
    
//     const hits = response.data.hits;
    
//     if (hits.length === 0) {
//        return Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
     
//     }
    
//   } catch (error) {
//     return Notiflix.Notify.failure('Oops, something went wrong. Please try again later.');
//   }
// };
// // gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(hits));

// function createGalleryMarkup(hits) {
//     return hits
//         .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
//             ` <div class="card-menu">
//         <img src="${data.webformatURL}"alt="${data.tags}"loading ="lazy"/>
//         <div class="info-menu">
//           <p class="info-item">
//             <b>${data.likes}</b>
//           </p>
//            <p class="info-item">
//             <b>${data.views}</b>
//           </p>
//            <p class="info-item">
//             <b>${data.comments}</b>
//           </p>
//            <p class="info-item">
//             <b>${data.downloads}</b>
//           </p>
//         </div>
//         </div>`)
//         .join('');
// };
import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '36223855-9729aa23392660264fa235b58';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 10;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
let currentTotalHits = 0;

form.addEventListener('submit', handleFormSubmit);


async function handleFormSubmit(event) {
  event.preventDefault();

  searchQuery = event.currentTarget.elements.searchQuery.value;

  if (searchQuery.trim() === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: PER_PAGE,
        page: page,
      },
    });

    const hits = response.data.hits;
    const totalHits = response.data.totalHits;

    if (hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      resetPage();
      return;
    }

    currentTotalHits = totalHits;

    gallery.innerHTML = '';
    createGalleryMarkup(hits);

    if (hits.length < PER_PAGE) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }

  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong. Please try again later.');
  }
};


async function handleLoadMoreBtnClick() {
  page++;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: PER_PAGE,
        page: page,
      },
    });

    const hits = response.data.hits;

    createGalleryMarkup(hits);

    if (gallery.children.length >= currentTotalHits) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong. Please try again later.');
  }
}
loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

function createGalleryMarkup(hits) {
  const markup = hits
    .map(({ webformatURL, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
                <img class="photo-img " src="${webformatURL}" alt="" loading="lazy" />
                <div class="info">
                  <p class="info-item"><b>Likes:</b> ${likes}</p>
                  <p class="info-item"><b>Views:</b> ${views}</p>
                  <p class="info-item"><b>Comments:</b> ${comments}</p>
                  <p class="info-item"><b>Downloads:</b> ${downloads}</p>
                </div>
              </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

function resetPage() {
  page =1;
currentTotalHits = 0;
loadMoreBtn.classList.add('is-hidden');
gallery.innerHTML = '';
};
