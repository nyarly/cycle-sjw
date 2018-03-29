var model = {

	gameTitle: 'FALQSComm',

	supportLink: 'http://patreon.com/joshroby',
	supportLinkLabel: 'Patreon',

	gameDivContents: function() {

		handlers.tick();

		var contentsArray = [];

		var startDiv = document.createElement('div');
		startDiv.id = 'startDiv';
		contentsArray.push(startDiv);
		var p = document.createElement('p');
		startDiv.appendChild(p);
		p.innerHTML = 'It starts with one conversation.'
		var p = document.createElement('p');
		startDiv.appendChild(p);
		p.innerHTML = '"I want to make our world a better place," you say.  "And I want your help."'
		var startButton = document.createElement('button');
		startDiv.appendChild(startButton);
		startButton.innerHTML = 'Organize';
		startButton.addEventListener('click',handlers.newGame);

		return contentsArray;

	},

};

function Game() {

	this.tickCount = 0;

	this.people = 1;
	this.money = 0;
	this.allymembers = 0;
	this.reputation = 0.1;
	this.buzz = 0;
	this.buzzModifier = function() {return Math.floor(Math.log(this.buzz+1) / Math.LN10 + 1.000000001) };

	this.officespace = 4;

	this.candidates = 0;
	this.support = 0;
	this.chances = 0;
	this.nextelection = 0;

	this.legislators = 0;
	this.legislatureSize = 235;
	this.clout = 0;
	this.obstruction = 100;
	this.overton = 50;

	this.coordinationAuto = 0;
	this.progress = {};

	this.electoralThreshold = 1000;

	this.soldiers = 0;
	this.logistics = 0;
	this.medics = 0;
	this.wounded = 0;

	this.launchpreparation = 0;

	this.thresholds = {
		Organization: [
			{name:'Unlock March',key:'March',stat:'People',minimum:10,reveal:'MarchActionDiv'},
			{name:'Unlock Picket',key:'Picket',stat:'People',minimum:20,reveal:'PicketActionDiv'},
			{name:'Unlock Direct Action',key:'DirectAction',stat:'People',minimum:100,reveal:'DirectActionActionDiv'},
			{name:'Unlock Protest',key:'Protest',stat:'People',minimum:200,reveal:'ProtestActionDiv'},
			{name:'Unlock Rally',key:'Rally',stat:'People',minimum:1000,reveal:'RallyActionDiv'},
			{name:'Unlock General Strike',key:'GeneralStrike',stat:'People',minimum:100000,reveal:'GeneralStrikeActionDiv'},
		],
		Reputation: [
			{name:'Unlock Coordinated Social Media',key:'SocialMediaAmbassadors',stat:'Reputation',minimum:10,reveal:'SocialMediaAmbassadorsEmployeeDiv'},
			{name:'Unlock Fundraiser Event',key:'Fundraiser',stat:'Reputation',minimum:50,reveal:'FundraiserActionDiv'},
			{name:'Unlock Alliances',key:'Alliances',stat:'Reputation',minimum:100,reveal:'AlliancesAlliesDiv'},
			{name:'Unlock Volunteer Coordinators',key:'VolunteerCoordinators',stat:'Reputation',minimum:200,reveal:'VolunteerCoordinatorsEmployeeDiv'},
			{name:'Unlock Recruiters',key:'Recruiters',stat:'Reputation',minimum:500,reveal:'RecruitersEmployeeDiv'},
			{name:'Unlock Professional Fundraisers',key:'Fundraisers',stat:'Reputation',minimum:1000,reveal:'FundraisersEmployeeDiv'},
			{name:'Unlock Event Planners',key:'EventPlanners',stat:'Reputation',minimum:2000,reveal:'EventPlannersEmployeeDiv'},
// 			{name:'Unlock Networkers',key:'Networkers',stat:'Reputation',minimum:2000,reveal:'NetworkersEmployeeDiv'},
			{name:'Unlock Grant Writers',key:'GrantWriters',stat:'Reputation',minimum:7500,reveal:'GrantWritersEmployeeDiv'},
			{name:'Unlock Action Campaign',key:'DirectActionCampaign',stat:'Reputation',minimum:10000,reveal:'DirectActionCampaignActionDiv'},
			{name:'Unlock Fundraising Campaign',key:'FundraisingCampaign',stat:'Reputation',minimum:20000,reveal:'FundraisingCampaignActionDiv'},
			{name:'Unlock Lobbyists',key:'Lobbyists',stat:'Reputation',minimum:50000,reveal:'LobbyistsEmployeeDiv'},
			{name:'Unlock Office',key:'Office',stat:'Reputation',minimum:50000,reveal:'OfficeNotesDiv'},
			{name:'Unlock Candidates',key:'Candidates',stat:'Reputation',minimum:100000,reveal:'CandidatesCandidatesDiv'},
			{name:'Unlock Campaign Staff',key:'CampaignStaff',stat:'Reputation',minimum:200000,reveal:'CampaignStaffEmployeeDiv'},
		],
		Candidates: [
			{name:'Unlock Legislature',key:'Legislature',stat:'Legislators',minimum:1,reveal:'LegislatorsEmployeeDiv'},
			{name:'Unlock Legislation',key:'Legislation',stat:'Legislators',minimum:1,reveal:'LegislationDiv'},
		],
		Legislators: [
			{name:'Unlock Status Quo',key:'StatusQuo',stat:'Legislators',minimum:1,reveal:'StatusQuoSolidarityDiv'},
		],
		Office: [
			{name:'Unlock Legislation',key:'Legislation',stat:'Lobbyists',minimum:1,reveal:'LegislationDiv'},
			{name:'Unlock Status Quo',key:'StatusQuo',stat:'Lobbyists',minimum:1,reveal:'StatusQuoSolidarityDiv'},
		],
		Auxiliary: [
			{name:'Unlock Reclaim Assets',key:'SeizeAssets',stat:'Soldiers',minimum:1000,reveal:'ReclaimAssetsOperationActionDiv'},
			{name:'Unlock Liberate Enslaved Workers',key:'LiberateEnslavedWorkers',stat:'Soldiers',minimum:10000,reveal:'LiberateEnslavedWorkersOperationActionDiv'},
			{name:'Unlock Frontal Assault',key:'FrontalAssault',stat:'Soldiers',minimum:20000,reveal:'FrontalAssaultActionDiv'},
			{name:'Unlock Humiliation Campaign',key:'HumiliationCampaign',stat:'Soldiers',minimum:50000,reveal:'HumiliationCampaignActionDiv'},
		],
	};

	this.unlocks = [
		{name:'Director of Grassroots Operations',header:'Office',stat:'People',minimum:50000,description:'Executes planned events'},
		{name:'Caucus',header:'Legislature',stat:'Legislators',minimum:20,description:'Collaboration and coordination yields more Clout.'},
	];

	this.upgrades = [
		{name:'Launch Website',header: 'Office',costStat:'Money',costNum:100,description:'Increases recruitment and fundraising effectiveness.'},
		{name:'Recurring Donations',prerequisite:'Launch Website',header: 'Office',costStat:'Money',costNum:500,description:'Secures a small income based on membership size.'},
		{name:'Integrated Social Media',prerequisite:'Launch Website',header: 'Office',costStat:'Money',costNum:500,description:'Social Media Ambassadors decrease buzz decay rate.'},
		{name:'Online Calendar',prerequisite:'Launch Website',header: 'Office',costStat:'Money',costNum:1000,description:'Allows volunteers to contribute shifts to events in a chaotic and unreliable fashion.'},
// 		{name:'Revamp Website',prerequisite:'Launch Website',header: 'Office',costStat:'Money',costNum:10000,description:'Improves all website benefits.'},
		{name:'Office Unit',header: 'Office',costStat:'Money',costNum:100000,upgradeStat:'Office Space',upgradeToNum:10},
		{name:'Office Suite',prerequisite:'Office Unit',header: 'Office',costStat:'Money',costNum:500000,upgradeStat:'Office Space',upgradeToNum:20},
		{name:'Storefront Office',prerequisite:'Office Suite',header: 'Office',costStat:'Money',costNum:1000000,upgradeStat:'Office Space',upgradeToNum:50},
		{name:'Small Office Building',prerequisite:'Storefront Office',header: 'Office',costStat:'Money',costNum:5000000,upgradeStat:'Office Space',upgradeToNum:100},
		{name:'Tower Floor',prerequisite:'Small Office Building',header: 'Office',costStat:'Money',costNum:50000000,upgradeStat:'Office Space',upgradeToNum:200},
		{name:'Office Tower',prerequisite:'Tower Floor',header: 'Office',costStat:'Money',costNum:100000000,upgradeStat:'Office Space',upgradeToNum:500},
// 		{name:'Metropolitan Office Tower',prerequisite:'Office Tower',header: 'Office',costStat:'Money',costNum:5000000,upgradeStat:'Office Space',upgradeToNum:700},
		{name:'Field Office',prerequisite:'Office Tower',header: 'Office',costStat:'Money',costNum:500000,upgradeStat:'Office Space',upgradeByNum:50},
	];

	this.actions = [
		{name:'Picket',header:'Coordination',completion:0.1,max:100,people: 0,money: 0,reputation:1,progress:0},
		{name:'March',header:'Coordination',completion:0.2,people: 0.2,money: 0,reputation:0.8,progress:0},
		{name:'Protest',header:'Coordination',completion:0.3,max:200,people: 0.1,money: 0,reputation:0.9,progress:0},
		{name:'Direct Action',header:'Coordination',completion:0.5,max:500,people: 0.4,money: 0.2,reputation:0.4,progress:0},
		{name:'Fundraiser',header:'Coordination',completion:0.5,max:1000,people: 0.1,money: 5,reputation:0.2,progress:0},
		{name:'Direct Action Campaign',header:'Coordination',completion:0.5,people: 0.5,money: 0.2,reputation:0.5,progress:0},
		{name:'Fundraising Campaign',header:'Coordination',completion:0.5,people: 0.1,money: 0.8,reputation:0.2,progress:0},
		{name:'Rally',header:'Coordination',completion:1,people: 0.2,money: 0.3,reputation:0.1,support:1,progress:0},
		{name:'General Strike',header:'Coordination',completion:1,people: 0,money: 0,reputation:2,progress:0},
		{name:'Auxiliaries Recruitment Drive',header:"Auxiliary",completion:1000,progress:1000},
		{name:'Reclaim Assets Operation',header:"Auxiliary",completion:10000,progress:0,stakes:0.1},
		{name:'Liberate Enslaved Workers Operation',header:"Auxiliary",completion:100000,progress:0,stakes:0.5},
		{name:'Frontal Assault',header:"Auxiliary",completion:1000000,progress:0,stakes:1},
		{name:'Humiliation Campaign',header:"Auxiliary",completion:10000000,progress:0,stakes:1.5},
	];

	this.staff = [
		{name:'Social Media Ambassadors',pay:600,header:'Office',work:{People:2,Money:100}},
		{name:'Volunteer Coordinators',pay:800,header:'Office'},
		{name:'Recruiters',pay:1000,header:'Office',work:{People:5}},
		{name:'Fundraisers',pay:1200,header:'Office',work:{Money:500}},
		{name:'Grant Writers',pay:1500,header:'Office'},
		{name:'Event Planners',pay:2000,header:'Office'},
		{name:'Networkers',pay:3000,header:'Office'},
		{name:'Lobbyists',pay:5000,header:'Office'},
		{name:'Campaign Staff',pay:7500,header:'Office',work:{Support:2}},
		{name:'Legislators',pay:0,header:'Legislature',work:{Clout:1}},
		{name:'Counsel',pay:100,header:'Legislature',work:{Clout:1}},
	];
	for (var employee of this.staff) {
		this[employee.name.toLowerCase().replace(/ /g,'')] = 0;
	};

	this.potentialAllies = [
		{name:'Local Activist Network Providing Assistance Right To You',header:"Alliances",members: 100,allyCost:100,tickCostStat:'Money',tickCostNum:-5},
		{name:'Queer Crossroads Shelter',header:"Alliances",members: 20,allyCost:500,tickCostStat:'Reputation',tickCostNum:-1},
		{name:'Local Black Lives Matter',header:"Alliances",members: 200,allyCost:1000,tickCostStat:'Reputation',tickCostNum:-2},
		{name:'Audubon Society Local Chapter',header:"Alliances",members: 100,allyCost:10000,tickCostStat:'Reputation',tickCostNum:1},
		{name:'Fight for $15',header:"Alliances",members: 500,allyCost:2000,tickCostStat:'Buzz',tickCostNum:-10},
		{name:'Indigenous Environmental Network',header:"Alliances",members: 1000,allyCost:3000,tickCostStat:'Buzz',tickCostNum:-10},
		{name:'Muslims for Progressive Values',header:"Alliances",members: 2000,allyCost:5000,tickCostStat:'Reputation',tickCostNum:-50},
		{name:'Service Employees International Union, Local Chapter',header:"Alliances",members: 5000,allyCost:10000,tickCostStat:'Reputation',tickCostNum:-50},
		{name:'Human Rights Campaign',header:"Alliances",members: 10000,allyCost:50000,tickCostStat:'Reputation',tickCostNum:-50},
		{name:'Fair Immigration Reform Movement',header:"Alliances",members: 20000,allyCost:20000,tickCostStat:'Reputation',tickCostNum:-50},
		{name:'Showing Up for Racial Justice',header:"Alliances",members: 500000,allyCost:100000,tickCostStat:'Buzz',tickCostNum:-10},
		{name:'National Organization for Women',header:"Alliances",members: 1000000,allyCost:200000,tickCostStat:'Buzz',tickCostNum:-10},
		{name:'National Black Lives Matter',header:"Alliances",members: 2000000,allyCost:500000,tickCostStat:'Reputation',tickCostNum:-100},
		{name:'Federation of Labor Unions',header:"Alliances",members: 5000000,allyCost:1500000,tickCostStat:'Buzz',tickCostNum:-500},
		{name:'GLAAD',header:"Alliances",members: 10000000,allyCost:1500000,tickCostStat:'Buzz',tickCostNum:-1000},
		{name:'The Neoliberal Establishment',header:"Alliances",members: 50000000,allyCost:10000000,tickCostStat:'People',tickCostNum:-1000},
	];
	this.allies = [];

	this.legislation = [
		{name:'Direct Democracy',replaces:['Publicly Funded Campaigns','Districtless Voting','Shortest Split-Line Districting','Compulsory Voting','Automatic Voter Registration','Robust Voting Protections','Widespread Disenfranchisement','Donations Protected as Speech'],effects:[{name:'Solidarity',change:250},{name:'Obstruction',change:-100}],description:'Policy is determined by popular consensus, mediated by sophisticated telecommunications.  Candidates and Legislators become Campaign Staff, which generates Clout.',support:0,denounce:0,status:'available'},
		{name:'Taxes Abolished',replaces:['Nationalize Real Estate','Nationalize Natural Resources','Million+ Income Total Tax','Progressive Taxation','Regressive Taxation','Open Borders'],effects:[{name:"Corporate Power",change:30},{name:"Economic Inequality",change:-5}],description:'Revenue from government leases replaces tax revenue.',support:0,denounce:0,status:'available'},
		{name:'Build Space Elevator',replaces:['Convert ISS to IISP','Expand Space Program'],effects:[{name:"Tech",change:20},{name:'Solidarity',change:50}],description:"Builds a carbon nanotube tower from the planet's surface to the IILP in Low Earth Orbit, drastically reducing energy costs for launch.",support:0,denounce:0,status:'available'},
		{name:'Educational Credentialing Program',replaces:['Right to Higher Education','Right to Internet Access','Net Neutrality','Public Arts Renaissance','Civic Engineering Academies','Student Loan Forgiveness'],effects:[{name:"Tech",change:10},{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-5}],description:'Education pursued outside of educational institutions can be evaluated for degree certification.',support:0,denounce:0,status:'available'},
		{name:'Right to Cosmetic Healthcare',replaces:['Right to Gender Reassignment','Right to Preventative Healthcare','Right to Corrective Healthcare','Right to Emergency Healthcare','Healthcare Debt'],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-2}],description:'All healthcare is made available to all.',support:0,denounce:0,status:'available'},
		{name:'Marriage Deregulation',replaces:['Degender Government Records','Recognize Nonbinary Genders','Queer Rights Protections'],effects:[{name:'Solidarity',change:40},{name:"Economic Inequality",change:-2}],description:'Marriage laws eliminated in favor of customizable marriage contracts of various terms, durations, and parties.',support:0,denounce:0,status:'available'},
		{name:'Inclusive Public History',replaces:['Reconciliation & Restitution','Acknowledge White Supremacy','Discovery Doctrine'],effects:[{name:'Solidarity',change:80}],description:'A concerted effort to research and revise historical records to account for erased narratives and influences.',support:0,denounce:0,status:'available'},
		{name:'Nationalize Real Estate',replaces:['Nationalize Natural Resources','Million+ Income Total Tax','Progressive Taxation','Regressive Taxation'],effects:[{name:"Corporate Power",change:-30},{name:"Economic Inequality",change:-5}],description:'All land becomes property of the state; unoccupied houses leased to individuals and families in need of homes. Leases pay into the national treasury.',support:0,denounce:0,status:'available'},
		{name:'Right to Shelter',replaces:[],effects:[{name:"Economic Inequality",change:-5}],description:'Citizens are guaranteed basic housing in huge government-run dormitories.',support:0,denounce:0,status:'available'},
		{name:'Right to Gender Reassignment',replaces:['Right to Corrective Healthcare','Right to Emergency Healthcare','Healthcare Debt'],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-1}],description:'Gender Reassignment procedures made available to all.  Cosmetic healthcare remains the financial responsibility of the individual.',support:0,denounce:0,status:'available'},
		{name:'Publicly Funded Campaigns',replaces:['Districtless Voting','Shortest Split-Line Districting','Compulsory Voting','Automatic Voter Registration','Robust Voting Protections','Widespread Disenfranchisement','Donations Protected as Speech'],effects:[{name:"Corporate Power",change:-10},{name:'Obstruction',change:-10}],description:'Campaign spending is limited to an equal budget provided by the state.  Your Campaign Staff get paid by the state.',support:0,denounce:0,status:'available'},
		{name:'Nationalize Natural Resources',replaces:['Million+ Income Total Tax','Progressive Taxation','Regressive Taxation'],effects:[{name:"Tech",change:8},{name:"Corporate Power",change:-30},{name:"Economic Inequality",change:-5}],description:'All natural resources become property of the state; individuals and business interests may lease them by paying into the national treasury.',support:0,denounce:0,status:'available'},
		{name:'Degender Government Records',replaces:['Recognize Nonbinary Genders','Queer Rights Protections'],effects:[{name:'Solidarity',change:40}],description:'Removes all references to gender in all government documents and legislation.  Gender becomes purely a matter of personal expression, not a legal category.',support:0,denounce:0,status:'available'},
		{name:'Districtless Voting',replaces:['Shortest Split-Line Districting','Compulsory Voting','Automatic Voter Registration','Robust Voting Protections','Widespread Disenfranchisement'],effects:[{name:'Solidarity',change:20},{name:'Obstruction',change:-10}],description:'All representation is elected at large; candidates may focus their campaign on self-defined demographics.',support:0,denounce:0,status:'available'},
		{name:'Reconciliation & Restitution',replaces:['Acknowledge White Supremacy','Discovery Doctrine'],effects:[{name:'Solidarity',change:100},{name:"Corporate Power",change:-20},{name:"Economic Inequality",change:-1}],description:'',support:0,denounce:0,status:'available'},
		{name:'Convert ISS to IISP',replaces:['Expand Space Program'],effects:[{name:"Tech",change:10}],description:'Converts the International Space Station into the International Interplanetary Space Port.',support:0,denounce:0,status:'available'},
		{name:'Right to Higher Education',replaces:['Right to Internet Access','Net Neutrality','Public Arts Renaissance','Civic Engineering Academies','Student Loan Forgiveness'],effects:[{name:"Tech",change:10},{name:'Solidarity',change:60},{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-4}],description:'Public education extended through doctorate programs for dedicated students.',support:0,denounce:0,status:'available'},
		{name:'Open Borders',replaces:[],effects:[{name:"Tech",change:7},{name:'Solidarity',change:80}],description:'Border crossings are logged but not restricted.',support:0,denounce:0,status:'available'},
		{name:'Right to Preventative Healthcare',replaces:['Right to Corrective Healthcare','Right to Emergency Healthcare','Healthcare Debt'],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-4}],description:'Preventative, corrective, and emergency healthcare is made available to all.  Additional healthcare is the financial responsibility of the individual.',support:0,denounce:0,status:'available'},
		{name:'Million+ Income Total Tax',replaces:['Progressive Taxation','Regressive Taxation'],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-3}],description:"Income tax beyond a citizen's first million is taxed at 100%.  You can make more, but it's just a high score.  The money goes to your fellow citizens.",support:0,denounce:0,status:'available'},
		{name:'Shortest Split-Line Districting',replaces:['Compulsory Voting','Automatic Voter Registration','Robust Voting Protections','Widespread Disenfranchisement'],effects:[{name:'Solidarity',change:30},{name:'Obstruction',change:-10}],description:'Voting districts are determined by mathematical algorithm to avoid partisan gerrymandering.',support:0,denounce:0,status:'available'},
		{name:"Acknowledge White Supremacy",replaces:['Discovery Doctrine'],effects:[{name:'Solidarity',change:60}],description:'Acknowledge that the state has been complicit in creating and maintaining a white supremacist social order... but do nothing.',support:0,denounce:0,status:'available'},
		{name:'Recognize Nonbinary Genders',replaces:['Queer Rights Protections'],effects:[{name:'Solidarity',change:20}],description:'Allows citizens to obtain government identification in a multitude of genders in addition to "male" and "female."',support:0,denounce:0,status:'available'},
		{name:'Expand Space Program',replaces:[],effects:[{name:"Tech",change:10},],description:'Revitalize the space program with robust funding and visionary goals.',support:0,denounce:0,status:'available'},
		{name:"Citizens' Defense Auxiliary",replaces:[],effects:[],description:"Regulates a citizens' auxiliary militia.",support:0,denounce:0,status:'available'},
		{name:'Compulsory Voting',replaces:['Automatic Voter Registration','Robust Voting Protections','Widespread Disenfranchisement'],effects:[{name:'Obstruction',change:-10}],description:'Failing to vote incurs a significant fine.  All eligible voters are automatically enrolled.',support:0,denounce:0,status:'available'},
		{name:'Public Arts Renaissance',replaces:[],effects:[{name:'Solidarity',change:100}],description:'Significant funding for the production and dissemination of new art spawns innovative new movements.',support:0,denounce:0,status:'available'},
		{name:'Civic Engineering Academies',replaces:['Student Loan Forgiveness'],effects:[{name:"Tech",change:15},],description:'Creates specialized public graduate programs focusing on civil and social engineering.',support:0,denounce:0,status:'available'},
		{name:'Universal Basic Income',replaces:['Progressive Taxation','Regressive Taxation'],effects:[{name:"Economic Inequality",change:-3},{name:"Corporate Power",change:-30}],description:'All citizens receive a government stipend providing a basic standard of living.',support:0,denounce:0,status:'available'},
		{name:'Student Loan Forgiveness',replaces:[],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-2}],description:'Student loan payments are made tax deductible.',support:0,denounce:0,status:'available'},
		{name:'Right to Corrective Healthcare',replaces:['Right to Emergency Healthcare','Healthcare Debt'],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-4}],description:'Corrective and emergency healthcare is made available to all.  Additional healthcare is the financial responsibility of the individual.',support:0,denounce:0,status:'available'},
		{name:'Automatic Voter Registration',replaces:['Robust Voting Protections','Widespread Disenfranchisement'],effects:[{name:'Solidarity',change:30},{name:'Obstruction',change:-10}],description:'Voters are automatically enrolled, but not required to vote.',support:0,denounce:0,status:'available'},
		{name:'Right to Internet Access',replaces:['Net Neutrality'],effects:[{name:"Tech",change:5},{name:"Economic Inequality",change:-2}],description:'Internet access made a public good and a right to all citizens',support:0,denounce:0,status:'available'},
		{name:'Progressive Taxation',replaces:['Regressive Taxation'],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-3}],description:'The rich are taxed at a higher effective rate than the poor.',support:0,denounce:0,status:'available'},
		{name:'Right to Emergency Healthcare',replaces:[],effects:[{name:"Corporate Power",change:-10},{name:"Economic Inequality",change:-3}],description:'Emergency healthcare is made available to all.  Additional healthcare is the financial responsibility of the individual.',support:0,denounce:0,status:'available'},
		{name:'Queer Rights Protections',replaces:[],effects:[{name:'Solidarity',change:20},{name:"Economic Inequality",change:-1}],description:'Individuals may not be discriminated on the basis of gender (assigned or expressed), sexual orientation, or marital affiliation.',support:0,denounce:0,status:'available'},
		{name:'Robust Voting Protections',replaces:['Widespread Disenfranchisement'],effects:[{name:'Solidarity',change:20},{name:'Obstruction',change:-10}],description:'Funding provided to ensure the participation of historically disenfranchised populations.',support:0,denounce:0,status:'available'},
		{name:'Net Neutrality',replaces:[],effects:[{name:"Tech",change:5},{name:"Corporate Power",change:-10}],description:'Private enterprise provides Internet service, but is prohibited from basing fees or services based on content delivered.',support:0,denounce:0,status:'available'},

		{name:'Healthcare Debt',replaces:[],effects:[],description:'Legal framework saddles patients with lifetime debt for medical care.',support:0,denounce:0,status:'enacted',statusquo:true},
		{name:'Donations Protected as Speech',replaces:[],effects:[],description:'Campaign donations are legally protected as speech, allowing the rich to influence politics to a greater degree.',support:0,denounce:0,status:'enacted',statusquo:true},
		{name:'Widespread Disenfranchisement',replaces:[],effects:[],description:'Multiple legal means of disenfranchising voters, especially those from marginalized populations.',support:0,denounce:0,status:'enacted',statusquo:true},
		{name:'Corporate Inculpability',replaces:[],effects:[],description:'Individuals working for corporations cannot be held liable for damages they cause in the course of their job.',support:0,denounce:0,status:'enacted',statusquo:true},
		{name:'Regressive Taxation',replaces:[],effects:[],description:'The poor are taxed at a higher effective rate than the rich.',support:0,denounce:0,status:'enacted',statusquo:true},
		{name:'Discovery Doctrine',replaces:[],effects:[],description:"Land and natural resources deemed 'unimproved' may be freely claimed.",support:0,denounce:0,status:'enacted',statusquo:true},
	];

	this.solidarity = 0;
	this.tech = 0;
	this.corporatepower = 100;
	this.economicinequality = 100;

	this.mercenaries = 100;
	this.prestige = 0;
	this.assetsseized = 0;
	this.populationenslaved = 0;
	this.elevatorSeized = false;

	this.degreesOfAcceptance = [
		'Unthinkable',
		'Radical',
		'Acceptable',
		'Sensible',
		'Popular',
		'Policy',
		'Popular',
		'Sensible',
		'Acceptable',
		'Radical',
		'Unthinkable'
	];

	this.unlocked = {Organization:true};

	this.update = function(stat,add) {
		this[stat.toLowerCase().replace(/ /g,'')] += add;
		view.update(stat);
		if (stat == 'People') {
			for (var action of this.actions) {
				view.updateButton(action);
			};
		} else if (stat == 'Support') {
			this.chances = 0;
			this.update("Chances",this.electoralChances());
		};
	};

	this.attendees = function(action) {
		var attendees = this.people * (Math.random() * 0.5 + 0.5);
		for (var ally of this.allies) {
			attendees += ally.members * Math.random();
		};
		attendees = Math.floor(attendees);
		if (action.max !== undefined) {attendees = Math.min(attendees,action.max);};
		return attendees;
	};

	this.organize = function() {
		var noRecruit = true;
		if (Math.random() < 0.5) {
			noRecruit = false;
			this.update('People',1);
		};
		if (noRecruit || (!noRecruit && Math.random() < 0.5) ) {
			this.update('Money',Math.max(1,Math.random() * Math.random() * 100 << 0));
		};
	};

	this.planAction = function(action) {
		if (action.header == 'Coordination') {
			var completion = Math.floor(action.completion * this.people);
			if (action.progress < completion || action.progress < action.max) {
				action.progress += 1 + game.volunteercoordinators;
			};
			if (action.progress >= completion || action.progress >= action.max) {
				action.progress = Infinity;
				view.enableAction(action);
			};
		} else {
			var completion = action.completion;
			if (action.progress < completion) {
				action.progress += 1 + game.logistics;
			};
			if (action.progress >= completion) {
				action.progress = Infinity;
				view.enableAction(action);
			};
		};
	};

	this.doAction = function(action) {
		if (action.header == 'Coordination') {
			var turnout = this.attendees(action);
			var buzzModifier = this.buzzModifier();
			view.displayEventResult(action,turnout,buzzModifier);
			this.update('Reputation',action.reputation * turnout * buzzModifier);
			this.update('People',action.people * turnout * buzzModifier);
			this.update('Money',action.money * turnout * buzzModifier);
			this.update('Buzz',action.reputation * turnout * buzzModifier);
			this.unlocked.Reputation = true;
			view.unlock('ReputationReputationDiv');
			view.unlock('ReputationBuzzDiv');
		} else {
			action.completion = Math.floor(action.completion * 1.1);
			if (action.name == 'Auxiliaries Recruitment Drive') {
				for (var recruit=0;recruit<game.solidarity;recruit++) {
					game.update(['Soldiers','Soldiers','Soldiers','Logistics','Logistics','Medics'][Math.random() * 6 << 0],Math.random() * 100 << 0);
				};
			} else {
				game.battle(action);
			};
		};
		action.progress = 0;
		view.disableAction(action);
	};

	this.battle = function(action) {
		var result;
		var corpScore = game.mercenaries * Math.random() * action.stakes;
		var commScore = game.soldiers * Math.random();
		var corpCasualties = Math.ceil(Math.min(100,Math.max(1,100 - (corpScore / commScore)*10))/100 * game.mercenaries);
		var commCasualties = Math.ceil(Math.min(100,Math.max(1,100 - (commScore / corpScore)*10))/100 * game.soldiers);
		var num = Math.round(Math.random()*100)/100;
		if (corpScore < commScore) {
			if (action.name == 'Reclaim Assets Operation') {
				num = Math.min(num,game.assetsseized);
				game.update("Assets Seized",-1 * num);
				result = Math.round(num*10000)/100 + "% assets reclaimed";
			} else if (action.name == 'Liberate Enslaved Workers Operation') {
				num = Math.min(num,game.populationenslaved);
				game.update("Population Enslaved",-1 * num);
				result = Math.round(num*10000)/100 + "% population liberated";
			} else if (action.name == 'Frontal Assault') {
				corpCasualties *= 2;
				corpCasualties = Math.min(corpCasualties,game.mercenaries);
			} else if (action.name == 'Humiliation Campaign') {
				num = Math.min(num * 1000,game.prestige);
				game.update("Prestige",-1 * num);
				result = "-" + num + " prestige";
			};
		};
		game.update("Wounded",commCasualties);
		game.update("Soldiers",commCasualties * -1);
		game.update("Mercenaries",corpCasualties * -1);
		view.displayBattleResult(action,commCasualties,corpCasualties,result);
	};

	this.train = function(employee) {
		if (this[employee.name.toLowerCase().replace(/ /g,'')] !== undefined) {
			this[employee.name.toLowerCase().replace(/ /g,'')]++;
		} else {
			this[employee.name.toLowerCase().replace(/ /g,'')] = 1;
		};
		view.update(employee.name);
	};

	this.fire = function(employee) {
		this[employee.name.toLowerCase().replace(/ /g,'')]--;
		view.update(employee.name);
	};

	this.upgrade = function(upgrade) {
		if (upgrade.upgradeByNum == undefined) {
			game.unlocked[upgrade.name.replace(/ /g,'')] = true;
		};
		game.update(upgrade.costStat,upgrade.costNum*-1);
		if (upgrade.upgradeToNum !== undefined) {
			game[upgrade.upgradeStat.toLowerCase().replace(/ /g,'')] = upgrade.upgradeToNum;
		} else if (upgrade.upgradeByNum !== undefined) {
			game[upgrade.upgradeStat.toLowerCase().replace(/ /g,'')] += upgrade.upgradeByNum;
		};
		if (upgrade.upgradeStat == 'Office Space') {
			document.getElementById('OfficeHead').innerHTML = upgrade.name;
			if (upgrade.name == 'Field Office') {
				if (game.fieldOffices == undefined) {
					game.fieldOffices = 1;
				} else {
					game.fieldOffices++
				};
				var adjective = 'Global';
				if (game.fieldOffices < 3) {
					adjective = "National";
				} else if (game.fieldOffices < 8) {
					adjective = "Continent-Spanning";
				};
				document.getElementById('OfficeHead').innerHTML = adjective + " Network of "+(1+game.fieldOffices)+" Offices";
			};
		};
	};

	this.unlock = function(unlock) {
		game.unlocked[unlock.name.replace(/ /g,'')] = true;
	};

	this.ally = function(ally) {
		this.update('Buzz',ally.allyCost);
		this.allies.push(ally);
		this.reputation -= ally.allyCost;
		this.allymembers += ally.members;
		view.update("AllyMembers");
	};

	this.cutTies = function(ally) {
		this.update('Buzz',ally.allyCost);
		ally.allyCost *= 2;
		this.allies.splice(this.allies.indexOf(ally),1);
		this.allymembers -= ally.members;
		view.update("AllyMembers");
	};

	this.nominate = function() {
		this.update("Reputation",-100000);
		this.update("Candidates",1);
	};

	this.fund = function() {
		this.update("Money",-100000);
		this.update("Support",100);
	};

	this.electoralChances = function() {
		var candidates = Math.max(1,this.candidates);
		return 1 - Math.pow(0.5,this.support / candidates / this.electoralThreshold);
	};

	this.legislationLobbyCost = function() {
		return Math.ceil(1000000 / (10 + game.lobbyists));
	};

	this.legislationPassCost = function(legislation) {
		var overton = legislation.overton - game.overton;
		var cost = Math.pow(2,Math.abs(overton)) / (1+legislation.support);
		return Math.ceil(Math.abs(cost));
	};

	this.legislationRepealCost = function(legislation) {
		var overton = Math.max(1,legislation.overton - game.overton + 10);
		var cost = 500000 / (overton*(1+legislation.denounce));
		return Math.ceil(Math.abs(cost));
	};

	this.promote = function(legislation) {
		game.update("Reputation",-10000);
		legislation.support++;
		if (game.legislationPassCost(legislation) < 1000) {
			legislation.status = 'enacted';
			game.enactLegislation(legislation);
			view.fillStrokeAllLegislation();
			view.displayLegislation(legislation);
		};
	},

	this.denounce = function(legislation) {
		game.update("Reputation",-10000);
		legislation.denounce++;
		if (game.legislationRepealCost(legislation) < 1000) {
			legislation.status = 'repealed';
			view.fillStrokeAllLegislation();
			view.displayLegislation(legislation);
		};
	},

	this.pass = function(legislation) {
		var legislationCost = -1 * game.legislationPassCost(legislation);
		game.update("Clout",legislationCost);
		legislation.status = 'enacted';
		game.enactLegislation(legislation);
		view.displayLegislation(legislation);
		view.fillStrokeAllLegislation(legislation);
	},

	this.enactLegislation = function(legislation) {
		for (var effect of legislation.effects) {
			game.update(effect.name.replace(/ /g,''),effect.change);
			if (effect.name == 'Obstruction') {
				game.electoralThreshold /= effect.change * -1;
			};
		};
		for (var leg of game.legislation) {
			if (legislation.replaces.indexOf(leg.name) !== -1 && leg.status == 'enacted') {
				leg.status = 'repealed';
			};
		};
		view.unlock('StatusQuoTechDiv');
		if (legislation.name == 'Direct Democracy') {
			game.update("Campaign Staff",game.legislators + game.candidates);
			game.legislators = 0;
			game.candidates = 0;
			game.support = 0;
			view.lockdown('CandidatesDiv');
			view.lockdown('LegislatureStaffDiv');
			for (var employee of game.staff) {
				if (employee.name == 'Campaign Staff') {
					employee.work = {Clout:1};
				};
			};
		} else if (legislation.name == 'Publicly Funded Campaigns') {
			for (var employee of game.staff) {
				if (employee.name == 'Campaign Staff') {
					employee.pay = 0;
				};
			};
			document.getElementById('CampaignStaffTrainButton').innerHTML = "Train ($0/tick)";
			document.getElementById('fundButton').style.display = 'none';
		} else if (legislation.name == "Citizens' Defense Auxiliary") {
			view.unlock("AuxiliariesRecruitmentDriveActionDiv");
			game.unlocked.Auxiliary = true;
		} else if (legislation.name == 'Build Space Elevator') {
			view.unlock("launchButton");
			game.update("Launch Preparation",game.tech / 10000);
		};
	},

	this.repeal = function(legislation) {
		var legislationCost = -1 * game.legislationRepealCost(legislation);
		game.update("Clout",legislationCost);
		legislation.status = 'repealed';
		view.displayLegislation(legislation);
		view.fillStrokeAllLegislation(legislation);
	},

	this.revert = function(legislation) {
		if (legislation.statusquo == true) {
			legislation.status = 'enacted';
			view.fillStrokeAllLegislation(legislation);
		} else {
			legislation.status = 'available';
			view.fillStrokeAllLegislation(legislation);
		};
		var total = 0, count = 0;
		for (var legislation of game.legislation) {
			if (legislation.status == 'enacted') {
				total += legislation.overton;
				count++;
			};
		};
		if (count > 0) {
			game.overton = 1.2 * total / count;
		};
		view.shiftOverton(game.overton);
		game.economicinequality = game.economicinequality + 5;
		view.shiftLorenz(game.economicinequality);
	},

	this.tick = function() {
		for (var category in this.thresholds) {
			if (this.unlocked[category]) {
				var nextThreshold = undefined;
				for (var threshold of this.thresholds[category]) {
					if (this.unlocked[threshold.key] !== true && game[threshold.stat.toLowerCase()] >= threshold.minimum) {
						this.unlocked[threshold.key] = true;
						if (threshold.reveal !== undefined) {
							view.unlock(threshold.reveal);
						};
					} else if (this.unlocked[threshold.key] !== true) {
						if (nextThreshold == undefined) {
							nextThreshold = threshold;
						};
					};
				};
				var thresholdDiv = document.getElementById(category + "ThresholdsDiv");
				if (nextThreshold == undefined && thresholdDiv) {
					thresholdDiv.innerHTML = '';
					thresholdDiv.style.display = 'none';
				} else if (thresholdDiv) {
					thresholdDiv.innerHTML = nextThreshold.name + " at " + nextThreshold.minimum.toLocaleString() + " " + nextThreshold.stat + ".";
					thresholdDiv.style.display = 'block';
				};
			};
		};
		for (var upgrade of game.upgrades) {
			if (game.unlocked[upgrade.name.replace(/ /g,'')] == undefined && (upgrade.prerequisite == undefined || (upgrade.prerequisite !== undefined && game.unlocked[upgrade.prerequisite.replace(/ /g,'')])) ) {
				view.unlockOne(upgrade.name.replace(/ /g,'') + 'UpgradeDiv');
			} else {
				view.lockdown(upgrade.name.replace(/ /g,'') + 'UpgradeDiv');
			};
		};
		for (var unlock of game.unlocks) {
			if (game.unlocked[unlock.name.replace(/ /g,'')] == undefined && (unlock.prerequisite == undefined || (unlock.prerequisite !== undefined && game.unlocked[unlock.prerequisite.replace(/ /g,'')])) ) {
				view.unlockOne(unlock.name.replace(/ /g,'') + 'UnlockDiv');
			} else {
				view.lockdown(unlock.name.replace(/ /g,'') + 'UnlockDiv');
			};
		};
		if (game.unlocked.RecurringDonations) {
			this.update("Money",this.people * 0.05);
		};
		var totalStaff = 0, totalPayroll = 0;
		for (var employee of this.staff) {
			if (employee.pay > 0) {
				totalStaff += game[employee.name.toLowerCase().replace(/ /g,'')];
			};
			var fireButton = document.getElementById(employee.name.replace(/ /g,'') + "FireButton");
			if (fireButton && game[employee.name.toLowerCase().replace(/ /g,'')] < 1) {
				fireButton.disabled = true;
			} else if (fireButton) {
				fireButton.disabled = false;
			};
			var networkingModifier = 1;
			if (game.unlocked.LaunchWebsite) {
				networkingModifier = 1.2;
			};
			var buzzModifier = this.buzzModifier();
			if (this[employee.name.toLowerCase().replace(/ /g,'')] > 0) {
				var employees = this[employee.name.toLowerCase().replace(/ /g,'')]
				this.money -= employees * employee.pay;
				totalPayroll += employees * employee.pay
				view.update('Money');
				if (employee.work !== undefined) {
					for (var task in employee.work) {
						var change = employees * employee.work[task] * networkingModifier * buzzModifier;
						if (task == 'Clout' && game.unlocked.Caucus) {
							change *= 1.2
						};
						this.update(task,Math.floor(change));
					};
				} else if (employee.name == 'Event Planners') {
					for (var n=0;n<this[employee.name.toLowerCase().replace(/ /g,'')];n++) {
						var action = this.actions[Math.random() * this.actions.length << 0];
						if (action.header == "Coordination" && this.unlocked[action.name.replace(/ /g,'')]) {
							this.planAction(action);
							view.updateButton(action);
							if (game.unlocked.DirectorofGrassrootsOperations && ( action.progress > action.completion * game.people || action.progress > action.max)) {
								this.doAction(action);
							};
						};
					};
				} else if (employee.name == 'Grant Writers') {
					if (Math.random() < 0.01) {
						this.update('Money',1000 * (Math.random() * 20 << 0));
					};
				};
			};
		};
		for (var upgrade of game.upgrades) {
			if (game[upgrade.costStat.toLowerCase().replace(/ /g,'')] < upgrade.costNum) {
				document.getElementById(upgrade.name.toLowerCase().replace(/ /g,'')+ "Button").disabled = true;
			} else {
				document.getElementById(upgrade.name.toLowerCase().replace(/ /g,'')+ "Button").disabled = false;
			};
		};
		for (var unlock of game.unlocks) {
			if (game[unlock.stat.toLowerCase().replace(/ /g,'')] < unlock.minimum) {
				document.getElementById(unlock.name.toLowerCase().replace(/ /g,'')+ "Button").disabled = true;
			} else {
				document.getElementById(unlock.name.toLowerCase().replace(/ /g,'')+ "Button").disabled = false;
			};
		};
		for (var ally of game.allies) {
			game[ally.tickCostStat.toLowerCase().replace(/ /g,'')] += ally.tickCostNum;
			view.update(ally.tickCostStat);
		};
		for (var ally of game.potentialAllies) {
			if (ally.allyCost > game.reputation && game.allies.indexOf(ally) == -1) {
				document.getElementById(ally.name.replace(/ /g,'')+'AllyDiv').style.display = 'none';
			} else {
				document.getElementById(ally.name.replace(/ /g,'')+'AllyDiv').style.display = 'block';
			};
		};
		var volunteers = Math.min(50,game.people / ( Math.random() * 500 ));
		for (var action of game.actions) {
			if (action.header !== 'Coordination' && game.unlocked[action.name.replace(/ /g,'')]) {
				action.progress += game.logistics;
				view.updateButton(action);
				if (action.progress > action.completion) {
					action.progress = Infinity;
					view.enableAction(action);
				};
			} else if (game.unlocked.OnlineCalendar && game.unlocked[action.name.replace(/ /g,'')]) {
				for (var i=0;i<volunteers;i++) {
					if (Math.random() > 0.5) {
						this.planAction(action);
						view.updateButton(action);
						if (game.unlocked.DirectorofGrassrootsOperations && ( action.progress > action.completion * game.people || action.progress > action.max)) {
							this.doAction(action);
						};
					};
				};
			};
		};

		if (game.buzz > 0) {
			var integratedsocialmedia = 0;
			if (game.unlocked.IntegratedSocialMedia == true) {integratedsocialmedia = game.socialmediaambassadors};
			this.update('Buzz',game.buzz * -0.1 / (1+integratedsocialmedia));
			if (game.buzz < 10 && totalStaff > 0) {view.lowBuzzWarning();} else {view.clearReputationNotes();};
		} else {
			game.buzz = 0;
		};

		// Allies Subsuming
		for (var ally of game.potentialAllies) {
			if (ally.members < game.people / 100) {
				game.potentialAllies.splice(game.potentialAllies.indexOf(ally),1);
				game.allies.splice(game.allies.indexOf(ally),1);
				game.update("AllyMembers",ally.members * -1);
				document.getElementById(ally.name.replace(/ /g,'') + 'AllyDiv').style.display = 'none';
			};
		};

		// Elections
		if (game.nextelection > 0) {
			this.update('Next Election',-1);
		} else {
			var chances = this.electoralChances();
			for (var c=0;c<this.candidates;c++) {
				if (Math.random() < chances) {
					this.update('Legislators',1);
					this.electoralThreshold *= 1.1;
					view.unlock('LegislatureStaffDiv');
				};
			};
			this.update('Next Election',52);
			this.update('Candidates',-1 * this.candidates);
			this.update('Support',-1 * this.support);
			this.update('Chances',0);
		};

		// Legislature
		var total = 0, count = 0;
		for (var legislation of game.legislation) {
			if (legislation.status == 'enacted') {
				total += legislation.overton;
				count++;
			};
		};
		if (count > 0) {
			game.overton = 1.2 * total / count;
		};
		view.shiftOverton(game.overton);
		if (game.legislation[0].status == 'enacted') {
			game.candidates = 0;
			game.legislators = 0;
			document.getElementById('CandidatesDiv').style.display = 'none';
			document.getElementById('LegislatureDiv').style.display = 'none';
		};

		view.shiftLorenz(game.economicinequality);


		// Corporate Insurgency
		if (game.corporatepower < 50) {
			view.unlock('TheCorporateInsurgencyDiv');
			this.update("Prestige",game.corporatepower);
			this.update("Prestige",game.prestige * game.populationenslaved);
			this.update("Prestige",game.prestige * game.assetsseized);
			if (game.prestige < 0) {game.prestige = 0};
			if (game.mercenaries < game.assetsseized * 100000) {
				this.update("Mercenaries",Math.max(0,game.prestige));
			} else if (Math.random() < 0.5 && game.assetsseized < 1) {
				this.update("Assets Seized",Math.random()/100);
				this.update("Assets Seized",1 - game.assetsseized);
				this.update("Mercenaries",game.mercenaries * Math.random() * -0.2);
			} else if (game.populationenslaved < 1) {
				this.update("Population Enslaved",Math.random()/100);
				this.update("Population Enslaved",1 - game.populationenslaved);
				this.update("Mercenaries",game.mercenaries * Math.random() * -0.2);
			} else {
				console.log('game over');
				for (var employee of ['socialmedia','volunteercoordinators','recruiters','fundraisers','grantwriters','eventplanners','lobbyists','campaignstaff','candidates','legislators','support','clout','money','people']) {
					game[employee] = 0;
				};
				var time = 300;
				for (var legislation of game.legislation) {
					var revertEvent = setTimeout(game.revert.bind(game,legislation),time);
					time += 100;
				};
				view.defeatScreen();
			};
			if (game.mercenaries < 0) {
				game.mercenaries = 0;
				game.assetsseized -= .01;
				game.populationenslaved -= .01;
			};
			if ((game.launchpreparation > 0.9 || game.assetsseized > 0.5) && game.mercenaries > 1 && game.launchpreparation > 0) {
				game.elevatorSeized = true;
				view.seizeElevator();
			};
			if (game.mercenaries == 0 && game.prestige < 1 && game.assetsseized < 0.01 && game.populationenslaved < 0.01) {
				view.lockdown("TheCorporateInsurgencyDiv");
				view.lockdown("AuxiliaryDiv");
				game.elevatorSeized = false;
				view.reclaimElevator();
			};
		};

		if (game.wounded > 0) {
			var healed = Math.min(game.medics,game.wounded);
			game.update("Soldiers",healed);
			game.update("Wounded",healed*-1);
		};

		if (game.launchpreparation > 0 && game.launchpreparation < 1 && game.elevatorSeized == false) {
			game.update("Launch Preparation",game.tech / 10000);
		} else if (game.launchpreparation >= 1 && game.elevatorSeized == false) {
			game.launchpreparation = 1;
			game.update("Launch Preparation",0);
			view.enableLaunch();
		} else if (game.elevatorSeized == true && game.launchpreparation < 1) {
			game.update("Launch Preparation",0.0001);
		};

		// Bankruptcy
		if (this.money < 0) {
			this.reputation += this.money;
			this.money = 0;
			view.update('Money');
			view.update('Reputation');
		};
		if (this.reputation < 0 && this.money == 0) {
			if (totalStaff > 0) { // Don't pay your staff, lose people
				this.update("People",(this.people-20) * -0.1);
			};
			for (employee of this.staff) {
				if (this[employee.name.toLowerCase().replace(/ /g,'')] > 0) {
					this[employee.name.toLowerCase().replace(/ /g,'')]--;
					totalStaff--;
					view.update(employee.name);
				};
			};
			this.reputation = 0;
			view.update('Reputation');
		};
		if (totalStaff >= this.officespace || totalStaff > this.people) {
			for (var employee of game.staff) {
				var trainButton = document.getElementById(employee.name.replace(/ /g,'') + "TrainButton");
				if (trainButton) {
					trainButton.disabled = true;
				};
			};
		} else {
			for (var employee of game.staff) {
				var trainButton = document.getElementById(employee.name.replace(/ /g,'') + "TrainButton");
				if (trainButton) {
					trainButton.disabled = false;
				};
			};
		};
		document.getElementById('OfficeStaffSummary').innerHTML = totalStaff+" staff / " + game.officespace+" max ~ $"+totalPayroll.toLocaleString()+"/week payroll";
		view.enableButtons();
		game.tickCount++;
	};



};
game = new Game();