const classData = {
	warrior: {
		name: 'AELRIC', label: 'GUERREIRO', hp: 120, mana: 40,
		stats: { FORCA: 12, DEFESA: 10, INTELIGENCIA: 3, AGILIDADE: 5, SORTE: 4 }, weaponClass: 'warrior'
	},
	mage: {
		name: 'LYSANDRA', label: 'MAGO', hp: 70, mana: 120,
		stats: { FORCA: 3, DEFESA: 4, INTELIGENCIA: 14, AGILIDADE: 6, SORTE: 5 }, weaponClass: 'mage'
	},
	archer: {
		name: 'ELIRA', label: 'ARQUEIRO', hp: 90, mana: 70,
		stats: { FORCA: 7, DEFESA: 6, INTELIGENCIA: 5, AGILIDADE: 13, SORTE: 8 }, weaponClass: 'archer'
	},
	paladin: {
		name: 'SERAPHINE', label: 'PALADINO', hp: 110, mana: 85,
		stats: { FORCA: 10, DEFESA: 12, INTELIGENCIA: 8, AGILIDADE: 5, SORTE: 5 }, weaponClass: 'paladin'
	},
	thief: {
		name: 'NYX', label: 'LADRÃO', hp: 85, mana: 55,
		stats: { FORCA: 7, DEFESA: 5, INTELIGENCIA: 6, AGILIDADE: 14, SORTE: 10 }, weaponClass: 'thief'
	}
};

const classWeapons = {
	warrior: ['Espada Longa', 'Espada de Duas Mãos', 'Machado de Batalha', 'Machado de Duas Mãos', 'Martelo de Guerra', 'Maça', 'Mangual', 'Lança', 'Alabarda', 'Foice de Guerra', 'Montante', 'Espada e Escudo'],
	mage: ['Cajado Mágico', 'Cajado de Batalha', 'Varinha', 'Grimório', 'Orbe Mágico', 'Cetro', 'Adaga Mágica', 'Tomo Arcano', 'Cajado de Fogo', 'Cajado de Gelo', 'Cajado de Raios', 'Cajado das Sombras', 'Cajado Sagrado'],
	archer: ['Arco Curto', 'Arco Longo', 'Arco Composto', 'Arco de Caça', 'Arco de Guerra', 'Besta', 'Besta Leve', 'Besta Pesada', 'Besta de Repetição', 'Arco Mágico', 'Arco de Fogo', 'Arco de Gelo', 'Arco Sombrio', 'Arco Sagrado', 'Facas de Arremesso', 'Dardos'],
	paladin: ['Espada Grande de Duas Mãos', 'Espada e escudo', 'Maça', 'Martelo', 'Lança'],
	thief: ['Adagas', 'Facas', 'Espadas curtas', 'Bestas', 'Armas leves de arremesso']
};

const weaponConfig = {
	nerfMultiplier: 0.7
};

const raceData = {
	human: {
		label: 'HUMANO', ability: 'XP E OURO AUMENTADOS',
		description: 'Ganha mais XP e ouro em todas as recompensas.', hp: 100, mana: 80,
		stats: { FORCA: 10, AGILIDADE: 10, DEFESA: 5 },
		passive: { xpMultiplier: 1.25, goldMultiplier: 1.25 }
	},
	elf: {
		label: 'ELFO', ability: 'GRIMORIO ARCANO',
		description: 'Nasce com um grimorio e aprende magias com desconto.', hp: 80, mana: 150,
		stats: { FORCA: 8, AGILIDADE: 10, DEFESA: 3 },
		passive: { spellDiscount: 0.2, startingGrimoire: true }
	},
	orc: {
		label: 'ORC', ability: 'FURIA DE SANGUE',
		description: 'Com pouca vida, recebe defesa e fica imune a atordoamento.', hp: 150, mana: 40,
		stats: { FORCA: 18, AGILIDADE: 6, DEFESA: 8 },
		passive: { lowHealthThreshold: 0.15, defenseMultiplier: 1.25, stunImmune: true }
	},
	dwarf: {
		label: 'ANAO', ability: 'MESTRE DA FORJA',
		description: 'Paga menos por melhorias de equipamentos e armas.', hp: 110, mana: 90,
		stats: { FORCA: 11, AGILIDADE: 9, DEFESA: 7 },
		passive: { upgradeDiscount: 0.2 }
	},
	demon: {
		label: 'DEMONIO', ability: 'SOMBRA INFERNAL',
		description: 'Causa mais dano a noite e pode eliminar inimigos enfraquecidos.', hp: 120, mana: 100,
		stats: { FORCA: 14, AGILIDADE: 10, DEFESA: 5 },
		passive: { nightDamageMultiplier: 1.25, executeThreshold: 0.15, executeChance: 0.2 }
	},
	angel: {
		label: 'ANJO', ability: 'LUZ CELESTIAL',
		description: 'Causa mais dano durante o dia.', hp: 100, mana: 120,
		stats: { FORCA: 13, AGILIDADE: 12, DEFESA: 6 },
		passive: { dayDamageMultiplier: 1.25 }
	},
	halfHuman: {
		label: 'DEMI-HUMANO', ability: 'AVIVADO',
		description: 'Acertos criticos ativam velocidade e dano por tempo limitado.', hp: 100, mana: 80,
		stats: { FORCA: 12, AGILIDADE: 15, DEFESA: 6 },
		passive: { speedMultiplier: 1.2, damageMultiplier: 1.05, duration: 10000 }
	}
};

