'use client';

import { Flex, Text } from '@radix-ui/themes';
import { TargetIcon } from '@radix-ui/react-icons';

export default function Header() {
  return (
    <Flex 
      justify="center" 
      align="center" 
      gap="3" 
      py="5"
      className="sticky top-0 backdrop-blur-sm border-b border-gray-800 bg-black/50"
    >
      <TargetIcon width={32} height={32} className="text-blue-500 animate-pulse" />
      <Text size="6" weight="bold">
        Fintech Radar
      </Text>
    </Flex>
  );
} 