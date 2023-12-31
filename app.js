Vue.createApp({
    data() {
        return {
            viePlayer: 250,
            vieAdversaire: 0,

            currentround: 0,

            readyTour: false,
            readySoin: false,

            result: '',
            stopGame: true,

            listMsg: ['Bienvenue!'],
            msg: '',

            colorViePlayer: 'chartreuse',
            colorVieAdversaire: 'chartreuse',

            winPts: 0,
            victory: 0,

            img: './img/rien.png',
            nomImg: 'Rien',

            playerImg: './img/player.png',

            textLancer: 'Lancer une game',

            pwrAttack: 0,
            statAttack: 0,
            neededAttackPts: 1,

            pwrSpecial: 0,
            statSpecial: 0,
            neededSpecialPts: 3,

            pwrHeal: 0,
            statHeal: 0,
            neededHealingPts: 2,

            pwrPV: 0,
            statPV: 0,
            neededPVPts: 4,

            healWait: 0,

            reloadEnnemi: 3,

            stateMsg: true,

        };
    },
    methods: {
        //attackPlayer: attaque de l'adversaire sur Anubis
        //dégâts compris entre 20 & 30 PV
        attackPlayer() {
            let attack = Math.random() * (30 - 20) + 20;
            attack = Math.floor(attack);
            this.viePlayer -= attack;
            this.healWait += 1;
            this.msg = 'Anubis se prend ' + attack + ' points de dégâts!';
            this.addMsg(); 
        },

        //attackAdversaire: attaque d'Anubis sur l'adversaire
        //dégâts compris entre 10 & 20 PV
        attackAdversaire() {
            let attack2 = Math.random() * (20 - 10) + 10;
            attack2 = Math.floor(attack2);
            powerAttack2 = attack2 * (1+this.pwrAttack);
            this.vieAdversaire -= powerAttack2;
            this.msg = "L'ennemi se prend " + powerAttack2.toFixed(2) + " points de dégâts!";
            this.addMsg();
            this.battleSound('attack');
            this.attackPlayer();
            this.currentround += 1;
            this.specialReady();
            this.soinReady();
            this.lifeBar();
            this.verifyVie();
        },

        //specialAttackAdversaire: attaque spécial d'Anubis
        //SI readyTour est vrai
        //dégâts compris entre 20 & 30 PV
        specialAttackAdversaire() {
            if(this.readyTour == true) {
                let attackSpe = Math.random() * (30 - 20) + 20;
                attackSpe = Math.floor(attackSpe);
                specialAttack = attackSpe * (1+this.pwrSpecial);
                this.vieAdversaire -= specialAttack;
                this.msg = "L'ennemi se prend d'énormes dégâts! Il perd " + specialAttack.toFixed(2) + "PV!";
                this.addMsg();
                this.battleSound('special');
                this.attackPlayer();
                this.currentround += 1;
                this.readyTour = false;
                this.soinReady();
                this.lifeBar();
                this.verifyVie();
            }
        },

        //specialReady: vérification de la validité de l'utilisation du spécial d'Anubis
        // SI 3 tours sont passés (modulo 3)
        specialReady() {
            if (this.currentround %3 == 0) {
                this.readyTour = true;
                this.msg = "L'attaque spéciale est prête!";
                this.addMsg();
            }
        },

        //soinPlayer: regain de vie pour Anubis
        //SI readySoin est vrai
        //regain de vie compris entre 25 & 40 PV
        soinPlayer() {
            let health = Math.random() * (40 - 25) + 25;
            if(this.readySoin == true) {
                health = Math.floor(health);
                healing = health * (1+this.pwrHeal);
                this.viePlayer += healing;
                this.msg = "Anubis vient de se soigner! Elle regagne " + healing.toFixed(2) + "PV!";
                this.addMsg();
                this.battleSound('heal');
                this.attackPlayer();
                this.healWait = 0;
                this.currentround += 1;
                this.specialReady();
                this.soinReady();
                this.lifeBar();
                this.verifyVie();
            }
        },

        //soinReady: vérification de la validité de l'utilisation du soin par Anubis
        //SI la vie d'Anubis est en dessous de 100 PV
        soinReady() {
            if (this.viePlayer < 100 && this.healWait > 2) {
                this.readySoin = true;
                this.msg = "Le soin est prêt!";
                this.addMsg();
            } else {
                this.readySoin = false;
            }
        },

        //lifeBar: colorisation de la barre de vie en fonction des PV
        //disponible pour Anubis et pour l'adversaire
        //SI la vie est en dessous de 100 PV MAIS est au dessus de 25 PV -> orange
        //SI la vie est en dessous de 25 PV -> rouge critique
        //SINON -> chartreuse (hehe)
        lifeBar() {
            if(this.viePlayer < 100 && this.viePlayer > 25) {
                this.colorViePlayer = 'orange';
            } else if (this.viePlayer < 25) {
                this.colorViePlayer = 'red';
            } else {
                this.colorViePlayer = 'chartreuse';
            }

            if(this.vieAdversaire < 100 && this.vieAdversaire > 25) {
                this.colorVieAdversaire = 'orange';
            } else if (this.vieAdversaire < 25) {
                this.colorVieAdversaire = 'red';
            } else {
                this.colorVieAdversaire = 'chartreuse';
            }
        },

        //verifyVie: vérification de si soit Anubis soit l'adversaire est mort
        //SI Anubis est à 0 PV ET pas l'adversaire -> Défaite
        //SI l'adversaire est à 0 PV ET pas Anubis -> Victoire
        //SI les 2 sont à 0 PV -> Égalité
        verifyVie() {
            if(this.viePlayer <= 0 && this.vieAdversaire > 0) {
                this.stopGame = true;
                this.viePlayer = 0;
                this.playerImg = './img/ded.png';
                this.battleSound('defeat');
                this.result = 'PERDU..';
                this.msg = "> Fin de game: Défaite <";
                this.addMsg();
                this.reloadEnnemi = 3;
            } else if (this.vieAdversaire <= 0 && this.viePlayer > 0) {
                this.stopGame = true;
                this.vieAdversaire = 0;
                this.img = './img/ded.png';
                this.playerImg = './img/spin.gif';
                this.battleSound('victory');
                this.result = 'VICTOIRE!';
                this.msg = "> Fin de game: Victoire <";
                this.winPts += 1;
                this.victory += 1;
                this.addMsg();
                this.reloadEnnemi = 3;
            } else if (this.viePlayer <= 0 && this.vieAdversaire <= 0) {
                this.stopGame = true;
                this.viePlayer = 0;
                this.vieAdversaire = 0;
                this.playerImg = './img/ded.png'
                this.img = './img/ded.png';
                this.battleSound('draw');
                this.result = "ÉGALITÉ"
                this.msg = "> Fin de game: Égalité <";
                this.winPts += 0.5;
                this.victory += 1;
                this.addMsg();
                this.reloadEnnemi = 3;
            }
        },

        //givingUp: fin prématurée de la game par forfait
        givingUp() {
            this.stopGame = true;
            this.battleSound('giveUp');
            this.playerImg = './img/ded.png';
            this.viePlayer = 0;
            this.result = 'ABANDON...'
            this.msg = "> Fin de game: Abandon <";
            this.addMsg();
            this.reloadEnnemi = 3;
        },

        //addMsg: ajout d'un message de jeu en fonction de l'action performée
        addMsg() {
            this.listMsg.unshift(this.msg);
        },

        //relancerGame: lancement d'une nouvelle game
        //SI reloadEnnemi n'est pas à 0
        relancerGame() {
            if(this.reloadEnnemi != 0) {
                this.viePlayer = 250 + this.pwrPV;
                this.currentround = 0;
                this.readySoin = false;
                this.readyTour = false;
                this.colorViePlayer = 'chartreuse';
                this.colorVieAdversaire = 'chartreuse';
                this.stopGame = false;
                this.playerImg = './img/player.png';
                this.result = '';
                this.listMsg = ['> Nouvelle game <'];
                this.textLancer = 'Relancer une game';
                this.battleSound('reGame');
                this.randomEnnemi();
                this.reloadEnnemi -= 1;
            } else {
                this.msg = "Impossible de relancer une nouvelle game!";
                this.addMsg();
            }

        },

        //randomEnnemi: choix d'un ennemi random sur le terrain
        randomEnnemi() {
            let random = Math.floor(Math.random()*3)+1;
            switch(random) {
                case 1:
                    this.img='./img/ennemi.png';
                    this.nomImg='Emerise';
                    this.vieAdversaire = 120;
                    break;
                case 2:
                    this.img='./img/ennemi2.jpg';
                    this.nomImg='Whistle';
                    this.vieAdversaire = 250;
                    break;
                case 3:
                    this.img='./img/kirby.jpg';
                    this.nomImg='Kirby armé';
                    this.vieAdversaire = 360;
                    break;
                default:
                    this.img='./img/player.png';
                    this.nomImg='BisBoss';
                    this.vieAdversaire = 9999;
                    break;
            }
            this.msg = this.nomImg + " veut se battre!";
            this.addMsg();
        },

        //battleSound(event): joue un sound effect en fonction de l'évènement
        battleSound(event) {
            let sound = new Audio('');
            sound.volume = 0.1;
            switch(event) {
                case 'attack': 
                    let randomAttack = Math.floor(Math.random()*2)+1;
                    switch(randomAttack) {
                        case 1:
                            sound.src = './sound/punch1.mp3';
                            break;
                        case 2:
                            sound.src = './sound/punch2.mp3';
                            break;
                    }
                    break;
                case 'special': 
                    let randomSpecial = Math.floor(Math.random()*2)+1;
                    switch(randomSpecial) {
                        case 1:
                            sound.src = './sound/special1.mp3';
                            break;
                        case 2:
                            sound.src= './sound/special2.mp3';
                            break;
                    }
                    break;
                case 'heal': 
                    let randomHealing = Math.floor(Math.random()*2)+1;
                    switch(randomHealing) {
                        case 1:
                            sound.src = './sound/heal1.mp3';
                            break;
                        case 2:
                            sound.src = './sound/heal2.mp3';
                            break;
                    }
                    break;
                case 'victory':
                    sound.volume = 0.3;
                    sound.src = './sound/victory.mp3';
                    break;
                case 'defeat':
                    sound.volume = 0.3;
                    sound.src = './sound/lose.mp3';
                    break;
                case 'draw':
                    sound.volume = 0.3;
                    sound.src = './sound/draw.mp3';
                    break;
                case 'giveUp':
                    sound.volume = 0.3;
                    sound.src = './sound/giveUp.mp3';
                    break;
                case 'reGame':
                    sound.src = './sound/reGame.mp3';
                    break;
                case 'addStat':
                    sound.volume = 0.3;
                    sound.src = './sound/addStat.mp3';
                    break;
                default:
                    sound.pause();
                    break;
            }
            sound.play();
        },

        //addAttackPower(): ajoute 10% de dégâts supplémentaires sur l'attaque d'Anubis
        //SI Anubis a au moins 1 point de victoires
        addAttackPower() {
            if(this.winPts >= this.neededAttackPts) {
                this.pwrAttack += 0.1;
                this.winPts -= this.neededAttackPts;
                this.statAttack += 10;
                this.battleSound('addStat');
                this.msg = "L'attaque d'Anubis a augmenté de 10%!";
                this.addMsg();
            } else {
                this.msg = "Anubis n'a pas gagné assez de point de victoires pour ça..";
                this.addMsg();
            }
        },

        //addSpecialPower(): ajoute 10% de dégâts supplémentaires sur le spécial d'Anubis
        //SI Anubis a au moins 2 points de victoires
        addSpecialPower() {
            if(this.winPts >= this.neededSpecialPts) {
                this.pwrSpecial += 0.1;
                this.winPts -= this.neededSpecialPts;
                this.statSpecial += 10;
                this.battleSound('addStat');
                this.msg = "L'attaque spéciale d'Anubis a augmenté de 10%!";
                this.addMsg();
            } else {
                this.msg = "Anubis n'a pas gagné assez de point de victoires pour ça..";
                this.addMsg();
            }
        },

        //addHealingPower(): ajoute 10% sur le soin d'Anubis
        //SI Anubis a au moins 3 points de victoires
        addHealingPower() {
            if(this.winPts >= this.neededHealingPts) {
                this.pwrHeal += 0.1;
                this.winPts -= this.neededHealingPts;
                this.statHeal += 10;
                this.battleSound('addStat');
                this.msg = "Le soin d'Anubis a augmenté de 10%!";
                this.addMsg();
            } else {
                this.msg = "Anubis n'a pas gagné assez de point de victoires pour ça..";
                this.addMsg();
            }
        },

        //addPVPower(): ajoute 10PV à la vie d'Anubis
        //SI Anubis a au moins 4 points de victoires
        addPVPower() {
            if(this.winPts >= this.neededPVPts) {
                this.pwrPV += 10;
                this.winPts -= this.neededPVPts;
                this.statPV += 10;
                this.battleSound('addStat');
                this.msg = "Les PV d'Anubis ont augmenté de 10 points!";
                this.addMsg();
                this.viePlayer += this.pwrPV;
            } else {
                this.msg = "Anubis n'a pas gagné assez de point de victoires pour ça..";
                this.addMsg();
            }
        },

        //hideMsg(): permet d'afficher/de cacher les messages de jeu
        hideMsg() {
            this.stateMsg = !this.stateMsg;
        },

    }
}).mount('#app');