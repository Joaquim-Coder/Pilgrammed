const classData = {
	warrior: { name: 'AELRIC', label: 'GUERREIRO', hp: 120, mana: 40, stats: { FORCA: 12, DEFESA: 10, INTELIGENCIA: 3, AGILIDADE: 5, SORTE: 4 } },
	mage: { name: 'LYSANDRA', label: 'MAGO', hp: 70, mana: 120, stats: { FORCA: 3, DEFESA: 4, INTELIGENCIA: 14, AGILIDADE: 6, SORTE: 5 } },
	archer: { name: 'ELIRA', label: 'ARQUEIRO', hp: 90, mana: 70, stats: { FORCA: 7, DEFESA: 6, INTELIGENCIA: 5, AGILIDADE: 13, SORTE: 8 } }
};

const combatConfig = {
	enemy: { name: 'Goblin', maxHp: 50, strength: 6, defense: 3, agility: 4 },
	actionDelay: 850,
	defenseMultiplier: 0.45,
	fleeBaseChance: 0.35,
	fleeAgilityFactor: 0.03,
	damageVariance: 2
};

const COMBAT_STATES = Object.freeze({ PLAYER_TURN: 'PLAYER_TURN', ENEMY_TURN: 'ENEMY_TURN', VICTORY: 'VICTORY', DEFEAT: 'DEFEAT', ESCAPED: 'ESCAPED' });

const menuScreen = document.querySelector('#screen-menu');
const classScreen = document.querySelector('#screen-class');
const gameScreen = document.querySelector('#screen-game');
const playButton = document.querySelector('#play-button');
const confirmButton = document.querySelector('#confirm-button');
const classCards = document.querySelectorAll('.class-card');
const actionButtons = document.querySelectorAll('.action-button');
const attackButton = document.querySelector('#attack-button');
const skillsButton = document.querySelector('#skills-button');
const itemsButton = document.querySelector('#items-button');
const defendButton = document.querySelector('#defend-button');
const escapeButton = document.querySelector('#escape-button');
const dialogueText = document.querySelector('#dialogue-text');
const turnIndicator = document.querySelector('#turn-indicator');
const enemyHpValue = document.querySelector('#enemy-hp-value');
const enemyHpBar = document.querySelector('#enemy-hp-bar');
let selectedClass = null;
let player = null;
let enemy = null;
let combatState = COMBAT_STATES.PLAYER_TURN;
let isDefending = false;

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
	player = { ...data, currentHp: data.hp, currentMana: data.mana };
	document.querySelector('#character-name').textContent = data.name;
	document.querySelector('#character-class').textContent = data.label;
	document.querySelector('#hp-value').textContent = `${data.hp} / ${data.hp}`;
	document.querySelector('#mana-value').textContent = `${data.mana} / ${data.mana}`;
	document.querySelector('#hp-bar').style.width = '100%';
	document.querySelector('#mana-bar').style.width = '100%';
	document.querySelector('#hud-stats').innerHTML = Object.entries(data.stats).map(([stat, value]) => `<div><dt>${stat}</dt><dd>${value}</dd><button type="button" disabled aria-label="Adicionar ponto em ${stat}">+</button></div>`).join('');
}

function setDialogue(message) {
	dialogueText.textContent = message;
}

function setCombatState(nextState) {
	combatState = nextState;
	const stateLabels = { PLAYER_TURN: 'SEU TURNO', ENEMY_TURN: 'TURNO DO INIMIGO', VICTORY: 'VITORIA', DEFEAT: 'DERROTA', ESCAPED: 'FUGA' };
	turnIndicator.textContent = stateLabels[nextState];
	const canAct = nextState === COMBAT_STATES.PLAYER_TURN;
	actionButtons.forEach((button) => { button.disabled = !canAct; });
}

function updateHpDisplays() {
	const playerHpBar = document.querySelector('#hp-bar');
	document.querySelector('#hp-value').textContent = `${player.currentHp} / ${player.hp}`;
	playerHpBar.style.width = `${(player.currentHp / player.hp) * 100}%`;
	enemyHpValue.textContent = `${enemy.currentHp} / ${enemy.maxHp}`;
	enemyHpBar.style.width = `${(enemy.currentHp / enemy.maxHp) * 100}%`;
}

