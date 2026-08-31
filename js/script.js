let arrCharacters = [];
let currentList = [];
let startingIndex = 0;
let endingIndex = 8;

const heroSection = document.getElementById('hero-section');
const heroButton = document.getElementById('hero-btn');

const choseSection = document.getElementById('chose-section');
const studentsButton = document.getElementById('stud-btn');
const staffButton = document.getElementById('staff-btn');
const charsHouseButton = document.getElementById('chars-house-btn');

const changeSection = document.getElementById('change-section');
const changeTitle = document.getElementById('change-title');
const changeList = document.getElementById('change-list');
const backButton = document.getElementById('back-btn');
const loadMoreButton = document.getElementById('load-more-btn');

async function getCharactersData() {
  const res = await fetch('https://hp-api.onrender.com/api/characters');
  try {
    arrCharacters = await res.json();
    return arrCharacters;
  } catch {
    changeList.innerHTML =
      '<p class="error-msg">Сталася помилка під час завантаження персонажів</p>';
    return [];
  }
}

async function ensureData() {
  if (arrCharacters.length === 0) {
    arrCharacters = await getCharactersData();
  }
  return arrCharacters;
}

function showSection(section) {
  [heroSection, choseSection, changeSection].forEach(s =>
    s.classList.add('is-hidden'),
  );
  section.classList.remove('is-hidden');
}

heroButton.addEventListener('click', () => {
  choseSection.classList.toggle('is-hidden');
});

backButton.addEventListener('click', () => {
  showSection(heroSection);
});

function showFiltered(list, title) {
  currentList = list;
  startingIndex = 0;
  changeTitle.textContent = title;

  loadMoreButton.disabled = false;
  loadMoreButton.style.cursor = 'pointer';
  loadMoreButton.textContent = 'Завантажити ще';

  renderCharacters();
}

function renderCharacters() {
  let charactersCards = currentList.slice(0, startingIndex + endingIndex);

  changeList.innerHTML = charactersCards
    .map(
      ch => `<li class="change-section__card">
  <img class="change-section__image" src="${ch.image}" alt="${ch.name}" />
  <h2 class="change-section__name">${ch.name}</h2>
  <div class="change-section__text">
    <p>${ch.alternate_names[0]}</p>
    <p>${ch.house}</p>
    <p>${ch.dateOfBirth}</p>
  </div>
  <button class="change-section__btn">Більше інформації →</button>
</li>`,
    )
    .join('');

  showSection(changeSection);

  startingIndex += endingIndex;

  if (startingIndex >= currentList.length) {
    loadMoreButton.disabled = true;
    loadMoreButton.style.cursor = 'not-allowed';
    loadMoreButton.textContent = 'Більше немає даних для завантаження';
  }
}

studentsButton.addEventListener('click', async () => {
  const characters = await ensureData();
  const students = characters.filter(ch => ch.hogwartsStudent);
  showFiltered(students, 'Студенти Гоґвортсу');
});

staffButton.addEventListener('click', async () => {
  const characters = await ensureData();
  const staff = characters.filter(ch => ch.hogwartsStaff);
  showFiltered(staff, 'Співробітники Гоґвортсу');
});

loadMoreButton.addEventListener('click', renderCharacters);
