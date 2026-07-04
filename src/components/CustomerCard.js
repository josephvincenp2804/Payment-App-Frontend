import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function CustomerCard({ customer, onPayPress, onHistoryPress }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.acctBadge}>
          <Ionicons name="wallet-outline" size={15} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.acctLabel}>A/C: {customer.account_number}</Text>
        </View>
        <Text style={styles.emiText}>{formatCurrency(customer.emi_due)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Issue Date</Text>
          <Text style={styles.value}>{formatDate(customer.issue_date)}</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Interest Rate</Text>
          <Text style={styles.value}>{customer.interest_rate}% p.a.</Text>
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Tenure</Text>
          <Text style={styles.value}>{customer.tenure} Months</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.btn, styles.btnSecondary]} 
          onPress={() => onHistoryPress(customer.account_number)}
          activeOpacity={0.7}
        >
          <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} style={styles.btnIcon} />
          <Text style={styles.btnSecondaryText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btn, styles.btnPrimary]} 
          onPress={() => onPayPress(customer)}
          activeOpacity={0.7}
        >
          <Ionicons name="card-outline" size={16} color={theme.colors.white} style={styles.btnIcon} />
          <Text style={styles.btnPrimaryText}>Pay EMI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  acctBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  icon: {
    marginRight: theme.spacing.xs,
  },
  acctLabel: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: '700',
  },
  emiText: {
    color: theme.colors.success,
    fontSize: theme.typography.h3.fontSize,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  gridItem: {
    flex: 1,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  value: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    borderRadius: theme.borderRadius.sm,
  },
  btnPrimary: {
    backgroundColor: theme.colors.primary,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnIcon: {
    marginRight: theme.spacing.xs,
  },
  btnPrimaryText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  btnSecondaryText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
});
