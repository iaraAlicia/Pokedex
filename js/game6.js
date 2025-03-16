const memoryGameContainer = document.getElementById('memory-game');
let selectedCards = [];
let matchedCards = [];

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random());

const createMemoryGame = async () => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=8');
    const data = await res.json();

    const pokemons = data.results;
    const pokemonCards = [...pokemons, ...pokemons]; // Duplique os pokemons para fazer pares
    const shuffledCards = shuffleArray(pokemonCards);

    shuffledCards.forEach((pokemon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = pokemon.name;

        const cardImage = document.createElement('img');
        cardImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`;
        card.appendChild(cardImage);

        memoryGameContainer.appendChild(card);

        card.addEventListener('click', () => flipCard(card, pokemon.name));
    });
};

const flipCard = (card, name) => {
    if (card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    selectedCards.push(card);

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

    if (matchedCards.length === 16) {
        setTimeout(() => alert('Você venceu!'), 500);
    }
};

createMemoryGame();
