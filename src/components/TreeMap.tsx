import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tree } from '../types';
import { supabase } from '../lib/supabase';

interface TreeMapProps {
  onTreeSelect?: (treeId: string) => void;
  selectionMode?: boolean;
  selectedTreeIds?: string[];
  onTreeToggle?: (treeId: string) => void;
}

const TreeMap = ({ onTreeSelect, selectionMode = false, selectedTreeIds = [], onTreeToggle }: TreeMapProps) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [treeMapData, setTreeMapData] = useState<(string | null)[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('TreeMap: Starting to load data...');
      
      // Load CSV data
      console.log('TreeMap: Fetching CSV from ./tree-map.csv');
      const response = await fetch('./tree-map.csv');
      console.log('TreeMap: CSV response status:', response.status);
      
      const csvText = await response.text();
      console.log('TreeMap: CSV text length:', csvText.length);
      console.log('TreeMap: First 100 chars of CSV:', csvText.substring(0, 100));
      
      const parsedData = csvText
        .trim()
        .split('\n')
        .map(row => 
          row.split(',').map(cell => {
            const trimmed = cell.trim();
            return trimmed === '' ? null : trimmed;
          })
        );
      
      console.log('TreeMap: Parsed CSV data rows:', parsedData.length);
      console.log('TreeMap: First row:', parsedData[0]);
      console.log('TreeMap: Tree positions (x) found:', parsedData.flat().filter(cell => cell === 'x').length);
      
      setTreeMapData(parsedData);

      // Load trees from database
      console.log('TreeMap: Loading trees from database...');
      const { data, error } = await supabase
        .from('trees')
        .select('*')
        .order('position_row', { ascending: true })
        .order('position_col', { ascending: true });

      if (error) throw error;
      console.log('TreeMap: Trees loaded from database:', data?.length || 0);
      setTrees(data || []);
    } catch (error) {
      console.error('TreeMap: Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTreeAtPosition = (row: number, col: number) => {
    return trees.find(tree => tree.position_row === row && tree.position_col === col);
  };

  const handleTreeClick = (tree: Tree) => {
    if (selectionMode && onTreeToggle) {
      onTreeToggle(tree.id);
    } else if (onTreeSelect) {
      onTreeSelect(tree.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading tree map...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Grove Map</h2>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Column headers */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `32px repeat(${treeMapData[0]?.length || 17}, minmax(0, 1fr))` }}>
            <div className="w-8 h-6"></div> {/* Empty corner */}
            {Array.from({ length: treeMapData[0]?.length || 17 }, (_, colIndex) => (
              <div key={`col-${colIndex}`} className="w-8 h-6 flex items-center justify-center text-xs font-medium text-gray-600">
                {colIndex + 1}
              </div>
            ))}
          </div>
          
          {/* Grid with row numbers */}
          <div className="grid gap-1" style={{ gridTemplateColumns: `32px repeat(${treeMapData[0]?.length || 17}, minmax(0, 1fr))` }}>
            {treeMapData.map((row: (string | null)[], rowIndex: number) => [
              // Row number
              <div key={`row-${rowIndex}`} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-600">
                {rowIndex + 1}
              </div>,
              // Row cells
              ...row.map((cell: string | null, colIndex: number) => {
                const tree = getTreeAtPosition(rowIndex, colIndex);
                
                if (cell === 'x') {
                  const isSelected = tree && selectedTreeIds.includes(tree.id);
                  
                  return (
                    <div key={`${rowIndex}-${colIndex}`} className="relative">
                      {tree ? (
                        selectionMode ? (
                          <button
                            onClick={() => handleTreeClick(tree)}
                            className={`w-8 h-8 rounded-full border-2 transition-colors duration-200 cursor-pointer ${
                              isSelected 
                                ? 'bg-blue-500 hover:bg-blue-600 border-blue-700' 
                                : 'bg-olive-500 hover:bg-olive-600 border-olive-700'
                            }`}
                            title={`Tree ${rowIndex + 1}-${colIndex + 1} - ${tree.variety || 'Unknown variety'} ${isSelected ? '(Selected)' : ''}`}
                          >
                            {isSelected && (
                              <svg className="w-4 h-4 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                            <span className="sr-only">Tree {rowIndex + 1}-{colIndex + 1} {isSelected ? '(Selected)' : ''}</span>
                          </button>
                        ) : (
                          <Link
                            to={`/tree/${tree.id}`}
                            className="block w-8 h-8 bg-olive-500 hover:bg-olive-600 rounded-full border-2 border-olive-700 transition-colors duration-200 cursor-pointer"
                            title={`Tree ${rowIndex + 1}-${colIndex + 1} - ${tree.variety || 'Unknown variety'}`}
                            onClick={() => handleTreeClick(tree)}
                          >
                            <span className="sr-only">Tree {rowIndex + 1}-{colIndex + 1}</span>
                          </Link>
                        )
                      ) : (
                        <div
                          className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded-full border-2 border-gray-500 transition-colors duration-200 cursor-pointer"
                          title={`Unregistered tree position ${rowIndex + 1}-${colIndex + 1}`}
                        >
                          <span className="sr-only">Empty tree position {rowIndex + 1}-{colIndex + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                }
                
                return (
                  <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8">
                    <span className="sr-only">Empty space</span>
                  </div>
                );
              })
            ]).flat()}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-olive-500 rounded-full border border-olive-700"></div>
          <span>Registered Tree</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-500"></div>
          <span>Unregistered Position</span>
        </div>
      </div>
    </div>
  );
};

export default TreeMap;
