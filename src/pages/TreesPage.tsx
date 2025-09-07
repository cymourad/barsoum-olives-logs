import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TreeMap from '../components/TreeMap';
import { Tree } from '../types';
import { supabase } from '../lib/supabase';
import { getTreePositions } from '../utils/treeMap';

const TreesPage = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInitializeModal, setShowInitializeModal] = useState(false);

  useEffect(() => {
    loadTrees();
  }, []);

  const loadTrees = async () => {
    try {
      console.log('TreesPage: Loading trees from database...');
      const { data, error } = await supabase
        .from('trees')
        .select('*')
        .order('position_row', { ascending: true })
        .order('position_col', { ascending: true });

      if (error) throw error;
      console.log('TreesPage: Trees loaded:', data?.length || 0);
      setTrees(data || []);
      
      // Check if we need to initialize trees
      if (!data || data.length === 0) {
        console.log('TreesPage: No trees found, showing initialize modal');
        setShowInitializeModal(true);
      }
    } catch (error) {
      console.error('TreesPage: Error loading trees:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeTrees = async () => {
    try {
      console.log('TreesPage: Starting tree initialization...');
      const treePositions = await getTreePositions();
      console.log('TreesPage: Tree positions generated:', treePositions.length);
      console.log('TreesPage: First few positions:', treePositions.slice(0, 5));
      
      const treesToInsert = treePositions.map(pos => ({
        position_row: pos.row,
        position_col: pos.col,
      }));

      console.log('TreesPage: Inserting trees into database...');
      const { error } = await supabase
        .from('trees')
        .insert(treesToInsert);

      if (error) throw error;
      console.log('TreesPage: Trees successfully inserted');
      
      setShowInitializeModal(false);
      loadTrees();
    } catch (error) {
      console.error('TreesPage: Error initializing trees:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading trees...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Trees Management</h1>
        <div className="text-sm text-gray-600">
          Total Trees: {trees.length}
        </div>
      </div>

      <TreeMap />

      {trees.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tree List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trees.map((tree) => (
              <Link
                key={tree.id}
                to={`/tree/${tree.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-olive-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      Tree {tree.position_row + 1}-{tree.position_col + 1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tree.variety || 'Unknown variety'}
                    </div>
                    {tree.year_planted && (
                      <div className="text-sm text-gray-500">
                        Planted: {tree.year_planted}
                      </div>
                    )}
                  </div>
                  <div className="text-olive-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Initialize Trees Modal */}
      {showInitializeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Initialize Trees</h3>
            <p className="text-gray-600 mb-6">
              No trees found in the database. Would you like to initialize all tree positions from the grove map?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={initializeTrees}
                className="btn-primary flex-1"
              >
                Initialize Trees
              </button>
              <button
                onClick={() => setShowInitializeModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreesPage;
