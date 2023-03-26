let limit = 0;
let offset = 0;

const pokeCards = (pokemonList) => {
  document.querySelector('#pokeCards').innerHTML = pokemonList.map((item, i) => `<div class="pokeCard"><div class="pokeInfo">#${item.id} ${item.name}<div class="pokeType">${item.types.map(t => `<img id="type" src="https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${t.type.name}.svg" alt="${t.type.name}"/>`).join('')}</div></div><img src="${item.sprites.front_default}"/></div>`).join('');
};

const fetchData = (limit, offset) => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

  fetch(url)
  .then(response => response.json())
  .then(json => {

    const fetches = json.results.map(item => {
      return fetch(item.url).then(res => res.json())
    })

    Promise.all(fetches).then(res => {
      pokemonData = res;
      pokeCards(pokemonData); // Display the full list of Pokemon
    })
  })
}
const genButtons = document.querySelectorAll('.gen_button');
let genTitle = document.querySelector('#genTitle')
let introTitle = document.querySelector('#introTitle')
let dropdown = document.querySelector('#typeDropdown')
const searchInput = document.querySelector('#search')

const generations = [
  { id: 1, name: 'Generation 1', limit: 151, offset: 0 },
  { id: 2, name: 'Generation 2', limit: 100, offset: 151 },
  { id: 3, name: 'Generation 3', limit: 135, offset: 251 },
  { id: 4, name: 'Generation 4', limit: 107, offset: 386 },
  { id: 5, name: 'Generation 5', limit: 156, offset: 493 },
  { id: 6, name: 'Generation 6', limit: 72, offset: 649 },
  { id: 7, name: 'Generation 7', limit: 88, offset: 721 },
  { id: 8, name: 'Generation 8', limit: 96, offset: 809 },
  { id: 9, name: 'Generation 9', limit: 110, offset: 905 },
];
genButtons.forEach(button => {
  button.addEventListener('click', () => {
    const genId = parseInt(button.dataset.genId);
    const generation = generations.find(gen => gen.id === genId);
    genTitle.textContent = generation.name;
    fetchData(generation.limit, generation.offset);
    introTitle.style.display = 'none';
    search.style.display = 'flex';
    dropdown.style.display = 'inline-block';
  });
});
let pokemonData = [];

const typeDropdown = document.querySelector('#typeDropdown');

const filterPokemonByTypeAndSearch = (type, searchValue) => {
  // If the type is "all", show all Pokemon
  if (type === "all") {
    return pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue));
  }

  // Filter the Pokemon by type
  return pokemonData.filter(pokemon =>
    pokemon.types.some(pokeType =>
      pokeType.type.name.toLowerCase() === type &&
      pokemon.name.toLowerCase().includes(searchValue)
    )
  );
}
const filterPokemon = () => {
  const searchValue = searchInput.value.toLowerCase();
  const type = typeDropdown.value.toLowerCase();

  // Filter the Pokemon by type and search query
  const filterList = filterPokemonByTypeAndSearch(type, searchValue);

  pokeCards(filterList);
};

typeDropdown.addEventListener('change', filterPokemon);
searchInput.addEventListener('input', filterPokemon);