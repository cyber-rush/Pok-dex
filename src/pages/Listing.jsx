import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListingPage = () => {
    const [pokemons, setPokemons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        abilities: '',
        habitat: ''
    });
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [abilityOptions, setAbilityOptions] = useState([]);
    const [habitatOptions, setHabitatOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=10&page=${currentPage}`);
                const pokemonList = response.data.results;

                const pokemonDetails = await Promise.all(
                    pokemonList.map(async pokemon => {
                        const pokemonData = await axios.get(pokemon.url);
                        const speciesData = await axios.get(pokemonData.data.species.url);

                        const abilities = pokemonData.data.abilities.map(ability => ability.ability.name).join(', ');
                        const habitat = speciesData.data.habitat ? speciesData.data.habitat.name : 'Unknown';

                        return {
                            id: pokemonData.data.id,
                            name: pokemonData.data.name,
                            abilities,
                            habitat,
                        };
                    })
                );

                setPokemons([...pokemons, ...pokemonDetails]);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch pokemons.');
                setIsLoading(false);
            }
        };

        fetchPokemons();
    }, [currentPage]); // Fetches more data when currentPage changes

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
                const pokemonList = response.data.results;

                const abilitiesSet = new Set();
                const habitatSet = new Set();

                for (const pokemon of pokemonList) {
                    const pokemonData = await axios.get(pokemon.url);
                    const speciesData = await axios.get(pokemonData.data.species.url);

                    const abilities = pokemonData.data.abilities.map(ability => ability.ability.name);
                    const habitat = speciesData.data.habitat ? speciesData.data.habitat.name : 'Unknown';

                    abilities.forEach(ability => abilitiesSet.add(ability));
                    habitatSet.add(habitat);
                }

                // Convert sets to arrays and sort them
                const sortedAbilities = Array.from(abilitiesSet).sort();
                const sortedHabitats = Array.from(habitatSet).sort();

                setAbilityOptions(sortedAbilities);
                setHabitatOptions(sortedHabitats);
            } catch (err) {
                setError('Failed to fetch options.');
            }
        };

        fetchOptions();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const applyFilters = () => {
        let filteredResults = [...pokemons];

        Object.keys(filters).forEach(key => {
            if (filters[key] !== '') {
                filteredResults = filteredResults.filter(pokemon =>
                    pokemon[key].toLowerCase().includes(filters[key].toLowerCase())
                );
            }
        });

        setFilteredPokemons(filteredResults);
    };

    const clearFilters = () => {
        setFilters({
            abilities: '',
            habitat: ''
        });
        setFilteredPokemons([]);
    };

    const handleScroll = () => {
        const isBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
        if (isBottom) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage]);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 py-10">
            <h1 className="text-4xl font-bold mb-8">All Pokemons</h1>
            {isLoading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Filter form */}
            <div className="flex flex-wrap justify-center space-y-4 sm:space-x-4 sm:space-y-0 mt-4 mb-4 sm:mb-8 sm:mt-8">
                <select name="abilities" value={filters.abilities} onChange={handleFilterChange} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md sm:block">
                    <option value="">Select Ability</option>
                    {abilityOptions.map((ability, index) => (
                        <option key={index} value={ability}>{ability}</option>
                    ))}
                </select>
                <select name="habitat" value={filters.habitat} onChange={handleFilterChange} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md sm:block">
                    <option value="">Select Habitat</option>
                    {habitatOptions.map((habitat, index) => (
                        <option key={index} value={habitat}>{habitat}</option>
                    ))}
                </select>
                <button onClick={applyFilters} className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md sm:block">Apply Filters</button>
                <button onClick={clearFilters} className="w-full sm:w-auto bg-gray-500 text-white px-4 py-2 rounded-md mt-2 sm:mt-0 sm:block">Clear Filters</button>
            </div>

            {/* Display filtered or original pokemons based on filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer ml-4 ">
                {(filteredPokemons.length > 0 ? filteredPokemons : pokemons).map(pokemon => (
                    <Link key={pokemon.id} to={`/details/${pokemon.id}`} className="pokemon-card">
                        <div key={pokemon.id} className="flex flex-col items-center border border-gray-300 p-4 hover:bg-yellow-300 transition duration-300 ease-in-out">
                            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} alt={pokemon.name} className="w-32 h-32" />
                            <p className="mt-2 text-center">{pokemon.name}</p>
                            <p className="text-sm text-gray-500">{`Abilities: ${pokemon.abilities}`}</p>
                            <p className="text-sm text-gray-500">{`Habitat: ${pokemon.habitat}`}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ListingPage;
