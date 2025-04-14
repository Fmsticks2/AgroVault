import { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, PencilIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

interface SocialMedia {
  platform: string;
  username: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  socialMedia: SocialMedia[];
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    socialMedia: [
      { platform: 'Twitter', username: '' },
      { platform: 'Discord', username: '' },
      { platform: 'Telegram', username: '' }
    ]
  });

  const handleSocialMediaChange = (platform: string, username: string) => {
    setProfile(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.map(social =>
        social.platform === platform ? { ...social, username } : social
      )
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the profile to your backend
    console.log('Saving profile:', profile);
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-background-light transition-colors">
        {profile.avatar ? (
          <img src={profile.avatar} alt="Profile" className="h-8 w-8 rounded-full" />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-text-secondary" />
        )}
        <span className="text-text-primary">{profile.name}</span>
      </Menu.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg p-4 focus:outline-none">
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-background-light border border-border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-background-light border border-border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm text-text-secondary">Social Media</label>
                  {profile.socialMedia.map((social) => (
                    <div key={social.platform} className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary w-20">{social.platform}</span>
                      <input
                        type="text"
                        value={social.username}
                        onChange={(e) => handleSocialMediaChange(social.platform, e.target.value)}
                        placeholder={`Enter ${social.platform} username`}
                        className="flex-1 bg-background-light border border-border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{profile.name}</h3>
                    <p className="text-sm text-text-secondary">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-text-secondary hover:text-primary transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.socialMedia.map((social) => (
                    <div key={social.platform} className="flex items-center space-x-2 text-sm">
                      <span className="text-text-secondary">{social.platform}:</span>
                      <span>{social.username || 'Not connected'}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-border" />
                <button
                  className="w-full flex items-center justify-center space-x-2 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  onClick={() => console.log('Disconnect wallet')}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Profile;