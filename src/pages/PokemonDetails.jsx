import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonDetails = () => {
    const { id } = useParams();
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [isBookmarked, setIsBookmarked] = useState(false); // Manage bookmark state

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemonDetails(response.data);

                // Check local storage or a database to see if this Pokemon is bookmarked
                const storedBookmarks = localStorage.getItem('bookmarkedPokemons');
                if (storedBookmarks) {
                    const parsedBookmarks = JSON.parse(storedBookmarks);
                    setIsBookmarked(parsedBookmarks.includes(id));
                }
            } catch (error) {
                // Handle error
            }
        };

        fetchPokemonDetails();
    }, [id]);

    const toggleBookmark = () => {
        const updatedBookmarkState = !isBookmarked;
        setIsBookmarked(updatedBookmarkState);

        // Update local storage with updated bookmark state
        const storedBookmarks = localStorage.getItem('bookmarkedPokemons');
        let updatedBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

        if (updatedBookmarkState) {
            updatedBookmarks = [...updatedBookmarks, id];
        } else {
            updatedBookmarks = updatedBookmarks.filter(pokemonId => pokemonId !== id);
        }

        localStorage.setItem('bookmarkedPokemons', JSON.stringify(updatedBookmarks));
    };

    if (!pokemonDetails) {
        return <p className="text-center mt-4">Loading...</p>;
    }

    const { name, abilities, species, sprites /* Add other necessary details */ } = pokemonDetails;

    return (
        <div className="container mx-auto mt-8 px-4 text-center">
            <h2 className="text-3xl font-semibold mb-4">{name}</h2>
            <img src={sprites.front_default} alt={name} className="mx-auto mb-6" />

            <div className="border p-4 rounded-lg mx-auto max-w-md">
                <p className="text-lg mb-2"><span className="font-semibold">Abilities:</span> {abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p className="text-lg mb-2"><span className="font-semibold">Species:</span> {species.name}</p>
                {/* Display other details here */}
            </div>

            <button
                onClick={toggleBookmark}
                className={`mt-6 py-2 px-4 rounded-md text-white ${isBookmarked ? 'bg-red-500' : 'bg-blue-600'}`}
            >
                {isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            </button>
            <Link to="/bookmarks" className="block mt-4 text-blue-600 underline">Go to Bookmarks</Link>
        </div>
    );
};

export default PokemonDetails;
