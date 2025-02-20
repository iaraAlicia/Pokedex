const evolutionChainContainer = document.getElementById('evolution-chain-container');
const submitButton = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
let evolutionChain = [];
let selectedOrder = [];

// Função para obter dados da API de evolução
const fetchEvolutionChain = async () => {
    const evolutionChainId = Math.floor(Math.random() * 150) + 1; // Randomiza a escolha da cadeia evolutiva
    const url = `https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`;
    const res = await fetch(url);
    const data = await res.json();

    let chain = data.chain;
    evolutionChain = [];

    // Percorre a cadeia evolutiva
    while (chain) {
        const pokemonName = chain.species.name;
        evolutionChain.push(pokemonName);
        chain = chain.evolves_to[0];
    }

    // Exibe os slots para o jogador arrastar e soltar
    displayEvolutionChain();
};

// Função para exibir os Pokémon e criar slots para arrastar e soltar
const displayEvolutionChain = () => {
    evolutionChainContainer.innerHTML = '';

    const shuffledChain = shuffleArray([...evolutionChain]); // Embaralha a ordem para o jogador
    shuffledChain.forEach(pokemon => {
        const pokemonSlot = document.createElement('div');
        pokemonSlot.classList.add('pokemon-slot');
        pokemonSlot.setAttribute('draggable', true);
        pokemonSlot.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon)}.png" alt="${pokemon}"><p>${pokemon}</p>`;
        pokemonSlot.addEventListener('dragstart', (event) => dragStart(event, pokemon));
        pokemonSlot.addEventListener('dragover', dragOver);
        pokemonSlot.addEventListener('drop', (event) => drop(event, pokemon));
        evolutionChainContainer.appendChild(pokemonSlot);
    });
};

// Embaralha um array
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// Pega o ID de um Pokémon
const getPokemonId = (name) => {
    const pokedex = {
        bulbasaur: 1, ivysaur: 2, venusaur: 3, charmander: 4, charmeleon: 5, charizard: 6,
        // Adicione mais Pokémon conforme necessário...
    };
    return pokedex[name.toLowerCase()];
};

// Função para manipulação de drag-and-drop
let draggedPokemon = null;

const dragStart = (event, pokemon) => {
    draggedPokemon = pokemon;
    event.dataTransfer.setData('text/plain', pokemon);
};

const dragOver = (event) => {
    event.preventDefault();
};

const drop = (event, pokemon) => {
    event.preventDefault();
    const droppedPokemon = event.dataTransfer.getData('text/plain');

    const indexDragged = selectedOrder.indexOf(draggedPokemon);
    const indexDropped = selectedOrder.indexOf(pokemon);

    // Troca os Pokémon de posição no array
    if (indexDragged > -1 && indexDropped > -1) {
        selectedOrder[indexDragged] = pokemon;
        selectedOrder[indexDropped] = draggedPokemon;
    } else {
        selectedOrder.push(droppedPokemon);
    }

    // Atualiza a interface gráfica
    updateOrderUI();
};

const updateOrderUI = () => {
    const pokemonSlots = document.querySelectorAll('.pokemon-slot');
    pokemonSlots.forEach((slot, index) => {
        slot.innerHTML = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(selectedOrder[index])}.png" alt="${selectedOrder[index]}"><p>${selectedOrder[index]}</p>`;
    });
};

// Função para verificar se o jogador acertou a ordem
const checkEvolutionOrder = () => {
    if (selectedOrder.join('') === evolutionChain.join('')) {
        resultDiv.textContent = 'Parabéns! Você acertou a ordem de evolução!';
        resultDiv.style.color = 'green';
    } else {
        resultDiv.textContent = 'Ordem incorreta. Tente novamente!';
        resultDiv.style.color = 'red';
    }
};

// Evento do botão de verificação
submitButton.addEventListener('click', checkEvolutionOrder);

// Inicializa o jogo
fetchEvolutionChain();
