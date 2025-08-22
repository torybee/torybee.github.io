// ==UserScript==
// @name         Battledome Score Fetcher
// @version      0.3
// @description  Writes battledome wins and scores to json file for Guild Battledome Challenge.
// @author       Kat (superkathiee)
// @match        *www.neopets.com/dome/record.phtml?username=*
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @icon         https://images.neopets.com/neoboards/avatars/bd_veteran.gif
// ==/UserScript==

(function () {
        'use strict';

        // FIRST TIME USERS MUST FILL IN THESE DETAILS!!!!
        const GITHUB_USERNAME = "torybee";
        const MY_NAME = "Tory";
        const AUTO_REFRESH_ON_FAILURE = true;
        const PLAYERS = [
              "16th_serendipity",
  "_aliciaaa_",
  "acherub",
  "angelbrat916",
  "bama_girl12",
  "barrelchic22",
  "bikerchic624",
  "bodhikels9",
  "christinearning",
  "cibola",
  "cutypie349514",
  "cyberpuppy33",
  "desirae336",
  "devil_kiki_girlz",
  "dianaholdsie",
  "dixie_immortal_chao",
  "doctor_boo",
  "drackonwood",
  "eggs11044",
  "eternal_fire48",
  "flated",
  "gali184",
  "gamin_de_la_landes2",
  "gymbrat2010",
  "haleigh_2011",
  "heart_stealer292",
  "id_24",
  "Illustrator",
  "jade3443",
  "jordanlyrix",
  "joshdibb",
  "kailey_kitty1995",
  "karma_moon",
  "kindled",
  "kittycrew",
  "koggler",
  "laura_ow08",
  "legiox",
  "lemontea_max9",
  "lesliiiiex",
  "limour",
  "m_hero18",
  "madidogs88",
  "madlovedarling",
  "marisn0w",
  "melissa12xx",
  "mew_mew_time",
  "misty_go_solo",
  "mylist",
  "najkay_44",
  "nixonnn",
  "nostosgalos",
  "notooryous",
  "nyltiac5",
  "oroitz",
  "ossabritt",
  "plushgator",
  "puppies10190",
  "rachael1410",
  "rainysapphire",
  "riseofzedekiel",
  "rotfljenn",
  "roxi2rox",
  "salvadortuna",
  "schwarzes_schaaf",
  "seluker406",
  "aleate",
  "softypaws",
  "spidero",
  "stratus365",
  "tackydad",
  "tatyanne",
  "thedaydreamfaerie",
  "unfreeze_xlinger2",
  "whyhellotherecupcake",
  "xmeanerina",
  "zuniak"
        ];

        // Fill this in *only* in tampermonkey. DO *NOT* COMMIT VALUE TO SOURCE CODE.
        const SECRET_GITHUB_TOKEN = "abcdefghijklmnopqrstuvwxyz1234567890";

        const data = {};

        // get username
        const usernameElement = document.querySelector('#bdFR_username a');
        data.username = usernameElement.textContent;

        if (PLAYERS.includes(data.username)) {
            // get battledome stats
            const totalWinsText = document.querySelector('#BDFR_totalWins').textContent;
            const totalScoreText = document.querySelector('#BDFR_totalScore').textContent;

            data.current_wins = parseInt(totalWinsText.replace(/,/g, ''), 10);
            data.current_score = parseInt(totalScoreText.replace(/,/g, ''), 10);

            console.log('Current Wins:', data.current_wins);
            console.log('Current Score:', data.current_score);

            // get current timestamp
            data.timestamp = new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'});

            // Helper function to make HTTP requests with GM.xmlHttpRequest
            function gmXhrRequest(method, fileName, data) {
                let url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_USERNAME}.github.io/contents/${fileName}`
                let headers = {
                    Authorization: `token ${SECRET_GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json'
                }
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: method,
                        url: url,
                        headers: headers,
                        data: data,
                        onload: (response) => resolve(response),
                        onerror: (error) => reject(error)
                    });
                });
            }

            function getExistingEntry(scores, username) {
                const index = scores.findIndex(entry => entry.username === username);
                if (index !== -1) {
                    const existingEntry = scores[index];
                    console.log(`Found user ${username}, will update stats`);
                    return existingEntry;
                } else {
                    console.log(`User ${username} not found, will add from scratch`);
                    return null;
                }
            }

            function showErrorBox() {
                const errorBox = document.createElement('div');
                errorBox.textContent = 'FAILED :(';
                errorBox.style.position = 'fixed';
                errorBox.style.top = '50%';
                errorBox.style.left = '50%';
                errorBox.style.width = '500px';
                errorBox.style.height = '200px';
                errorBox.style.backgroundColor = 'red';
                errorBox.style.color = 'white';
                errorBox.style.fontSize = '75px';
                errorBox.style.fontWeight = 'bold';
                errorBox.style.display = 'flex';
                errorBox.style.flexDirection = 'column';
                errorBox.style.justifyContent = 'center';
                errorBox.style.alignItems = 'center';
                errorBox.style.zIndex = '9999';
                errorBox.style.transform = 'translate(-50%, -50%)'; // Center the box

                const refreshButton = document.createElement('button');
                refreshButton.textContent = 'Try Again :)';
                refreshButton.style.marginTop = '20px';
                refreshButton.style.padding = '10px 20px';
                refreshButton.style.fontSize = '40px';
                refreshButton.style.cursor = 'pointer';
                refreshButton.style.border = 'none';
                refreshButton.style.borderRadius = '5px';
                refreshButton.style.backgroundColor = 'white';
                refreshButton.style.color = 'red';
                refreshButton.style.fontWeight = 'bold';

                refreshButton.addEventListener('click', () => {
                    location.reload();
                });

                errorBox.appendChild(refreshButton);
                document.body.appendChild(errorBox);
            }

            function updateScores(fileName, data) {
                return gmXhrRequest('GET', fileName).then(response => {
                    const responseData = JSON.parse(response.responseText);
                    const gitSha = responseData.sha;
                    const scores = JSON.parse(atob(responseData.content.trim()));

                    const existingEntry = getExistingEntry(scores, data.username);

                    if (existingEntry) {
                        existingEntry.current_wins = data.current_wins;
                        existingEntry.current_score = data.current_score;
                        existingEntry.last_updated = data.timestamp;
                        existingEntry.total_wins = data.current_wins - existingEntry.starting_wins;
                        existingEntry.total_score = data.current_score - existingEntry.starting_score;
                    } else {
                        scores.push({
                            "logo": "images/ignite-flame.png",
                            "username": data.username,
                            "starting_wins": data.current_wins,
                            "starting_score": data.current_score,
                            "starting_stats_captured": data.timestamp,
                            "current_wins": data.current_wins,
                            "current_score": data.current_score,
                            "last_updated": data.timestamp,
                            "total_wins": 0,
                            "total_score": 0
                        });
                    }

                    const fileContent = JSON.stringify(scores, null, 2);
                    const base64Content = btoa(unescape(encodeURIComponent(fileContent)));

                    const updateData = {
                        message: `Update ${data.username} score in ${fileName} by ${MY_NAME} at ${data.timestamp} NST`,
                        content: base64Content,
                        branch: `main`,
                        sha: gitSha
                    };
                    return gmXhrRequest('PUT', fileName, JSON.stringify(updateData)).then(response => {
                        const parsedResponse = JSON.parse(response.responseText);
                        console.log(parsedResponse)
                        console.log(`Response status: ${parsedResponse.status}`);
                        if (parsedResponse.status && parsedResponse.status === "409") {
                            showErrorBox();
                            if (AUTO_REFRESH_ON_FAILURE) {
                                location.reload();
                            }
                            throw new Error('Speedy McQuick over here, try again');
                        } else {
                            console.log(`Update ${data.username} score in ${fileName} by ${MY_NAME}`, JSON.parse(response.responseText));
                        }
                    }).catch(error => {
                        console.error('Error updating file:', error.response ? JSON.parse(error.responseText) : error.message);
                    });
                });
            }

            const updateIfParticipant = async () => {
                if (PLAYERS.includes(data.username)) {
                    await updateScores('bd_scores.json', data);
                }
            };
            updateIfParticipant().catch(error => console.error('Error in updateIfParticipant:', error));

        } else {
            console.log(`User ${data.username} is not a participant in Guild Battledome Challenge.`);
        }
    }
)
();
