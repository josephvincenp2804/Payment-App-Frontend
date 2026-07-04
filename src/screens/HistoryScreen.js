import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import api from '../services/api';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen({ route, navigation }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // Load params when screen gets navigated to with an account number
  useEffect(() => {
    if (route.params && route.params.accountNumber) {
      setAccountNumber(route.params.accountNumber);
      fetchHistory(route.params.accountNumber);
    }
  }, [route.params]);

  const fetchHistory = async (acctNum) => {
    const targetAcct = acctNum || accountNumber;
    if (!targetAcct || targetAcct.trim() === '') {
      setError('Account number is required');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const response = await api.get(`/payments/${targetAcct.trim()}`);
      setPayments(response.data);
    } catch (err) {
      console.error(err);
      setPayments([]);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch payment history. Please check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  const renderPaymentItem = ({ item, index }) => (
    <View style={styles.paymentCard}>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineDot} />
        {index < payments.length - 1 && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.paymentContent}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentAmount}>{formatCurrency(item.payment_amount)}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.paymentDate}>{formatDate(item.payment_date)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <Text style={styles.label}>Account Number</Text>
          <View style={styles.searchRow}>
            <View style={styles.inputContainer}>
              <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Account Number..."
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                value={accountNumber}
                onChangeText={(text) => {
                  setAccountNumber(text);
                  setError('');
                }}
              />
            </View>
            <TouchableOpacity 
              style={[styles.fetchBtn, loading && styles.disabledBtn]} 
              onPress={() => fetchHistory()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} size="small" />
              ) : (
                <Text style={styles.fetchBtnText}>Fetch</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View style={styles.messageContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {!error && !loading && !searched ? (
          <View style={styles.messageContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.messageText}>Enter an account number above to load history.</Text>
          </View>
        ) : null}

        {!error && !loading && searched && payments.length === 0 ? (
          <View style={styles.messageContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.messageText}>No payment records found for this account.</Text>
          </View>
        ) : null}

        {!error && payments.length > 0 ? (
          <View style={styles.historyContainer}>
            <Text style={styles.historyHeader}>Transaction History ({payments.length})</Text>
            <FlatList
              data={payments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPaymentItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : null}
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  searchSection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 48,
    paddingHorizontal: theme.spacing.md,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
  },
  fetchBtn: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  fetchBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  messageText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 15,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  historyContainer: {
    flex: 1,
  },
  historyHeader: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  paymentCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 24,
    marginRight: theme.spacing.xs,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary,
    marginTop: 18,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginTop: 4,
  },
  paymentContent: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  paymentAmount: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: theme.colors.secondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  paymentDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
});
