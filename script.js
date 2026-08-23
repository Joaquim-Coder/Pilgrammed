const classData = {
	warrior: { name: 'AELRIC', label: 'GUERREIRO', hp: 120, mana: 40, stats: { FORCA: 12, DEFESA: 10, INTELIGENCIA: 3, AGILIDADE: 5, SORTE: 4 } },
	mage: { name: 'LYSANDRA', label: 'MAGO', hp: 70, mana: 120, stats: { FORCA: 3, DEFESA: 4, INTELIGENCIA: 14, AGILIDADE: 6, SORTE: 5 } },
	archer: { name: 'ELIRA', label: 'ARQUEIRO', hp: 90, mana: 70, stats: { FORCA: 7, DEFESA: 6, INTELIGENCIA: 5, AGILIDADE: 13, SORTE: 8 } }
};

const combatConfig = {
	enemy: { name: 'Goblin', maxHp: 50, strength: 6, defense: 3, agility: 4, luck: 2 },
	actionDelay: 850,
	defenseMultiplier: 0.45,
	fleeBaseChance: 0.35,
	fleeAgilityFactor: 0.03,
	damageVariance: 2,
	criticalBaseChance: 0.05,
	criticalLuckFactor: 0.01,
	criticalMaxChance: 0.15,
	criticalMultiplier: 1.75,
	evasionBaseChance: 0.03,
	evasionAgilityFactor: 0.01,
	evasionMaxChance: 0.18,
	initiativeAgilityFactor: 0.025,
	initiativeMaxShift: 0.2
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
const dialogueLog = document.querySelector('#dialogue-log');
const turnIndicator = document.querySelector('#turn-indicator');
const enemyHpValue = document.querySelector('#enemy-hp-value');
const enemyHpBar = document.querySelector('#enemy-hp-bar');
let selectedClass = null;
let player = null;
let enemy = null;
let combatState = COMBAT_STATES.PLAYER_TURN;
let isDefending = false;
const dialogueHistory = [];
const maxVisibleMessages = 3;

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
	const removedMessage = dialogueHistory.length >= maxVisibleMessages ? dialogueHistory.shift() : null;
	dialogueHistory.push(message);
	renderDialogueLog(removedMessage);
}

