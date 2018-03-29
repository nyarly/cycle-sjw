var view = {

	clearGame: function() {
		var gameDiv = document.getElementById('gameDiv');
		gameDiv.innerHTML = '';

		var headers = [
			['Organization','Reputation','Coordination','Office'],
			['Candidates','Legislature','Legislation'],
			['Status Quo','The Corporate Insurgency',"Auxiliary",'Alliances','Alpha Centauri Expedition']
		];
		for (var column of headers) {
			var columnDiv = document.createElement('div');
			gameDiv.appendChild(columnDiv);
			columnDiv.className = 'columnDiv';
			for (var header of column) {
				var headerDiv = document.createElement('div');
				headerDiv.id = header.replace(/ /g,'') + "Div";
				columnDiv.appendChild(headerDiv);
				headerDiv.style.display = 'none';
				var h2 = document.createElement('h2');
				h2.innerHTML = header;
				h2.id = header + "Head";
				headerDiv.appendChild(h2);
				if (header == 'Organization') {
					view.displayStats(['People','Money','AllyMembers'],header,headerDiv,'none');
					var organizeButton = document.createElement('button');
					organizeButton.id = 'organizeButton';
					headerDiv.appendChild(organizeButton);
					organizeButton.className = 'topButton';
					organizeButton.innerHTML = 'Organize';
					organizeButton.addEventListener('click',handlers.organize);
				} else if (header == 'Reputation') {
					h2.innerHTML = '';
					view.displayStats(['Reputation','Buzz'],header,headerDiv,'block');
				} else if (header == 'Office') {
					var OfficeStaffSummary = document.createElement('div');
					headerDiv.appendChild(OfficeStaffSummary);
					OfficeStaffSummary.id = 'OfficeStaffSummary';
					h2.innerHTML = "Working out of your apartment";
					OfficeStaffSummary.innerHTML = "0 staff / 4 max - $0/week payroll";
				} else if (header == 'Legislature') {
					view.displayStats(['Clout','Obstruction'],header,headerDiv,'block');
				} else if (header == 'Candidates') {
					view.displayStats(['Candidates','Support','Next Election','Chances'],header,headerDiv,'block');
					var candidateActions = document.createElement('div');
					headerDiv.appendChild(candidateActions);
					var nominateButton = document.createElement('button');
					nominateButton.id = 'nominateButton';
					candidateActions.appendChild(nominateButton);
					nominateButton.className = 'Display';
					nominateButton.innerHTML = 'Nominate New Candidate (100,000 Rep)';
					nominateButton.addEventListener('click',handlers.nominate);
					var fundButton = document.createElement('button');
					fundButton.id = 'fundButton';
					candidateActions.appendChild(fundButton);
					fundButton.className = 'Display';
					fundButton.innerHTML = 'Fund Campaigns ($100,000)';
					fundButton.addEventListener('click',handlers.fund);
				} else if (header == 'Status Quo') {
					var lorenzDiv = document.createElement('div');
					headerDiv.appendChild(lorenzDiv);
					lorenzDiv.appendChild(view.lorenz());
					lorenzDiv.id = 'lorenzDiv';
// 					headerDiv.style.display = 'block';
					view.displayStats(['Corporate Power','Economic Inequality','Solidarity','Tech'],header,headerDiv,'block');
				} else if (header == 'The Corporate Insurgency') {
					view.displayStats(['Mercenaries','Prestige','Assets Seized','Population Enslaved'],header,headerDiv,'block');
				} else if (header == "Auxiliary") {
					h2.innerHTML = "Citizens' Defense Auxiliary";
					view.displayStats(['Soldiers','Logistics','Medics','Wounded'],header,headerDiv,'block');
				} else if (header == "Alpha Centauri Expedition") {
					view.displayStats(['Launch Preparation'],header,headerDiv,'block');
				};
				for (var div of ['Staff','Actions','Thresholds','Allies','Upgrades','Unlocks','Notes']) {
					var divNode = document.createElement('div');
					divNode.id = header.replace(/ /g,'') + div + "Div";
					divNode.className = div;
					divNode.style.display = 'none';
					headerDiv.appendChild(divNode);
				};
				if (header == 'Legislation') {
					var overtonWindow = view.overton();
					headerDiv.appendChild(overtonWindow);
					view.shiftOverton(50);
				} else if (header == "Alpha Centauri Expedition") {
					var launchButton = document.createElement('button');
					launchButton.id = 'launchButton';
					headerDiv.appendChild(launchButton);
					launchButton.className = 'Display';
					launchButton.innerHTML = 'Launch';
					launchButton.disabled = true;
					launchButton.addEventListener('click',view.victoryScreen);
				};
			};
		};
		for (var action of game.actions) {
			var actionDiv = document.createElement('div');
			actionDiv.id = action.name.replace(/ /g,'') + 'ActionDiv';
			document.getElementById(action.header.replace(/ /g,'')+"ActionsDiv").appendChild(actionDiv);
			actionDiv.style.display = 'none';
			var button = document.createElement('button');
			button.id = action.name.replace(/ /g,'') + 'PlanButton';
			button.addEventListener('click',handlers.planAction.bind(game,action));
			actionDiv.appendChild(button);
			view.updateButton(action);
			var actButton = document.createElement('button');
			actButton.id = action.name.replace(/ /g,'') + 'ActButton';
			actButton.addEventListener('click',handlers.doAction.bind(game,action));
			actButton.innerHTML = "Go!";
			actButton.disabled = true;
			actionDiv.appendChild(actButton);
		};
		for (var employee of game.staff) {
			var employeeDiv = document.createElement('div');
			document.getElementById(employee.header+"StaffDiv").appendChild(employeeDiv);
			employeeDiv.id = employee.name.replace(/ /g,'') + 'EmployeeDiv';
			employeeDiv.style.display = 'none';
			employeeDiv.innerHTML = " " + employee.name + " ";
			var span = document.createElement('span');
			employeeDiv.prepend(span);
			span.id = employee.name.replace(/ /g,'') + "Display";
			span.innerHTML = "0 ";
			if (employee.pay > 0) {
				var button = document.createElement('button');
				button.id = employee.name.replace(/ /g,'') + 'TrainButton';
				button.addEventListener('click',handlers.train.bind(game,employee));
				button.innerHTML = "Train ($" +employee.pay+ "/week)";
				employeeDiv.appendChild(button);
				var button = document.createElement('button');
				button.id = employee.name.replace(/ /g,'') + 'FireButton';
				button.addEventListener('click',handlers.fire.bind(game,employee));
				button.innerHTML = "Fire";
				button.disabled = true;
				employeeDiv.appendChild(button);
			};
		};
		for (var upgrade of game.upgrades) {
			document.getElementById(upgrade.header+"UpgradesDiv").style.display = 'block';
			var upgradeDiv = document.createElement('div');
			upgradeDiv.id = upgrade.name.replace(/ /g,'') + 'UpgradeDiv';
			upgradeDiv.className = 'upgradeDiv';
			document.getElementById(upgrade.header+"UpgradesDiv").appendChild(upgradeDiv);
			upgradeDiv.style.display = 'none';
			var upgradeHeader = document.createElement('h4');
			upgradeDiv.appendChild(upgradeHeader);
			upgradeHeader.innerHTML = upgrade.name;
			if (upgrade.description !== undefined) {
				upgradeDiv.innerHTML += upgrade.description + ' ';
			} else if (upgrade.upgradeToNum !== undefined) {
				upgradeDiv.innerHTML += 'Upgrade ' + upgrade.upgradeStat + ' to ' + upgrade.upgradeToNum + '. ';
			} else if (upgrade.upgradeByNum !== undefined) {
				upgradeDiv.innerHTML += 'Upgrade ' + upgrade.upgradeStat + ' by ' + upgrade.upgradeByNum + '. ';
			} else {
			};
			var button = document.createElement('button');
			upgradeDiv.appendChild(button);
			button.id = upgrade.name.toLowerCase().replace(/ /g,'')+ "Button";
			if (upgrade.costStat == 'Money') {
				button.innerHTML = "$" + upgrade.costNum.toLocaleString();
			} else {
				button.innerHTML = upgrade.costNum.toLocaleString() + " " + upgrade.costStat;
			};
			button.addEventListener('click',handlers.upgrade.bind(game,upgrade));
		};
		for (var unlock of game.unlocks) {
			document.getElementById(unlock.header+"UnlocksDiv").style.display = 'block';
			var unlockDiv = document.createElement('div');
			unlockDiv.id = unlock.name.replace(/ /g,'') + 'UnlockDiv';
			unlockDiv.className = 'unlockDiv';
			document.getElementById(unlock.header+"UnlocksDiv").appendChild(unlockDiv);
			unlockDiv.style.display = 'none';
			var unlockHeader = document.createElement('h4');
			unlockDiv.appendChild(unlockHeader);
			unlockHeader.innerHTML = unlock.name;
			if (unlock.description !== undefined) {
				unlockDiv.innerHTML += unlock.description + " ";
			};
			var button = document.createElement('button');
			unlockDiv.appendChild(button);
			button.id = unlock.name.toLowerCase().replace(/ /g,'')+ "Button";
			button.innerHTML = "Requires "+unlock.minimum.toLocaleString()+" "+unlock.stat;
			button.addEventListener('click',handlers.unlock.bind(game,unlock));
		};
		for (var ally of game.potentialAllies) {
			var alliancesDiv = document.getElementById(ally.header+'AlliesDiv');
			var allyDiv = document.createElement('div');
			alliancesDiv.appendChild(allyDiv);
			allyDiv.id = ally.name.replace(/ /g,'') + 'AllyDiv';
			allyDiv.className = 'allyDiv';
			var allyHead = document.createElement('h4');
			allyDiv.appendChild(allyHead);
			allyHead.innerHTML = ally.name;
			var allyDescription = document.createElement('p');
			allyDiv.appendChild(allyDescription);
			allyDescription.className = 'allyDescription';
			allyDescription.innerHTML += ally.members.toLocaleString() + ' members, ' + ally.tickCostNum + ' ' + ally.tickCostStat + '/week ';
			var allyButton = document.createElement('button');
			allyDescription.appendChild(allyButton);
			allyButton.id = ally.name.replace(/ /g,'') + "AllyButton";
			allyButton.innerHTML = 'Ally (' + ally.allyCost.toLocaleString() + ' Rep)';
			allyButton.addEventListener('click',handlers.ally.bind(game,ally));
			var cutTiesButton = document.createElement('button');
			allyDescription.appendChild(cutTiesButton);
			cutTiesButton.id = ally.name.replace(/ /g,'') + "CutTiesButton";
			cutTiesButton.innerHTML = 'Cut Ties';
			cutTiesButton.addEventListener('click',handlers.cutTies.bind(game,ally));
			cutTiesButton.style.display = 'none';
		};

		document.getElementById('OrganizationDiv').style.display = 'block';
		document.getElementById('OrganizationPeopleDiv').style.display = 'block';
		document.getElementById('OrganizationMoneyDiv').style.display = 'block';

// 		document.getElementById("AuxiliaryDiv").style.display = 'block';
// 		document.getElementById("AuxiliaryActionsDiv").style.display = 'block';
// 		document.getElementById("AuxiliaryThresholdsDiv").style.display = 'block';
// 		document.getElementById("AuxiliariesRecruitmentDriveActionDiv").style.display = 'block';

	},

	displayStats: function(statArray,header,headerDiv,displayStyle) {
		for (var div of statArray) {
			var divNode = document.createElement('div');
			divNode.id = header.replace(/ /g,'') + div.replace(/ /g,'') + 'Div';
			headerDiv.appendChild(divNode);
			divNode.className = 'Display';
			divNode.innerHTML = div + ": ";
			divNode.style.display = displayStyle;
			var span = document.createElement('span');
			span.id = div.replace(/ /g,'')+'Display';
			span.className = 'DisplaySpan';
			span.innerHTML = game[div.toLowerCase().replace(/ /g,'')];
			divNode.appendChild(span);
		};
	},

	update: function(stat) {
		var string = Math.round(game[stat.toLowerCase().replace(/ /g,'')]).toLocaleString();
		if (stat == "Money") {
			string = "$" + string;
		} else if (stat == "Next Election") {
			string = string + " weeks";
		} else if (stat == "Chances"  || stat == 'Assets Seized' || stat == 'Population Enslaved' || stat == 'Launch Preparation') {
			string = (Math.round(game[stat.toLowerCase().replace(/ /g,'')]*10000)/100) + "%";
		} else if (stat == 'Support') {
			string = game.support.toLocaleString() + ' / ' + Math.ceil(game.electoralThreshold).toLocaleString();
		};
		document.getElementById(stat.replace(/ /g,'') + "Display").innerHTML = string + " ";
	},

	updateButton:function(action) {
		var button = document.getElementById(action.name.replace(/ /g,'') + 'PlanButton');
		if (action.header == 'Coordination') {
			var completion = Math.floor(action.completion * game.people);
		} else {
			var completion = action.completion;
		};
		if (action.max !== undefined) {completion = Math.min(completion,action.max);}
		var progress = action.progress;
		if (progress < completion) {
			button.innerHTML = "Plan " + action.name + " (needs " + (completion-progress).toLocaleString() + " shifts)";
		} else {
			button.innerHTML = action.name + " Ready!";
		};
	},

	unlock: function(id) {
		document.getElementById(id).style.display = 'block';
		document.getElementById(id).parentNode.style.display = 'block';
		document.getElementById(id).parentNode.parentNode.style.display = 'block';
	},

	unlockOne: function(id) {
		document.getElementById(id).style.display = 'block';
	},

	lockdown: function(id) {
		document.getElementById(id).style.display = 'none';
	},

	toggleAllyButtons: function(ally) {
		if (game.allies.indexOf(ally) == -1) {
			document.getElementById(ally.name.replace(/ /g,'') + "AllyButton").style.display = 'block';
			document.getElementById(ally.name.replace(/ /g,'') + "CutTiesButton").style.display = 'none';
		} else {
			document.getElementById(ally.name.replace(/ /g,'') + "AllyButton").style.display = 'none';
			document.getElementById(ally.name.replace(/ /g,'') + "CutTiesButton").style.display = 'block';
		};
		document.getElementById(ally.name.replace(/ /g,'') + "AllyButton").innerHTML = 'Ally (' + ally.allyCost + ' Rep)';
	},

	enableAction: function(action) {
		document.getElementById(action.name.replace(/ /g,'') + "ActButton").disabled = false;
		document.getElementById(action.name.replace(/ /g,'') + "PlanButton").disabled = true;
	},

	disableAction: function(action) {
		document.getElementById(action.name.replace(/ /g,'') + "ActButton").disabled = true;
		document.getElementById(action.name.replace(/ /g,'') + "PlanButton").disabled = false;
	},

	displayEventResult: function(action,turnout,buzzModifier) {
		var CoordinationNotesDiv = document.getElementById('CoordinationNotesDiv');
		CoordinationNotesDiv.style.display = 'block';
		CoordinationNotesDiv.innerHTML = '';
		var div = document.createElement('div');
		div.innerHTML = action.name + ' had '+turnout.toLocaleString()+" turnout amid "+(Math.round(game.buzz*100)/100).toLocaleString()+" buzz (x"+buzzModifier+").";
		CoordinationNotesDiv.appendChild(div);
		var ul = document.createElement('ul');
		CoordinationNotesDiv.appendChild(ul);
		for (var stat of ['people','money','reputation','support']) {
			var num = Math.floor(action[stat] * turnout * game.buzzModifier());
			if (num > 0) {
				var li = document.createElement('li');
				li.innerHTML = "+"+num.toLocaleString()+" "+stat;
				ul.appendChild(li);
			};
		};
	},

	displayBattleResult: function(action,commCasualties,corpCasualties,result) {
		var AuxiliaryNotesDiv = document.getElementById('AuxiliaryNotesDiv');
		AuxiliaryNotesDiv.style.display = 'block';
		AuxiliaryNotesDiv.innerHTML = '';
		var victoryDefeat = 'defeat';
		if (corpCasualties > commCasualties) {victoryDefeat = 'victory!'};
		var div = document.createElement('div');
		AuxiliaryNotesDiv.appendChild(div);
		div.innerHTML = action.name + " is a " + victoryDefeat + "!";
		var ul = document.createElement('ul');
		div.appendChild(ul);
		var li = document.createElement('li');
		ul.appendChild(li);
		li.innerHTML = commCasualties + ' auxiliary casualties';
		var li = document.createElement('li');
		ul.appendChild(li);
		li.innerHTML = corpCasualties + ' mercenary casualties';
		var li = document.createElement('li');
		ul.appendChild(li);
		li.innerHTML = result;
	},

	lowBuzzWarning: function() {
		var div = document.getElementById('ReputationNotesDiv');
		div.style.display = 'block';
		div.innerHTML = '';
		var lowDiv = document.createElement('div');
		lowDiv.id = 'lowBuzzDiv';
		lowDiv.innerHTML = "Your office can't do anything without buzz!";
		div.appendChild(lowDiv);
	},

	clearReputationNotes: function() {
		var div = document.getElementById('ReputationNotesDiv');
		div.style.display = 'block';
		div.innerHTML = '';
	},

	updateStaffSummary: function(totalStaff,totalPayroll) {
	},

	displayLegislation: function(legislation) {
		var legislationDiv = document.createElement('div');
		legislationDiv.id = legislation.name.toLowerCase().replace(/ /g,'')+'LegislationDiv';
		legislationDiv.className = 'Legislation';
		var h4 = document.createElement('h4');
		legislationDiv.appendChild(h4);
		h4.innerHTML = legislation.name;
		var statusP = document.createElement('p');
		legislationDiv.appendChild(statusP);
		statusP.innerHTML = "Status: " + legislation.status;
		var descP = document.createElement('p');
		legislationDiv.appendChild(descP);
		descP.innerHTML = legislation.description;
		var effectsArray = [];
		if (legislation.status == 'available') {
			for (var effect of legislation.effects) {
				if (effect.change !== 0) {
					var string = '';
					if (effect.change > 0) {
						string = "+";
					};
					string += effect.change + " " + effect.name;
					effectsArray.push(string);
				};
			};
		};
		var effectsP = document.createElement('p');
		legislationDiv.appendChild(effectsP);
		effectsP.innerHTML = gamen.prettyList(effectsArray);
		var replaceArray = [];
		for (var replace of legislation.replaces) {
			for (var leg of game.legislation) {
				if (leg.name == replace && leg.status == 'enacted') {
					replaceArray.push(replace)
				};
			};
		};
		if (replaceArray.length > 0) {
			var replaceP = document.createElement('p');
			legislationDiv.appendChild(replaceP);
			replaceP.innerHTML = "Replaces " + gamen.prettyList(replaceArray);
		};
		var legislativeActionsP = document.createElement('p');
		legislationDiv.appendChild(legislativeActionsP);
		var lobbyCost = game.legislationLobbyCost();
		if (legislation.status == 'available') {
			var promoteButton = document.createElement('button');
			legislativeActionsP.appendChild(promoteButton);
			promoteButton.innerHTML = 'Promote<br />('+lobbyCost.toLocaleString()+' Rep)';
			promoteButton.addEventListener('click',handlers.promote.bind(game,legislation));
			if (game.reputation < lobbyCost) {promoteButton.disabled = true;};
			var passButton = document.createElement('button');
			legislativeActionsP.appendChild(passButton);
			passButton.innerHTML = 'Pass Legislation<br />('+game.legislationPassCost(legislation).toLocaleString()+' Clout)';
			passButton.addEventListener('click',handlers.pass.bind(game,legislation));
			if (game.clout < game.legislationPassCost(legislation)) {passButton.disabled = true;};
		} else if (legislation.status == 'enacted') {
			var denounceButton = document.createElement('button');
			legislativeActionsP.appendChild(denounceButton);
			denounceButton.innerHTML = 'Denounce<br />('+lobbyCost.toLocaleString()+' Rep)';
			denounceButton.addEventListener('click',handlers.denounce.bind(game,legislation));
			if (game.reputation < lobbyCost) {denounceButton.disabled = true;};
			var repealButton = document.createElement('button');
			legislativeActionsP.appendChild(repealButton);
			repealButton.innerHTML = 'Repeal Legislation<br />('+game.legislationRepealCost(legislation).toLocaleString()+' Clout)';
			repealButton.addEventListener('click',handlers.repeal.bind(game,legislation));
			if (game.clout < game.legislationRepealCost(legislation)) {repealButton.disabled = true;};
		};
		if (game.legislation[0].status == 'enacted') {
			if (passButton !== undefined) {passButton.style.display = 'none';};
			if (repealButton !== undefined) {repealButton.style.display = 'none';};
		};

		var LegislationNotesDiv = document.getElementById('LegislationNotesDiv');
		LegislationNotesDiv.innerHTML = '';
		LegislationNotesDiv.appendChild(legislationDiv);
		LegislationNotesDiv.style.display = 'block';
	},

	overton: function() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.id = 'overtonSVG';
		svg.setAttribute('viewBox','-16 -50 32 100');
		for (var i=0;i<7;i++) {
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			svg.appendChild(rect);
			rect.id = 'overtonRect'+i;
			rect.setAttribute('x',(30-i*1.5)/-2);
			rect.setAttribute('y',(100-i*15)/-2);
			rect.setAttribute('width',30 - i*1.5);
			rect.setAttribute('height',100 - i * 15);
			var colorChar = Math.round((i)*255/6).toString(16);
			var fill = "#"+colorChar+colorChar+colorChar;
			rect.setAttribute('fill',fill);
		};
		rect.setAttribute('stroke','#ccc');
		rect.setAttribute('stroke-width',0.25);

		for (var i in game.legislation) {
			var overtonLevel = i * (98/game.legislation.length) - 49;
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			svg.appendChild(text);
			text.id = game.legislation[i].name.toLowerCase().replace(/ /g,'')+'LegislationText';
			text.innerHTML = game.legislation[i].name;
			text.setAttribute('x',0);
			text.setAttribute('y',overtonLevel+1);
			text.setAttribute('font-size',1.8);
			text.setAttribute('text-anchor','middle');
			game.legislation[i].overton = overtonLevel;
			game.legislation[i].node = text;
			text.addEventListener('click',handlers.displayLegislation.bind(this,game.legislation[i]));
			view.fillStrokeLegislation(game.legislation[i]);
		};

		return svg;
	},

	fillStrokeLegislation: function(legislation) {
		if (legislation.status == 'repealed') {
			legislation.node.setAttribute('fill','grey');
			legislation.node.setAttribute('stroke','none');
		} else if (legislation.status == 'enacted') {
			legislation.node.setAttribute('fill','black');
			legislation.node.setAttribute('stroke','white');
			legislation.node.setAttribute('stroke-width','0.5');
			legislation.node.setAttribute('paint-order','stroke');
		} else if (legislation.overton < game.overton - 25) {
			legislation.node.setAttribute('fill','none');
			legislation.node.setAttribute('stroke','none');
		} else {
			legislation.node.setAttribute('fill','black');
			legislation.node.setAttribute('stroke','none');
		};
	},

	fillStrokeAllLegislation: function() {
		for (var legislation of game.legislation) {
			view.fillStrokeLegislation(legislation);
		};
	},

	shiftOverton: function(centerPoint) {
		var bottomPoint = 0;
		for (var i=0;i<7;i++) {
			var rect = document.getElementById('overtonRect'+i);
			rect.setAttribute('y',(centerPoint * i + bottomPoint * (7 - i) )/7 - (100 - i * 15)/2);
		};
	},

	lorenz: function() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.id = 'lorenzSVG';
		svg.setAttribute('viewBox','-110 -110 220 220');
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		svg.appendChild(line);
		line.setAttribute('x1',-101);
		line.setAttribute('y1',101);
		line.setAttribute('x2',101);
		line.setAttribute('y2',101);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',1);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		svg.appendChild(text);
		text.setAttribute('x',0);
		text.setAttribute('y',108);
		text.setAttribute('font-size',20);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('stroke','white');
		text.setAttribute('stroke-width','5');
		text.setAttribute('paint-order','stroke');
		text.innerHTML = 'People';
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		svg.appendChild(line);
		line.setAttribute('x1',101);
		line.setAttribute('y1',-101);
		line.setAttribute('x2',101);
		line.setAttribute('y2',101);
		line.setAttribute('stroke','black');
		line.setAttribute('stroke-width',1);
		var text = document.createElementNS('http://www.w3.org/2000/svg','text');
		svg.appendChild(text);
		text.setAttribute('x',0);
		text.setAttribute('y',108);
		text.setAttribute('font-size',20);
		text.setAttribute('text-anchor','middle');
		text.setAttribute('stroke','white');
		text.setAttribute('paint-order','stroke');
		text.setAttribute('stroke-width','5');
		text.setAttribute('transform','rotate(-90)');
		text.innerHTML = 'Wealth';
		var line = document.createElementNS('http://www.w3.org/2000/svg','line');
		svg.appendChild(line);
		line.setAttribute('x1',-101);
		line.setAttribute('y1',101);
		line.setAttribute('x2',101);
		line.setAttribute('y2',-101);
		line.setAttribute('stroke','grey');
		line.setAttribute('stroke-width',1);
		line.setAttribute('stroke-dasharray','10,10');
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.id = 'lorenzCurve';
		svg.appendChild(path);
		path.setAttribute('d','M-100,100 C 0,100 100,0 100,-100');
		path.setAttribute('fill','none');
		path.setAttribute('stroke','red');
		path.setAttribute('stroke-width',1);

		return svg;
	},

	shiftLorenz: function(num) {
		num = Math.max(0,num);
		var lorenzCurve = document.getElementById('lorenzCurve');
		var d = 'M-100,100 C '+(-100+num*2)+',100 100,'+(-100 + num*2)+' 100,-100';
		lorenzCurve.setAttribute('d',d);
	},

	seizeElevator: function() {
		var AlphaCentauriExpeditionNotesDiv = document.getElementById('AlphaCentauriExpeditionNotesDiv');
		AlphaCentauriExpeditionNotesDiv.style.display = 'block';
		AlphaCentauriExpeditionNotesDiv.innerHTML = '';
		var p = document.createElement('p');
		AlphaCentauriExpeditionNotesDiv.appendChild(p);
		p.className = 'elevatorSeized';
		p.innerHTML = "The Corporate Insurgency has seized the Space Elevator!";
		document.getElementById('launchButton').disabled = true;
	},

	reclaimElevator: function() {
		document.getElementById('AlphaCentauriExpeditionNotesDiv').innerHTML = '';
	},

	enableLaunch: function() {
		document.getElementById('launchButton').disabled = false;
	},

	victoryScreen: function() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.id = 'victorySVG';
		svg.setAttribute('viewBox','-100 -61.5 200 123');
		var backsplash = document.createElementNS('http://www.w3.org/2000/svg','g');
		svg.appendChild(backsplash);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		backsplash.appendChild(rect);
		rect.setAttribute('x',-110);
		rect.setAttribute('y',-70);
		rect.setAttribute('width',220);
		rect.setAttribute('height',140);
		rect.setAttribute('fill','black');
		var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
		backsplash.appendChild(animate);
		animate.setAttribute('attributeName','opacity');
		animate.setAttribute('from','0');
		animate.setAttribute('to','1');
		animate.setAttribute('dur','4s');
		animate.setAttribute('begin','indefinite');
		animate.beginElement();


		var starColors = ['#ffd27d','#ffa371','#a6a8ff','#fffa86','#a87bff']
		var stars = document.createElementNS('http://www.w3.org/2000/svg','g');
		svg.appendChild(stars);
		stars.setAttribute('opacity',0);
		for (var i=0;i<800;i++) {
			var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
			stars.appendChild(circle);
			circle.setAttribute('cx',Math.random() * 200 - 100);
			circle.setAttribute('cy',Math.random() * 140 - 70);
			circle.setAttribute('r',Math.random()*Math.random());
			circle.setAttribute('fill',starColors[Math.random() * starColors.length << 0]);
		};
		var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
		stars.appendChild(animate);
		animate.setAttribute('attributeName','opacity');
		animate.setAttribute('from','0');
		animate.setAttribute('to','1');
		animate.setAttribute('dur','3s');
		animate.setAttribute('begin','indefinite');
		animate.setAttribute('fill','freeze');
		setTimeout(view.fadeIn.bind(view,animate),3000);

		var words = [
			{string:'FULLY',x:-63,y:-40,size:19,xScale:1},
			{string:'-AUTOMATED',x:32,y:-40,size:19,xScale:1},
			{string:'LUXURY',x:0,y:-11,size:30,xScale:1.55},
			{string:'QUEER',x:-49,y:14,size:26,xScale:1},
			{string:'SPACE',x:52,y:14,size:26,xScale:1},
			{string:'COMMUNISM',x:0,y:43,size:30,xScale:1},
		];
		var i = 4000;
		for (var word of words) {
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			text.setAttribute('x',word.x);
			text.setAttribute('y',word.y);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('font-size',word.size);
			text.setAttribute('font-weight','bolder');
			text.setAttribute('fill','white');
			text.setAttribute('transform','scale('+word.xScale+',1)');
			text.innerHTML = word.string

			setTimeout(view.victorySnap.bind(view,text),i);
			i += 1000;
		};

		i+= 1000;

		// Buttons
		var buttons = [
			{string:'Play Again',x:-50,href:''},
			{string:'Patreon',x:0,href:'https://www.patreon.com/joshroby'},
			{string:'Brag',x:50,href:'http://twitter.com/home?status=I unlocked FALQSComm in '+game.tickCount.toLocaleString()+' weeks! http://joshroby.com/FALQSComm/'},
		];
		for (var button of buttons) {
			var anchor = document.createElementNS('http://www.w3.org/2000/svg','a');
			anchor.setAttribute('href',button.href);
			if (button.href !== '' ) {anchor.setAttribute('target','_blank');};
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			anchor.appendChild(rect);
			rect.setAttribute('x',button.x - 22);
			rect.setAttribute('width',44);
			rect.setAttribute('y',50);
			rect.setAttribute('height',10);
			rect.setAttribute('rx',4);
			rect.setAttribute('ry',4);
			rect.setAttribute('fill','white');
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			anchor.appendChild(text);
			text.setAttribute('x',button.x);
			text.setAttribute('y',57.5);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('fill','black');
			text.setAttribute('font-size',7.5);
			text.setAttribute('font-weight','bold');
			text.innerHTML = button.string;

			setTimeout(view.victorySnap.bind(view,anchor),i);
			i+= 500;
		};

		//

