import React, { useMemo, useState, useEffect } from "react";
import {useReactTable,getCoreRowModel,flexRender } from "@tanstack/react-table";

const SearchResults = ({ data }) => {

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState(() => {
    const savedSelections = localStorage.getItem("selectedRows");
    return savedSelections ? JSON.parse(savedSelections) : {};
  }); 

  const [selectAll, setSelectAll] = useState(false);
  const [filterMode, setFilterMode] = useState("All");

  const rowsPerPage = 15;
  const totalPages = Math.ceil(data.length / rowsPerPage); 

  // Simpan selectedRows ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("selectedRows", JSON.stringify(selectedRows));
  }, [selectedRows]);

  // Sesuaikan currentPage jika total halaman berubah
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const filteredData = useMemo(() => {
    if (filterMode === "Selected") {
      return data.filter(row => selectedRows[row.ID]); // Pastikan hanya menampilkan data yang dipilih
    }
    return data;
  }, [data, filterMode, selectedRows]);

  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredData, currentPage, totalPages]);

  const toggleRowSelection = (rowID) => {
    console.log("Toggling row with ID:", rowID);  // 🔍 Cek apakah ID benar
    
    if (!rowID) {
      console.error("Error: rowID is undefined!");
      return;
    }
  
    setSelectedRows((prev) => {
      const newSelection = { ...prev };
  
      if (newSelection[rowID]) {
        delete newSelection[rowID]; 
      } else {
        newSelection[rowID] = true; 
      }
  
      console.log("Updated selectedRows:", newSelection);
      return newSelection;
    });
  };  
  
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
  
    setSelectedRows((prev) => {
      const newSelectedRows = { ...prev };
  
      if (newSelectAll) {
        paginatedData.forEach(row => {
          newSelectedRows[row.ID] = true;
        });
      } else {
        paginatedData.forEach(row => {
          delete newSelectedRows[row.ID];
        });
      }
  
      return newSelectedRows;
    });
  };  
  
  useEffect(() => {
    const allPaginatedSelected = paginatedData.length > 0 && paginatedData.every(row => selectedRows[row.ID]);
    setSelectAll(allPaginatedSelected);
  }, [paginatedData, selectedRows]);    
  
  const columns = useMemo(
    () => [
      { accessorKey: "check", header: (
          <input
            type="checkbox"
            className="mt-2 ml-2 w-5 h-5 cursor-pointer text-gray-400 checked:text-blue-600"
            checked={selectAll}
            onChange={toggleSelectAll}
          />
        ), cell: ({ row }) => (
          <input
            type="checkbox"
            className="mt-2 ml-2 w-5 h-5 cursor-pointer text-gray-400 checked:text-blue-600"
            checked={selectedRows[row.original.ID] || false}
            onChange={() => toggleRowSelection(row.original.ID)}
          />
        ) },
      { accessorKey: "HARI", header: "Hari" },
      { accessorKey: "JAM", header: "Jam" },
      { accessorKey: "RUANG", header: "Ruang" },
      { accessorKey: "MATA KULIAH", header: "Mata Kuliah" },
      { accessorKey: "T/P", header: "T/P" },
      { accessorKey: "KELAS", header: "Kelas" },
      { accessorKey: "DOSEN", header: "Dosen" },
    ],
    [selectedRows, selectAll]
  );
      
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-10 w-full  flex justify-center">
      <div className="w-full max-w-7xl mx-auto bg-white p-10 rounded-2xl shadow-lg flex flex-col min-h-fit">
        {/* Dropdown Filter */}
        <div className="mb-4 flex justify-start">
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="p-2 rounded-md text-gray-600 bg-white shadow-md hover:bg-blue-100"
          >
            <option value="All" className="block px-4 py-2 text-sm text-gray-700">All</option>
            <option value="Selected" className="">Selected</option>
          </select>
        </div>
        {table.getRowModel().rows.length > 0 ? (
          <div className="overflow-hidden rounded-2xl">
            <table className="w-full border-collapse rounded-2xl overflow-hidden">
              <thead className="bg-blue-200 text-left rounded-t-2xl">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="rounded-t-2xl">
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={header.id}
                        className={`p-3 font-bold text-black border-b border-gray-300 ${
                          index === 0 ? "rounded-tl-2xl" : ""
                        } ${index === headerGroup.headers.length - 1 ? "rounded-tr-2xl" : ""}`}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className={`${
                      rowIndex % 2 === 0 ? "bg-blue-50" : "bg-white"
                    } hover:bg-blue-100`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 border-b border-gray-300 text-black">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 pt-20 min-h-screen">
            <h2 className="text-4xl font-bold text-blue-600">Tidak ada hasil pencarian</h2>
            <p className="text-lg text-black mt-2">Silakan cari kata kunci lain atau ubah filter</p>
          </div>
        )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-auto pt-4 gap-2 text-black text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md text-blue-600 disabled:opacity-50"
          >
            &#9664;
          </button>
          <span className="">{currentPage}</span>
          <span className="text-gray-600">dari</span>
          <span className="">{totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 border rounded-md text-blue-600 disabled:opacity-50"
          >
            &#9654;
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default SearchResults;
