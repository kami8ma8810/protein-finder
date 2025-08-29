import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../design-system/tokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      return (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😅</Text>
            <Text style={styles.title}>おっと、エラーが発生しました</Text>
            <Text style={styles.message}>
              申し訳ございません。予期しないエラーが発生しました。
            </Text>
            
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              accessibilityRole="button"
              accessibilityLabel="再試行"
            >
              <Text style={styles.buttonText}>再試行</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorTitle}>エラー詳細（開発用）</Text>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.title2,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.label.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: Typography.fontSize.body,
    color: Colors.label.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.body,
  },
  button: {
    backgroundColor: Colors.primary.blue,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.padding.button,
    borderRadius: BorderRadius.button,
    minWidth: 120,
  },
  buttonText: {
    color: Colors.background.primary,
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  errorDetails: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.medium,
    width: '100%',
  },
  errorTitle: {
    fontSize: Typography.fontSize.footnote,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.system.red,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: Typography.fontSize.caption1,
    color: Colors.label.primary,
    marginBottom: Spacing.xs,
    fontFamily: 'monospace',
  },
  stackTrace: {
    fontSize: Typography.fontSize.caption2,
    color: Colors.label.tertiary,
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;