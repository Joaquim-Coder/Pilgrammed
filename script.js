const classData = {
	warrior: { name: 'AELRIC', label: 'GUERREIRO', hp: 120, mana: 40, stats: { FORCA: 12, DEFESA: 10, INTELIGENCIA: 3, AGILIDADE: 5, SORTE: 4 } },
	mage: { name: 'LYSANDRA', label: 'MAGO', hp: 70, mana: 120, stats: { FORCA: 3, DEFESA: 4, INTELIGENCIA: 14, AGILIDADE: 6, SORTE: 5 } },
	archer: { name: 'ELIRA', label: 'ARQUEIRO', hp: 90, mana: 70, stats: { FORCA: 7, DEFESA: 6, INTELIGENCIA: 5, AGILIDADE: 13, SORTE: 8 } }
};

const combatConfig = {
	enemy: { name: 'Goblin', maxHp: 50, strength: 6, defense: 3, agility: 4, luck: 2 },
	messagePause: 760,
	turnPause: 900,
	ashDuration: 900,
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
	initiativeMaxShift: 0.2,
	timingCycleDuration: 1800,
	timingDuration: 4500,
	timingFeedbackPause: 450,
	timingZones: [
		{ max: 0.22, label: 'RUIM', multiplier: 0.7 },
		{ max: 0.36, label: 'NORMAL', multiplier: 1 },
		{ max: 0.44, label: 'BOM', multiplier: 1.15 },
		{ max: 0.47, label: 'OTIMO', multiplier: 1.3 },
		{ max: 0.53, label: 'PERFEITO', multiplier: 1.5 },
		{ max: 0.56, label: 'OTIMO', multiplier: 1.3 },
		{ max: 0.64, label: 'BOM', multiplier: 1.15 },
		{ max: 0.78, label: 'NORMAL', multiplier: 1 },
		{ max: 1, label: 'RUIM', multiplier: 0.7 }
	],
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
const timingGame = document.querySelector('#timing-game');
const timingTrack = document.querySelector('#timing-track');
const timingMarker = document.querySelector('#timing-marker');
const timingFeedback = document.querySelector('#timing-feedback');
const playerHpBar = document.querySelector('#hp-bar');
const playerManaBar = document.querySelector('#mana-bar');
const playerXpBar = document.querySelector('#xp-bar');
let selectedClass = null;
let player = null;
let enemy = null;
let combatState = COMBAT_STATES.PLAYER_TURN;
let isDefending = false;
let timingSession = null;
const dialogueHistory = [];
const maxVisibleMessages = 3;
const dialogueQueue = [];
let isProcessingDialogue = false;
let previousPlayerHp = null;
let previousEnemyHp = null;
dialogueLog.style.setProperty('--ash-duration', `${combatConfig.ashDuration}ms`);

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
	previousPlayerHp = null;
	previousEnemyHp = null;
	document.querySelector('#character-name').textContent = data.name;
	document.querySelector('#character-class').textContent = data.label;
	document.querySelector('#hp-value').textContent = `${data.hp} / ${data.hp}`;
	document.querySelector('#mana-value').textContent = `${data.mana} / ${data.mana}`;
	playerHpBar.style.width = '100%';
	playerManaBar.style.width = '100%';
	playerXpBar.style.width = '0%';
	document.querySelector('#hud-stats').innerHTML = Object.entries(data.stats).map(([stat, value]) => `<div><dt>${stat}</dt><dd>${value}</dd><button type="button" disabled aria-label="Adicionar ponto em ${stat}">+</button></div>`).join('');
}

