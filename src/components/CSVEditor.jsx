import { useCallback, useEffect, useRef, useState } from 'react'
import Papa from "papaparse";
import PropTypes from "prop-types"
import "../assets/csv-editor.scss"

CSVEditor.propTypes = {
  importedFile: PropTypes.array.isRequired,
};

const CSVEditor = ({ importedFile }) => {
  const [parsedCSVData, setParsedCSVData] = useState([]);
  const [tableCell, setTableCell] = useState({ row: -1, col: -1 });
  const [tableCellInput, setTableCellInput] = useState("");
  const tableRef = useRef(null);
  const inputRef = useRef(null);

  const parseFile = useCallback((file) => {
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedCSVData(results.data);
      },
    });
  }, []);

  useEffect(() => {
    console.log(Object.keys(importedFile))
    if (Object.keys(importedFile)?.length > 0) {
      console.log("herhe")
      parseFile(importedFile)
    }
  }, [parseFile, importedFile])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;
      let newRow = tableCell.row;
      let newCol = tableCell.col;

      if (key === "ArrowUp" && newRow > 0) {
        inputRef.current.blur();
        newRow--;
        event.preventDefault();
      } else if (key === "ArrowDown" && newRow < parsedCSVData.length - 2) {
        inputRef.current.blur();
        newRow++;
        event.preventDefault();
      } else if (key === "ArrowLeft" && newCol > 0) {
        newCol--;
        event.preventDefault();
      } else if (key === "ArrowRight" && newCol < parsedCSVData[0].length - 1) {
        newCol++;
        event.preventDefault();
      } else if (key === "Enter") {
        if (document.activeElement === inputRef.current) {
          inputRef.current.blur();
        } else {
          inputRef.current.focus();
        }
      }

      setTableCell({ row: newRow, col: newCol });
      setTableCellInput(parsedCSVData[newRow + 1][newCol]);

      if (tableRef.current) {
        const selectedCellElement =
          tableRef.current.rows[newRow + 1].cells[newCol];
        selectedCellElement.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "center",
        });
      }
    };
    if (parsedCSVData.length && tableCell.row !== -1 && tableCell.col !== -1) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      if (
        parsedCSVData.length &&
        tableCell.row !== -1 &&
        tableCell.col !== -1
      ) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [tableCell.row, tableCell.col, parsedCSVData]);

  return (
    <div>
      {!!parsedCSVData?.length && (
        <div className="table-responsive preview-table mb-3">
          <table
            className="table table-centered react-table table-bordered mb-0"
            ref={tableRef}
          >
            <thead>
              <tr>
                {parsedCSVData[0]?.map((column, i) => (
                  <th key={i}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(parsedCSVData || [])?.slice(1, 1000)?.map((row, i) => {
                return (
                  <tr key={i}>
                    {row?.map((cell, j) => {
                      return (
                        <td
                          key={`${i}-${j}`}
                          className={
                            tableCell.row === i && tableCell.col === j
                              ? "table-cell"
                              : ""
                          }
                          onClick={() => {
                            setTableCellInput(cell);
                            setTableCell({ row: i, col: j });
                          }}
                        >
                          {tableCell.row === i && tableCell.col === j ? (
                            <>
                              <input
                                type="text"
                                className="table-cell-input"
                                value={tableCellInput}
                                ref={inputRef}
                                onChange={(e) => {
                                  setTableCellInput(e.target.value);
                                  setParsedCSVData((prev) => {
                                    prev[i + 1].splice(
                                      j,
                                      1,
                                      e.target.value
                                    );
                                    return prev;
                                  });
                                }}
                              />
                            </>

                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CSVEditor