function randomDamage(attackerStrength, targetDefense) {
	const variance = Math.floor(Math.random() * (combatConfig.damageVariance * 2 + 1)) - combatConfig.damageVariance;
	return Math.max(1, attackerStrength - targetDefense + variance);
}

function resetCombat() {
	enemy = { ...combatConfig.enemy, currentHp: combatConfig.enemy.maxHp };
	isDefending = false;
	updateHpDisplays();
	setCombatState(COMBAT_STATES.PLAYER_TURN);
	setDialogue('Um Goblin apareceu!');
	window.setTimeout(() => {
		if (combatState === COMBAT_STATES.PLAYER_TURN) setDialogue('Seu turno.');
	}, combatConfig.actionDelay);
}

function finishCombat(state, message) {
	setCombatState(state);
	setDialogue(message);
}

function enemyTurn() {
	if (combatState !== COMBAT_STATES.ENEMY_TURN || enemy.currentHp <= 0 || player.currentHp <= 0) return;
	setDialogue(`${enemy.name} atacou!`);
	window.setTimeout(() => {
		if (combatState !== COMBAT_STATES.ENEMY_TURN) return;
		let damage = randomDamage(enemy.strength, player.stats.DEFESA);
		if (isDefending) {
			damage = Math.max(1, Math.floor(damage * combatConfig.defenseMultiplier));
			setDialogue('Voce bloqueou parte do ataque!');
			isDefending = false;
			window.setTimeout(() => applyEnemyDamage(damage), combatConfig.actionDelay);
			return;
		}
		applyEnemyDamage(damage);
	}, combatConfig.actionDelay);
}

function applyEnemyDamage(damage) {
	player.currentHp = Math.max(0, player.currentHp - damage);
	updateHpDisplays();
	window.setTimeout(() => {
		if (player.currentHp <= 0) {
			finishCombat(COMBAT_STATES.DEFEAT, 'Voce foi derrotado...');
			return;
		}
		setCombatState(COMBAT_STATES.PLAYER_TURN);
		setDialogue('Seu turno.');
	}, combatConfig.actionDelay);
	setDialogue(`${player.name} sofreu ${damage} de dano.`);
}

function attack() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	const damage = randomDamage(player.stats.FORCA, enemy.defense);
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	enemy.currentHp = Math.max(0, enemy.currentHp - damage);
	updateHpDisplays();
	setDialogue(`${player.name} atacou o ${enemy.name}!`);
	window.setTimeout(() => {
		if (enemy.currentHp <= 0) {
			finishCombat(COMBAT_STATES.VICTORY, `${enemy.name} foi derrotado!`);
			window.setTimeout(() => setDialogue('Voce venceu a batalha!'), combatConfig.actionDelay);
			return;
		}
		setDialogue(`${enemy.name} sofreu ${damage} de dano.`);
		window.setTimeout(enemyTurn, combatConfig.actionDelay);
	}, combatConfig.actionDelay);
}

function defend() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	isDefending = true;
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	setDialogue(`${player.name} assumiu uma posicao defensiva.`);
	window.setTimeout(enemyTurn, combatConfig.actionDelay);
}

function escape() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	const chance = Math.min(0.9, combatConfig.fleeBaseChance + player.stats.AGILIDADE * combatConfig.fleeAgilityFactor);
	if (Math.random() < chance) {
		finishCombat(COMBAT_STATES.ESCAPED, 'Voce conseguiu fugir da batalha!');
		return;
	}
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	setDialogue('Voce nao conseguiu fugir!');
	window.setTimeout(enemyTurn, combatConfig.actionDelay);
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
	resetCombat();
	showScreen(gameScreen);
});

attackButton.addEventListener('click', attack);
defendButton.addEventListener('click', defend);
escapeButton.addEventListener('click', escape);
skillsButton.addEventListener('click', () => {
	if (combatState === COMBAT_STATES.PLAYER_TURN) setDialogue('Voce ainda nao possui habilidades disponiveis.');
});
itemsButton.addEventListener('click', () => {
	if (combatState === COMBAT_STATES.PLAYER_TURN) setDialogue('Voce ainda nao possui itens disponiveis.');
});
