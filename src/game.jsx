import {Organization} from "./organize/component";
import {Locked} from "./locked/component";
import thresholds from "./thresholds";
import unlocks from "./unlocks";
import upgrades from "./upgrades";
import actions from "./actions";
import staff from "./staff";
import potentialAllies from "./allies";
import legislation from "./legislation";

const degreesOfAcceptance = [
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

function attrname(name) {
  return name.toLowerCase().replace(/ /g,'');
}

export class Game {
  constructor() {
    this.started = false;

    this.tickCount = 0;

    this.people = 1;
    this.money = 0;
    this.allymembers = 0;
    this.reputation = 0.1;
    this.buzz = 0;

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
    this.allies = [];

    this.solidarity = 0;
    this.tech = 0;
    this.corporatepower = 100;
    this.economicinequality = 100;

    this.mercenaries = 100;
    this.prestige = 0;
    this.assetsseized = 0;
    this.populationenslaved = 0;
    this.elevatorSeized = false;

    this.unlocked = {
      organization: true,
    };
    for (var employee of staff) {
      this[attrname(employee.name)] = 0;
    }

  }

  buzzModifier() {
    return Math.floor(Math.log(this.buzz+1) / Math.LN10 + 1.000000001)
  }

  update(stat,add) {
    this[stat.toLowerCase().replace(/ /g,'')] += add;
    /*
    if (stat == 'People') {
      for (var action of this.actions) {
        //view.updateButton(action);
      };
    } else if (stat == 'Support') {
      this.chances = 0;
      this.update("Chances",this.electoralChances());
    };
    */
  }

  attendees(action) {
    var attendees = this.people * (Math.random() * 0.5 + 0.5);
    for (var ally of this.allies) {
      attendees += ally.members * Math.random();
    };
    attendees = Math.floor(attendees);
    if (action.max !== undefined) {attendees = Math.min(attendees,action.max);};
    return attendees;
  }

  /*
  organize() {
    var noRecruit = true;
    if (Math.random() < 0.5) {
      noRecruit = false;
      this.update('People',1);
    };
    if (noRecruit || (!noRecruit && Math.random() < 0.5) ) {
      this.update('Money',Math.max(1,Math.random() * Math.random() * 100 << 0));
    };
  }
  */

  planAction(action) {
    if (action.header == 'Coordination') {
      var completion = Math.floor(action.completion * this.people);
      if (action.progress < completion || action.progress < action.max) {
        action.progress += 1 + this.volunteercoordinators;
      };
      if (action.progress >= completion || action.progress >= action.max) {
        action.progress = Infinity;
        //view.enableAction(action);
      };
    } else {
      var completion = action.completion;
      if (action.progress < completion) {
        action.progress += 1 + this.logistics;
      };
      if (action.progress >= completion) {
        action.progress = Infinity;
        //view.enableAction(action);
      };
    };
  }

  doAction(action) {
    if (action.header == 'Coordination') {
      var turnout = this.attendees(action);
      var buzzModifier = this.buzzModifier();
      //view.displayEventResult(action,turnout,buzzModifier);
      this.update('Reputation',action.reputation * turnout * buzzModifier);
      this.update('People',action.people * turnout * buzzModifier);
      this.update('Money',action.money * turnout * buzzModifier);
      this.update('Buzz',action.reputation * turnout * buzzModifier);
      this.unlocked.Reputation = true;
      //view.unlock('ReputationReputationDiv');
      //view.unlock('ReputationBuzzDiv');
    } else {
      action.completion = Math.floor(action.completion * 1.1);
      if (action.name == 'Auxiliaries Recruitment Drive') {
        for (var recruit=0;recruit<this.solidarity;recruit++) {
          this.update(['Soldiers','Soldiers','Soldiers','Logistics','Logistics','Medics'][Math.random() * 6 << 0],Math.random() * 100 << 0);
        };
      } else {
        this.battle(action);
      };
    };
    action.progress = 0;
    //view.disableAction(action);
  }

  battle(action) {
    var result;
    var corpScore = this.mercenaries * Math.random() * action.stakes;
    var commScore = this.soldiers * Math.random();
    var corpCasualties = Math.ceil(Math.min(100,Math.max(1,100 - (corpScore / commScore)*10))/100 * this.mercenaries);
    var commCasualties = Math.ceil(Math.min(100,Math.max(1,100 - (commScore / corpScore)*10))/100 * this.soldiers);
    var num = Math.round(Math.random()*100)/100;
    if (corpScore < commScore) {
      if (action.name == 'Reclaim Assets Operation') {
        num = Math.min(num,this.assetsseized);
        this.update("Assets Seized",-1 * num);
        result = Math.round(num*10000)/100 + "% assets reclaimed";
      } else if (action.name == 'Liberate Enslaved Workers Operation') {
        num = Math.min(num,this.populationenslaved);
        this.update("Population Enslaved",-1 * num);
        result = Math.round(num*10000)/100 + "% population liberated";
      } else if (action.name == 'Frontal Assault') {
        corpCasualties *= 2;
        corpCasualties = Math.min(corpCasualties,this.mercenaries);
      } else if (action.name == 'Humiliation Campaign') {
        num = Math.min(num * 1000,this.prestige);
        this.update("Prestige",-1 * num);
        result = "-" + num + " prestige";
      };
    };
    this.update("Wounded",commCasualties);
    this.update("Soldiers",commCasualties * -1);
    this.update("Mercenaries",corpCasualties * -1);
    //view.displayBattleResult(action,commCasualties,corpCasualties,result);
  }

  train(employee) {
    if (this[attrnam(employee.name)] !== undefined) {
      this[attrname(employee.name)]++;
    } else {
      this[attrname(employee.name)] = 1;
    };
    //view.update(employee.name);
  }

  fire(employee) {
    this[attrname(employee.name)]--;
    //view.update(employee.name);
  }

  upgrade(upgrade) {
    if (upgrade.upgradeByNum == undefined) {
      this.unlocked[upgrade.name.replace(/ /g,'')] = true;
    }
    this.update(upgrade.costStat,upgrade.costNum*-1);
    if (upgrade.upgradeToNum !== undefined) {
      this[upgrade.upgradeStat.toLowerCase().replace(/ /g,'')] = upgrade.upgradeToNum;
    } else if (upgrade.upgradeByNum !== undefined) {
      this[upgrade.upgradeStat.toLowerCase().replace(/ /g,'')] += upgrade.upgradeByNum;
    }
    if (upgrade.upgradeStat == 'Office Space') {
      document.getElementById('OfficeHead').innerHTML = upgrade.name;
      if (upgrade.name == 'Field Office') {
        if (this.fieldOffices == undefined) {
          this.fieldOffices = 1;
        } else {
          this.fieldOffices++
        }
        var adjective = 'Global';
        if (this.fieldOffices < 3) {
          adjective = "National";
        } else if (this.fieldOffices < 8) {
          adjective = "Continent-Spanning";
        }
        document.getElementById('OfficeHead').innerHTML = adjective + " Network of "+(1+this.fieldOffices)+" Offices";
      }
    }
  }

  unlock(unlock) {
    this.unlocked[unlock.name.replace(/ /g,'')] = true;
  }

  getUnlocked(name) {
    const it = this.unlocked[attrname(name)]
    if (it == null) {
      return new Locked(this)
    }
    return it;
  }

  ally(ally) {
    this.update('Buzz',ally.allyCost);
    this.allies.push(ally);
    this.reputation -= ally.allyCost;
    this.allymembers += ally.members;
    //view.update("AllyMembers");
  }

  cutTies(ally) {
    this.update('Buzz',ally.allyCost);
    ally.allyCost *= 2;
    this.allies.splice(this.allies.indexOf(ally),1);
    this.allymembers -= ally.members;
    //view.update("AllyMembers");
  }

  nominate() {
    this.update("Reputation",-100000);
    this.update("Candidates",1);
  }

  fund() {
    this.update("Money",-100000);
    this.update("Support",100);
  }

  electoralChances() {
    var candidates = Math.max(1,this.candidates);
    return 1 - Math.pow(0.5,this.support / candidates / this.electoralThreshold);
  }

  legislationLobbyCost() {
    return Math.ceil(1000000 / (10 + this.lobbyists));
  }

  legislationPassCost(legislation) {
    var overton = legislation.overton - this.overton;
    var cost = Math.pow(2,Math.abs(overton)) / (1+legislation.support);
    return Math.ceil(Math.abs(cost));
  }

  legislationRepealCost(legislation) {
    var overton = Math.max(1,legislation.overton - this.overton + 10);
    var cost = 500000 / (overton*(1+legislation.denounce));
    return Math.ceil(Math.abs(cost));
  }

  promote(legislation) {
    this.update("Reputation",-10000);
    legislation.support++;
    if (this.legislationPassCost(legislation) < 1000) {
      legislation.status = 'enacted';
      this.enactLegislation(legislation);
      //view.fillStrokeAllLegislation();
      //view.displayLegislation(legislation);
    };
  }

  denounce(legislation) {
    this.update("Reputation",-10000);
    legislation.denounce++;
    if (this.legislationRepealCost(legislation) < 1000) {
      legislation.status = 'repealed';
      //view.fillStrokeAllLegislation();
      //view.displayLegislation(legislation);
    };
  }

  pass(legislation) {
    var legislationCost = -1 * this.legislationPassCost(legislation);
    this.update("Clout",legislationCost);
    legislation.status = 'enacted';
    this.enactLegislation(legislation);
    //view.displayLegislation(legislation);
    //view.fillStrokeAllLegislation(legislation);
  }

  enactLegislation(legislation) {
    for (var effect of legislation.effects) {
      this.update(effect.name.replace(/ /g,''),effect.change);
      if (effect.name == 'Obstruction') {
        this.electoralThreshold /= effect.change * -1;
      };
    };
    for (var leg of this.legislation) {
      if (legislation.replaces.indexOf(leg.name) !== -1 && leg.status == 'enacted') {
        leg.status = 'repealed';
      };
    };
    //view.unlock('StatusQuoTechDiv');
    if (legislation.name == 'Direct Democracy') {
      this.update("Campaign Staff",this.legislators + this.candidates);
      this.legislators = 0;
      this.candidates = 0;
      this.support = 0;
      //view.lockdown('CandidatesDiv');
      //view.lockdown('LegislatureStaffDiv');
      for (var employee of this.staff) {
        if (employee.name == 'Campaign Staff') {
          employee.work = {Clout:1};
        };
      };
    } else if (legislation.name == 'Publicly Funded Campaigns') {
      for (var employee of this.staff) {
        if (employee.name == 'Campaign Staff') {
          employee.pay = 0;
        };
      };
      document.getElementById('CampaignStaffTrainButton').innerHTML = "Train ($0/tick)";
      document.getElementById('fundButton').style.display = 'none';
    } else if (legislation.name == "Citizens' Defense Auxiliary") {
      //view.unlock("AuxiliariesRecruitmentDriveActionDiv");
      this.unlocked.Auxiliary = true;
    } else if (legislation.name == 'Build Space Elevator') {
      //view.unlock("launchButton");
      this.update("Launch Preparation",this.tech / 10000);
    };
  }

  repeal(legislation) {
    var legislationCost = -1 * this.legislationRepealCost(legislation);
    this.update("Clout",legislationCost);
    legislation.status = 'repealed';
    //view.displayLegislation(legislation);
    //view.fillStrokeAllLegislation(legislation);
  }

  revert(legislation) {
    if (legislation.statusquo == true) {
      legislation.status = 'enacted';
      //view.fillStrokeAllLegislation(legislation);
    } else {
      legislation.status = 'available';
      //view.fillStrokeAllLegislation(legislation);
    };
    var total = 0, count = 0;
    for (var legislation of this.legislation) {
      if (legislation.status == 'enacted') {
        total += legislation.overton;
        count++;
      };
    };
    if (count > 0) {
      this.overton = 1.2 * total / count;
    };
    //view.shiftOverton(this.overton);
    this.economicinequality = this.economicinequality + 5;
    //view.shiftLorenz(this.economicinequality);
}
}
