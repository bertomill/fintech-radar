'use client';

import { Flex, Text, Badge } from '@radix-ui/themes';
import { 
  BackpackIcon,
  LayersIcon,
  StarFilledIcon
} from '@radix-ui/react-icons';

interface UserPreferencesViewProps {
  preferences: {
    occupation: string;
    industry: string;
    interests: string[];
  };
}

export default function UserPreferencesView({ preferences }: UserPreferencesViewProps) {
  return (
    <Flex direction="column" gap="4">
      <Flex gap="2" align="center">
        <BackpackIcon className="text-blue-500" />
        <div>
          <Text size="1" color="gray">Occupation</Text>
          <Text size="2">{preferences.occupation || 'Not set'}</Text>
        </div>
      </Flex>

      <Flex gap="2" align="center">
        <LayersIcon className="text-blue-500" />
        <div>
          <Text size="1" color="gray">Industry</Text>
          <Text size="2">{preferences.industry || 'Not set'}</Text>
        </div>
      </Flex>

      <div>
        <Flex gap="2" align="center" mb="2">
          <StarFilledIcon className="text-blue-500" />
          <Text size="1" color="gray">Interests</Text>
        </Flex>
        <Flex gap="2" wrap="wrap">
          {preferences.interests.length > 0 ? (
            preferences.interests.map((interest) => (
              <Badge key={interest} color="blue">
                {interest}
              </Badge>
            ))
          ) : (
            <Text size="2" color="gray">No interests set</Text>
          )}
        </Flex>
      </div>
    </Flex>
  );
} 