'use client';

import { Box, Container, Flex, Text } from '@radix-ui/themes';
import { TargetIcon } from '@radix-ui/react-icons';

export default function Navbar() {
  return (
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
          <Flex gap="6">
            {/* Navigation items */}
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
} 