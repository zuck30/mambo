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
  brandName: { fontSize: 18, fontWeight: 'bold', letterSpacing: -0.5 },
  brandTagline: { fontSize: 7, color: THEME.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  reportMeta: { alignItems: 'flex-end' },
  reportTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 15, marginBottom: 6, color: '#000000' },
  table: { display: 'table', width: 'auto', borderWidth: 1, borderColor: THEME.border },
  tableHeader: { flexDirection: 'row', backgroundColor: THEME.headerBg, alignItems: 'center', height: 22 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: THEME.border, alignItems: 'center', minHeight: 26 },
  rowOdd: { backgroundColor: THEME.rowOdd },
  cellHeader: { fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', textTransform: 'uppercase' },
  cellText: { fontSize: 8, color: THEME.textPrimary },
  cellSubText: { fontSize: 6.5, color: THEME.textSecondary },
  insightSection: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: THEME.border, backgroundColor: '#FAFAFA' },
  insightTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6, borderBottomWidth: 0.5, borderBottomColor: THEME.border, paddingBottom: 2 },
  insightItem: { fontSize: 7.5, color: THEME.textSecondary, marginBottom: 3 },
  footer: { position: 'absolute', bottom: 25, left: 40, right: 40, paddingTop: 8, borderTopWidth: 0.5, borderTopColor: THEME.border, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 6.5, color: THEME.textSecondary, textTransform: 'uppercase' }
});