function renderDialogueLog(removedMessage = null) {
	dialogueLog.innerHTML = dialogueHistory.map((message, index) => {
		const age = dialogueHistory.length - index - 1;
		const ageClass = age === 0 ? 'log-message-new' : age === dialogueHistory.length - 1 ? 'log-message-oldest' : 'log-message-middle';
		return `<p class="log-message ${ageClass}">${message}</p>`;
	}).join('');
	if (!removedMessage) return;

	const exitingMessage = document.createElement('p');
	exitingMessage.className = 'log-message log-message-exiting';
	exitingMessage.textContent = removedMessage;
	dialogueLog.appendChild(exitingMessage);
	window.requestAnimationFrame(() => exitingMessage.classList.add('is-evaporating'));
	window.setTimeout(() => exitingMessage.remove(), 650);
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

function calculateCriticalChance(attacker) {
	const luck = attacker.stats ? attacker.stats.SORTE : attacker.luck || 0;
	return Math.min(combatConfig.criticalMaxChance, combatConfig.criticalBaseChance + luck * combatConfig.criticalLuckFactor);
}

function isCritical(attacker) {
	return Math.random() < calculateCriticalChance(attacker);
}

function calculateEvasionChance(defender) {
	const agility = defender.stats ? defender.stats.AGILIDADE : defender.agility || 0;
	return Math.min(combatConfig.evasionMaxChance, combatConfig.evasionBaseChance + agility * combatConfig.evasionAgilityFactor);
}

function evadesAttack(defender) {
	return Math.random() < calculateEvasionChance(defender);
}

function determineInitiative(playerData, enemyData) {
	const agilityDifference = playerData.stats.AGILIDADE - enemyData.agility;
	const playerChance = Math.max(0.5 - combatConfig.initiativeMaxShift, Math.min(0.5 + combatConfig.initiativeMaxShift, 0.5 + agilityDifference * combatConfig.initiativeAgilityFactor));
	return Math.random() < playerChance;
}

function calculateAttack(attacker, defenderDefense) {
	const critical = isCritical(attacker);
	const normalDamage = randomDamage(attacker.strength || attacker.stats.FORCA, defenderDefense);
	return { critical, damage: critical ? Math.max(normalDamage + 1, Math.floor(normalDamage * combatConfig.criticalMultiplier)) : normalDamage };
}

function resetCombat() {
	enemy = { ...combatConfig.enemy, currentHp: combatConfig.enemy.maxHp };
	isDefending = false;
	updateHpDisplays();
	const playerStarts = determineInitiative(player, enemy);
	setCombatState(playerStarts ? COMBAT_STATES.PLAYER_TURN : COMBAT_STATES.ENEMY_TURN);
	setDialogue('Um Goblin apareceu!');
	window.setTimeout(() => {
		if (combatState === COMBAT_STATES.PLAYER_TURN) {
			setDialogue(`${player.name} foi mais rapido!`);
			window.setTimeout(() => setDialogue('Seu turno.'), combatConfig.actionDelay);
			return;
		}
		if (combatState === COMBAT_STATES.ENEMY_TURN) {
			setDialogue(`${enemy.name} tomou a iniciativa!`);
			window.setTimeout(enemyTurn, combatConfig.actionDelay);
		}
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
		if (evadesAttack(player)) {
			setDialogue(`Voce desviou do ataque do ${enemy.name}!`);
			window.setTimeout(() => finishEnemyTurn(), combatConfig.actionDelay);
			return;
		}
		const attackResult = calculateAttack(enemy, player.stats.DEFESA);
		let damage = attackResult.damage;
		if (isDefending) {
			damage = Math.max(1, Math.floor(damage * combatConfig.defenseMultiplier));
			setDialogue('Voce bloqueou parte do ataque!');
			isDefending = false;
			window.setTimeout(() => applyEnemyDamage(damage, attackResult.critical), combatConfig.actionDelay);
			return;
		}
		applyEnemyDamage(damage, attackResult.critical);
	}, combatConfig.actionDelay);
}

function finishEnemyTurn() {
	if (player.currentHp <= 0 || enemy.currentHp <= 0) return;
	setCombatState(COMBAT_STATES.PLAYER_TURN);
	setDialogue('Seu turno.');
}

function applyEnemyDamage(damage, critical) {
	player.currentHp = Math.max(0, player.currentHp - damage);
	updateHpDisplays();
	if (critical) setDialogue('ACERTO CRITICO!');
	else setDialogue(`${player.name} sofreu ${damage} de dano.`);
	window.setTimeout(() => {
		if (player.currentHp <= 0) {
			finishCombat(COMBAT_STATES.DEFEAT, 'Voce foi derrotado...');
			return;
		}
		if (critical) {
			setDialogue(`${enemy.name} causou ${damage} de dano!`);
			window.setTimeout(finishEnemyTurn, combatConfig.actionDelay);
			return;
		}
		finishEnemyTurn();
	}, combatConfig.actionDelay);
}

function attack() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	if (evadesAttack(enemy)) {
		setCombatState(COMBAT_STATES.ENEMY_TURN);
		setDialogue(`${player.name} atacou!`);
		window.setTimeout(() => {
			if (combatState !== COMBAT_STATES.ENEMY_TURN) return;
			setDialogue(`${enemy.name} desviou do ataque!`);
			window.setTimeout(enemyTurn, combatConfig.actionDelay);
		}, combatConfig.actionDelay);
		return;
	}
	const attackResult = calculateAttack(player, enemy.defense);
	const damage = attackResult.damage;
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	enemy.currentHp = Math.max(0, enemy.currentHp - damage);
	updateHpDisplays();
	setDialogue(`${player.name} atacou o ${enemy.name}!`);
	window.setTimeout(() => {
		if (attackResult.critical) {
			setDialogue('ACERTO CRITICO!');
			window.setTimeout(() => {
				setDialogue(`${player.name} causou ${damage} de dano!`);
				if (enemy.currentHp <= 0) {
					window.setTimeout(() => {
						finishCombat(COMBAT_STATES.VICTORY, `${enemy.name} foi derrotado!`);
						window.setTimeout(() => setDialogue('Voce venceu a batalha!'), combatConfig.actionDelay);
					}, combatConfig.actionDelay);
					return;
				}
				window.setTimeout(enemyTurn, combatConfig.actionDelay);
			}, combatConfig.actionDelay);
			return;
		}
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
