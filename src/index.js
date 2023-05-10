
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
