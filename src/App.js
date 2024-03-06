import logo from "./logo.svg";
import "./App.css";
import { AgGridReact } from "ag-grid-react"; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

function App() {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "blockNumber", filter: "agNumberColumnFilter", hide: true },
    { field: "hash", filter: "agTextColumnFilter" },
    { field: "to", filter: "agTextColumnFilter" },
    { field: "value", filter: "agNumberColumnFilter" },
    { field: "gas", filter: "agNumberColumnFilter" },
    { field: "gasPrice", filter: "agNumberColumnFilter" },
    { field: "gasUsed", filter: "agNumberColumnFilter" },
    { field: "functionName", filter: "agTextColumnFilter" },
  ]);
  useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const data = await fetch(
        "https://api.etherscan.io/api?module=account&action=txlist&address=0x6Fb447Ae94F5180254D436A693907a1f57696900&startblock=16689267&endblock=18982605&sort=asc&apikey="
      );
      const json = await data.json();
      if (json?.status === "1") {
        setRowData(json?.result);
      }
      return json;
    },
  });

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);
  const hideColumn = () => {
    setColDefs((colDefs) =>
      colDefs.map((item) => {
        if (item?.field === "blockNumber") {
          return { ...item, hide: !item?.hide };
        }
        return item;
      })
    );
  };
  return (
    <div>
      <button onClick={() => onBtnExport()}>Export Excel</button>
      <button onClick={() => hideColumn()}>Hide Column</button>
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact ref={gridRef} rowData={rowData} columnDefs={colDefs} />
      </div>
    </div>
  );
}

export default App;
