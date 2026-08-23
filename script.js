const classData = {
	warrior: { name: 'AELRIC', label: 'GUERREIRO', hp: 120, mana: 40, stats: { FORCA: 12, DEFESA: 10, INTELIGENCIA: 3, AGILIDADE: 5, SORTE: 4 } },
	mage: { name: 'LYSANDRA', label: 'MAGO', hp: 70, mana: 120, stats: { FORCA: 3, DEFESA: 4, INTELIGENCIA: 14, AGILIDADE: 6, SORTE: 5 } },
	archer: { name: 'ELIRA', label: 'ARQUEIRO', hp: 90, mana: 70, stats: { FORCA: 7, DEFESA: 6, INTELIGENCIA: 5, AGILIDADE: 13, SORTE: 8 } }
};

const menuScreen = document.querySelector('#screen-menu');
const classScreen = document.querySelector('#screen-class');
const gameScreen = document.querySelector('#screen-game');
const playButton = document.querySelector('#play-button');
const confirmButton = document.querySelector('#confirm-button');
const classCards = document.querySelectorAll('.class-card');
let selectedClass = null;

function showScreen(screenToShow) {
	[menuScreen, classScreen, gameScreen].forEach((screen) => {
		screen.classList.toggle('is-hidden', screen !== screenToShow);
	});
}

function selectClass(card) {
	classCards.forEach((item) => {
		const isSelected = item === card;
		item.classList.toggle('is-selected', isSelected);
		item.setAttribute('aria-pressed', String(isSelected));
	});
	selectedClass = card.dataset.class;
	confirmButton.disabled = false;
}

function populateHud() {
	const data = classData[selectedClass];
	document.querySelector('#character-name').textContent = data.name;
	document.querySelector('#character-class').textContent = data.label;
	document.querySelector('#hp-value').textContent = `${data.hp} / ${data.hp}`;
	document.querySelector('#mana-value').textContent = `${data.mana} / ${data.mana}`;
	document.querySelector('#hp-bar').style.width = '100%';
	document.querySelector('#mana-bar').style.width = '100%';
	document.querySelector('#hud-stats').innerHTML = Object.entries(data.stats).map(([stat, value]) => `<div><dt>${stat}</dt><dd>${value}</dd><button type="button" disabled aria-label="Adicionar ponto em ${stat}">+</button></div>`).join('');
}

playButton.addEventListener('click', () => showScreen(classScreen));
classCards.forEach((card) => {
	card.addEventListener('click', () => selectClass(card));
	card.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectClass(card); }
	});
});
confirmButton.addEventListener('click', () => {
	if (!selectedClass) return;
	populateHud();
	showScreen(gameScreen);
});
