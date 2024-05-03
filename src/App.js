import { Children, useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

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

function SelectedMovie({movieId, deselectMovie, addToWatchedList}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0)
  const [isWatched, setIsWatched] = useState(false)

  useEffect(function () {
    // Check if the movie was already watched

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
      Title: movie.title,
      Year: movie.year,
      Poster: movie.poster,
      runtime: movie.runtime,
      imdbRating: movie.imdbRating,
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
              {/* You rated this movie {watchedUserRating} <span>⭐</span> */}
              BOO
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

// function ListBox({children}){
//   const [isOpen1, setIsOpen1] = useState(true);
  
//   return (<div className="box">
//   <button
//     className="btn-toggle"
//     onClick={() => setIsOpen1((open) => !open)}
//   >
//     {isOpen1 ? "–" : "+"}
//   </button>
//   {isOpen1 && children}
// </div>)
// }

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
      <span>{avgImdbRating}</span>
    </p>
    <p>
      <span>🌟</span>
      <span>{avgUserRating}</span>
    </p>
    <p>
      <span>⏳</span>
      <span>{avgRuntime} min</span>
    </p>
  </div>
</div>)
}

function WatchedMovie({movie}){
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
    </div>
  </li>)
}

function WatchedMovieList({watched}){
  return (<ul className="list">
  {watched.map((movie) => (
    <WatchedMovie movie={movie} />
  ))}
</ul>)
}

// function WatchedBox(){
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);


//   return (<div className="box">
//   <button
//     className="btn-toggle"
//     onClick={() => setIsOpen2((open) => !open)}
//   >
//     {isOpen2 ? "–" : "+"}
//   </button>
//   {isOpen2 && (
//     <>
//       <WatchedSummary watched={watched}/>
//       <WatchedMovieList watched={watched} />
//     </>
//   )}
// </div>)
// }

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


  useEffect(() => {
    (async () => {
      try {
        if(query.length <= 0) {
          setMovies([])
          setError("")
          return
        }

        setIsLoading(true)
        setError("")
        
        const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)

        if(!res.ok) throw new Error("🚧 Something went wrong 🚧")
        
        const data = await res.json()
      if(data.Response === "False") throw new Error("❌ No Movies Found ❌")
        setMovies(data.Search)
      }
      catch(err) {
        setError(err.message)
      }
      finally {
        setIsLoading(false)
      }
    })();
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
          {selectedMovieId && <SelectedMovie movieId={selectedMovieId} deselectMovie={() => setSelectedMovieId("")} addToWatchedList={handleAddtoWatchedList}/>}
          {
          !selectedMovieId && 
          <>
            <WatchedSummary watched={watched}/>
            <WatchedMovieList watched={watched} />
          </>
          }
        </Box>
      
      </Main>
    </>
  );
}
