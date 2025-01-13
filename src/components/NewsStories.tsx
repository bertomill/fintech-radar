'use client';

import { useEffect, useState } from 'react';
import { Card, Flex, Text, ScrollArea, Dialog, Box } from '@radix-ui/themes';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

interface StoryItem {
  id: string;
  title: string;
  source: {
    name: string;
  };
  urlToImage: string;
  url: string;
}

export default function NewsStories() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [activeStory, setActiveStory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    }

    fetchStories();
  }, []);

  return (
    <Box className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
      <ScrollArea type="always" scrollbars="horizontal">
        <Flex gap="3" py="4" px="6" style={{ minWidth: 'max-content' }}>
          {loading ? (
            <Text>Loading stories...</Text>
          ) : (
            stories.map((story) => (
              <Card
                key={story.id}
                className="relative cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                  width: '180px',
                  height: '240px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url(${story.urlToImage})`,
                  borderRadius: '16px',
                }}
                onClick={() => setActiveStory(story.id)}
              >
                <Flex 
                  direction="column" 
                  justify="between" 
                  style={{ height: '100%' }}
                  p="4"
                >
                  <div className="rounded-full bg-blue-500 w-10 h-10 flex items-center justify-center ring-2 ring-white">
                    <Text size="3" weight="bold">{story.source.name[0]}</Text>
                  </div>
                  <Text size="2" weight="medium" className="line-clamp-3">
                    {story.title}
                  </Text>
                </Flex>
              </Card>
            ))
          )}
        </Flex>
      </ScrollArea>

      <Dialog.Root open={!!activeStory} onOpenChange={() => setActiveStory(null)}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          {activeStory && stories.find(s => s.id === activeStory) && (
            <Flex direction="column" gap="4">
              <Dialog.Title>
                {stories.find(s => s.id === activeStory)?.title}
              </Dialog.Title>
              <a 
                href={stories.find(s => s.id === activeStory)?.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:underline"
              >
                Read full article <ExternalLinkIcon />
              </a>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
} 