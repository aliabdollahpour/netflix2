import React, { useContext, useRef, useEffect, useState, useCallback } from "react"
import { useHistory, useLocation } from "react-router-dom";
import musicSearchContext from "../MusicSearch/context"
import { searchMusicBy } from "../../api"
import AlbumResults from "./AlbumResults/AlbumResults";
import ArtistResults from "./ArtistResults/ArtistResults";
import style from "./MusicSearch.module.css"

const MusicSearch = () => {
    const context = useContext(musicSearchContext)
    const history = useHistory()
    const location = useLocation()
    const [albums, setAlbums] = useState(null)
    const [artists, setArtists] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(null)

    const fetchData = useCallback(async () => {
        return await searchMusicBy(context.searchInput, null).then(response => {

            setAlbums(response.results.albums)
            setArtists(response.results.artists)
            //setPage(response.data.page)
            //setTotalPages(response.data.total_pages)

        })

    }, [context]);

    // The below use effect will trigger when ever one of the following changes:
    //      - context.searchInput: When ever the current search value updates.
    //      - location.pathname: When ever the current route updates.
    //      - history: This will most likely never change for the lifetime of the app.
    useEffect(() => {
        let basePath = location.pathname;

        // As the available information does not pass a "Base Route" we must calculate it
        // from the available information. The current path may already be a search and
        // duplicate "/search/" appends could be added with out a small amount of pre-processing.
        const searchIndex = basePath.indexOf('/search/');

        // Remove previous "/search/" if found.
        if (searchIndex >= 0) {
            basePath = basePath.substr(0, searchIndex);
        }

        // Calculate new path.
        const newPath = `${basePath}/search/${encodeURI(context.searchInput)}`;

        // Check new path is indeed a new path.
        // This is to deal with the fact that location.pathname is a dependency of the useEffect
        // Changing the route with history.push will update the route causing this useEffect to
        // refire. If we continually push the calculated path onto the history even if it is the
        // same as the current path we would end up with a loop.
        if (newPath !== location.pathname) {
            history.push(newPath);
        }
        console.log(`basePath is ${basePath}, newPath is ${newPath}`)
    }, [context.searchInput, location.pathname, history])

    useEffect(() => {

        fetchData()

        return () => {
            setAlbums(null)
            setArtists(null)
        }
    }, [fetchData])

    return (
        <React.Fragment>
        <div className={style.MusicSearch}>
            {albums ? (
                albums.length ? (
                    <AlbumResults albums={albums}/>
                ) : (<div className="not-found">No results :/ </div>)
            ) : (
                <div className="loading-content">
                    <div className="loading-circle"></div>
                    <span className="loading-name">LOADING...</span>
                </div>
            )}

            {artists ? (
                artists.length ? (
                    <ArtistResults artists={artists}/>
                ) : (<div className="not-found">No results :/ </div>)
            ) : (
                <div className="loading-content">
                    <div className="loading-circle"></div>
                    <span className="loading-name">LOADING...</span>
                </div>
            )}
        </div>
        </React.Fragment>
    )

}

export default MusicSearch