// 		document.body.innerHTML = '';
		document.body.appendChild(svg);
	},

	defeatScreen: function() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.id = 'victorySVG';
		svg.setAttribute('viewBox','-100 -61.5 200 123');
		var backsplash = document.createElementNS('http://www.w3.org/2000/svg','g');
		svg.appendChild(backsplash);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		backsplash.appendChild(rect);
		rect.setAttribute('x',-110);
		rect.setAttribute('y',-70);
		rect.setAttribute('width',220);
		rect.setAttribute('height',140);
		rect.setAttribute('fill','white');
		var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
		backsplash.appendChild(animate);
		animate.setAttribute('attributeName','opacity');
		animate.setAttribute('from','0');
		animate.setAttribute('to','1');
		animate.setAttribute('dur','6s');
		animate.setAttribute('begin','indefinite');
		animate.beginElement();


		var words = [
			{string:'When the corporations take over, it is not gently.',x:0,y:-30,size:3.5,xScale:1},
			{string:'All public art is destroyed.  Everything deemed a luxury is confiscated.  Dissent is crushed.',x:0,y:-20,size:3.5,xScale:1},
			{string:'The Legislature is reconstituted, with seats explicitly going to the highest bidder.',x:0,y:-10,size:3.5,xScale:1},
			{string:'The corporate owners retreat to space stations.  Everyone left becomes an "employee."',x:0,y:0,size:3.5,xScale:1},
			{string:'Disinformation blares across every screen, demonizing you and your organization.',x:0,y:10,size:3.5,xScale:1},
			{string:"There is no outcry&#8212;there isn't even media coverage&#8212;when you are shot.",x:0,y:20,size:3.5,xScale:1},
		];
		var i = 4000;
		for (var word of words) {
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			text.setAttribute('x',word.x);
			text.setAttribute('y',word.y);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('font-size',word.size);
			text.setAttribute('font-weight','bolder');
			text.setAttribute('fill','black');
			text.setAttribute('transform','scale('+word.xScale+',1)');
			text.innerHTML = word.string

			setTimeout(view.victorySnap.bind(view,text),i);
			i += 2000;
		};

		i+= 1000;

		// Buttons
		var buttons = [
			{string:'Play Again',x:-30,href:''},
			{string:'Patreon',x:30,href:'https://www.patreon.com/joshroby'},
// 			{string:'Brag',x:50,href:'http://twitter.com/home?status=I unlocked FALQSComm in '+game.tickCount.toLocaleString()+' weeks! http://joshroby.com/FALQSComm/'},
		];
		for (var button of buttons) {
			var anchor = document.createElementNS('http://www.w3.org/2000/svg','a');
			anchor.setAttribute('href',button.href);
			if (button.href !== '' ) {anchor.setAttribute('target','_blank');};
			var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
			anchor.appendChild(rect);
			rect.setAttribute('x',button.x - 22);
			rect.setAttribute('width',44);
			rect.setAttribute('y',50);
			rect.setAttribute('height',10);
			rect.setAttribute('rx',4);
			rect.setAttribute('ry',4);
			rect.setAttribute('fill','black');
			var text = document.createElementNS('http://www.w3.org/2000/svg','text');
			anchor.appendChild(text);
			text.setAttribute('x',button.x);
			text.setAttribute('y',57.5);
			text.setAttribute('text-anchor','middle');
			text.setAttribute('fill','white');
			text.setAttribute('font-size',7.5);
			text.setAttribute('font-weight','bold');
			text.innerHTML = button.string;

			setTimeout(view.victorySnap.bind(view,anchor),i);
			i+= 500;
		};

		//

// 		document.body.innerHTML = '';
		document.body.appendChild(svg);
	},

	victorySnap: function(group) {
		document.getElementById('victorySVG').appendChild(group);
	},

	fadeIn: function(group) {
		group.beginElement();
	},

	enableButtons: function() {
		var nominateButton = document.getElementById('nominateButton');
		if (game.reputation < 100000) {
			nominateButton.disabled = true;
		} else {
			nominateButton.disabled = false;
		};
		var fundButton = document.getElementById('fundButton');
		if (game.money < 100000) {
			fundButton.disabled = true;
		} else {
			fundButton.disabled = false;
		};
	},
};