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

            win: 0,

            img: './img/spin.gif',
            nomImg: 'Rien',

        };
    },
    methods: {
        //attackPlayer: attaque de l'adversaire sur Anubis
        //dégâts compris entre 20 & 30 PV
        attackPlayer() {
            let attack = Math.random() * (30 - 20) + 20;
            attack = Math.floor(attack);
            this.viePlayer -= attack;
            this.msg = 'Anubis se prend ' + attack + ' points de dégâts!';
            this.addMsg(); 
        },

        //attackAdversaire: attaque d'Anubis sur l'adversaire
        //dégâts compris entre 10 & 20 PV
        attackAdversaire() {
            let attack2 = Math.random() * (20 - 10) + 10;
            attack2 = Math.floor(attack2);
            this.vieAdversaire -= attack2;
            this.msg = "L'ennemi se prend " + attack2 + " points de dégâts!";
            this.addMsg();
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
                this.vieAdversaire -= attackSpe;
                this.msg = "L'ennemi se prend d'énormes dégâts! Il perd " + attackSpe + "PV!";
                this.addMsg();
                this.attackPlayer();
                this.currentround += 1;
                this.readyTour = false;
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
                this.viePlayer += health;
                this.msg = "Anubis vient de se soigner! Elle regagne " + health + "PV!";
                this.addMsg();
                this.attackPlayer();
                this.currentround += 1;
                this.specialReady();
                this.readySoin = false;
                this.lifeBar();
                this.verifyVie();
            }
        },

        //soinReady: vérification de la validité de l'utilisation du soin par Anubis
        //SI la vie d'Anubis est en dessous de 100 PV
        soinReady() {
            if (this.viePlayer < 100) {
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
                this.result = 'PERDU..';
                this.msg = "Fin de game: Défaite";
                this.addMsg();
            } else if (this.vieAdversaire <= 0 && this.viePlayer > 0) {
                this.stopGame = true;
                this.vieAdversaire = 0;
                this.result = 'VICTOIRE!';
                this.msg = "Fin de game: Victoire";
                this.win += 1;
                this.addMsg();
            } else if (this.viePlayer <= 0 && this.vieAdversaire <= 0) {
                this.stopGame = true;
                this.viePlayer = 0;
                this.vieAdversaire = 0;
                this.result = "ÉGALITÉ"
                this.msg = "Fin de game: Égalité";
                this.win += 0.5;
                this.addMsg();
            }
        },

        //givingUp: fin prématurée de la game par forfait
        givingUp() {
            this.stopGame = true;
            this.result = 'ABANDON...'
            this.msg = "Fin de game: Abandon";
            this.addMsg();
        },

        //addMsg: ajout d'un message de jeu en fonction de l'action performée
        addMsg() {
            this.listMsg.unshift(this.msg);
        },

        //relancerGame: lancement d'une nouvelle game
        relancerGame() {
            this.viePlayer = 250;
            this.currentround = 0;
            this.readySoin = false;
            this.readyTour = false;
            this.colorViePlayer = 'chartreuse';
            this.colorVieAdversaire = 'chartreuse';
            this.stopGame = false;
            this.result = '';
            this.listMsg = ['Nouvelle game'];
            this.randomEnnemi();

        },

        //randomEnnemi: choix d'un ennemi random sur le terrain
        randomEnnemi() {
            let random = Math.floor(Math.random()*3)+1;
            console.log(random);
            switch(random) {
                case 1:
                    this.img='./img/ennemi.png';
                    this.nomImg='TumNuk';
                    this.vieAdversaire=250;
                    break;
                case 2:
                    this.img='./img/ennemi2.jpg';
                    this.nomImg='Whistle';
                    this.vieAdversaire=360;
                    break;
                case 3:
                    this.img='./img/kirby.jpg';
                    this.nomImg='Kirby armé';
                    this.vieAdversaire=150;
                    break;
                default:
                    this.img='./img/player.png';
                    this.nomImg='BisBoss';
                    break;
            }
            this.msg = this.nomImg + " veut se battre!";
            this.addMsg();
        }
    }
}).mount('#app');