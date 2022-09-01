const pokemonBox = document.getElementById('pokemon');
const btnLoadMore = document.getElementById('load-more-pokemon');
const typeBtn = document.querySelectorAll('.type-checkbox');
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

/// Requête permettant de récupérer tous les pokémons

let controller;
const pokemonData = async function (id) {
    try{
        controller = new AbortController();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {signal: controller.signal});
        const pokemonData = await response.json();
        return await pokemonData;
    }
    catch(err){
        console.log(`ERREUR : ${err}`);
    }
          
};

///Génère tous les Pokémons ou tous les Pokémons en fonction de leurs types

let latestPokemon; 
const generatePokemon = async function(type,begin = 1, end = 31){
    for(let i = begin; i < end; i++){
        let pokemon  = await pokemonData(i);
        if(pokemon.id == 899){
            btnLoadMore.innerText = "EVERYONE IS HERE";
            break;
        };
        if(type){
            if(pokemon.types.some(pokemonType => pokemonType.type.name == type)){
                pokemonBox.insertAdjacentHTML('beforeend',createPokemonCard(pokemon));
                latestPokemon = i;
            }
        }else{
            pokemonBox.insertAdjacentHTML('beforeend',createPokemonCard(pokemon));
            latestPokemon = i;
        };
    };
};

const generatePokemonByTypes = async function(type){
    controller.abort();
    resetPokedex();
    await generatePokemon(type, 1, 899);
    btnLoadMore.innerText = "EVERYONE IS HERE";
    btnLoadMore.style.pointerEvents = "none";
};


typeBtn.forEach(element => {
    element.addEventListener('click', function(){     
        generatePokemonByTypes(element.id);

    })
});


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

};

/// Clear pokedex 

const resetPokedex = function(){
    latestPokemon = 1;
    pokemonBox.innerHTML = '';
    btnLoadMore.innerText = "LOAD MORE POKEMON";
    btnLoadMore.style.pointerEvents = "auto";
};


const resetButton = document.querySelector("aside > button")
resetButton.addEventListener('click', function(){
    resetPokedex();
    generatePokemon();
    
})

/// Bouton permettant de générer plus de Pokémon

const loadMore = () =>{
    generatePokemon('',latestPokemon+1, latestPokemon+31);
}

/// Change la couleurs du fond des bouttons "Types" en fonction du type qu'il représente

typeBtn.forEach(element => {
    let color = colorsOfType[element.id];
    element.parentElement.style.backgroundColor = color;
    
})

generatePokemon('',latestPokemon);
