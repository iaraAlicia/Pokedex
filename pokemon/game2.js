const pokemonShadow = document.getElementById('pokemon-shadow');
const guessInput = document.getElementById('guess');
const submitGuess = document.getElementById('submit-guess');
const resultMessage = document.getElementById('result-message');
const newGameButton = document.getElementById('new-game');

let currentPokemon = null;

// Função para buscar um Pokémon aleatório
const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 150) + 1; // Pega um Pokémon aleatório entre 1 e 150
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await res.json();
    currentPokemon = pokemon;

    // Exibe a sombra do Pokémon
    pokemonShadow.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${randomId}.png`;
    pokemonShadow.style.filter = 'brightness(1)'; // Deixa a imagem na sombra
};



// Verifica o palpite do usuário (agora para tipos)
const checkGuess = () => {
    const userGuess = guessInput.value.toLowerCase().trim();

    // Obtém os tipos do Pokémon
    const pokemonTypes = currentPokemon.types.map(typeInfo => typeInfo.type.name.toLowerCase());

    // Verifica se o palpite corresponde a algum dos tipos
    if (pokemonTypes.includes(userGuess)) {
        resultMessage.textContent = `Você acertou! O tipo do Pokémon é ${pokemonTypes.join(' e ')}.`;
        pokemonShadow.style.filter = 'brightness(1)'; // Revela a imagem
    } else {
        resultMessage.textContent = `Tente novamente! Esse Pokémon não é do tipo ${userGuess}.`;
    }
};

// Inicia um novo jogo
const startNewGame = () => {
    guessInput.value = '';
    resultMessage.textContent = '';
    fetchRandomPokemon();
};

submitGuess.addEventListener('click', checkGuess);
newGameButton.addEventListener('click', startNewGame);

// Começa o jogo assim que a página carrega
window.onload = startNewGame;

document.getElementById('back-button').addEventListener('click', function() {
    window.history.back();
});