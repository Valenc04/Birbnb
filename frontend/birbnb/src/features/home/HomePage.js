import ContenedoresDeAlojamientos from '../../components/contenedoresDeAlojamientos/ContenedoresDeAlojamientos';
import SearchBar from '../../components/searchBar/SearchBar'

export const HomePage = () => (
    <>
        <main>
            <SearchBar/>
            <ContenedoresDeAlojamientos/>
        </main>
    </>
);