import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResult";
import axios from "axios";

const SearchJadwalPage = () => {
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (searchTerm) => {
    try {
      const res = await axios.get(`https://findyourclass-api.vercel.app/search?keyword=${encodeURIComponent(searchTerm)}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Gagal fetch data jadwal:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 to-blue-200 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Cari Jadwal Kuliah</h1>
      <div className="flex justify-center">
        <SearchBar keyword={keyword} setKeyword={setKeyword} onSearch={handleSearch} />
      </div>
      {searchResults.length > 0 && <SearchResults data={searchResults} />}
    </div>
  );
};

export default SearchJadwalPage;
