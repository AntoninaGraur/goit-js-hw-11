

import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';




// const form = document.querySelector('#search-form');
// const gallery = document.querySelector('.gallery');
// const API_KEY = '36223855-9729aa23392660264fa235b58';

class UnsplashAPI {
    #BASE_URL = "https://pixabay.com/api/";
    #API_KEY = "36223855-9729aa23392660264fa235b58";

    #page;
    #searchQuery;


    #searchParams = new URLSearchParams({
        key: this.#API_KEY,
        q: "searchQuery",
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
    });


    constructor() {
        this.#page = 1;
        this.#searchQuery = "";
    }


    getImages() {

    }
}