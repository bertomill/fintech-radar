'use client';

import { useState } from 'react';
import { Card, Flex, Text, Button, TextField, ScrollArea, Box } from '@radix-ui/themes';
import { MagnifyingGlassIcon, ExternalLinkIcon } from '@radix-ui/react-icons';

interface NewsSource {
  title: string;
  url: string;
  publishedAt: string;
}

export default function TechnologyAnalysis() {
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<NewsSource[]>([]);

  const formatAnalysis = (text: string) => {
    // Split by numbered sections
    return text.split('###').map((section, index) => {
      if (index === 0) return section; // First section doesn't need special formatting
      
      // Format each section with proper spacing and styling
      const trimmedSection = section.trim();
      return (
        <Box key={index} my="4">
          <Text as="p" size="2" weight="bold" mb="2">
            {trimmedSection.split('\n')[0]}
          </Text>
          <Text as="p" color="gray" size="2">
            {trimmedSection.split('\n').slice(1).join('\n')}
          </Text>
        </Box>
      );
    });
  };

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
      setSources(data.sources);
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card size="3">
      <Flex direction="column" gap="3">
        <Text size="5" weight="bold">AI Technology Analysis</Text>
        <form onSubmit={handleAnalyze}>
          <Flex direction="column" gap="3">
            <TextField.Root>
              <TextField.Input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about any fintech technology..."
                disabled={isLoading}
              />
            </TextField.Root>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <MagnifyingGlassIcon width={16} height={16} />
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Flex>
        </form>
        {analysis && (
          <ScrollArea style={{ height: 400 }} className="mt-4">
            <Box className="space-y-4 p-4 bg-gray-900 rounded-lg">
              {typeof analysis === 'string' ? formatAnalysis(analysis) : analysis}
              
              {sources?.length > 0 && (
                <Box className="mt-6 pt-4 border-t border-gray-700">
                  <Text size="2" weight="bold" mb="2">Sources:</Text>
                  {sources.map((source, index) => (
                    <Flex key={index} gap="2" mb="2">
                      <ExternalLinkIcon />
                      <Text asChild size="1">
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          {source.title} ({new Date(source.publishedAt).toLocaleDateString()})
                        </a>
                      </Text>
                    </Flex>
                  ))}
                </Box>
              )}
            </Box>
          </ScrollArea>
        )}
      </Flex>
    </Card>
  );
} 