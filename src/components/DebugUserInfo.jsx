import { useSelector } from 'react-redux';

const DebugUserInfo = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 rounded-lg p-4 text-sm">
        <h3 className="font-bold text-red-800">Debug: User Not Authenticated</h3>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 text-sm max-w-sm">
      <h3 className="font-bold text-blue-800 mb-2">Debug: User Info</h3>
      <div className="space-y-1 text-blue-700">
        <div><strong>Name:</strong> {user?.name || 'N/A'}</div>
        <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
        <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
        <div><strong>JBP Coins:</strong> {user?.jbpCoins !== undefined ? user.jbpCoins : 'Not Set'}</div>
        <div><strong>User ID:</strong> {user?._id || 'N/A'}</div>
      </div>
      <button 
        onClick={() => console.log('Full user object:', user)}
        className="mt-2 text-xs bg-blue-200 px-2 py-1 rounded"
      >
        Log to Console
      </button>
    </div>
  );
};

export default DebugUserInfo;