const AnalyticsReportPDF = ({ 
  serviceStats = [], 
  customerStats = [],
  inventoryStats = { items: [] },
  metrics = {},
  jobStats = [],
  dateRangeText = "N/A"
}) => {
  const currentYear = new Date().getFullYear();

  // Safeguard metrics
  const totalRev = metrics?.totalRevenue || 0;
  const totalExp = metrics?.totalExpenses || 0;
  const totalJobs = metrics?.totalJobs || 0;

  // Insight Logic with safety checks
  const insights = [];
  if (metrics?.lowStockCount > 0) insights.push(`Inventory: ${metrics.lowStockCount} items below threshold.`);
  if (metrics?.avgOrderValue > 0) insights.push(`Revenue: Avg ticket size is ${formatCurrency(metrics.avgOrderValue)}.`);
  
  const completedJobs = jobStats?.filter(j => j.status === 'done') || [];
  if (completedJobs.length > 0) {
    const totalTime = completedJobs.reduce((sum, j) => {
      const start = j.created_at ? new Date(j.created_at) : null;
      const end = j.completed_at ? new Date(j.completed_at) : null;
      return (start && end) ? sum + (end - start) : sum;
    }, 0);
    const avgCycle = totalTime / completedJobs.length / 60000;
    if (avgCycle > 0) insights.push(`Efficiency: Avg operational cycle is ${Math.round(avgCycle)} mins.`);
  }

  // Helper to safely aggregate services
  const aggregatedServices = (serviceStats || []).reduce((acc, curr) => {
    const name = curr.services?.name || 'Standard Service';
    if (!acc[name]) acc[name] = { count: 0, revenue: 0 };
    acc[name].count += 1;
    acc[name].revenue += Number(curr.subtotal || 0);
    return acc;
  }, {});

  const sortedServices = Object.entries(aggregatedServices)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 8);

  return (
    <Document title="Operational Analytics">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>GariDesk</Text>
          </View>
          <View style={styles.reportMeta}>
            <Text style={styles.reportTitle}>Analytics Report as of</Text>
            <Text style={{ fontSize: 7, color: THEME.textSecondary }}>{dateRangeText}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>1. Key Performance Metrics</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: '25%', paddingLeft: 8 }]}>Revenue</Text>
            <Text style={[styles.cellHeader, { width: '25%', textAlign: 'center' }]}>Expenses</Text>
            <Text style={[styles.cellHeader, { width: '25%', textAlign: 'center' }]}>Net Profit</Text>
            <Text style={[styles.cellHeader, { width: '25%', textAlign: 'right', paddingRight: 8 }]}>Throughput</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.cellText, { width: '25%', paddingLeft: 8, fontWeight: 'bold' }]}>{formatCurrency(totalRev)}</Text>
            <Text style={[styles.cellText, { width: '25%', textAlign: 'center' }]}>{formatCurrency(totalExp)}</Text>
            <Text style={[styles.cellText, { width: '25%', textAlign: 'center', fontWeight: 'bold' }]}>{formatCurrency(totalRev - totalExp)}</Text>
            <Text style={[styles.cellText, { width: '25%', textAlign: 'right', paddingRight: 8 }]}>{totalJobs} Units</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>2. Service Performance (By Volume)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: '10%', paddingLeft: 8 }]}>Rank</Text>
            <Text style={[styles.cellHeader, { width: '50%', paddingLeft: 8 }]}>Service Offering</Text>
            <Text style={[styles.cellHeader, { width: '15%', textAlign: 'center' }]}>Volume</Text>
            <Text style={[styles.cellHeader, { width: '25%', textAlign: 'right', paddingRight: 8 }]}>Revenue</Text>
          </View>
          {sortedServices.map(([name, data], idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 !== 0 && styles.rowOdd]}>
              <Text style={[styles.cellText, { width: '10%', paddingLeft: 8 }]}>#{idx + 1}</Text>
              <Text style={[styles.cellText, { width: '50%', paddingLeft: 8, fontWeight: 'bold' }]}>{name}</Text>
              <Text style={[styles.cellText, { width: '15%', textAlign: 'center' }]}>{data.count}</Text>
              <Text style={[styles.cellText, { width: '25%', textAlign: 'right', paddingRight: 8, fontWeight: 'bold' }]}>{formatCurrency(data.revenue)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>3. Critical Inventory Levels</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: '45%', paddingLeft: 8 }]}>Resource Item</Text>
            <Text style={[styles.cellHeader, { width: '20%', textAlign: 'center' }]}>On Hand</Text>
            <Text style={[styles.cellHeader, { width: '15%', textAlign: 'center' }]}>Min</Text>
            <Text style={[styles.cellHeader, { width: '20%', textAlign: 'right', paddingRight: 8 }]}>Status</Text>
          </View>
          {(inventoryStats?.items || []).slice(0, 10).map((item, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 !== 0 && styles.rowOdd]}>
              <Text style={[styles.cellText, { width: '45%', paddingLeft: 8, fontWeight: 'bold' }]}>{item.name}</Text>
              <Text style={[styles.cellText, { width: '20%', textAlign: 'center' }]}>{item.current_stock} {item.unit}</Text>
              <Text style={[styles.cellText, { width: '15%', textAlign: 'center' }]}>{item.minimum_stock}</Text>
              <Text style={[styles.cellText, { width: '20%', textAlign: 'right', paddingRight: 8, fontWeight: 'bold', color: Number(item.current_stock) <= Number(item.minimum_stock) ? '#B91C1C' : '#059669' }]}>
                {Number(item.current_stock) <= Number(item.minimum_stock) ? 'LOW' : 'OK'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>GariDesk Intelligence | {currentYear}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>4. Workflow Status Distribution</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: '50%', paddingLeft: 8 }]}>Pipeline Stage</Text>
            <Text style={[styles.cellHeader, { width: '25%', textAlign: 'center' }]}>Volume</Text>
            <Text style={[styles.cellHeader, { width: '25%', textAlign: 'right', paddingRight: 8 }]}>Share (%)</Text>
          </View>
          {['waiting', 'in_progress', 'done', 'cancelled'].map((status, idx) => {
            const count = (jobStats || []).filter(j => j.status === status).length;
            const percentage = jobStats?.length > 0 ? (count / jobStats.length * 100).toFixed(1) : 0;
            return (
              <View key={idx} style={[styles.tableRow, idx % 2 !== 0 && styles.rowOdd]}>
                <Text style={[styles.cellText, { width: '50%', paddingLeft: 8, textTransform: 'capitalize' }]}>{status.replace('_', ' ')}</Text>
                <Text style={[styles.cellText, { width: '25%', textAlign: 'center' }]}>{count}</Text>
                <Text style={[styles.cellText, { width: '25%', textAlign: 'right', paddingRight: 8 }]}>{percentage}%</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>5. High-Value Customer Ledger</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cellHeader, { width: '45%', paddingLeft: 8 }]}>Entity Name</Text>
            <Text style={[styles.cellHeader, { width: '15%', textAlign: 'center' }]}>Visits</Text>
            <Text style={[styles.cellHeader, { width: '20%', textAlign: 'right' }]}>Cumulative</Text>
            <Text style={[styles.cellHeader, { width: '20%', textAlign: 'right', paddingRight: 8 }]}>Last Active</Text>
          </View>
          {(customerStats || []).slice(0, 12).map((customer, idx) => (
            <View key={idx} style={[styles.tableRow, idx % 2 !== 0 && styles.rowOdd]}>
              <View style={{ width: '45%', paddingLeft: 8 }}>
                <Text style={[styles.cellText, { fontWeight: 'bold' }]}>{customer.full_name || 'N/A'}</Text>
                <Text style={styles.cellSubText}>{customer.phone || '-'}</Text>
              </View>
              <Text style={[styles.cellText, { width: '15%', textAlign: 'center' }]}>{customer.total_visits || 0}</Text>
              <Text style={[styles.cellText, { width: '20%', textAlign: 'right', fontWeight: 'bold' }]}>{formatCurrency(customer.total_spent || 0)}</Text>
              <Text style={[styles.cellText, { width: '20%', textAlign: 'right', paddingRight: 8 }]}>{customer.updated_at ? formatDate(customer.updated_at, 'dd/MM/yy') : 'N/A'}</Text>
            </View>
          ))}
        </View>

        {insights.length > 0 && (
          <View style={styles.insightSection}>
            <Text style={styles.insightTitle}>Strategic Observations</Text>
            {insights.map((text, idx) => (
              <Text key={idx} style={styles.insightItem}>• {text}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default AnalyticsReportPDF;