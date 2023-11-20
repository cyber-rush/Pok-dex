import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookmarksScreen = () => {
    const [bookmarkedPokemons, setBookmarkedPokemons] = useState([]);

    useEffect(() => {
        // Fetch bookmarked Pokemons from local storage on component mount
        const storedBookmarks = localStorage.getItem('bookmarkedPokemons');
        if (storedBookmarks) {
            setBookmarkedPokemons(JSON.parse(storedBookmarks));
        }
    }, []);

    const removeBookmark = (id) => {
        const updatedBookmarks = bookmarkedPokemons.filter(pokemonId => pokemonId !== id);
        setBookmarkedPokemons(updatedBookmarks);
        // Update local storage with updated bookmarks
        localStorage.setItem('bookmarkedPokemons', JSON.stringify(updatedBookmarks));
    };

    return (
        <div className="container mx-auto mt-8 px-4 text-center">
            <h2 className="text-3xl font-semibold mb-4">Bookmarked Pokemons</h2>
            {bookmarkedPokemons.length === 0 ? (
                <p>No bookmarked Pokemons yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {bookmarkedPokemons.map(pokemonId => (
                        <BookmarkCard key={pokemonId} id={pokemonId} removeBookmark={removeBookmark} />
                    ))}
                </div>
            )}
        </div>
    );
};

const BookmarkCard = ({ id, removeBookmark }) => {
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemon(response.data);
            } catch (error) {
                // Handle error
            }
        };

        fetchPokemon();
    }, [id]);

    return (
        <div className="border p-4 rounded-lg">
            {pokemon ? (
                <>
                    <h3 className="text-lg font-semibold mb-2">{pokemon.name}</h3>
                    <img src={pokemon.sprites.front_default} alt={name} className="mx-auto mb-6" />
                    {/* Display other details or image if needed */}
                    <button onClick={() => removeBookmark(id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Remove Bookmark</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BookmarksScreen;
