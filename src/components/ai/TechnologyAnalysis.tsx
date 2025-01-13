'use client';

import { useState } from 'react';
import { Card, Text, Button, TextField, Flex } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function TechnologyAnalysis() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const { user } = useAuth();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResponse(data.content);
      setIsPersonalized(data.personalized);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size="2">
      <Flex direction="column" gap="3">
        <Text size="5" weight="bold">AI Technology Analysis</Text>
        
        {user && isPersonalized && (
          <Flex gap="2" align="center" className="bg-blue-500/10 p-2 rounded">
            <PersonIcon className="text-blue-500" />
            <Text size="2" color="blue">
              Analysis personalized based on your preferences
            </Text>
          </Flex>
        )}

        <TextField.Root>
          <TextField.Input 
            placeholder="Ask about any fintech technology..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </TextField.Root>

        <Button 
          onClick={handleAnalyze} 
          disabled={loading || !query.trim()}
        >
          <MagnifyingGlassIcon />
          {loading ? 'Analyzing...' : 'Analyze'}
        </Button>

        {response && (
          <Text as="p" color="gray" style={{ whiteSpace: 'pre-wrap' }}>
            {response}
          </Text>
        )}

        {!user && (
          <Text size="2" color="gray" align="center">
            Sign in to get personalized analysis based on your preferences
          </Text>
        )}
      </Flex>
    </Card>
  );
} 