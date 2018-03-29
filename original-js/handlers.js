var handlers = {

	newGame: function() {
		game = undefined;
		game = new Game();
		view.clearGame();
	},

	tick: function() {
		if (game.people > 1 || game.money > 0) {
			game.tick();
		};
		var nextTick = setTimeout(handlers.tick,1000);
	},

	organize: function() {
		game.organize();
	},

	planAction: function(action) {
		game.planAction(action);
		view.updateButton(action);
	},

	doAction: function(action) {
		game.doAction(action);
		view.updateButton(action);
	},

	train: function(employee) {
		game.train(employee);
	},

	fire: function(employee) {
		game.fire(employee);
	},

	upgrade: function(upgrade) {
		game.upgrade(upgrade);
	},

	unlock: function(unlock) {
		game.unlock(unlock);
	},

	ally: function(ally) {
		view.unlock('OrganizationAllyMembersDiv');
		game.ally(ally);
		view.toggleAllyButtons(ally);
	},

	cutTies: function(ally) {
		game.cutTies(ally);
		view.toggleAllyButtons(ally);
	},

	nominate: function() {
		game.nominate();
	},

	fund: function() {
		game.fund();
	},

	displayLegislation: function(legislation) {
		view.displayLegislation(legislation);
	},

	promote: function(legislation) {
		game.promote(legislation);
		view.displayLegislation(legislation);
	},

	denounce: function(legislation) {
		game.denounce(legislation);
		view.displayLegislation(legislation);
	},

	pass: function(legislation) {
		game.pass(legislation);
	},

	repeal: function(legislation) {
		game.repeal(legislation);
	},

};