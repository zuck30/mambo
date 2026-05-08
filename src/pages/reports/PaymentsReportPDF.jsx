import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '../../lib/utils';

const THEME = {
  textPrimary: '#000000',
  textSecondary: '#404040',
  headerBg: '#1A1A1A',
  rowOdd: '#F8F8F8',
  border: '#E0E0E0',
  borderDark: '#000000',
};

const styles = StyleSheet.create({
  page: {
    padding: '30 40',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: THEME.borderDark,
    paddingBottom: 10,
    marginBottom: 15,
  },
  brandName: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 7,
    color: THEME.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  reportMeta: {
    alignItems: 'flex-end',
  },
  reportTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  
  table: {
    display: 'table',
    width: 'auto',
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: THEME.headerBg,
    alignItems: 'center',
    height: 22,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    alignItems: 'center',
    minHeight: 28,
  },
  rowOdd: {
    backgroundColor: THEME.rowOdd,
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    height: 24,
    borderTopWidth: 1,
    borderTopColor: THEME.borderDark,
  },

  /* Column widths adjusted to prevent collision */
  colReceipt: { width: '18%', paddingLeft: 8, paddingRight: 4 }, 
  colClient: { width: '32%', paddingHorizontal: 8 }, 
  colPlate: { width: '12%', textAlign: 'center' }, 
  colMethod: { width: '15%', textAlign: 'center' }, 
  colAmount: { width: '23%', textAlign: 'right', paddingRight: 8 }, 
  
  cellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 8,
    color: THEME.textPrimary,
  },
  cellSubText: {
    fontSize: 6.5,
    color: THEME.textSecondary,
  },

  /* Insights at the Bottom */
  insightSection: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  insightTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.border,
    paddingBottom: 2,
  },
  insightItem: {
    fontSize: 7.5,
    color: THEME.textSecondary,
    marginBottom: 3,
  },

  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: THEME.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 6.5,
    color: THEME.textSecondary,
    textTransform: 'uppercase',
  }
});

const PaymentsReportPDF = ({ payments, dateRange, generatedAt }) => {
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const totalDue = payments.reduce((sum, p) => sum + (Number(p.amount_due) - Number(p.amount_paid)), 0);
  const currentYear = new Date().getFullYear();

  // Financial Insights Logic
  const insights = [];
  const methodStats = payments.reduce((acc, p) => {
    acc[p.payment_method] = (acc[p.payment_method] || 0) + 1;
    return acc;
  }, {});

  const topMethod = Object.entries(methodStats).sort((a, b) => b[1] - a[1])[0];
  if (topMethod) {
    insights.push(`Dominant Payment Method: ${topMethod[0].replace('_', ' ').toUpperCase()} (${Math.round(topMethod[1]/payments.length*100)}% of volume).`);
  }
  if (totalDue > 0) {
    insights.push(`Collection Alert: Total outstanding balance is ${formatCurrency(totalDue)}. Prioritize reconciliation.`);
  }
  insights.push(`Efficiency: Processed ${payments.length} transactions with an average value of ${formatCurrency(totalAmount / payments.length)}.`);

  return (
    <Document title="Audit Report">
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>GariDesk</Text>
            <Text style={styles.brandTagline}>Financial Report</Text>
          </View>
          <View style={styles.reportMeta}>
            <Text style={styles.reportTitle}>Financial Payment Ledger</Text>
            <Text style={{ fontSize: 7, color: THEME.textSecondary }}>{dateRange}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.cellHeader, styles.colReceipt]}>Ref / Job</Text>
            <Text style={[styles.cellHeader, styles.colClient]}>Customer Entity</Text>
            <Text style={[styles.cellHeader, styles.colPlate]}>Vehicle</Text>
            <Text style={[styles.cellHeader, styles.colMethod]}>Method</Text>
            <Text style={[styles.cellHeader, styles.colAmount]}>Amount Paid</Text>
          </View>

          {payments.map((payment, i) => (
            <View key={i} style={[styles.tableRow, i % 2 !== 0 && styles.rowOdd]} wrap={false}>
              <View style={styles.colReceipt}>
                <Text style={[styles.cellText, { fontWeight: 'bold' }]}>{payment.receipt_number}</Text>
                <Text style={styles.cellSubText}>{payment.jobs?.job_number || 'N/A'}</Text>
              </View>

              <View style={styles.colClient}>
                <Text style={[styles.cellText, { fontWeight: 'bold' }]}>{payment.customers?.full_name}</Text>
                <Text style={styles.cellSubText}>{payment.customers?.phone}</Text>
              </View>

              <Text style={[styles.cellText, styles.colPlate]}>{payment.jobs?.cars?.plate_number || 'N/A'}</Text>

              <Text style={[styles.cellText, styles.colMethod, { textTransform: 'capitalize' }]}>
                {payment.payment_method?.replace('_', ' ')}
              </Text>

              <View style={styles.colAmount}>
                <Text style={[styles.cellText, { fontWeight: 'bold' }]}>{formatCurrency(payment.amount_paid)}</Text>
                {payment.amount_due > payment.amount_paid && (
                  <Text style={[styles.cellSubText, { color: '#666' }]}>
                    Bal: {formatCurrency(payment.amount_due - payment.amount_paid)}
                  </Text>
                )}
              </View>
            </View>
          ))}

          <View style={styles.tableFooter} wrap={false}>
            <View style={{ width: '77%', paddingLeft: 8, flexDirection: 'row', gap: 15 }}>
              <Text style={{ fontSize: 7, fontWeight: 'bold' }}>Count: {payments.length}</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold' }}>Arrears: {formatCurrency(totalDue)}</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={[styles.cellText, { fontWeight: 'bold' }]}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* INSIGHTS PLACED AT THE BOTTOM */}
        <View style={styles.insightSection} wrap={false}>
          <Text style={styles.insightTitle}>Financial Intelligence & Observations</Text>
          {insights.map((text, idx) => (
            <Text key={idx} style={styles.insightItem}>• {text}</Text>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated: {formatDate(generatedAt, 'dd/MM/yyyy HH:mm')} | GariDesk
          </Text>
          <Text 
            style={styles.footerText} 
            render={({ pageNumber, totalPages }) => `Folio ${pageNumber} / ${totalPages}`} 
          />
        </View>

      </Page>
    </Document>
  );
};

export default PaymentsReportPDF;