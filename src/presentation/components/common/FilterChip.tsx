import React, { useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  AccessibilityRole,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../design-system/tokens';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  icon?: string;
  count?: number;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  testID?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected = false,
  onPress,
  disabled = false,
  icon,
  count,
  color = Colors.primary.blue,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  testID,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  const chipStyle = [
    styles.chip,
    selected && { backgroundColor: color, borderColor: color },
    disabled && styles.disabled,
    style,
  ];

  const labelStyle = [
    styles.label,
    selected && styles.selectedLabel,
    disabled && styles.disabledLabel,
    textStyle,
  ];

  const countLabel = count !== undefined ? ` (${count})` : '';
  const displayLabel = `${icon ? `${icon} ` : ''}${label}${countLabel}`;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleValue }] },
      ]}
    >
      <TouchableOpacity
        style={chipStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel || `${label}${countLabel}`}
        accessibilityHint={accessibilityHint || `タップして${label}フィルターを${selected ? '解除' : '適用'}`}
        accessibilityState={{
          selected,
          disabled,
        }}
        testID={testID}
        activeOpacity={0.8}
      >
        <Text style={labelStyle}>
          {displayLabel}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface FilterChipGroupProps {
  chips: Array<{
    id: string;
    label: string;
    icon?: string;
    count?: number;
  }>;
  selectedIds: string[];
  onChipPress: (id: string) => void;
  multiSelect?: boolean;
  color?: string;
  style?: ViewStyle;
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({
  chips,
  selectedIds,
  onChipPress,
  multiSelect = true,
  color = Colors.primary.blue,
  style,
}) => {
  const handleChipPress = useCallback((id: string) => {
    if (!multiSelect) {
      onChipPress(id);
    } else {
      onChipPress(id);
    }
  }, [multiSelect, onChipPress]);

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chipGroup, style]}
      accessibilityRole="radiogroup"
      accessibilityLabel="フィルターオプション"
    >
      {chips.map((chip) => (
        <FilterChip
          key={chip.id}
          label={chip.label}
          icon={chip.icon}
          count={chip.count}
          selected={selectedIds.includes(chip.id)}
          onPress={() => handleChipPress(chip.id)}
          color={color}
          style={styles.chipInGroup}
        />
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.gray.gray4,
    backgroundColor: Colors.background.primary,
    minHeight: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: Typography.fontSize.callout,
    color: Colors.label.primary,
    fontWeight: Typography.fontWeight.regular,
  },
  selectedLabel: {
    color: Colors.background.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  disabledLabel: {
    color: Colors.label.tertiary,
  },
  chipGroup: {
    paddingHorizontal: Spacing.padding.screen,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
  },
  chipInGroup: {
    marginRight: Spacing.xs,
  },
});

export default FilterChip;