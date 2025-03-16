const memoryGameContainer = document.getElementById('memory-game');
let selectedCards = [];
let matchedCards = [];

// Função para embaralhar as cartas
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

// Função para criar o jogo da memória
const createMemoryGame = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=8');  // Obter 8 pokémons
    const data = await res.json();

    const pokemons = data.results;
    const pokemonCards = [...pokemons, ...pokemons];  // Duplicar para criar pares
    const shuffledCards = shuffleArray(pokemonCards);  // Embaralhar os pares

    shuffledCards.forEach((pokemon) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = pokemon.name;

        // Obter o ID do Pokémon na URL (ele está na posição final da URL)
        const pokemonUrlParts = pokemon.url.split('/');
        const pokemonId = pokemonUrlParts[pokemonUrlParts.length - 2];

        // Criar a imagem da carta usando o ID correto do Pokémon
        const cardImage = document.createElement('img');
        cardImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        card.appendChild(cardImage);

        memoryGameContainer.appendChild(card);

        // Adicionar o evento de flip na carta
        card.addEventListener('click', () => flipCard(card, pokemon.name));
    });
};

// Função para virar a carta e verificar se é um par
const flipCard = (card, name) => {
    if (card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    selectedCards.push(card);

    // Verificar se há duas cartas selecionadas
    if (selectedCards.length === 2) {
        if (selectedCards[0].dataset.name === selectedCards[1].dataset.name) {
            matchedCards.push(...selectedCards);
            selectedCards = [];
        } else {
            setTimeout(() => {
                selectedCards.forEach(card => card.classList.remove('flipped'));
                selectedCards = [];
            }, 1000);
        }
    }

    // Verificar se o jogador venceu (encontrou todos os pares)
    if (matchedCards.length === 16) {
        setTimeout(() => alert('Você venceu!'), 500);
    }
};

// Iniciar o jogo
createMemoryGame();


document.getElementById('back-button').addEventListener('click', function() {
    window.history.back();
});