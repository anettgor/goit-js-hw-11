import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const input = document.querySelector('input');

loadMore.style.display = 'none';

if (!searchBtn) {
  console.error('No search button found');
} else {
  searchBtn.addEventListener('click', e => {
    e.preventDefault();
    onSubmit();
  });
}
const params = {
  KEY: '33187861-b0f031d63d8289b7509252611',
  IMAGE_TYPE: 'photo',
  ORIENTATION: 'horizontal',
  SAFE_SEARCH: 'true',
  PER_PAGE: 40,
};

const { KEY, IMAGE_TYPE, ORIENTATION, SAFE_SEARCH, PER_PAGE } = params;

async function fetchImages() {
  try {
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${input.value}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safe_search=${SAFE_SEARCH}&per_page=${PER_PAGE}&page=${page}`;
    const response = await axios.get(URL);
    console.log('FETCH IMAGES RESPONSE', response);
    return response;
  } catch (error) {
    console.error('FETCH ERROR', error);
    Notiflix.Notify.failure('Ooops an error has occurred: ' + error.message);
  }
}
let page = 1;
let pagesTotal;

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function scrollLower() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onSubmit() {
  gallery.innerHTML = '';
  page = 1;
  fetchImages().then(function (onFulfilled) {
    if (input.value.trim() === '') {
      return Notiflix.Notify.failure('Input field cannot be empty');
    } else if (onFulfilled.data.totalHits > 0) {
      // lightbox.refresh();
      showOutput(onFulfilled);
      pagesTotal = Math.ceil(onFulfilled.data.totalHits / PER_PAGE);
      Notiflix.Notify.success(
        `"Hooray! We found ${onFulfilled.data.totalHits} images."`
      );
      loadMore.style.display = 'block';
      return onFulfilled;
    } else {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

function showOutput(response) {
  const hits = response.data.hits;
  hits.forEach(hit => {
    const div = document.createElement('div');
    div.classList.add('photo-card');
    gallery.appendChild(div);
    div.innerHTML = `
        <a class="gallery-item" href="${hit.largeImageURL}">
        <img src="${hit.previewURL}" alt="${hit.tags}" loading="lazy" />
        </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span class="details">${hit.likes} </span>
        </p>
        <p class="info-item">
          <b>Views</b>
           <span class="details">${hit.views} </span>
        </p>
        <p class="info-item">
          <b>Comments</b>
           <span class="details">${hit.comments} </span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
           <span class="details">${hit.downloads} </span>
        </p>
      </div>
   `;
  });
  lightbox.refresh();
}

function fetchMore() {
  page++;
  fetchImages().then(function (onFulfilled) {
    showOutput(onFulfilled);
    scrollLower();
  });

  if (page >= pagesTotal) {
    loadMore.style.display = 'none';
    return Notify.info("That's all of the search results");
  }
}

loadMore.addEventListener('click', fetchMore);
