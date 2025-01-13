'use client';

import { Box, Container, Flex, Text, Button, Dialog, TextField, Tabs } from '@radix-ui/themes';
import { TargetIcon, PersonIcon, GitHubLogoIcon, ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreferences {
  occupation: string;
  interests: string[];
  industry: string;
}

interface PasswordValidation {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

export default function Navbar() {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    occupation: '',
    interests: [],
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [password, setPassword] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  useEffect(() => {
    // Load user preferences if logged in
    async function loadPreferences() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setUserPrefs({
            occupation: data.occupation || '',
            industry: data.industry || '',
            interests: data.interests || []
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    loadPreferences();
  }, [user]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAuthMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setAuthMessage({
          type: 'success',
          text: 'Check your email for the confirmation link!'
        });
      }
    } catch (error: any) {
      setAuthMessage({
        type: 'error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setShowSignup(false);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const validatePassword = (value: string) => {
    setPasswordValidation({
      hasMinLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /[0-9]/.test(value),
    });
  };

  return (
    <>
      <Box 
        className="fixed top-0 left-0 right-0 w-full z-[99999] border-b border-gray-800"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 99999,
        }}
      >
        <Container size="3" style={{ position: 'relative' }}>
          <Flex py="3" justify="between" align="center">
            <Flex align="center" gap="3">
              <TargetIcon width={28} height={28} className="text-blue-500 animate-pulse" />
              <Text size="4" weight="bold">
                Fintech Radar
              </Text>
            </Flex>
            <Flex gap="3" align="center">
              {user ? (
                <>
                  <Text size="2">{user.email}</Text>
                  <Button 
                    variant="soft" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                  <Button 
                    onClick={() => setShowSignup(true)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <PersonIcon width={16} height={16} />
                    Update Preferences
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setShowSignup(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <PersonIcon width={16} height={16} />
                  Sign In
                </Button>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Dialog.Root open={showSignup} onOpenChange={setShowSignup}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          {!user ? (
            <>
              <Dialog.Title>
                Welcome to Fintech Radar
              </Dialog.Title>
              <Tabs.Root defaultValue="signin">
                <Tabs.List>
                  <Tabs.Trigger value="signin">Sign In</Tabs.Trigger>
                  <Tabs.Trigger value="signup">Sign Up</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="signin">
                  <form onSubmit={handleSignIn}>
                    <Flex direction="column" gap="3">
                      <TextField.Root>
                        <TextField.Input 
                          name="email"
                          placeholder="Email" 
                          type="email" 
                          required
                        />
                      </TextField.Root>
                      <TextField.Root>
                        <TextField.Input 
                          name="password"
                          placeholder="Password" 
                          type="password" 
                          required
                        />
                      </TextField.Root>
                      {error && (
                        <Flex gap="2" align="center" className="text-red-500">
                          <ExclamationTriangleIcon />
                          <Text size="2">{error}</Text>
                        </Flex>
                      )}
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                      </Button>
                      <Flex align="center" gap="3">
                        <div className="h-px flex-1 bg-gray-800" />
                        <Text size="2">or continue with</Text>
                        <div className="h-px flex-1 bg-gray-800" />
                      </Flex>
                      <Button 
                        variant="soft" 
                        onClick={() => handleSocialLogin('github')}
                      >
                        <GitHubLogoIcon />
                        GitHub
                      </Button>
                    </Flex>
                  </form>
                </Tabs.Content>

                <Tabs.Content value="signup">
                  <form onSubmit={handleSignup}>
                    <Flex direction="column" gap="3">
                      <TextField.Root>
                        <TextField.Input 
                          name="email"
                          placeholder="Email" 
                          type="email" 
                          required
                        />
                      </TextField.Root>
                      <TextField.Root>
                        <TextField.Input 
                          name="password"
                          placeholder="Password" 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                          }}
                        />
                      </TextField.Root>
                      
                      <Box className="space-y-2 text-sm">
                        <Text size="2" weight="bold">Password requirements:</Text>
                        <Flex direction="column" gap="1">
                          <Flex gap="2" align="center">
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.hasMinLength ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <Text size="1" color={passwordValidation.hasMinLength ? 'green' : 'gray'}>
                              At least 8 characters
                            </Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <Text size="1" color={passwordValidation.hasUpperCase ? 'green' : 'gray'}>
                              One uppercase letter
                            </Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <Text size="1" color={passwordValidation.hasLowerCase ? 'green' : 'gray'}>
                              One lowercase letter
                            </Text>
                          </Flex>
                          <Flex gap="2" align="center">
                            <div className={`w-2 h-2 rounded-full ${passwordValidation.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <Text size="1" color={passwordValidation.hasNumber ? 'green' : 'gray'}>
                              One number
                            </Text>
                          </Flex>
                        </Flex>
                      </Box>

                      {authMessage && (
                        <Flex 
                          gap="2" 
                          align="center" 
                          className={authMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}
                        >
                          {authMessage.type === 'error' ? (
                            <ExclamationTriangleIcon />
                          ) : (
                            <CheckCircledIcon />
                          )}
                          <Text size="2">{authMessage.text}</Text>
                        </Flex>
                      )}
                      
                      <Button 
                        type="submit" 
                        disabled={loading || !Object.values(passwordValidation).every(Boolean)}
                      >
                        {loading ? 'Processing...' : 'Sign Up'}
                      </Button>
                    </Flex>
                  </form>
                </Tabs.Content>
              </Tabs.Root>
            </>
          ) : (
            <form onSubmit={handleSignup}>
              <Flex direction="column" gap="3">
                <TextField.Root>
                  <TextField.Input 
                    placeholder="What's your occupation?"
                    value={userPrefs.occupation}
                    onChange={(e) => setUserPrefs({
                      ...userPrefs,
                      occupation: e.target.value
                    })}
                  />
                </TextField.Root>
                <TextField.Root>
                  <TextField.Input 
                    placeholder="Which industry do you work in?"
                    value={userPrefs.industry}
                    onChange={(e) => setUserPrefs({
                      ...userPrefs,
                      industry: e.target.value
                    })}
                  />
                </TextField.Root>
                <Text size="2" weight="bold">Interests</Text>
                <Flex gap="2" wrap="wrap">
                  {['Blockchain', 'AI', 'Banking', 'Investment', 'Regulation'].map((interest) => (
                    <Button
                      key={interest}
                      variant="soft"
                      onClick={() => setUserPrefs(prev => ({
                        ...prev,
                        interests: prev.interests.includes(interest)
                          ? prev.interests.filter(i => i !== interest)
                          : [...prev.interests, interest]
                      }))}
                      className={userPrefs.interests.includes(interest) ? 'bg-blue-500' : ''}
                    >
                      {interest}
                    </Button>
                  ))}
                </Flex>
                <Button type="submit">Complete Setup</Button>
              </Flex>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
} 