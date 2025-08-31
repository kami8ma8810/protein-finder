import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../design-system/tokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  showCancelButton?: boolean;
  editable?: boolean;
  testID?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = '検索',
  onSubmit,
  onClear,
  onFocus,
  onBlur,
  autoFocus = false,
  showCancelButton = true,
  editable = true,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const cancelButtonWidth = useRef(new Animated.Value(0)).current;

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus?.();

    if (showCancelButton) {
      Animated.timing(cancelButtonWidth, {
        toValue: 70,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [onFocus, showCancelButton, cancelButtonWidth]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();

    if (showCancelButton && !value) {
      Animated.timing(cancelButtonWidth, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [onBlur, showCancelButton, value, cancelButtonWidth]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onClear?.();
    inputRef.current?.focus();
    AccessibilityInfo.announceForAccessibility('検索フィールドがクリアされました');
  }, [onChangeText, onClear]);

  const handleCancel = useCallback(() => {
    onChangeText('');
    inputRef.current?.blur();
    onClear?.();
  }, [onChangeText, onClear]);

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Ionicons name="search" size={20} color={Colors.label.tertiary} style={styles.searchIcon} />

        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.label.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoFocus={autoFocus}
          editable={editable}
          clearButtonMode="never"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityRole="search"
          accessibilityLabel="検索"
          testID={testID || 'search-input'}
          nativeID="search-input"
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={18} color={Colors.label.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {showCancelButton && (
        <Animated.View style={[styles.cancelContainer, { width: cancelButtonWidth }]}>
          <TouchableOpacity
            onPress={handleCancel}
            style={styles.cancelButton}
            accessibilityRole="button"
          >
            <Text style={styles.cancelText}>キャンセル</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.padding.screen,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.background.secondary,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray.gray6,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.sm,
    height: 36,
  },
  searchContainerFocused: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.primary.blue,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.body,
    color: Colors.label.primary,
    paddingVertical: 0,
    ...Platform.select({
      ios: {
        paddingVertical: 8,
      },
      android: {
        paddingVertical: 4,
      },
    }),
  },
  clearButton: {
    padding: Spacing.xxs,
  },
  clearIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.label.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIconText: {
    color: Colors.background.primary,
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  cancelContainer: {
    overflow: 'hidden',
  },
  cancelButton: {
    paddingLeft: Spacing.sm,
    justifyContent: 'center',
    height: 36,
  },
  cancelText: {
    fontSize: Typography.fontSize.body,
    color: Colors.primary.blue,
  },
});

export default SearchBar;
