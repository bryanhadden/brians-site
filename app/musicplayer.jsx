import {useState, useRef, useEffect} from 'react';

const MusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const audioRef = useRef(null);

    useEffect(() => {
        if (songs.length > 0 && audioRef.current) {
            loadSong(currentSongIndex);
        }
    }, [songs, currentSongIndex]);

    const loadSong = (index) => {
        if (songs[index]) {
            const song = songs[index];
            setSongTitle(song.title || 'Unknown Title');
            setSongArtist(song.artist || 'Unknown Artist');
            audioRef.current.src = song.filePath;
            audioRef.current.load();
        }
    };

    const playSong = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch((error) => console.error('Error playing audio:', error));
                setIsPlaying(true);
            }
        }
    };

    const nextSong = () => {
        if (songs.length > 0) {
            setCurrentSongIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % songs.length;
                return newIndex;
            });
        }
    };

    const prevSong = () => {
        if (songs.length > 0) {
            setCurrentSongIndex((prevIndex) => {
                const newIndex = (prevIndex - 1 + songs.length) % songs.length;
                return newIndex;
            });
        }
    };

    const addSong = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const newSong = {
                    title: prompt('Enter song title:', 'Unknown Song').trim() || 'Unknown Song',
                    artist: prompt('Enter artist name:', 'Unknown Artist').trim() || 'Unknown Artist',
                    filePath: e.target.result,
                };
                setSongs((prevSongs) => [...prevSongs, newSong]);
            };

            reader.readAsDataURL(file);
        }
    };

    const handlePlaylistClick = (index) => {
        if (songs[index]) {
            setCurrentSongIndex(index);
        }
    };

    return (
        <div className="music-player">
            <div className="song-info">
                <h2>{songTitle}</h2>
                <p>{songArtist}</p>
            </div>

            <audio ref={audioRef} src="" onEnded={nextSong}/>

            <div className="controls">
                <button onClick={prevSong}>Previous</button>
                <button onClick={playSong}>{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={nextSong}>Next</button>
            </div>

            <div className="playlist">
                <h2>Playlist</h2>
                <ul>
                    {songs.map((song, index) => (
                        <li key={index} onClick={() => handlePlaylistClick(index)}>
                            {song.title} - {song.artist}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="add-song">
                <label htmlFor="song-file">Add Song</label>
                <input type="file" id="song-file" accept="audio/*" onChange={addSong}/>
            </div>
        </div>
    );
};

export default MusicPlayer;