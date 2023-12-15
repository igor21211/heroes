const API = "https://657b56c8394ca9e4af14350a.mockapi.io/heroes";
const API_COMICS = "https://657b56c8394ca9e4af14350a.mockapi.io/comics";
const tbody = document.querySelector(".tbody");
const btnSubmit = document.querySelector(".add-hero");
const openModal = document.querySelector(".open-modal");

async function getAllHeroes() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    renderTable(data);
  } catch (e) {
    openErrorModal(error.message);
  }
}

async function getHeroName(name) {
  try {
    const response = await fetch(`${API}?name=${name}`);
    const data = await response.json();
    return data;
  } catch (e) {
    openErrorModal(error.message);
  }
}
async function getComics() {
  try {
    const response = await fetch(API_COMICS);
    const data = await response.json();
    renderSelect(data);
  } catch (e) {
    openErrorModal(e.message);
  }
}

function renderSelect(data) {
  const selectEl = document.getElementById("comics");
  selectEl.innerHTML = data.map(renderOption).join();
}

function renderOption(data) {
  return `
  <option value="${data.name}">${data.name}</option>
  `;
}

function renderTable(data) {
  tbody.innerHTML = data.map(renderHeroes).join("");
}

function renderHeroes(data) {
  return `
        <tr>
          <td>${data.name}</td>
          <td>${data.comics}</td>
          <td>
            <label class="heroFavouriteInput">
              Favourite: <input onclick="changeFavourite(${
                data.id
              },${!data.favourite})" type="checkbox" ${
    data.favourite ? "checked" : ""
  } />
            </label>
          </td>
          <td><button onclick="removeHero(${data.id})">Delete</button></td>
        </tr>
    `;
}

async function removeHero(id) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data) {
      return getAllHeroes();
    }
  } catch (e) {
    openErrorModal(error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getAllHeroes();
  getComics();
});

async function submitForm(e) {
  e.preventDefault();
  const form = document.querySelector(".heroes__form");
  const formData = new FormData(form);
  const jsonObject = {};
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });
  const data = await getHeroName(jsonObject.name);
  if (data.length > 0) {
    return openErrorModal();
  }

  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonObject),
    });
    if (response.ok) {
      getAllHeroes();
    }
  } catch (error) {
    openErrorModal(error.message);
  }
}

openModal.addEventListener("click", function () {
  document.querySelector(".heroes__form").style.display = "block";
});

document.querySelector(".close-modal").addEventListener("click", function () {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
});

function openErrorModal(error = "This hero is already added!") {
  const pEl = document.querySelector(".text-modal");
  pEl.textContent = error;
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
  setTimeout(() => {
    modal.style.display = "none";
  }, 2000);
}

async function changeFavourite(id, favourite) {
  try {
    const response = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favourite,
      }),
    });
  } catch (e) {
    openErrorModal(e.message);
  }
}
