import { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserPassword, updateUserDisplayName } from '@/lib/api';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState<string | null>(null);
  const [displayNameSuccess, setDisplayNameSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchUserProfile(token);
        setUser(data);
        if (data.display_name) {
          setDisplayName(data.display_name);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordError('Not authenticated. Please log in.');
      return;
    }

    try {
      await updateUserPassword(token, newPassword);
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  const handleDisplayNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayNameError(null);
    setDisplayNameSuccess(null);

    if (!displayName.trim()) {
      setDisplayNameError('Display name cannot be empty.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setDisplayNameError('Not authenticated. Please log in.');
      return;
    }

    try {
      await updateUserDisplayName(token, displayName);
      setDisplayNameSuccess('Display name updated successfully!');
      setUser((prevUser: any) => ({ ...prevUser, display_name: displayName }));
    } catch (err: any) {
      setDisplayNameError(err.message || 'Failed to update display name.');
    }
  };

  if (loading) return <div className="container mx-auto mt-10 text-center">Loading profile...</div>;
  if (error) return <div className="container mx-auto mt-10 text-center text-red-500">Error: {error}</div>;
  if (!user) return <div className="container mx-auto mt-10 text-center">No profile data.</div>;

  return (
    <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">User Profile</h1>

      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Account Information</h2>
        <div className="space-y-2">
          <p className="text-lg text-gray-700"><strong>ID:</strong> {user.id}</p>
          <p className="text-lg text-gray-700"><strong>Email:</strong> {user.email}</p>
          {user.display_name && <p className="text-lg text-gray-700"><strong>Display Name:</strong> {user.display_name}</p>}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Change Display Name</h2>
        <form onSubmit={handleDisplayNameChange} className="space-y-4">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              id="display-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          {displayNameError && <p className="text-red-500 text-sm mt-2">{displayNameError}</p>}
          {displayNameSuccess && <p className="text-green-500 text-sm mt-2">{displayNameSuccess}</p>}
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Update Display Name
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 sm:p-8 mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="new-password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 text-sm mt-2">{passwordSuccess}</p>}
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;