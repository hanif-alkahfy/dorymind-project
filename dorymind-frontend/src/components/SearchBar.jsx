import { useEffect } from "react";
import { FaSearch } from "react-icons/fa"; 

const SearchBar = ({ onSearch, keyword, setKeyword }) => {
  // Ambil keyword terakhir saat halaman dimuat atau reset jika kosong
  useEffect(() => {
    const savedKeyword = sessionStorage.getItem("searchKeyword");
    setKeyword(savedKeyword ? savedKeyword : ""); // Jika kosong, reset ke string kosong
  }, []);

  const handleSearch = () => {
    if (keyword.trim() !== "") {
      sessionStorage.setItem("searchKeyword", keyword); // Simpan keyword
      onSearch(keyword);
    }
  };

  return (
    <div className="flex items-center w-full max-w-3xl bg-gradient-to-l from-blue-300 to-blue   -100 rounded-full shadow-md px-4 py-4">
      <input
        type="text"
        placeholder="Keyword : [Mata Kuliah] [Dosen]"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 px-4 py-2"
      />
      <button onClick={handleSearch} className="p-2 rounded-full text-blue-500 hover:text-blue-700">
        <FaSearch size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