function delay(duration) {
	return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function setDialogue(message) {
	return enqueueDialogue(message);
}

function enqueueDialogue(message) {
	return new Promise((resolve) => {
		dialogueQueue.push({ message, resolve });
		processDialogueQueue();
	});
}

async function processDialogueQueue() {
	if (isProcessingDialogue) return;
	isProcessingDialogue = true;
	while (dialogueQueue.length) {
		const queuedMessage = dialogueQueue.shift();
		const exitAnimation = renderDialogueMessage(queuedMessage.message);
		await Promise.all([delay(combatConfig.messagePause), exitAnimation]);
		queuedMessage.resolve();
	}
	isProcessingDialogue = false;
}

function renderDialogueMessage(message) {
	dialogueHistory.push(message);
	const messageElement = document.createElement('p');
	messageElement.className = 'log-message log-message-new';
	messageElement.textContent = message;
	dialogueLog.appendChild(messageElement);
	updateDialogueAges();
	if (dialogueHistory.length <= maxVisibleMessages) return Promise.resolve();

	dialogueHistory.shift();
	const oldestElement = [...dialogueLog.children].find((element) => !element.classList.contains('log-message-exiting'));
	if (!oldestElement) return Promise.resolve();
	oldestElement.classList.remove('log-message-new', 'log-message-middle', 'log-message-oldest');
	oldestElement.classList.add('log-message-exiting');
	window.requestAnimationFrame(() => oldestElement.classList.add('is-evaporating'));
	return new Promise((resolve) => {
		oldestElement.addEventListener('animationend', () => {
			oldestElement.remove();
			updateDialogueAges();
			resolve();
		}, { once: true });
	});
}

function updateDialogueAges() {
	const activeMessages = [...dialogueLog.children].filter((element) => !element.classList.contains('log-message-exiting'));
	activeMessages.forEach((element, index) => {
		element.classList.remove('log-message-new', 'log-message-middle', 'log-message-oldest');
		const age = activeMessages.length - index - 1;
		element.classList.add(age === 0 ? 'log-message-new' : age === activeMessages.length - 1 ? 'log-message-oldest' : 'log-message-middle');
	});
}

function setCombatState(nextState) {
	combatState = nextState;
	const stateLabels = { PLAYER_TURN: 'SEU TURNO', ENEMY_TURN: 'TURNO DO INIMIGO', VICTORY: 'VITORIA', DEFEAT: 'DERROTA', ESCAPED: 'FUGA' };
	turnIndicator.textContent = stateLabels[nextState];
	const canAct = nextState === COMBAT_STATES.PLAYER_TURN;
	actionButtons.forEach((button) => { button.disabled = !canAct; });
}

function updateHpDisplays() {
	document.querySelector('#hp-value').textContent = `${player.currentHp} / ${player.hp}`;
	updateBar(playerHpBar, player.currentHp, player.hp, previousPlayerHp !== null && player.currentHp < previousPlayerHp);
	enemyHpValue.textContent = `${enemy.currentHp} / ${enemy.maxHp}`;
	updateBar(enemyHpBar, enemy.currentHp, enemy.maxHp, previousEnemyHp !== null && enemy.currentHp < previousEnemyHp);
	previousPlayerHp = player.currentHp;
	previousEnemyHp = enemy.currentHp;
}

function updateBar(bar, currentValue, maximumValue, damaged = false) {
	const percentage = Math.max(0, Math.min(100, (currentValue / maximumValue) * 100));
	bar.style.width = `${percentage}%`;
	if (!damaged) return;
	pulseBar(bar);
}

function pulseBar(bar) {
	bar.classList.remove('bar-damage');
	window.requestAnimationFrame(() => {
		bar.classList.add('bar-damage');
		bar.addEventListener('animationend', () => bar.classList.remove('bar-damage'), { once: true });
	});
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

function calculateTimingQuality(position) {
	return combatConfig.timingZones.find((zone) => position <= zone.max) || combatConfig.timingZones[combatConfig.timingZones.length - 1];
}

function startTimingGame() {
	return new Promise((resolve) => {
		const session = { resolved: false, rafId: 0, startedAt: performance.now(), resolve };
		timingSession = session;
		timingGame.classList.remove('is-hidden', 'timing-complete');
		timingFeedback.textContent = 'AGUARDE O MARCADOR';
		timingFeedback.className = 'timing-feedback';

		const complete = () => completeTimingGame(session);
		const onKeyDown = (event) => {
			if (event.code !== 'Space' || event.repeat || timingSession !== session) return;
			event.preventDefault();
			complete();
		};
		const animate = (now) => {
			if (session.resolved) return;
			if (now - session.startedAt >= combatConfig.timingDuration) {
				complete();
				return;
			}
			const cycleProgress = ((now - session.startedAt) % combatConfig.timingCycleDuration) / combatConfig.timingCycleDuration;
			const position = cycleProgress <= 0.5 ? cycleProgress * 2 : 2 - cycleProgress * 2;
			timingMarker.style.left = `${position * 100}%`;
			session.rafId = window.requestAnimationFrame(animate);
		};

		timingGame.addEventListener('click', complete);
		window.addEventListener('keydown', onKeyDown);
		session.cleanup = () => {
			window.cancelAnimationFrame(session.rafId);
			timingGame.removeEventListener('click', complete);
			window.removeEventListener('keydown', onKeyDown);
		};
		session.rafId = window.requestAnimationFrame(animate);
	});
}

function completeTimingGame(session) {
	if (session.resolved || timingSession !== session) return;
	session.resolved = true;
	session.cleanup();
	const position = Math.max(0, Math.min(1, parseFloat(timingMarker.style.left || '0') / 100));
	const result = calculateTimingQuality(position);
	timingFeedback.textContent = `${result.label}!`;
	timingFeedback.classList.add('is-result', `timing-${result.label.toLowerCase()}`);
	timingGame.classList.add('timing-complete');
	delay(combatConfig.timingFeedbackPause).then(() => {
		if (timingSession !== session) return;
		timingGame.classList.add('is-hidden');
		timingSession = null;
		session.resolve(result);
	});
}

async function resetCombat() {
	enemy = { ...combatConfig.enemy, currentHp: combatConfig.enemy.maxHp };
	isDefending = false;
	dialogueHistory.length = 0;
	dialogueQueue.length = 0;
	dialogueLog.replaceChildren();
	updateHpDisplays();
	const playerStarts = determineInitiative(player, enemy);
	setCombatState(playerStarts ? COMBAT_STATES.PLAYER_TURN : COMBAT_STATES.ENEMY_TURN);
	actionButtons.forEach((button) => { button.disabled = true; });
	await setDialogue('Um Goblin apareceu!');
	if (combatState === COMBAT_STATES.PLAYER_TURN) {
		await setDialogue(`${player.name} foi mais rapido!`);
		await setDialogue('Seu turno.');
		setCombatState(COMBAT_STATES.PLAYER_TURN);
		return;
	}
	if (combatState === COMBAT_STATES.ENEMY_TURN) {
		await setDialogue(`${enemy.name} tomou a iniciativa!`);
		await enemyTurn();
	}
}

async function finishCombat(state, message) {
	setCombatState(state);
	await setDialogue(message);
}

async function enemyTurn() {
	if (combatState !== COMBAT_STATES.ENEMY_TURN || enemy.currentHp <= 0 || player.currentHp <= 0) return;
	await setDialogue(`${enemy.name} atacou!`);
	if (combatState !== COMBAT_STATES.ENEMY_TURN) return;
	if (evadesAttack(player)) {
		await setDialogue(`Voce desviou do ataque do ${enemy.name}!`);
		await finishEnemyTurn();
		return;
	}
	const attackResult = calculateAttack(enemy, player.stats.DEFESA);
	let damage = attackResult.damage;
	if (isDefending) {
		damage = Math.max(1, Math.floor(damage * combatConfig.defenseMultiplier));
		isDefending = false;
		await setDialogue('Voce bloqueou parte do ataque!');
	}
	await applyEnemyDamage(damage, attackResult.critical);
}

async function finishEnemyTurn() {
	if (player.currentHp <= 0 || enemy.currentHp <= 0) return;
	await setDialogue('Seu turno.');
	setCombatState(COMBAT_STATES.PLAYER_TURN);
}

async function applyEnemyDamage(damage, critical) {
	player.currentHp = Math.max(0, player.currentHp - damage);
	updateHpDisplays();
	if (critical) {
		await setDialogue('ACERTO CRITICO!');
		await setDialogue(`${enemy.name} causou ${damage} de dano!`);
	} else {
		await setDialogue(`${player.name} sofreu ${damage} de dano.`);
	}
	if (player.currentHp <= 0) {
		await finishCombat(COMBAT_STATES.DEFEAT, 'Voce foi derrotado...');
		return;
	}
	await finishEnemyTurn();
}

async function attack() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	const timingResult = await startTimingGame();
	await setDialogue(`${player.name} atacou o ${enemy.name}!`);
	await setDialogue(`${timingResult.label}!`);
	if (combatState !== COMBAT_STATES.ENEMY_TURN) return;
	if (evadesAttack(enemy)) {
		await setDialogue(`${enemy.name} desviou do ataque!`);
		await enemyTurn();
		return;
	}
	const attackResult = calculateAttack(player, enemy.defense);
	const damage = Math.max(1, Math.floor(attackResult.damage * timingResult.multiplier));
	enemy.currentHp = Math.max(0, enemy.currentHp - damage);
	updateHpDisplays();
	if (attackResult.critical) {
		await setDialogue('ACERTO CRITICO!');
		await setDialogue(`${player.name} causou ${damage} de dano!`);
	} else {
		await setDialogue(`${enemy.name} sofreu ${damage} de dano.`);
	}
	if (enemy.currentHp <= 0) {
		await finishCombat(COMBAT_STATES.VICTORY, `${enemy.name} foi derrotado!`);
		await setDialogue('Voce venceu a batalha!');
		return;
	}
	await enemyTurn();
}

async function defend() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	isDefending = true;
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	await setDialogue(`${player.name} assumiu uma posicao defensiva.`);
	await enemyTurn();
}

async function escape() {
	if (combatState !== COMBAT_STATES.PLAYER_TURN) return;
	const chance = Math.min(0.9, combatConfig.fleeBaseChance + player.stats.AGILIDADE * combatConfig.fleeAgilityFactor);
	if (Math.random() < chance) {
		await finishCombat(COMBAT_STATES.ESCAPED, 'Voce conseguiu fugir da batalha!');
		return;
	}
	setCombatState(COMBAT_STATES.ENEMY_TURN);
	await setDialogue('Voce nao conseguiu fugir!');
	await enemyTurn();
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
	resetCombat();
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
