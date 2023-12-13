document.addEventListener("DOMContentLoaded", function () {
    // Attach click event handlers to buttons
    document.getElementById('rickButton').addEventListener('click', function () {
        showInfo('Rick');
    });
    
    document.getElementById('mortyButton').addEventListener('click', function () {
        showInfo('Morty');
    });

    document.getElementById('summerButton').addEventListener('click', function () {
        showInfo('Summer');
    });

    document.getElementById('jerryButton').addEventListener('click', function () {
        showInfo('Jerry');
    });

    document.getElementById('bethButton').addEventListener('click', function () {
        showInfo('Beth');
    });

    document.getElementById('changeColorButton').addEventListener('click', function () {
        changeBackgroundColor();
    });

    loadEpisodes();

    // Attach change event handler to episode select
    document.getElementById('episodeSelect').addEventListener('change', function () {
        var selectedEpisode = this.value;
        showEpisodeCharacters(selectedEpisode);
    });
});

async function showInfo(character) {
    var infoOutput = document.getElementById('infoOutput');
    var characterData = await getCharacterInfo(character);
    
    // Clear previous info
    infoOutput.innerHTML = '';

    // Display information
    var infoText = `Name: ${characterData.name}\nType: ${characterData.type}\nGender: ${characterData.gender}\nStatus: ${characterData.status}\nEpisode: ${characterData.episode}`;
    infoOutput.textContent = infoText;

    // Display character image
    var characterImage = document.getElementById('rickAndMortyImage');
    characterImage.src = characterData.image;

    // Select the episode in the dropdown
    var episodeSelect = document.getElementById('episodeSelect');
    episodeSelect.value = characterData.episode;

    // Show episodes for the character
    showCharacterEpisodes(character);
}

async function getCharacterInfo(character) {
    try {
        // Fetch character data from the Rick and Morty API
        var response = await fetch(`https://rickandmortyapi.com/api/character/?name=${character}`);
        var data = await response.json();

        if (data.results.length > 0) {
            var characterData = data.results[0];

            // Fetch episode data
            var episodeResponse = await fetch(characterData.episode[0]);
            var episodeData = await episodeResponse.json();

            return {
                name: characterData.name,
                type: characterData.type,
                gender: characterData.gender,
                status: characterData.status,
                episode: episodeData.name,
                image: characterData.image
            };
        } else {
            throw new Error("Character not found");
        }
    } catch (error) {
        console.error(error);
        return {
            name: "Character not found",
            type: "",
            gender: "",
            status: "",
            episode: "",
            image: ""
        };
    }
}

async function loadEpisodes() {
    try {
        // Fetch all episodes from the Rick and Morty API
        var response = await fetch('https://rickandmortyapi.com/api/episode');
        var data = await response.json();

        // Populate the episode select dropdown
        var episodeSelect = document.getElementById('episodeSelect');
        data.results.forEach(function (episode) {
            var option = document.createElement('option');
            option.value = episode.name;
            option.textContent = episode.name;
            episodeSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

async function showEpisodeCharacters(episodeName) {
    try {
        // Fetch episode data from the Rick and Morty API
        var response = await fetch(`https://rickandmortyapi.com/api/episode/?name=${episodeName}`);
        var episodeData = await response.json();

        // Display characters in the episode
        var episodeCharacters = document.getElementById('episodeCharacters');
        episodeCharacters.innerHTML = '<h2>Characters in this Episode</h2>';

        episodeData.results[0].characters.forEach(async function (characterURL) {
            var characterResponse = await fetch(characterURL);
            var characterData = await characterResponse.json();

            var characterInfo = document.createElement('div');
            characterInfo.textContent = `Name: ${characterData.name}, Type: ${characterData.type}, Gender: ${characterData.gender}, Status: ${characterData.status}`;

            episodeCharacters.appendChild(characterInfo);
        });
    } catch (error) {
        console.error(error);
    }
}

async function showCharacterEpisodes(characterName) {
    try {
        // Fetch character data from the Rick and Morty API
        var response = await fetch(`https://rickandmortyapi.com/api/character/?name=${characterName}`);
        var characterData = await response.json();

        // Display episodes for the character
        var characterEpisodes = document.getElementById('characterEpisodes');
        characterEpisodes.innerHTML = '<h2>Episodes featuring this Character</h2>';

        characterData.results[0].episode.forEach(async function (episodeURL) {
            var episodeResponse = await fetch(episodeURL);
            var episodeData = await episodeResponse.json();

            var episodeInfo = document.createElement('div');
            episodeInfo.textContent = `Episode: ${episodeData.name}, Air Date: ${episodeData.air_date}`;

            characterEpisodes.appendChild(episodeInfo);
        });
    } catch (error) {
        console.error(error);
    }
}

function changeBackgroundColor() {
    document.body.style.backgroundColor = 'black';
}
