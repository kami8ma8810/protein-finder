import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, AccessibilityInfo } from 'react-native';
import { Colors, Typography, Spacing } from '../../design-system/tokens';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = Colors.primary.blue,
  message,
  fullScreen = false,
  overlay = false,
}) => {
  React.useEffect(() => {
    if (message) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }, [message]);

  const content = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator
        size={size}
        color={color}
        accessibilityRole="progressbar"
        accessibilityLabel={message || 'Loading'}
      />
      {message && (
        <Text style={styles.message} accessibilityRole="text">
          {message}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return <View style={[styles.overlay, fullScreen && styles.fullScreen]}>{content}</View>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  fullScreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  message: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.body,
    color: Colors.label.secondary,
    textAlign: 'center',
  },
});

export default LoadingSpinner;
