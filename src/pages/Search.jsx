import React, { useState } from 'react';
import axios from 'axios'; // For making API requests
import { Link, useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const [pokemonName, setPokemonName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!pokemonName.trim()) {
            return; // Do nothing if the input is empty or contains only whitespace
        }

        try {
            setIsLoading(true);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            console.log(response.data)
            navigate('/listing', { state: { searchResult: response.data } });
            setSearchResult(response.data);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
            <h1 className="text-4xl font-bold mb-8">Pokemon Search</h1>
            <div className="flex items-center space-x-2 mb-4">
                <input
                    type="text"
                    value={pokemonName}
                    onChange={(e) => setPokemonName(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
                    placeholder="Enter Pokemon name"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none"
                >
                    Search
                </button>
            </div>
            {isLoading && <p className="text-blue-500">Loading...</p>}
            {error && <p className="text-red-500">Error: No such Pokemon exists</p>}
        </div>
    );
};

export default SearchPage;
