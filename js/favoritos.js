document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>Você ainda não adicionou nenhum Pokémon aos favoritos.</p>";
        return;
    }

    fetch('pokemons.json')  // Supondo que o arquivo JSON com a lista de Pokémon esteja aqui
        .then(response => response.json())
        .then(pokemons => {
            const favoritePokemons = pokemons.filter(pokemon => favorites.includes(pokemon.id));

            const pokemonHTMLString = favoritePokemons.map(pokeman => `
                <div class="pokemon-card" data-id="${pokeman.id}">
                    <img src="${pokeman.image}" alt="${pokeman.name}">
                    <h2>${pokeman.id}. ${pokeman.name.charAt(0).toUpperCase() + pokeman.name.slice(1)}</h2>
                    <p>Type: ${pokeman.types.map(type => `<span class="pokemon-type ${type}">${type}</span>`).join(' ')}</p>
                    <p>Power: ${pokeman.power}</p>
                    <button class="remove-favorite" onclick="removeFavorite(${pokeman.id})">Remover dos Favoritos</button>
                </div>
            `).join('');

            favoritesContainer.innerHTML = pokemonHTMLString;
        })
        .catch(error => {
            console.error('Erro ao carregar os Pokémon favoritos:', error);
            favoritesContainer.innerHTML = "<p>Erro ao carregar seus Pokémon favoritos.</p>";
        });
});

const removeFavorite = (pokemonId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== pokemonId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    location.reload();  // Recarrega a página para atualizar a lista de favoritos
};
