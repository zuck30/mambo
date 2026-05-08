import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatCurrency, formatDate } from '../../lib/utils';

const styles = StyleSheet.create({
  page: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    fontFamily: 'Courier',
    fontSize: 10,
  },
  text: {
    fontFamily: 'Courier',
    fontSize: 10,
  },
  title: {
    fontFamily: 'Courier',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Courier',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginVertical: 6,
    borderStyle: 'dashed',
  },
  dividerSolid: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 9,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingLeft: 4,
  },
  serviceName: {
    fontSize: 9,
    flex: 2,
  },
  serviceAmount: {
    fontSize: 9,
    textAlign: 'right',
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  thankYou: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 6,
    fontSize: 9,
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    fontSize: 8,
    marginTop: 6,
  },
  space: {
    marginBottom: 4,
  },
  smallText: {
    fontSize: 7,
    textAlign: 'center',
  },
  header: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 6,
    borderStyle: 'dashed',
  },
  infoSection: {
    marginBottom: 8,
  },
  paymentMethod: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderStyle: 'dashed',
  },
});

const PDFReceiptDocument = ({ payment, job }) => {
  const receiptDate = new Date();
  
  return (
    <Document>
      {/* Use fixed height (800 points is enough) - width 280 points = ~80mm */}
      <Page size={[280, 800]} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GariDesk</Text>
          <Text style={styles.subtitle}>Premium Auto Service</Text>
          <Text style={styles.subtitle}>Tanzania, Dar es salaam</Text>
          <Text style={styles.subtitle}>Tel: +255 774 174 921</Text>
          <Text style={[styles.subtitle, { marginTop: 4 }]}>OFFICIAL RECEIPT</Text>
        </View>

        {/* Receipt Number */}
        <View style={styles.row}>
          <Text style={styles.label}>Receipt No:</Text>
          <Text style={styles.value}>{payment?.receipt_number || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(receiptDate, 'dd/MM/yyyy HH:mm')}</Text>
        </View>
        
        <View style={styles.divider} />

        {/* Customer Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.label, { marginBottom: 4 }]}>CUSTOMER:</Text>
          <Text style={styles.value}>{job?.customers?.full_name || 'N/A'}</Text>
          <Text style={styles.value}>{job?.customers?.phone || 'N/A'}</Text>
        </View>

        {/* Vehicle Info */}
        <View style={styles.infoSection}>
          <Text style={[styles.label, { marginBottom: 4 }]}>VEHICLE:</Text>
          <Text style={styles.value}>{job?.cars?.plate_number || 'N/A'}</Text>
          <Text style={styles.value}>
            {job?.cars?.make} {job?.cars?.model} {job?.cars?.year}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Services */}
        <Text style={[styles.label, { marginBottom: 4 }]}>SERVICES RENDERED:</Text>
        
        {job?.job_services?.map((service, index) => (
          <View key={index} style={styles.serviceRow}>
            <Text style={styles.serviceName}>{service.services?.name || 'Service'}</Text>
            <Text style={styles.serviceAmount}>{formatCurrency(service.subtotal)}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        {/* Totals */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL PAID:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(payment?.amount_paid)}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentMethod}>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{payment?.payment_method?.replace('_', ' ').toUpperCase() || 'N/A'}</Text>
          </View>
          {payment?.transaction_id && (
            <View style={styles.row}>
              <Text style={styles.label}>Transaction ID:</Text>
              <Text style={styles.value}>{payment?.transaction_id}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Thank You Message */}
        <Text style={styles.thankYou}>Karibu Sana GariDesk</Text>
        
        {/* Footer */}
        
        <View style={styles.space} />
        
        {/* Thermal printer cut mark */}
        <Text style={styles.smallText}>- - - - - - - - - - - - - - - - - - - -</Text>
        <Text style={styles.smallText}>Cut here</Text>
        <Text style={styles.smallText}>- - - - - - - - - - - - - - - - - - - -</Text>
      </Page>
    </Document>
  );
};

export default PDFReceiptDocument;