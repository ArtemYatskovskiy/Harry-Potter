//Змінні

let arrCharacters = [];
let currentList = [];
let startingIndex = 0;
let endingIndex = 8;

// DOM-елементи

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

const housesList = document.getElementById('houses-list');
const gryffindorButton = document.getElementById('gryffindor-btn');
const slytherinButton = document.getElementById('slytherin-btn');
const ravenclawButton = document.getElementById('ravenclaw-btn');
const hufflepuffButton = document.getElementById('hufflepuff-btn');

// Отримання данних

async function getCharactersData() {
  try {
    const res = await fetch('https://hp-api.onrender.com/api/characters');
    arrCharacters = await res.json();
    return arrCharacters;
  } catch (err) {
    console.error('Сталася помилка під час завантаження персонажів:', err);
    return [];
  }
}

async function ensureData() {
  if (arrCharacters.length === 0) {
    arrCharacters = await getCharactersData();
  }
  return arrCharacters;
}

// Рендер персонажів

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
    <p>${ch.alternate_names[0] || 'Null'}</p>
    <p>${ch.house || 'Null'}</p>
    <p>${ch.dateOfBirth || 'Null'}</p>
  </div>
  <button class="change-section__btn">Більше інформації<img src="./images/arrow.svg" alt="" width="30" height="20" />
      <div class="hover-card">
      <p>Name: <span>${ch.name}</span></p>
      <p>
        Alternate names: <span>${ch.alternate_names.join(', ') || 'Null'}</span>
      </p>
      <p>Species: <span class="text-capitalize">${ch.species || 'Null'}</span></p>
      <p>Gender: <span class="text-capitalize">${ch.gender || 'Null'}</span></p>
      <p>House: <span>${ch.house || 'Null'}</span></p>
      <p>Date of birth: <span>${ch.dateOfBirth || 'Null'}</span></p>
      <p>Year of birth: <span>${ch.yearOfBirth || 'Null'}</span></p>
      <p>Wizard: <span class="text-capitalize">${ch.wizard || 'Null'}</span></p>
      <p>Ancestry: <span class="text-capitalize">${ch.ancestry || 'Null'}</span></p>
      <p>Eye colour: <span class="text-capitalize">${ch.eyeColour || 'Null'}</span></p>
      <p>Hair colour: <span class="text-capitalize">${ch.hairColour || 'Null'}</span></p>
      <p>
        Wand:
        <span class="text-capitalize"
          >${ch.wand.wood || 'Null'}, core: ${ch.wand.core || 'Null'}, length:
          ${ch.wand.length || 'Null'}</span
        >
      </p>
      <p>Patronus: <span class="text-capitalize">${ch.patronus || 'Null'}</span></p>
      <p>Hogwarts student: <span class="text-capitalize">${ch.hogwartsStudent || 'Null'}</span></p>
      <p>Hogwarts staff: <span class="text-capitalize">${ch.hogwartsStaff || 'Null'}</span></p>
      <p>Actor: <span>${ch.actor || 'Null'}</span></p>
      <p>Alive: <span class="text-capitalize">${ch.alive || 'Null'}</span></p>
    </div></button>
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

// Фільтр по Будинку

function setActiveHouseBtn(activeBtn) {
  [
    gryffindorButton,
    slytherinButton,
    ravenclawButton,
    hufflepuffButton,
  ].forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
}

async function filterHouse(house, btn) {
  setActiveHouseBtn(btn);
  const characters = await ensureData();
  const filtered = characters.filter(ch => ch.house === house);
  showFiltered(filtered, `Персонажі в певному будинку`);
}

gryffindorButton.addEventListener('click', () =>
  filterHouse('Gryffindor', gryffindorButton),
);
slytherinButton.addEventListener('click', () =>
  filterHouse('Slytherin', slytherinButton),
);
ravenclawButton.addEventListener('click', () =>
  filterHouse('Ravenclaw', ravenclawButton),
);
hufflepuffButton.addEventListener('click', () =>
  filterHouse('Hufflepuff', hufflepuffButton),
);

charsHouseButton.addEventListener('click', async () => {
  housesList.classList.remove('is-hidden');
  await filterHouse('Gryffindor', gryffindorButton);
});

studentsButton.addEventListener('click', async () => {
  housesList.classList.add('is-hidden');
  const characters = await ensureData();
  const students = characters.filter(ch => ch.hogwartsStudent);
  showFiltered(students, 'Студенти Гоґвортсу');
});

staffButton.addEventListener('click', async () => {
  housesList.classList.add('is-hidden');
  const characters = await ensureData();
  const staff = characters.filter(ch => ch.hogwartsStaff);
  showFiltered(staff, 'Співробітники Гоґвортсу');
});

loadMoreButton.addEventListener('click', renderCharacters);
