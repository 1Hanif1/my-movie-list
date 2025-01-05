import { useState, useEffect } from "react";

const API_KEY = "8bb07f99";

export function useMovies(query) {
    const [isLoading, setIsLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
          try {
            if(query.length < 3) {
              setMovies([])
              setError("")
              return
            }
    
            setIsLoading(true)
            setError("")
            
            const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`, {signal: controller.signal})
    
            if(!res.ok) throw new Error("🚧 Something went wrong 🚧")
            
            const data = await res.json()
            if(data.Response === "False") throw new Error("❌ No Movies Found ❌")
            setMovies(data.Search)
            setError("")
          }
          catch(err) {
            if(err.name !== "AbortError") setError(err.message)
          }
          finally {
            setIsLoading(false)
            
          }
        })();
    
        return () => controller.abort();
      }, [query])

    return {isLoading, movies, error}
}