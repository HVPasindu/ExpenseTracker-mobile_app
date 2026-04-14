import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ScrollView, FlatList,
} from 'react-native';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

const CustomDatePicker = ({ visible, onClose, onConfirm, maxDate = new Date() }) => {
  const today = maxDate;
  const [step, setStep] = useState('year'); // 'year' | 'month' | 'day'
  const [selYear, setSelYear] = useState(today.getFullYear());
  const [selMonth, setSelMonth] = useState(today.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [yearDone, setYearDone] = useState(false);
  const [monthDone, setMonthDone] = useState(false);

  const years = [];
  for (let y = today.getFullYear(); y >= 2000; y--) years.push(y);

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y, m) => new Date(y, m, 1).getDay();

  const isFutureMonth = (m) =>
    selYear > today.getFullYear() ||
    (selYear === today.getFullYear() && m > today.getMonth());

  const isFutureDay = (d) => {
    const date = new Date(selYear, selMonth, d);
    return date > today;
  };

  const handleYearSelect = (y) => {
    setSelYear(y);
    setYearDone(true);
    // Fix month if future
    if (y === today.getFullYear() && selMonth > today.getMonth()) {
      setSelMonth(today.getMonth());
    }
    setStep('month');
  };

  const handleMonthSelect = (m) => {
    if (isFutureMonth(m)) return;
    setSelMonth(m);
    setMonthDone(true);
    setSelDay(null);
    setStep('day');
  };

  const handleConfirm = () => {
    if (!selDay) return;
    const date = new Date(selYear, selMonth, selDay);
    onConfirm(date);
    onClose();
  };

  const renderDayGrid = () => {
    const days = [];
    const firstDay = getFirstDay(selYear, selMonth);
    const totalDays = getDaysInMonth(selYear, selMonth);

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`e-${i}`} style={styles.dayCell} />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const future = isFutureDay(d);
      const selected = d === selDay;
      days.push(
        <TouchableOpacity
          key={d}
          style={[styles.dayCell, selected && styles.selDay, future && styles.futureDay]}
          onPress={() => !future && setSelDay(d)}
          disabled={future}
          activeOpacity={0.7}>
          <Text style={[styles.dayCellText, selected && styles.selDayText,
            future && styles.futureDayText]}>
            {d}
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  const Tab = ({ label, active, done, onPress }) => (
    <TouchableOpacity
      style={[styles.tab, active && styles.activeTab, done && !active && styles.doneTab]}
      onPress={onPress}>
      <Text style={[styles.tabText, active && styles.activeTabText, done && !active && styles.doneTabText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>
          {step === 'year' ? 'Select Year' : step === 'month' ? 'Select Month' : 'Select Day'}
        </Text>

        {/* Step tabs */}
        <View style={styles.tabRow}>
          <Tab
            label={yearDone ? String(selYear) : 'Year'}
            active={step === 'year'}
            done={yearDone}
            onPress={() => setStep('year')}
          />
          <Tab
            label={monthDone ? MONTHS[selMonth] : 'Month'}
            active={step === 'month'}
            done={monthDone}
            onPress={() => yearDone && setStep('month')}
          />
          <Tab
            label={selDay ? String(selDay) : 'Day'}
            active={step === 'day'}
            done={!!selDay}
            onPress={() => monthDone && setStep('day')}
          />
        </View>

        {/* Year panel */}
        {step === 'year' && (
          <ScrollView style={styles.panel} showsVerticalScrollIndicator={false}>
            <View style={styles.yearGrid}>
              {years.map(y => (
                <TouchableOpacity
                  key={y}
                  style={[styles.yearCell, y === selYear && yearDone && styles.selCell]}
                  onPress={() => handleYearSelect(y)}>
                  <Text style={[styles.cellText, y === selYear && yearDone && styles.selCellText]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Month panel */}
        {step === 'month' && (
          <View style={styles.panel}>
            <View style={styles.monthGrid}>
              {MONTHS.map((m, i) => {
                const disabled = isFutureMonth(i);
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.monthCell,
                      i === selMonth && monthDone && styles.selCell,
                      disabled && styles.disabledCell]}
                    onPress={() => handleMonthSelect(i)}
                    disabled={disabled}>
                    <Text style={[styles.cellText,
                      i === selMonth && monthDone && styles.selCellText,
                      disabled && styles.disabledCellText]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Day panel */}
        {step === 'day' && (
          <View style={styles.panel}>
            {/* Month nav */}
            <View style={styles.monthNav}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => {
                  let nm = selMonth - 1, ny = selYear;
                  if (nm < 0) { nm = 11; ny--; }
                  setSelMonth(nm); setSelYear(ny); setSelDay(null);
                }}>
                <Text style={styles.navBtnText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep('month')}>
                <Text style={styles.monthNavLabel}>
                  {MONTHS_FULL[selMonth]} {selYear}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => {
                  let nm = selMonth + 1, ny = selYear;
                  if (nm > 11) { nm = 0; ny++; }
                  if (ny > today.getFullYear() ||
                    (ny === today.getFullYear() && nm > today.getMonth())) return;
                  setSelMonth(nm); setSelYear(ny); setSelDay(null);
                }}>
                <Text style={styles.navBtnText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Day headers */}
            <View style={styles.dayHeaders}>
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <Text key={d} style={styles.dayHeader}>{d}</Text>
              ))}
            </View>

            {/* Day grid */}
            <View style={styles.dayGrid}>
              {renderDayGrid()}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.confirmBtn, !selDay && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={!selDay}>
          <Text style={styles.confirmBtnText}>Confirm</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40, height: 4, backgroundColor: '#d9dce3',
    borderRadius: 4, alignSelf: 'center', marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16, fontWeight: '600', color: '#0b132b',
    textAlign: 'center', marginBottom: 14,
  },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tab: {
    flex: 1, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#d9dce3',
    alignItems: 'center', backgroundColor: '#f7fbff',
  },
  activeTab: { borderColor: '#00a6fb', backgroundColor: '#e8f6ff' },
  doneTab: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  tabText: { fontSize: 13, color: '#6b7280' },
  activeTabText: { color: '#00a6fb', fontWeight: '600' },
  doneTabText: { color: '#15803d', fontWeight: '600' },
  panel: { minHeight: 200, marginBottom: 4 },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  yearCell: {
    width: '22%', paddingVertical: 9, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#d9dce3', alignItems: 'center',
  },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthCell: {
    width: '30%', paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#d9dce3', alignItems: 'center',
  },
  selCell: { backgroundColor: '#00a6fb', borderColor: '#00a6fb' },
  disabledCell: { opacity: 0.3 },
  cellText: { fontSize: 13, color: '#0b132b' },
  selCellText: { color: '#fff', fontWeight: '600' },
  disabledCellText: { color: '#6b7280' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  navBtn: { backgroundColor: '#f0f4f8', borderRadius: 8, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  navBtnText: { fontSize: 20, color: '#0b132b' },
  monthNavLabel: { fontSize: 14, fontWeight: '600', color: '#0b132b', paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1.5, borderColor: '#d9dce3', borderRadius: 8 },
  dayHeaders: { flexDirection: 'row', marginBottom: 4 },
  dayHeader: { flex: 1, textAlign: 'center', fontSize: 11, color: '#6b7280' },
  dayGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  dayCellText: { fontSize: 13, color: '#0b132b' },
  selDay: { backgroundColor: '#00a6fb' },
  selDayText: { color: '#fff', fontWeight: '600' },
  futureDay: { opacity: 0.25 },
  futureDayText: { color: '#6b7280' },
  confirmBtn: { backgroundColor: '#00a6fb', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 14 },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  cancelText: { textAlign: 'center', marginTop: 10, fontSize: 13, color: '#6b7280' },
});

export default CustomDatePicker;