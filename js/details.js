document.addEventListener('DOMContentLoaded', async () => {
    // Captura o ID do Pokémon pela URL (ou outro meio)
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id'); // Pega o ID do Pokémon da URL

    // Função para buscar os dados do Pokémon da API
    async function getPokemonDetails(id) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return data;
    }

    // Carrega os detalhes do Pokémon
    const pokemon = await getPokemonDetails(pokemonId);

    // Popula os detalhes do Pokémon na página
    document.getElementById('pokemon-name').textContent = pokemon.name;
    document.getElementById('pokemon-image').src = pokemon.sprites.front_default;
    document.getElementById('pokemon-types').textContent = 'Tipo: ' + pokemon.types.map(type => type.type.name).join(', ');

    // Prepara os dados dos stats para o gráfico
    const statsLabels = pokemon.stats.map(stat => stat.stat.name);
    const statsValues = pokemon.stats.map(stat => stat.base_stat);

    // Configura o gráfico
    const ctx = document.getElementById('stats-chart').getContext('2d');
    const statsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: statsLabels,
            datasets: [{
                label: 'Stats',
                data: statsValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Botão para voltar
    document.getElementById('back-button').addEventListener('click', () => {
        window.history.back();
    });
});
