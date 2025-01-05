import { useEffect, useState } from "react";

export function useLocalStorage(state){
    const [watched, setWatched] = useState(
        () => localStorage.getItem('watched') ? JSON.parse(localStorage.getItem('watched')) : state
    );
    
    useEffect(() => {
        localStorage.setItem("watched", JSON.stringify(watched ? watched : []))
    }, [watched])

    return [watched, setWatched]
}