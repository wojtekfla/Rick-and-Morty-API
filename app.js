
const URL = "https://rickandmortyapi.com/api/character";

document.addEventListener('DOMContentLoaded', init)

function init () {
	getCharacters(URL);
	addEventListenerOnInput();
	addEventListeneronRadio();
}

let nextPageLinkUrl = "";
let prevPageLinkUrl = "";

async function getCharacters(url) {
	try {
		const response = await fetch(`${url}`);
    console.log('respon', response)
		if (!response.ok) {
			changeLeftBtn(response)
			return renderError()
		}
		const characters = await response.json();

		renderCharacters(characters.results);
		changeRightBtn(characters);
		changeLeftBtn(characters);

	} catch (err) {
		console.error("Failed to fetch !", err);
	}
}

const createCharacterEl = (characters) => {
	let ulEl = document.querySelector("ul");
	if (ulEl) {
		ulEl.innerHTML = "";
	} else {
		ulEl = document.createElement("ul");
	}

	characters.forEach((character) => {
		const liEl = document.createElement("li");
		const imageContainer = document.createElement("div");
		const imageEl = document.createElement("img");
		imageEl.src = character.image;
		imageContainer.append(imageEl);

		const divWrapper = document.createElement("div");
		divWrapper.classList.add("wrapper")

		const nameEl = document.createElement("div");
		nameEl.classList.add("character__name");
		nameEl.innerText = character.name;
		const speciesEl = document.createElement("div");
		speciesEl.classList.add("character__species");
		speciesEl.innerText = `gatunek: ${character.species}`;
		const statusEl = document.createElement("div");
		statusEl.classList.add("character__status");
		statusEl.innerText = `status: ${character.status}`;

		divWrapper.append(nameEl)
		divWrapper.append(speciesEl)
		divWrapper.append(statusEl)

		liEl.append(imageContainer);
		liEl.append(divWrapper);
		ulEl.append(liEl);
	});
	return ulEl;
};

function renderCharacters(charList) {
	const rootElement = document.querySelector("#root");
	rootElement.append(createCharacterEl(charList));
}

function changeRightBtn(resObj) {
	const btnRight = document.querySelector("#arrow-right");
	const aEl = btnRight.querySelector("a");
	const nextPageLink = resObj.info.next;
	aEl.href = nextPageLink;
	btnRight.addEventListener("click", changeToNextPage);
	return (nextPageLinkUrl = nextPageLink);
}

function changeToNextPage(e) {
	e.preventDefault();
	getCharacters(nextPageLinkUrl);
}

function changeLeftBtn(resObj) {
	let prevPageLink
	const btnLeft = document.querySelector("#arrow-left");
	const aEl = btnLeft.querySelector("a");

	if (!resObj.info) {
		prevPageLink = prevPageLinkUrl
	} else {
		prevPageLink = resObj.info.prev;
	}
	aEl.href = prevPageLink;
  btnLeft.addEventListener("click", changeToPrevPage);
  return (prevPageLinkUrl = prevPageLink);
}

function changeToPrevPage(e) {
	e.preventDefault();
	const inputEl = document.querySelector('#filter')
	let inputValue = inputEl.value
	if (inputValue !== "") {
		inputValue = inputValue.slice(0, -1)
		inputEl.value = inputValue
		return filterByName(inputValue);
	}
	getCharacters(prevPageLinkUrl)
	
}

function addEventListenerOnInput() {
	const inputEl = document.querySelector("#filter");
	inputEl.addEventListener("keyup", (e) => {
		e.preventDefault();
		let nameFilter = e.target.value;
    return filterByName(nameFilter)
	});
}

function filterByName(nameToFind) {
  return getCharacters(`${URL}/?name=${nameToFind}`);
}

function addEventListeneronRadio() {
	const inputEl = document.querySelector(".nav-radio");
	let inputList1 = inputEl.querySelectorAll('[name="status"]');
	let inputList = [...inputList1];
	console.log("inputList", inputList);
	inputList.forEach((el) => {
		el.addEventListener("change", filterByStatus);
		return inputList;
	});
}

function filterByStatus(radioBtnEl) {
	const inputEl = document.querySelector("#filter");
	const nameValue = inputEl.value
	let radioBtnValue = radioBtnEl.target.id
  return getCharacters(`${URL}/?status=${radioBtnValue}&name=${nameValue}`);
};

function renderError () {
	const rootEl = document.querySelector('#root')
	let ulEl = document.querySelector('ul')
	if (ulEl) {
		ulEl.innerHTML = ''
	} else {
    ulEl = document.createElement('ul')
  }
	const liEl = document.createElement('li')
	const pEl = document.createElement('p')
	pEl.innerText = "Nie znaleziono postaci spełniających kryteria wyszukiwania"
	liEl.append(pEl)
	ulEl.append(liEl)
	rootEl.append(ulEl)
}





