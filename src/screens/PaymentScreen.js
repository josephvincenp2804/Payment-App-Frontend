import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen({ route, navigation }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill details if passed from parameters
  useEffect(() => {
    if (route.params) {
      if (route.params.accountNumber) {
        setAccountNumber(route.params.accountNumber);
      }
      if (route.params.emiDue) {
        setAmount(route.params.emiDue.toString());
      }
    }
  }, [route.params]);

  const handlePayment = async () => {
    setErrorMessage('');

    // Local inputs verification
    if (!accountNumber || accountNumber.trim() === '') {
      setErrorMessage('Account number is required');
      return;
    }

    if (!amount || amount.trim() === '') {
      setErrorMessage('Payment amount is required');
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
      setErrorMessage('Payment amount must be a valid number');
      return;
    }

    if (numericAmount <= 0) {
      setErrorMessage('Payment amount must be greater than zero');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/payments', {
        account_number: accountNumber.trim(),
        payment_amount: numericAmount
      });

      if (response.data && response.data.success) {
        setAccountNumber('');
        setAmount('');
        // Redirect to Success Screen
        navigation.navigate('Success', {
          referenceNumber: response.data.reference_number || 'N/A'
        });
      } else {
        setErrorMessage(response.data.message || 'Payment request failed');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to connect to the backend server. Verify your API settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.iconHeader}>
              <View style={styles.iconBubble}>
                <Ionicons name="card" size={48} color={theme.colors.primary} />
              </View>
              <Text style={styles.title}>Make EMI Payment</Text>
              <Text style={styles.subtitle}>Process an instant payment against customer accounts</Text>
            </View>

            {errorMessage ? (
              <View style={styles.errorAlert}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.error} style={styles.alertIcon} />
                <Text style={styles.errorAlertText}>{errorMessage}</Text>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Account Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Account Number (e.g. 100001)"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  value={accountNumber}
                  onChangeText={(text) => {
                    setAccountNumber(text);
                    setErrorMessage('');
                  }}
                  editable={!loading}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Payment Amount ($)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="cash-outline" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Amount (e.g. 5000)"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(text) => {
                    setAmount(text);
                    setErrorMessage('');
                  }}
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, loading && styles.disabledBtn]} 
              onPress={handlePayment}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={theme.colors.white} style={styles.submitIcon} />
                  <Text style={styles.submitBtnText}>Confirm and Pay</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: theme.spacing.lg,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconBubble: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    padding: theme.spacing.md,
    borderRadius: 50,
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    marginTop: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: theme.spacing.md,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg,
  },
  alertIcon: {
    marginRight: theme.spacing.sm,
  },
  errorAlertText: {
    color: '#FCA5A5',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 52,
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
  submitBtn: {
    backgroundColor: theme.colors.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 52,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitIcon: {
    marginRight: theme.spacing.xs,
  },
  submitBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  cancelBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});
