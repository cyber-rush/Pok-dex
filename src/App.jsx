
import { Route, Routes } from 'react-router-dom'
import Search from './pages/Search'
import Listing from './pages/Listing'
import PokemonDetails from './pages/PokemonDetails'
import BookmarksScreen from './pages/BookmarksScreen '

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Search />} />
      <Route path='/listing' element={<Listing />} />
      <Route path="/details/:id" element={<PokemonDetails />} />
      <Route path="/bookmarks" element={<BookmarksScreen />} />
    </Routes>
  )
}

export default App
