import { useEffect, useState } from "react";
import StarRating from "./StarRating";


const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Logo(){
  return <div className="logo">
  <span role="img">🍿</span>
  <h1>MyMovieList</h1>
</div>
}

function Search({query,search}){
  // const [query, setQuery] = useState("");
  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  onChange={(e) => search(e.target.value)}
/>
}

function NumResults({movies}){
  return <p className="num-results">
  Found <strong>{movies.length}</strong> results
</p>
}

function NavBar({children}) {
  
  return <nav className="nav-bar">
    {children}
  </nav>
}

function SelectedMovie({movieId, deselectMovie, addToWatchedList, watchedList = []}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0)
  const isWatched = watchedList.map(movie => movie.imdbID).includes(movieId)
  const watchedUserRating = watchedList.find(movie => movie.imdbID === movieId)?.userRating
  const {
    Title,
    Plot,
    Poster,
    Runtime,
    imdbRating,
    Released,
    Actors,
    Director,
    Genre
  } = movie

  useEffect(function(){
    document.title = `Movie: ${Title}`;
    return () => document.title = "MyMovieList"
  }, [Title]
  )

  useEffect(function () {
 
    (async() => {
      try {
        setIsLoading(true)
        setError("")
        const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`)

        if(!res.ok) throw new Error("🚧 Something went wrong 🚧")
      
        const data = await res.json()

        setMovie(data)
      } catch(err) {
        setIsLoading(false)
        setError("Something went wrong ☹️")
      } finally {
        setIsLoading(false)
      }
    })();

  }, [movieId])

  useEffect(() => {
    document.addEventListener('keydown', (e) => e.code === "Escape"? deselectMovie() : null)

    return () => document.removeEventListener('keydown', null)
  }, [deselectMovie])
  
  const handleAddToList = function() {
    // {
    //   imdbID: "tt1375666",
    //   Title: "Inception",
    //   Year: "2010",
    //   Poster:
    //     "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    //   runtime: 148,
    //   imdbRating: 8.8,
    //   userRating: 10,
    // }

    /**
     * 1. Format the data
     * 2. Add the data to the watchedList
     */
    
    const data = {
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: +movie.Runtime.split(' ')[0],
      imdbRating: movie.imdbRating,
      imdbID: movie.imdbID,
      userRating: userRating
    }

    addToWatchedList(data)
  }

  return <div className="details">
  {!isLoading && !error && (
    <>
      <header>
        <button className="btn-back" onClick={deselectMovie}>
          &larr;
        </button>

        <img src={Poster} alt={`Poster of ${Title} movie`} />
        
        <div className="details-overview">
          <h2>{Title}</h2>
          <p>
            {Released} &bull; {Runtime}
          </p>
          <p>{Genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      {/* <p>{avgRating}</p> */}
      <section>
        <div className="rating">
          {!isWatched ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                setMovieRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleAddToList}>
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <p>
              You rated this movie with {watchedUserRating} <span>⭐</span>
              {/* You rated this movie with <span>⭐</span> */}
            </p>
          )}
        </div>

        <p>
          <em>{Plot}</em>
        </p>
        <p>Starring {Actors}</p>
        <p>Directed by {Director}</p>
      </section>
    </>
  )}
  {isLoading && <Loader />}
  {error && <ErrorMessage message={error}/>}
</div>
}

function Movie({movie, selectMovie}){
  return (<li key={movie.imdbID} onClick={() => selectMovie(movie.imdbID)}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>)
}

function MovieList({movies, onSelectMovie}){
  return (<ul className="list list-movies">
  {movies?.map((movie) => (
    <Movie movie={movie} key={movie.imdbID} selectMovie={(id) => onSelectMovie(id)}/>
  ))}
</ul>)
}

function Box({children}){
  const [isOpen, setIsOpen] = useState(true);
  return (<div className="box">
  <button
    className="btn-toggle"
    onClick={() => setIsOpen((open) => !open)}
  >
    {isOpen ? "–" : "+"}
  </button>
  {isOpen && children}
</div>)
}

function WatchedSummary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return(<div className="summary">
  <h2>Movies you watched</h2>
  <div>
    <p>
      <span>#️⃣</span>
      <span>{watched.length} movies</span>
    </p>
    <p>
      <span>⭐️</span>
      <span>{avgImdbRating.toFixed(1)}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating.toFixed(1)}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime.toFixed(0)} min</span>
    </p>
  </div>
</div>)
}

function WatchedMovie({movie, removeMovieFromWatchedList}){
  return( <li key={movie.imdbID}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>

      <button className="btn-delete" onClick={() => removeMovieFromWatchedList(movie.imdbID)}>X</button>
    </div>
  </li>)
}

function WatchedMovieList({watched, removeMovieFromWatchedList}){
  return (<ul className="list">
  {watched.map((movie) => (
    <WatchedMovie movie={movie} key={movie.imdbRating} removeMovieFromWatchedList={removeMovieFromWatchedList}/>
  ))}
</ul>)
}


function Main({children}){
  return <main className="main">
    {children}
  </main>
}

function Loader(){
  return <p className="loader">♻️ Loading... </p>
}

function ErrorMessage({message}) {
  return <p className="error">{message}</p>
}

const API_KEY = "8bb07f99";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState("")
  
  const handleAddtoWatchedList = (movie) => {setWatched(prev => [...prev, movie])}
  const handleRemoveMovieFromWatchedList = (id) => setWatched(watched => watched.filter(movie => movie.imdbID !== id))

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        if(query.length <= 0) {
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
  
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} search={setQuery}/>
        <NumResults movies={movies}/>
      </NavBar>

      <Main movies={movies}>

        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies}/>} */}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={(id) => setSelectedMovieId(id)}/>}
          {isLoading && !error && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedMovieId && <SelectedMovie movieId={selectedMovieId} deselectMovie={() => setSelectedMovieId("")} addToWatchedList={handleAddtoWatchedList} watchedList={watched}/>}
          {
          !selectedMovieId && 
          <>
            <WatchedSummary watched={watched}/>
            <WatchedMovieList watched={watched} removeMovieFromWatchedList={handleRemoveMovieFromWatchedList}/>
          </>
          }
        </Box>
      
      </Main>
    </>
  );
}
