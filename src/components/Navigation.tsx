import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/trees', label: 'Trees', icon: '🌳' },
    { path: '/oil-processing-batches', label: 'Oil Processing', icon: '🫒' },
    { path: '/pickling-batches', label: 'Pickling', icon: '🥒' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-olive-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🫒</span>
            <span className="text-xl font-bold">Barsoum Olives Tracker</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-olive-600 text-white'
                    : 'text-olive-100 hover:bg-olive-700 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
