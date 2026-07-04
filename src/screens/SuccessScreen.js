import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessScreen({ route, navigation }) {
  const referenceNumber = route.params?.referenceNumber || 'N/A';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.successCard}>
          <View style={styles.iconBubble}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          </View>

          <Text style={styles.title}>Payment Successful</Text>
          <Text style={styles.subtitle}>Your EMI payment has been successfully captured and updated.</Text>

          <View style={styles.refContainer}>
            <Text style={styles.refLabel}>Reference Number</Text>
            <Text style={styles.refValue}>{referenceNumber}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.popToTop()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={theme.colors.white} style={styles.btnIcon} />
          <Text style={styles.backBtnText}>Go Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  successCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    width: '100%',
    shadowColor: theme.colors.cardShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: theme.spacing.xl,
  },
  iconBubble: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    padding: theme.spacing.sm,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  refContainer: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  refLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  refValue: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: theme.borderRadius.sm,
    width: '100%',
  },
  btnIcon: {
    marginRight: theme.spacing.xs,
  },
  backBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
