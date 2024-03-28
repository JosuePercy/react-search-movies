import { useRef } from 'react';
import './App.css'
import { Movies } from './components/Movies';
import { useMovies } from './hooks/useMovies';
import { useState } from 'react';
import { useEffect } from 'react';

import searchMobile from './assets/img/search.png'

function useSearch() {

  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  /*   const handleSubmit = ( event ) => {
    event.preventDefault()
    const fields = Object.fromEntries( new window.FormData(event.target)) => TODO: forma no contralada
    console.log(fields);
  }; */

  useEffect(() => {

    if ( isFirstInput.current ) {
      isFirstInput.current = search === ''
      return
    }


    if (search === "") {
      setError("No se puede buscar una pelicula vacia");
      return;
    }

    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una pelicula con un número");
      return;
    }

    if (search.length < 3) {
      setError("La busqueda debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search]);

  return { 
    search,
    updateSearch,
    error,
  };



}
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [ sort, setSort ] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })

   const handleSubmit = (event) => {
     event.preventDefault();
     getMovies({ search })
   };

   const handleSort = () => {
     setSort(!sort)
   }

   const handleSearchIcon = () => {
       if (isOpen) setIsOpen(false);
       else setIsOpen(true);
   }

   const handleChange = (event) => {
     updateSearch(event.target.value);
   };


  return (
    <>
      <div className="page">
        <header>
          <h1 style={{ textAlign: "center " }}>Buscardor de películas</h1>
          <form className="form" onSubmit={handleSubmit}>
            <input
              style={{
                border: "1px solid transparent",
                borderColor: error ? "red" : "transparent",
              }}
              value={search}
              onChange={handleChange}
              name="query"
              placeholder="Avengers, Star Wars, The Matrix..."
            />
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <button type="submit">
              <span className="none-mobile">Buscar</span>
              <img
                className="display-mobile"
                src={searchMobile}
                alt="search-mobile"
              />
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </header>

        <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
      </div>
    </>
  );
}

export default App
