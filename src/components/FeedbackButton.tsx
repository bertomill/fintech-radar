'use client';

import { useState } from 'react';
import { Button, Dialog, TextField, Flex, Text } from '@radix-ui/themes';
import { ChatBubbleIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { toPng } from 'html-to-image';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function FeedbackButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState<Array<{x: number, y: number, width: number, height: number}>>([]);

  const takeScreenshot = async () => {
    try {
      // Get the body element
      const element = document.body;
      
      // Convert to PNG
      const dataUrl = await toPng(element, {
        quality: 0.95,
        backgroundColor: '#000', // Match dark theme background
      });
      
      setScreenshot(dataUrl);
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Upload screenshot to Supabase Storage
      const screenshotFile = await fetch(screenshot!)
        .then(res => res.blob())
        .then(blob => new File([blob], 'feedback-screenshot.png', { type: 'image/png' }));

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('feedback-screenshots')
        .upload(`${user.id}/${Date.now()}.png`, screenshotFile);

      if (uploadError) throw uploadError;

      // Save feedback to database
      const { error: feedbackError } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          comment,
          screenshot_path: uploadData.path,
          annotations: annotations,
          created_at: new Date().toISOString()
        });

      if (feedbackError) throw feedbackError;

      setIsOpen(false);
      setScreenshot(null);
      setComment('');
      setAnnotations([]);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAnnotation = () => {
    setAnnotationMode(true);
    document.body.style.cursor = 'crosshair';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!annotationMode) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      const width = upEvent.clientX - startX;
      const height = upEvent.clientY - startY;
      
      setAnnotations(prev => [...prev, {
        x: startX,
        y: startY,
        width,
        height
      }]);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      setAnnotationMode(false);
      document.body.style.cursor = 'default';
    };
    
    // Simplified mousemove handler for now
    const handleMouseMove = () => {
      // Will implement live preview later
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <div 
        className="fixed bottom-32 right-8 z-[99999]"
        style={{ 
          position: 'fixed',
          transform: 'translateZ(0)',
          right: '32px',
        }}
      >
        <Button
          className="rounded-full shadow-xl hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-blue-600"
          size="3"
          style={{
            padding: '12px 24px',
            border: 'none',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
          onClick={() => {
            takeScreenshot();
            setIsOpen(true);
          }}
        >
          <Flex align="center" gap="2">
            <ChatBubbleIcon width={18} height={18} />
            <Text size="2" weight="medium">Feedback</Text>
          </Flex>
        </Button>

        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Content 
            style={{ 
              maxWidth: 600,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Dialog.Title>
              <Flex align="center" gap="2">
                <ChatBubbleIcon className="text-blue-500" />
                <Text size="5">Send Feedback</Text>
              </Flex>
            </Dialog.Title>
            
            <Flex direction="column" gap="4" className="mt-4">
              {screenshot && (
                <div 
                  className="relative border border-gray-800 rounded-lg overflow-hidden bg-black/50"
                  onMouseDown={handleMouseDown}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={screenshot} 
                    alt="Screenshot" 
                    style={{ 
                      maxHeight: '300px', 
                      width: '100%', 
                      objectFit: 'contain',
                    }}
                  />
                  {annotations.map((annotation, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-blue-500 bg-blue-500/20 backdrop-blur-sm"
                      style={{
                        left: annotation.x,
                        top: annotation.y,
                        width: annotation.width,
                        height: annotation.height,
                        borderRadius: '4px',
                      }}
                    />
                  ))}
                </div>
              )}
              
              <Button 
                variant="soft" 
                onClick={startAnnotation}
                className="bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
              >
                <Flex align="center" gap="2">
                  <CrossCircledIcon />
                  Draw Annotation
                </Flex>
              </Button>

              <TextField.Root>
                <TextField.Input
                  placeholder="Describe your feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="bg-black/50 border-gray-800"
                />
              </TextField.Root>

              <Flex gap="3" justify="end" mt="4">
                <Button 
                  variant="soft" 
                  color="gray" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleFeedbackSubmit}
                  disabled={loading || !comment.trim()}
                  className="bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  {loading ? (
                    <Flex align="center" gap="2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Sending...
                    </Flex>
                  ) : (
                    'Send Feedback'
                  )}
                </Button>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </>
  );
} 