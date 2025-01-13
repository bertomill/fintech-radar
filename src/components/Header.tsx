'use client';

import { Flex, Text, Box } from '@radix-ui/themes';
import { TargetIcon } from '@radix-ui/react-icons';

export default function Header() {
  return (
    <Box className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
      <Flex 
        justify="center" 
        align="center" 
        gap="3" 
        py="4"
      >
        <TargetIcon width={32} height={32} className="text-blue-500 animate-pulse" />
        <Text size="6" weight="bold">
          Fintech Radar
        </Text>
      </Flex>
    </Box>
  );
} 