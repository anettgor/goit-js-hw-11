import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchBooks = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const input = document.querySelector('input');

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

// function hideLoadMoreBtn() {
//   loadMore.visibility:hidden;
// }
loadMore.style.display = 'none';

if (!searchBooks) {
  console.error('No search books');
} else {
  searchBooks.addEventListener('click', e => {
    e.preventDefault();
    getImages();
    console.log(input.value);
  });
}

const params = {
  KEY: '33187861-b0f031d63d8289b7509252611',
  IMG_TYPE: 'photo',
  ORIENTATION: 'horizontal',
  SAFE_SEARCH: 'true',
  Q: input.value,
  PER_PAGE: 40,
};

const { KEY, IMG_TYPE, ORIENTATION, SAFE_SEARCH, PER_PAGE } = params;

let currentPage = 1;
let value = '';
let totalPages;

async function getImages() {
  try {
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${input.value}&image_type=${IMG_TYPE}&orientation=${ORIENTATION}&safe_search=${SAFE_SEARCH}&per_page=${PER_PAGE}&page=${currentPage}`;

    //  const testUrl = 'https://jsonplaceholder.typicode.com/todos';
    const response = await axios.get(URL);
    console.log(response);
    if (input.value === '') {
      return Notiflix.Notify.failure('Input field cannot be empty');
    } else if (response.data.totalHits > 0) {
      showOutput(response);
      Notiflix.Notify.success(
        `"Hooray! We found ${response.data.totalHits} images."`
      );
      return response;
    } else {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}

function showOutput(response) {
  const hits = response.data.hits;
  hits.forEach(hit => {
    console.log(hit.id);
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
}

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
