import { useCallback, useRef, useState } from 'react';
import { Box, Grid, Button } from '@chakra-ui/react';

const N = 30;
const gridRows = N;
const gridColumns = N;
const cellSize = '20px';
const iterationDelay = 1000; //In miliseconds

const neighborCells = [
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
];
export function Index() {
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < gridRows; i++) {
      rows.push(Array.from(Array(gridColumns).fill(0)));
    }
    // console.table(rows);
    return rows;
  });

  const runningRef = useRef(running);
  runningRef.current = running;

  // useCallback to avoid recreating function on rerender
  const simulate = useCallback(() => {
    // Need ref to keep updated value even being the same function
    // a.k.a. no direct access to state vars
    if (!runningRef.current) return;
    setGrid((currentGrid) => {
      return produce(currentGrid, (nextGrid) => {
        for (let i = 0; i < gridRows; i++) {
          for (let j = 0; j < gridColumns; j++) {
            let neighbors = 0;
            //Check bounds
            neighborCells.forEach(([x, y]) => {
              const neighborCellColumn = i + x;
              const neighborCellRow = j + y;

              if (
                neighborCellColumn >= 0 &&
                neighborCellColumn < gridRows &&
                neighborCellRow >= 0 &&
                neighborCellRow < gridColumns
              ) {
                neighbors += currentGrid[neighborCellColumn][neighborCellRow];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              nextGrid[i][j] = 0;
            } else if (currentGrid[i][j] === 0 && neighbors === 3) {
              nextGrid[i][j] = 1;
            }
          }
        }
      });
    });

    const handler = setTimeout(simulate, iterationDelay);
    return () => clearTimeout(handler); // setTimeout Cleanup
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            simulate();
          }
        }}
      >
        {running ? '■' : '▶️'}
      </Button>
      <Grid templateColumns={`repeat(${gridColumns}, ${cellSize})`}>
        {grid.map((rows, rowidx) =>
          rows.map((col, colidx) => (
            <Box
              key={`${rowidx},${colidx}`}
              w={cellSize}
              h={cellSize}
              bgColor={(grid[rowidx][colidx] && 'lightgreen') || 'darkgray'}
              border="solid 1px lightgray"
              onClick={() => {
                const newGrid = produce(grid, (nextGrid) => {
                  nextGrid[rowidx][colidx] = grid[rowidx][colidx] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
            />
          ))
        )}
      </Grid>
    </>
  );
}

export default Index;

const produce = (grid, callback) => {
  //Inspired by https://immerjs.github.io/immer/produce/
  const nextGrid = JSON.parse(JSON.stringify(grid)); // deep copy
  callback(nextGrid); // manipulate copy in callback
  return nextGrid; // Return fully transformed
};
