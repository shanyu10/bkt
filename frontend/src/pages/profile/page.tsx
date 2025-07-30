
import { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: {
            'x-auth-token': token,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Failed to fetch profile');
        }

        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="container mx-auto mt-10 text-center">Loading profile...</div>;
  if (error) return <div className="container mx-auto mt-10 text-center text-red-500">Error: {error}</div>;
  if (!user) return <div className="container mx-auto mt-10 text-center">No profile data.</div>;

  return (
    <div className="container mx-auto mt-10 max-w-md">
      <h1 className="text-4xl font-bold text-center mb-8">User Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-2"><strong>ID:</strong> {user.id}</p>
        <p className="text-lg"><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
