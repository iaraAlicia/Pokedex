document.addEventListener('DOMContentLoaded', async () => {
    const pokemon1Select = document.getElementById('pokemon1-select');
    const pokemon2Select = document.getElementById('pokemon2-select');
    const pokemon1Image = document.getElementById('pokemon1-image');
    const pokemon2Image = document.getElementById('pokemon2-image');
    const battleButton = document.getElementById('battle-button');
    const battleResult = document.getElementById('battle-result');
    const searchInput = document.getElementById('search-input');

    let allPokemon = [];

    const typeTranslations = {
        normal: 'Normal',
        fire: 'Fogo',
        water: 'Água',
        grass: 'Grama',
        electric: 'Elétrico',
        ice: 'Gelo',
        fighting: 'Lutador',
        poison: 'Veneno',
        ground: 'Terra',
        flying: 'Voador',
        psychic: 'Psíquico',
        bug: 'Inseto',
        rock: 'Pedra',
        ghost: 'Fantasma',
        dark: 'Sombrio',
        dragon: 'Dragão',
        steel: 'Aço',
        fairy: 'Fada'
    };

    const fetchPokemon = async () => {
        const url = 'https://pokeapi.co/api/v2/pokemon?limit=150';
        const res = await fetch(url);
        const data = await res.json();
        allPokemon = await Promise.all(data.results.map(async (result, index) => {
            const pokemonData = await fetch(result.url).then(res => res.json());
            const powerStat = pokemonData.stats.reduce((acc, stat) => acc + stat.base_stat, 0); // Soma dos stats
            return {
                id: index + 1,
                name: result.name.charAt(0).toUpperCase() + result.name.slice(1),
                power: powerStat,
                types: pokemonData.types.map(typeInfo => typeTranslations[typeInfo.type.name]),
                image: pokemonData.sprites.front_default // URL da imagem do Pokémon
            };
        }));
        populatePokemonOptions(allPokemon);
    };

    const populatePokemonOptions = (filteredPokemon) => {
        pokemon1Select.innerHTML = '<option value="">Selecione o Pokémon 1</option>';
        pokemon2Select.innerHTML = '<option value="">Selecione o Pokémon 2</option>';

        filteredPokemon.forEach(pokemon => {
            const option1 = document.createElement('option');
            option1.value = pokemon.id;
            option1.textContent = pokemon.name;
            pokemon1Select.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = pokemon.id;
            option2.textContent = pokemon.name;
            pokemon2Select.appendChild(option2);
        });
    };

    const updatePokemonImage = (pokemonSelect, pokemonImage) => {
        const selectedPokemon = allPokemon.find(pokemon => pokemon.id == pokemonSelect.value);
        if (selectedPokemon) {
            pokemonImage.src = selectedPokemon.image;
            pokemonImage.alt = `Imagem de ${selectedPokemon.name}`;
        } else {
            pokemonImage.src = '';
            pokemonImage.alt = '';
        }
    };

    pokemon1Select.addEventListener('change', () => {
        updatePokemonImage(pokemon1Select, pokemon1Image);
    });

    pokemon2Select.addEventListener('change', () => {
        updatePokemonImage(pokemon2Select, pokemon2Image);
    });

    battleButton.addEventListener('click', () => {
        const pokemon1Id = parseInt(pokemon1Select.value);
        const pokemon2Id = parseInt(pokemon2Select.value);

        if (pokemon1Id && pokemon2Id) {
            const pokemon1 = allPokemon.find(p => p.id === pokemon1Id);
            const pokemon2 = allPokemon.find(p => p.id === pokemon2Id);

            const winnerMessage = determineWinner(pokemon1, pokemon2);
            battleResult.textContent = winnerMessage;
        } else {
            battleResult.textContent = 'Por favor, selecione dois Pokémon.';
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        populatePokemonOptions(filteredPokemon);
    });

    await fetchPokemon();
});

const determineWinner = (pokemon1, pokemon2) => {
    if (pokemon1.power > pokemon2.power) {
        return `${pokemon1.name} venceria!`;
    } else if (pokemon1.power < pokemon2.power) {
        return `${pokemon2.name} venceria!`;
    } else {
        return `É um empate!`;
    }
};
