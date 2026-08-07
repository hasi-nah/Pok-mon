import React, { useState, useEffect } from 'react';
import './App.css';

// Couleurs pour chaque type de Pokémon
const TYPE_COLORS = {
  grass: '#78C850',
  poison: '#A040A0',
  fire: '#F08030',
  flying: '#A890F0',
  water: '#6890F0',
  bug: '#A8B820',
  normal: '#A8A878',
  electric: '#F8D030',
  ground: '#E0C068',
  fairy: '#EE99AC',
  fighting: '#C03028',
  psychic: '#F85888',
  rock: '#B8A038',
  steel: '#B8B8D0',
  ice: '#98D8D8',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
};

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
        const data = await response.json();


        const detailedPokemons = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return await res.json();
          })
        );

        setPokemonList(detailedPokemons);
        setLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des Pokémon :", error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) {
    return <div className="loading">Chargement du Pokédex...</div>;
  }

  return (
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => {
          const formattedId = `#${String(pokemon.id).padStart(4, '0')}`;
          const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

          return (
            <div key={pokemon.id} className="pokemon-card">
              <div className="image-wrapper">
                <img src={imageUrl} alt={pokemon.name} />
              </div>
              <div className="pokemon-info">
                <span className="pokemon-id">{formattedId}</span>
                <h3 className="pokemon-name">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h3>
                <div className="types-container">
                  {pokemon.types.map((typeInfo) => {
                    const typeName = typeInfo.type.name;
                    return (
                      <span
                        key={typeName}
                        className="type-badge"
                        style={{ backgroundColor: TYPE_COLORS[typeName] || '#777' }}
                      >
                        {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
  );
}

export default App;