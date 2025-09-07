// Function to load and parse tree map data from CSV
async function loadTreeMapData(): Promise<(string | null)[][]> {
  try {
    const response = await fetch("/tree-map.csv");
    const csvText = await response.text();

    return csvText
      .trim()
      .split("\n")
      .map((row) =>
        row.split(",").map((cell) => {
          const trimmed = cell.trim();
          return trimmed === "" ? null : trimmed;
        })
      );
  } catch (error) {
    console.error("Error loading tree map CSV:", error);
    // Fallback to empty array if CSV can't be loaded
    return [];
  }
}

// Cache for the loaded tree map data
let treeMapDataCache: (string | null)[][] | null = null;

export interface TreePosition {
  row: number;
  col: number;
  id: string;
}

// Get tree map data with caching
async function getTreeMapData(): Promise<(string | null)[][]> {
  console.log("Fetching tree map data...");
  if (treeMapDataCache === null) {
    treeMapDataCache = await loadTreeMapData();
    console.log("Tree map data loaded:", treeMapDataCache);
  }
  return treeMapDataCache;
}

export async function getTreePositions(): Promise<TreePosition[]> {
  const positions: TreePosition[] = [];
  let treeId = 1;
  const treeMapData = await getTreeMapData();

  treeMapData.forEach((row: (string | null)[], rowIndex: number) => {
    row.forEach((cell: string | null, colIndex: number) => {
      if (cell === "x") {
        positions.push({
          row: rowIndex,
          col: colIndex,
          id: `tree-${treeId.toString().padStart(3, "0")}`,
        });
        treeId++;
      }
    });
  });

  return positions;
}

export async function getTreeCount(): Promise<number> {
  const positions = await getTreePositions();
  return positions.length;
}

export async function getGridDimensions(): Promise<{
  rows: number;
  cols: number;
}> {
  const treeMapData = await getTreeMapData();
  return {
    rows: treeMapData.length,
    cols: Math.max(...treeMapData.map((row: (string | null)[]) => row.length)),
  };
}
