document.addEventListener('DOMContentLoaded', () => {
    const pokedex = document.getElementById('pokedex');
    const searchInput = document.getElementById('search');
    const typeSelect = document.getElementById('type-select');
    const sortSelect = document.getElementById('sort-select');

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalTypes = document.getElementById('modal-types');
    const modalStats = document.getElementById('modal-stats');
    const closeModal = document.getElementById('close-modal');
    const moreDetailsBtn = document.getElementById('more-details-btn');

    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');

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

    let allPokemon = [];
    let currentPage = 1;
    const itemsPerPage = 12;

    const fetchPokemon = async () => {
        const url = 'https://pokeapi.co/api/v2/pokemon?limit=150';
        const res = await fetch(url);
        const data = await res.json();
        allPokemon = await Promise.all(data.results.map(async (result, index) => {
            const pokemonData = await fetch(result.url).then(res => res.json());
            const powerStat = pokemonData.stats.reduce((acc, stat) => acc + stat.base_stat, 0);
            return {
                id: index + 1,
                name: result.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                types: pokemonData.types.map(typeInfo => typeInfo.type.name),
                power: powerStat,
                stats: pokemonData.stats.map(stat => ({
                    name: stat.stat.name,
                    value: stat.base_stat
                }))
            };
        }));
        displayPokemonPaginated();
    };

    const displayPokemonPaginated = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedPokemon = allPokemon.slice(startIndex, endIndex);
        displayPokemon(paginatedPokemon);
        updatePaginationControls();
    };

    const displayPokemon = (pokemonArray) => {
        const pokemonHTMLString = pokemonArray.map(pokeman => `
            <div class="pokemon-card" data-id="${pokeman.id}">
                <img src="${pokeman.image}" alt="${pokeman.name}">
                <h2>${pokeman.id}. ${pokeman.name.charAt(0).toUpperCase() + pokeman.name.slice(1)}</h2>
                <p>Type: ${pokeman.types.map(type => `<span class="pokemon-type ${type}">${typeTranslations[type]}</span>`).join(' ')}</p>
                <p>Power: ${pokeman.power}</p>
                <div class="favorite-container">
                    <button class="favorite-icon" data-id="${pokeman.id}">★ Favoritar</button>
                </div>
            </div>
        `).join('');

        pokedex.innerHTML = pokemonHTMLString;

        updateFavorites();
        document.querySelectorAll('.pokemon-card').forEach(card => {
            card.addEventListener('click', (event) => {
                if (!event.target.classList.contains('favorite-icon')) {
                    const pokemonId = event.currentTarget.getAttribute('data-id');
                    const pokemon = allPokemon.find(p => p.id === parseInt(pokemonId));
                    showModal(pokemon);
                }
            });
        });

        document.querySelectorAll('.favorite-icon').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const pokemonId = parseInt(event.target.getAttribute('data-id'));
                toggleFavorite(pokemonId);
            });
        });
    };

    const showModal = (pokemon) => {
        modalTitle.textContent = `${pokemon.id}. ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
        modalImage.src = pokemon.image;
        modalTypes.innerHTML = `Tipo: ${pokemon.types.map(type => `<span class="pokemon-type ${type}">${typeTranslations[type]}</span>`).join(', ')}`;
        modalStats.innerHTML = `
            <h3>Status:</h3>
            <ul>
                ${pokemon.stats.map(stat => `<li>${stat.name}: ${stat.value}</li>`).join('')}
            </ul>
        `;
        moreDetailsBtn.onclick = () => {
            window.location.href = `pokemon_details.html?id=${pokemon.id}`;
        };
        modal.style.display = 'flex';
    };

    const closeModalHandler = () => {
        modal.style.display = 'none';
    };

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModalHandler();
        }
    });

    closeModal.addEventListener('click', closeModalHandler);

    const updatePaginationControls = () => {
        currentPageSpan.textContent = currentPage;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= Math.ceil(allPokemon.length / itemsPerPage);
    };

    const filterAndSortPokemon = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedType = typeSelect.value;
        const selectedSort = sortSelect.value;

        let filteredPokemon = allPokemon.filter(pokemon => {
            const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === 'all' || pokemon.types.includes(selectedType);

            return matchesSearch && matchesType;
        });

        switch (selectedSort) {
            case 'az':
                filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'za':
                filteredPokemon.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'power-asc':
                filteredPokemon.sort((a, b) => a.power - b.power);
                break;
            case 'power-desc':
                filteredPokemon.sort((a, b) => b.power - a.power);
                break;
        }

        displayPokemon(filteredPokemon.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
        updatePaginationControls();
    };

    searchInput.addEventListener('input', filterAndSortPokemon);
    typeSelect.addEventListener('change', filterAndSortPokemon);
    sortSelect.addEventListener('change', filterAndSortPokemon);

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            filterAndSortPokemon();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(allPokemon.length / itemsPerPage)) {
            currentPage++;
            filterAndSortPokemon();
        }
    });

    fetchPokemon();

    const toggleFavorite = (pokemonId) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.includes(pokemonId)) {
            favorites = favorites.filter(id => id !== pokemonId);
            alert("Pokémon removido dos favoritos!");
        } else {
            favorites.push(pokemonId);
            alert("Pokémon adicionado aos favoritos!");
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavorites();
    };

    const updateFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        document.querySelectorAll('.pokemon-card').forEach(card => {
            const pokemonId = parseInt(card.getAttribute('data-id'));
            const favoriteIcon = card.querySelector('.favorite-icon');

            if (favorites.includes(pokemonId)) {
                favoriteIcon.classList.add('favorited');
                favoriteIcon.textContent = '★ Favorito';
            } else {
                favoriteIcon.classList.remove('favorited');
                favoriteIcon.textContent = '★ Favoritar';
            }
        });
    };
});
