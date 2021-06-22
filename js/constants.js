// Group A
const ITALY = { name:'Italy', flag: './assets/flags/Italy.png' };
const SWITZERLAND = { name:'Switzerland', flag: './assets/flags/Switzerland.jpg' };
const TURKEY = { name:'Turkey', flag: './assets/flags/Turkey.png' };
const WALES = { name:'Wales', flag: './assets/flags/Wales.png' };
// Group B
const BELGIUM = { name:'Belgium', flag: './assets/flags/Belgium.jpg' };
const DENMARK = { name:'Denmark', flag: './assets/flags/Denmark.jpg' };
const FINLAND = { name:'Finland', flag: './assets/flags/Finland.png' };
const RUSSIA = { name:'Russia', flag: './assets/flags/Russia.jpg' };
// Group C
const AUSTRIA = { name:'Austria', flag: './assets/flags/Austria.png' };
const NETHERLANDS = { name:'Netherlands', flag: './assets/flags/Netherlands.png' };
const MACEDONIA = { name:'North Macedonia', flag: './assets/flags/Macedonia.png' };
const UKRAINE = { name:'Ukraine', flag: './assets/flags/Ukraine.png' };
// Group D
const CROATIA = { name:'Croatia', flag: './assets/flags/Croatia.jpg' };
const CZECH_REPUBLIC = { name:'Czech Republic', flag: './assets/flags/CzechRepublic.png' };
const ENGLAND = { name:'England', flag: './assets/flags/England.jpg' };
const SCOTLAND = { name:'Scotland', flag: './assets/flags/Scotland.png' };
// Group E
const POLAND = { name:'Poland', flag: './assets/flags/Poland.jpg' };
const SLOVAKIA = { name:'Slovakia', flag: './assets/flags/Slovakia.png' };
const SPAIN = { name:'Spain', flag: './assets/flags/Spain.jpg' };
const SWEDEN = { name:'Sweden', flag: './assets/flags/Sweden.png' };
// Group F
const FRANCE = { name:'France', flag: './assets/flags/France.jpg' };
const GERMANY = { name:'Germany', flag: './assets/flags/Germany.jpg' };
const HUNGARY = { name:'Hungary', flag: './assets/flags/Hungary.png' };
const PORTUGAL = { name:'Portugal', flag: './assets/flags/Portugal.jpg' };

const teams = [
    ITALY,
    SWITZERLAND,
    TURKEY,
    WALES,
    BELGIUM,
    DENMARK,
    FINLAND,
    RUSSIA,
    AUSTRIA,
    NETHERLANDS,
    MACEDONIA,
    UKRAINE,
    CROATIA,
    CZECH_REPUBLIC,
    ENGLAND,
    SCOTLAND,
    POLAND,
    SLOVAKIA,
    SPAIN,
    SWEDEN,
    FRANCE,
    GERMANY,
    HUNGARY,
    PORTUGAL
];

const groupNames = [
    'A', 'B', 'C', 'D', 'E', 'F'
];

const getMatchResults = () => new Promise((resolve, reject) => {
    fetch('https://www.uefa.com/uefaeuro-2020/news/0254-0d41684d1216-06773df7faed-1000--euro-2020-fixtures-and-results/')
    .then(res => res.text())
    .then(res => {
        try {
            const tempBox = document.createElement('html');
            tempBox.innerHTML = res;
            const mainBox = tempBox.querySelector('body > div.container-fluid.main-wrap.article_page > div.body.row > div > div.content > article > section.section.article_content > div > div > div');
            const pElements = mainBox.querySelectorAll('p');
            let newList = [...pElements].reduce((a, c) => {
                a = [...a, ...c.innerText.split(' ')];
                return a;
            }, []);

            const teamsCopy = [];
            teams.forEach(t => teamsCopy.push(Object.assign({}, t)));
            teamsCopy.find(x => x.name === 'North Macedonia').name = 'Macedonia';
            teamsCopy.find(x => x.name === 'Czech Republic').name = 'Czech';

            newList = newList.filter(x => {
                return teamsCopy.some(t => x.toUpperCase().includes(t.name.toUpperCase())) || /[0-9]-[0-9]/.test(x);
            });
            let matches = [];

            for (let i = 0; i < newList.length; i += 3) {
                matches.push({
                    team1: newList[i],
                    team2: newList[i+2],
                    team1score: newList[i+1].split('-')[0],
                    team2score: newList[i+1].split('-')[1]
                });
            };

            matches = matches.filter(x =>
                x.team1 &&
                x.team2 &&
                x.team1score &&
                x.team2score
            );

            matches.forEach((x, i) => x.phase = i < 36 ? 'groupPhase' : 'knockoutPhase');

            resolve(matches);
        } catch(e) {
            reject(e);
        }
    });
});

