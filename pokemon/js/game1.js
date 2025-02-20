document.addEventListener('DOMContentLoaded', () => {
    const pokemonSilhouette = document.getElementById('pokemon-silhouette');
    const silhouetteElement = document.querySelector('.pokemon-silhouette');
    const pokemonGuess = document.getElementById('pokemon-guess');
    const submitGuess = document.getElementById('submit-guess');
    const resultMessage = document.getElementById('feedback');
    const hint1 = document.getElementById('hint1');
    const hint2 = document.getElementById('hint2');
    const hint3 = document.getElementById('hint3');

    let currentPokemon = {};
    
    // Lista de Pokémon para o jogo
    const pokemonList = [
        { name: 'pikachu', hint: ['Elétrico', 'Mouse Pokémon', 'Número 25'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
        { name: 'bulbasaur', hint: ['Grama/Veneno', 'Seed Pokémon', 'Número 1'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
        { name: 'charmander', hint: ['Fogo', 'Lizard Pokémon', 'Número 4'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
        { name: 'squirtle', hint: ['Água', 'Tiny Turtle Pokémon', 'Número 7'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' }
    ];

    let currentHintIndex = 0;

    // Função para selecionar um Pokémon aleatoriamente
    const getRandomPokemon = () => {
        const randomIndex = Math.floor(Math.random() * pokemonList.length);
        return pokemonList[randomIndex];
    };

    // Função para iniciar o jogo
    const startGame = () => {
        currentPokemon = getRandomPokemon();
        pokemonSilhouette.src = currentPokemon.image;
        pokemonSilhouette.style.filter = 'brightness(0) invert(1)'; // Silhueta
        silhouetteElement.style.filter = 'brightness(1) contrast(100%) saturate(0%)';
        pokemonGuess.value = '';
        resultMessage.textContent = '';
        currentHintIndex = 0;
    };

    // Função para verificar o palpite do jogador
    const checkGuess = () => {
        const userGuess = pokemonGuess.value.trim().toLowerCase();
        if (userGuess === currentPokemon.name) {
            resultMessage.textContent = 'Parabéns! Você acertou!';
            resultMessage.style.color = 'green';
            pokemonSilhouette.style.filter = 'none'; // Revelar o Pokémon
        } else {
            resultMessage.textContent = 'Errou! Tente novamente!';
            resultMessage.style.color = 'red';
        }
    };

    // Função para mostrar dicas
    const showHint = () => {
        if (currentHintIndex < currentPokemon.hint.length) {
            resultMessage.textContent = `Dica: ${currentPokemon.hint[currentHintIndex]}`;
            currentHintIndex++;
        } else {
            resultMessage.textContent = 'Sem mais dicas!';
        }
    };

    // Eventos de clique
    submitGuess.addEventListener('click', checkGuess);
    hint1.addEventListener('click', showHint);
    hint2.addEventListener('click', showHint);
    hint3.addEventListener('click', showHint);

    // Iniciar o jogo ao carregar a página
    startGame();
});
