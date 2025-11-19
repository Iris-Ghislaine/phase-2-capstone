'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useToast } from '@/context/ToastContext';
import { Settings, User, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!session) {
    router.push('/login');
    return null;
  }

  const [formData, setFormData] = useState({
    name: session.user?.name || '',
    bio: '',
    avatar: session.user?.image || '',
  });

  // Fetch user data on mount to populate bio
  useEffect(() => {
    const fetchUserData = async () => {
      const username = (session.user as any)?.username;
      if (!username) return;

      try {
        const res = await fetch(`/api/users/${username}`);
        if (res.ok) {
          const userData = await res.json();
          setFormData(prev => ({
            ...prev,
            bio: userData.bio || '',
            avatar: userData.avatar || session.user?.image || '',
            name: userData.name || session.user?.name || '',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (session) {
      fetchUserData();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const username = (session.user as any)?.username;
      if (!username) {
        toast.error('Username not found');
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/users/${username}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to update settings');
        return;
      }

      toast.success('Settings updated successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="text-gray-700" size={32} />
          <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <Avatar src={formData.avatar} size="xl" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
              <p className="text-gray-500">{session.user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} />
                Profile Information
              </h3>
              
              <div className="space-y-4">
                <Input
                  label="Display Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                
                <Textarea
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
                
                <Input
                  label="Avatar URL"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mt-6">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <Lock size={20} />
            Coming Soon
          </h3>
          <p className="text-yellow-800">
            Password change, email notifications, and additional settings will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}