// How to know where each winner/runner up from each group gets placed in the knockout table
// See https://en.wikipedia.org/wiki/UEFA_Euro_2020_knockout_phase#Bracket
const knockoutPhaseNumberMatrix = {
    'A1': 3,
    'A2': 15,
    'B1': 1,
    'B2': 16,
    'C1': 13,
    'C2': 4,
    'D1': 11,
    'D2': 7,
    'E1': 9,
    'E2': 8,
    'F1': 5,
    'F2': 12
};

// See https://en.wikipedia.org/wiki/UEFA_Euro_2020_knockout_phase#Combinations_of_matches_in_the_round_of_16
const thirdPlaceCombinationMatrix = [
    {
        thirdPlaceTeamsCombination: ['A', 'B', 'C', 'D'],
        'A': 2,
        'D': 14,
        'B': 10,
        'C': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'B', 'C', 'E'],
        'A': 2,
        'E': 14,
        'B': 10,
        'C': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'B', 'C', 'F'],
        'A': 2,
        'F': 14,
        'B': 10,
        'C': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'B', 'D', 'E'],
        'D': 2,
        'E': 14,
        'A': 10,
        'B': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'B', 'D', 'F'],
        'D': 2,
        'F': 14,
        'A': 10,
        'B': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'B', 'E', 'F'],
        'E': 2,
        'F': 14,
        'B': 10,
        'A': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'C', 'D', 'E'],
        'E': 2,
        'D': 14,
        'C': 10,
        'A': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'C', 'D', 'F'],
        'F': 2,
        'D': 14,
        'C': 10,
        'A': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'C', 'E', 'F'],
        'E': 2,
        'F': 14,
        'C': 10,
        'A': 6
    }, {
        thirdPlaceTeamsCombination: ['A', 'D', 'E', 'F'],
        'E': 2,
        'F': 14,
        'D': 10,
        'A': 6
    }, {
        thirdPlaceTeamsCombination: ['B', 'C', 'D', 'E'],
        'E': 2,
        'D': 14,
        'B': 10,
        'C': 6
    }, {
        thirdPlaceTeamsCombination: ['B', 'C', 'D', 'F'],
        'F': 2,
        'D': 14,
        'C': 10,
        'B': 6
    }, {
        thirdPlaceTeamsCombination: ['B', 'C', 'E', 'F'],
        'F': 2,
        'E': 14,
        'C': 10,
        'B': 6
    }, {
        thirdPlaceTeamsCombination: ['B', 'D', 'E', 'F'],
        'F': 2,
        'E': 14,
        'D': 10,
        'B': 6
    }, {
        thirdPlaceTeamsCombination: ['C', 'D', 'E', 'F'],
        'F': 2,
        'E': 14,
        'D': 10,
        'C': 6
    }
];

const TOTAL_NUMBER_OF_TEAMS = 24;
const NUMBER_OF_GROUPS = 6;
const TEAMS_PER_GROUP = 4;

const knockOutPhases = [16, 8, 4, 2];

const defaultColor = 'white';

export {
    teams,
    groupNames,
    TOTAL_NUMBER_OF_TEAMS,
    NUMBER_OF_GROUPS,
    TEAMS_PER_GROUP,
    knockOutPhases,
    defaultColor,
    knockoutPhaseNumberMatrix,
    thirdPlaceCombinationMatrix,
    getMatchResults,
};