const combatConfig = {
	enemy: {
		name: 'Goblin', maxHp: 50, strength: 6, defense: 3,
		agility: 4, luck: 2, xp: 25, gold: 10
	},
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

const worldState = { timeOfDay: 'day' };
const inventory = { items: [], spells: [], gold: 0 };

const COMBAT_STATES = Object.freeze({
	PLAYER_TURN: 'PLAYER_TURN',
	ENEMY_TURN: 'ENEMY_TURN',
	VICTORY: 'VICTORY',
	DEFEAT: 'DEFEAT',
	ESCAPED: 'ESCAPED'
});

const menuScreen = document.querySelector('#screen-menu');
const classScreen = document.querySelector('#screen-class');
const raceScreen = document.querySelector('#screen-race');
const gameScreen = document.querySelector('#screen-game');
const playButton = document.querySelector('#play-button');
const confirmButton = document.querySelector('#confirm-button');
const classCards = document.querySelectorAll('#class-grid .class-card');
const weaponButtons = document.querySelectorAll('.weapon-list-button');
const weaponDialog = document.querySelector('#weapon-dialog');
const weaponDialogList = document.querySelector('#weapon-dialog-list');
const weaponDialogClose = document.querySelector('#weapon-dialog-close');
const raceCards = document.querySelectorAll('.race-card');
const confirmRaceButton = document.querySelector('#confirm-race-button');
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
let selectedRace = null;
let weaponDialogTrigger = null;
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
let avivadoTimeout = null;
dialogueLog.style.setProperty('--ash-duration', `${combatConfig.ashDuration}ms`);

function showScreen(screenToShow) {
	[menuScreen, classScreen, raceScreen, gameScreen].forEach((screen) => {
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

function closeWeaponDialog() {
	weaponDialog.classList.add('is-hidden');
	weaponDialogTrigger?.focus();
	weaponDialogTrigger = null;
}

function selectRace(card) {
	raceCards.forEach((item) => {
		const isSelected = item === card;
		item.classList.toggle('is-selected', isSelected);
		item.setAttribute('aria-pressed', String(isSelected));
	});
	selectedRace = card.dataset.race;
	confirmRaceButton.disabled = false;
}

function createCharacter(classKey, raceKey) {
	const classChoice = classData[classKey];
	const raceChoice = raceData[raceKey];
	const stats = { ...classChoice.stats };
	Object.entries(raceChoice.stats).forEach(([stat, value]) => { stats[stat] = (stats[stat] || 0) + value; });
	return {
		...classChoice,
		hp: classChoice.hp + raceChoice.hp,
		mana: classChoice.mana + raceChoice.mana,
		stats,
		race: raceKey,
		raceLabel: raceChoice.label,
		ability: raceChoice.ability,
		currentHp: classChoice.hp + raceChoice.hp,
		currentMana: classChoice.mana + raceChoice.mana,
		weapon: { name: `${classChoice.label} inicial`, class: classChoice.weaponClass },
		isAvivado: false,
		speedMultiplier: 1,
		damageMultiplier: 1
	};
}

function saveCharacter() {
	const characterData = {
		class: selectedClass,
		race: selectedRace,
		xp: player ? player.xp || 0 : 0,
		inventory
	};
	localStorage.setItem('pilgrammed-character', JSON.stringify(characterData));
}

function loadSavedCharacter() {
	try {
		const saved = JSON.parse(localStorage.getItem('pilgrammed-character'));
		if (!saved) return false;
		selectedClass = classData[saved.class] ? saved.class : null;
		selectedRace = raceData[saved.race] ? saved.race : null;
		if (saved.inventory) {
			inventory.items = Array.isArray(saved.inventory.items) ? saved.inventory.items : [];
			inventory.spells = Array.isArray(saved.inventory.spells) ? saved.inventory.spells : [];
			inventory.gold = Number(saved.inventory.gold) || 0;
		}
		if (!selectedClass || !selectedRace) return false;
		populateHud();
		player.xp = Number(saved.xp) || 0;
		saveCharacter();
		return true;
	} catch (error) {
		localStorage.removeItem('pilgrammed-character');
		return false;
	}
}

function restoreSelectionCards() {
	const selectedClassCard = [...classCards].find((card) => card.dataset.class === selectedClass);
	const selectedRaceCard = [...raceCards].find((card) => card.dataset.race === selectedRace);
	if (selectedClassCard) selectClass(selectedClassCard);
	if (selectedRaceCard) selectRace(selectedRaceCard);
}

function startBattle() {
	if (!classData[selectedClass] || !raceData[selectedRace]) return false;
	showScreen(gameScreen);
	resetCombat();
	return true;
}

function populateHud() {
	player = createCharacter(selectedClass, selectedRace);
	grantStartingItems();
	saveCharacter();
	previousPlayerHp = null;
	previousEnemyHp = null;
	document.querySelector('#character-name').textContent = player.name;
	document.querySelector('#character-class').textContent = player.label;
	document.querySelector('#character-race').textContent = `${player.raceLabel} | ${player.ability}`;
	document.querySelector('#hp-value').textContent = `${player.hp} / ${player.hp}`;
	document.querySelector('#mana-value').textContent = `${player.mana} / ${player.mana}`;
	playerHpBar.style.width = '100%';
	playerManaBar.style.width = '100%';
	playerXpBar.style.width = '0%';
	document.querySelector('#hud-stats').innerHTML = Object.entries(player.stats).map(([stat, value]) => `<div><dt>${stat}</dt><dd>${value}</dd><button type="button" disabled aria-label="Adicionar ponto em ${stat}">+</button></div>`).join('');
}

function getRacePassive() {
	return raceData[player.race].passive;
}

function isLowHealth(character = player) {
	return character.currentHp < character.hp * getRacePassive().lowHealthThreshold;
}

function getDefense(character) {
	const baseDefense = character.stats ? character.stats.DEFESA : character.defense;
	if (character === player && player.race === 'orc' && isLowHealth()) {
		return Math.floor(baseDefense * getRacePassive().defenseMultiplier);
	}
	return baseDefense;
}

function canBeStunned(character = player) {
	return !(character === player && player.race === 'orc' && isLowHealth());
}

function calculateXpReward(baseXp) {
	return Math.floor(baseXp * (player.race === 'human' ? getRacePassive().xpMultiplier : 1));
}

function calculateGoldReward(baseGold) {
	return Math.floor(baseGold * (player.race === 'human' ? getRacePassive().goldMultiplier : 1));
}

function addXp(baseXp) {
	const reward = calculateXpReward(baseXp);
	player.xp = (player.xp || 0) + reward;
	saveCharacter();
	return reward;
}

function addGold(baseGold) {
	const reward = calculateGoldReward(baseGold);
	inventory.gold += reward;
	saveCharacter();
	return reward;
}

function calculateSpellCost(baseCost) {
	return Math.max(0, Math.ceil(baseCost * (player.race === 'elf' ? 1 - getRacePassive().spellDiscount : 1)));
}

function grantStartingItems() {
	if (player.race === 'elf' && !inventory.items.includes('GRIMORIO')) {
		inventory.items.push('GRIMORIO');
	}
}

function equipWeapon(weapon) {
	if (!player || !weapon || typeof weapon.class !== 'string') return false;
	player.weapon = weapon;
	return true;
}

function getWeaponDamageMultiplier(attacker) {
	if (attacker !== player || !attacker.weapon) return 1;
	return attacker.weapon.class === classData[selectedClass].weaponClass ? 1 : weaponConfig.nerfMultiplier;
}

function learnSpell(spell, baseCost) {
	const cost = calculateSpellCost(baseCost);
	inventory.spells.push({ ...spell, cost });
	return cost;
}

function buySpell(spell, baseCost) {
	return learnSpell(spell, baseCost);
}

function recordSpell(spell, baseCost) {
	return learnSpell(spell, baseCost);
}

function calculateUpgradeCost(baseCost) {
	return Math.max(0, Math.ceil(baseCost * (player.race === 'dwarf' ? 1 - getRacePassive().upgradeDiscount : 1)));
}

function upgradeEquipment(equipment, baseCost, applyUpgrade) {
	const cost = calculateUpgradeCost(baseCost);
	applyUpgrade(equipment);
	return cost;
}

function setTimeOfDay(timeOfDay) {
	worldState.timeOfDay = timeOfDay === 'night' ? 'night' : 'day';
}

function activateAvivado() {
	if (player.race !== 'halfHuman') return;
	const passive = getRacePassive();
	player.isAvivado = true;
	player.speedMultiplier = passive.speedMultiplier;
	player.damageMultiplier = passive.damageMultiplier;
	window.clearTimeout(avivadoTimeout);
	avivadoTimeout = window.setTimeout(() => {
		player.isAvivado = false;
		player.speedMultiplier = 1;
		player.damageMultiplier = 1;
	}, passive.duration);
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
	const agilityDifference = playerData.stats.AGILIDADE * (playerData.speedMultiplier || 1) - enemyData.agility;
	const playerChance = Math.max(0.5 - combatConfig.initiativeMaxShift, Math.min(0.5 + combatConfig.initiativeMaxShift, 0.5 + agilityDifference * combatConfig.initiativeAgilityFactor));
	return Math.random() < playerChance;
}

function calculateAttack(attacker, defenderDefense) {
	const critical = isCritical(attacker);
	let normalDamage = randomDamage(attacker.strength || attacker.stats.FORCA, defenderDefense);
	if (attacker === player) {
		const passive = getRacePassive();
		if (player.race === 'demon' && worldState.timeOfDay === 'night') normalDamage *= passive.nightDamageMultiplier;
		if (player.race === 'angel' && worldState.timeOfDay === 'day') normalDamage *= passive.dayDamageMultiplier;
		normalDamage *= player.damageMultiplier || 1;
		normalDamage *= getWeaponDamageMultiplier(attacker);
	}
	return { critical, damage: critical ? Math.max(normalDamage + 1, Math.floor(normalDamage * combatConfig.criticalMultiplier)) : Math.floor(normalDamage) };
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
	const attackResult = calculateAttack(enemy, getDefense(player));
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
	let damage = Math.max(1, Math.floor(attackResult.damage * timingResult.multiplier));
	if (player.race === 'demon' && enemy.currentHp < enemy.maxHp * getRacePassive().executeThreshold && Math.random() < getRacePassive().executeChance) {
		damage = enemy.currentHp;
		await setDialogue('A sombra infernal executou o inimigo!');
	}
	enemy.currentHp = Math.max(0, enemy.currentHp - damage);
	if (attackResult.critical) activateAvivado();
	updateHpDisplays();
	if (attackResult.critical) {
		await setDialogue('ACERTO CRITICO!');
		await setDialogue(`${player.name} causou ${damage} de dano!`);
	} else {
		await setDialogue(`${enemy.name} sofreu ${damage} de dano.`);
	}
	if (enemy.currentHp <= 0) {
		const xpReward = addXp(enemy.xp);
		const goldReward = addGold(enemy.gold);
		await finishCombat(COMBAT_STATES.VICTORY, `${enemy.name} foi derrotado!`);
		await setDialogue(`Voce recebeu ${xpReward} XP e ${goldReward} ouro.`);
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

playButton.addEventListener('click', () => {
	selectedClass = null;
	selectedRace = null;
	classCards.forEach((card) => {
		card.classList.remove('is-selected');
		card.setAttribute('aria-pressed', 'false');
	});
	raceCards.forEach((card) => {
		card.classList.remove('is-selected');
		card.setAttribute('aria-pressed', 'false');
	});
	confirmButton.disabled = true;
	confirmRaceButton.disabled = true;
	showScreen(raceScreen);
});
classCards.forEach((card) => {
	card.addEventListener('click', () => selectClass(card));
	card.addEventListener('keydown', (event) => {
		if (event.target !== card) return;
		if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectClass(card); }
	});
});
weaponButtons.forEach((button) => {
	button.addEventListener('click', (event) => {
		event.stopPropagation();
		const weapons = classWeapons[button.dataset.weaponsFor];
		if (!weapons) return;
		weaponDialogTrigger = button;
		weaponDialogList.replaceChildren(...weapons.map((weapon) => {
			const item = document.createElement('li');
			item.textContent = weapon;
			return item;
		}));
		weaponDialog.classList.remove('is-hidden');
		weaponDialogClose.focus();
	});
});
weaponDialogClose.addEventListener('click', closeWeaponDialog);
weaponDialog.addEventListener('click', (event) => {
	if (event.target === weaponDialog.querySelector('.weapon-dialog-backdrop')) closeWeaponDialog();
});
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !weaponDialog.classList.contains('is-hidden')) closeWeaponDialog();
});
confirmButton.addEventListener('click', () => {
	if (!selectedClass) return;
	if (!selectedRace) return;
	populateHud();
	startBattle();
});

raceCards.forEach((card) => {
	card.addEventListener('click', () => selectRace(card));
	card.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectRace(card); }
	});
});
confirmRaceButton.addEventListener('click', () => {
	if (!raceData[selectedRace]) return;
	showScreen(classScreen);
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
