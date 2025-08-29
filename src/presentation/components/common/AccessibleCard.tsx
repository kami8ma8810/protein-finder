import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityRole,
  GestureResponderEvent,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../design-system/tokens';

interface AccessibleCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  selected?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  testID?: string;
  showChevron?: boolean;
  badge?: string | number;
  badgeColor?: string;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  disabled = false,
  selected = false,
  style,
  titleStyle,
  subtitleStyle,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  testID,
  showChevron = false,
  badge,
  badgeColor = Colors.system.red,
}) => {
  const cardContent = (
    <View style={[
      styles.container,
      selected && styles.selected,
      disabled && styles.disabled,
      style,
    ]}>
      <View style={styles.content}>
        {(title || subtitle) && (
          <View style={styles.textContainer}>
            {title && (
              <Text
                style={[
                  styles.title,
                  disabled && styles.disabledText,
                  titleStyle,
                ]}
                numberOfLines={2}
              >
                {title}
              </Text>
            )}
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  disabled && styles.disabledText,
                  subtitleStyle,
                ]}
                numberOfLines={3}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )}
        {children}
      </View>
      
      <View style={styles.accessories}>
        {badge !== undefined && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>
              {typeof badge === 'number' && badge > 99 ? '99+' : badge}
            </Text>
          </View>
        )}
        {showChevron && (
          <Text style={styles.chevron}>›</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled,
          selected,
        }}
        testID={testID}
        activeOpacity={0.7}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      accessibilityRole="none"
      testID={testID}
    >
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.card,
    padding: Spacing.padding.card,
    marginVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.medium,
  },
  selected: {
    borderWidth: 2,
    borderColor: Colors.primary.blue,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.headline,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.label.primary,
    marginBottom: Spacing.xxs,
  },
  subtitle: {
    fontSize: Typography.fontSize.subheadline,
    color: Colors.label.secondary,
    lineHeight: Typography.lineHeight.subheadline,
  },
  disabledText: {
    color: Colors.label.tertiary,
  },
  accessories: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  badge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.xs,
  },
  badgeText: {
    color: Colors.background.primary,
    fontSize: Typography.fontSize.caption2,
    fontWeight: Typography.fontWeight.bold,
  },
  chevron: {
    fontSize: 24,
    color: Colors.label.tertiary,
    fontWeight: Typography.fontWeight.semibold,
  },
});

export default AccessibleCard;