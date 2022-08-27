const pokemonBox = document.getElementById('pokemon');
const btnLoadMore = document.getElementById('load-more-pokemon');
const typeBtn = document.querySelectorAll('.type-checkbox')
const colorsOfType = {
	fire: '#e66363',
	grass: '#63e665',
	electric: '#ffe100',
	water: '#63b8e6',
	rock: '#b08f51',
	ground: '#e6ba63',
	fairy: '#ffbaf2',
	poison: '#8863e6',
	bug: '#a8e663',
	dragon: '#97b3e6',
	psychic: '#ff69e3',
	flying: '#98ced7',
	fighting: '#ffa238',
	normal: '#F5F5F5',
    ghost: '#82658f',
    dark: '#3a2842',
    steel: '#8a8a8a',
    ice: '#5ee0dc'

};

/// Récupération des données d'un Pokémon à l'aide de son ID

let controller;

const pokemonData = async function (id,type) {
    controller = new AbortController();
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`
    const response = await fetch(url, {signal: controller.signal})
    if (!response.ok){
        console.log(`ERREUR : ${response.status}`)
    }

    const pokemon = await response.json();
    if(type){

        if(pokemon.types.length > 1){
            if(pokemon.types[0].type.name == type || pokemon.types[1].type.name == type){
                return pokemonBox.insertAdjacentHTML("beforeend", createPokemonCard(pokemon));
            };

        } else if (pokemon.types.length == 1){
            if(pokemon.types[0].type.name == type ){
                return pokemonBox.insertAdjacentHTML("beforeend", createPokemonCard(pokemon));
            };
        }

    }else{
        return pokemonBox.insertAdjacentHTML("beforeend", createPokemonCard(pokemon))
    }
          
};

/// Création de la carte du Pokémon

const createPokemonCard = function(pokemon){
    let type1;
    let type2 = '';

    if (pokemon.types.length > 1){
        type1 = pokemon.types[0].type.name
        type2 = pokemon.types[1].type.name
    }else{
        type1 = pokemon.types[0].type.name
    }

    let colorOftype1 = colorsOfType[type1]
    let colorOftype2 = colorsOfType[type2]

    const childItem = `
        <div class="pokemon-card">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="Image du pokémon"/>
            <h2> #${pokemon.id.toString().padStart(3,"0")}</h2>
            <h1>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h1>
            <div class="types">
                <h3 class="type1" style = "color: ${colorOftype1}">${type1.toUpperCase()}</h3>
                <h3 class="type2" style = "color: ${colorOftype2}"">${type2.toUpperCase()}</h3>
            </div>
        </div>
    `
    
    return childItem;

}

/// Fonction principale 

let lastestPokemon;
const fetchPokemons =  async (begin = 1,end = 30,typeOfFetch) => {
    for(let i = begin; i < end+1; i++){
        if(i == 899){
            btnLoadMore.innerText = "EVERYONE IS HERE !"
            break;
        }
        await pokemonData(i,typeOfFetch);
        lastestPokemon = i;
    }
}

/// Clear pokedex 

const resetPokedex = function(){
    pokemonBox.innerHTML = ''
    lastestPokemon = 0;
    btnLoadMore.innerText = "LOAD MORE POKEMON"
}

const resetButton = document.querySelector("aside > button")
resetButton.addEventListener('click', function(){
    resetPokedex();
    fetchPokemons();
    
})

/// Bouton permettant de générer plus de Pokémon

const loadMore = () =>{
    fetchPokemons(lastestPokemon+1, lastestPokemon+30)
}

///Bouton permettant de générer les Pokémons en fonction de leurs types
let pokemonType = '';

fetchPokemons();

const fetchPokemonByType = async function(checkbox){
    pokemonType = checkbox.id;
    console.log(pokemonType)
    controller.abort(); //Annule le fetch en cours
    resetPokedex();
    if (checkbox.checked){
       await fetchPokemons(1,900,pokemonType);
    }else{
       await fetchPokemons(lastestPokemon+1, 30)
    }
}

/// Change la couleurs du fond des bouttons "Types" en fonction du type qu'il représente


typeBtn.forEach(element => {
    let color = colorsOfType[element.id]
    element.parentElement.style.backgroundColor = color;
    
})
