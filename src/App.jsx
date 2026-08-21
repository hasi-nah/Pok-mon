import { useState, useEffect } from 'react';
import './App.css';


import heroImg from './assets/pokenmon.jpg';

const TYPE_COLORS = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  normal: '#A8A878'
};

function App() {
  const [pokemons, setPokemons] = useState([]);
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

        setPokemons(detailedPokemons);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) {
    return <div className="loading">Chargement du Pokédex...</div>;
  }

  return (
    <div className="app-container">
      {/* 2. AFFICHAGE DE L'IMAGE FIXE */}
      <img src={heroImg} alt="Hero Pokémon" className="sidebar-hero" />

      {/* GRILLE DES POKÉMON */}
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <div className="image-wrapper">
              <img 
                src={pokemon.sprites.other['official-artwork'].front_default} 
                alt={pokemon.name} 
              />
            </div>

            <div className="pokemon-info">
              <span className="pokemon-id">
                #{String(pokemon.id).padStart(4, '0')}
              </span>

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
        ))}
      </div>
    </div>
  );
}

export default App;