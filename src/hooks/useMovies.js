import withoutResults from "../mocks/no-results.json";
import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { searchMovies } from "../services/movies";

export function useMovies({ search , sort }) {

  const [ movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const previusSearch = useRef(search)

  const getMovies = useCallback( async ({ search }) => {
      if (search === previusSearch.current) return;
      try {
        setLoading(true);
        setError(null);
        previusSearch.current = search;
        const newMovies = await searchMovies({ search });
        setMovies(newMovies);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
  }, []); 

  useEffect( () => {
    console.log('new getMovies received')
  }, [getMovies])


/*   const getSortedMovies = () => {
    console.log("getSortedMovies");
    const sortedMovies = sort
      ? [...movies ].sort((a, b) => a.title.localeCompare(b.title))
      : movies

    return sortedMovies
  }
 */

  const sortedMovies = useMemo( () => {
    console.log('memoSortedMovies')
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies;
  }, [ sort, movies ])

  return { movies: sortedMovies, getMovies, loading, sort };
}
