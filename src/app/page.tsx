'use client';

import { Box, Container, Flex, Text, Card, Heading } from "@radix-ui/themes";
import { 
  DashboardIcon, 
  BarChartIcon, 
  LightningBoltIcon 
} from "@radix-ui/react-icons";
import TechnologyAnalysis from '@/components/ai/TechnologyAnalysis';
import NewsStories from '@/components/NewsStories';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <Box className="min-h-screen">
        <Box style={{ paddingTop: '56px' }}>
          <NewsStories />
          <Container size="3" py="9">
            <Flex direction="column" gap="6" mb="8">
              <Text size="5" align="center" color="gray">
                Stay ahead of emerging financial technologies and trends
              </Text>
            </Flex>

            <Flex direction="column" gap="4" mb="8">
              <Card size="2">
                <Flex gap="3" align="center">
                  <DashboardIcon width={24} height={24} className="text-blue-500" />
                  <Heading size="3">Technology Radar</Heading>
                </Flex>
                <Text as="p" color="gray" mt="2">
                  Track emerging technologies in the financial sector
                </Text>
              </Card>

              <Card size="2">
                <Flex gap="3" align="center">
                  <BarChartIcon width={24} height={24} className="text-green-500" />
                  <Heading size="3">Market Trends</Heading>
                </Flex>
                <Text as="p" color="gray" mt="2">
                  Analysis of current market movements and predictions
                </Text>
              </Card>

              <Card size="2">
                <Flex gap="3" align="center">
                  <LightningBoltIcon width={24} height={24} className="text-yellow-500" />
                  <Heading size="3">Innovation Insights</Heading>
                </Flex>
                <Text as="p" color="gray" mt="2">
                  Deep dives into innovative financial solutions
                </Text>
              </Card>

              <TechnologyAnalysis />
            </Flex>

            <Flex justify="center">
              <Text size="2" color="gray">
                © {new Date().getFullYear()} Fintech Radar. All rights reserved.
              </Text>
            </Flex>
          </Container>
        </Box>
      </Box>
    </>
  );
}
