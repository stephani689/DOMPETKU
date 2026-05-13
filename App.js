import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, 
  SafeAreaView, StatusBar, LayoutAnimation, Platform, UIManager, Alert
} from 'react-native';

// Aktifkan animasi untuk Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [transaksi, setTransaksi] = useState([]);
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');

  // --- LOGIKA SALDO ---
  const totalMasuk = transaksi.filter(t => t.tipe === 'masuk').reduce((s, t) => s + t.nominal, 0);
  const totalKeluar = transaksi.filter(t => t.tipe === 'keluar').reduce((s, t) => s + t.nominal, 0);
  const saldo = totalMasuk - totalKeluar;

  // --- FITUR UNIK: DYNAMIC MOOD ---
  const getMood = () => {
    if (saldo < 0) return { emoji: "😭", txt: "DOMPET KRITIS!", col: "#e74c3c" };
    if (saldo === 0) return { emoji: "😐", txt: "BOKEK NIH...", col: "#bdc3c7" };
    if (saldo > 0 && saldo < 100000) return { emoji: "😊", txt: "MASIH AMAN", col: "#f1c40f" };
    return { emoji: "🤑", txt: "SULTAN MAH BEBAS!", col: "#2ecc71" };
  };

  const mood = getMood();

  // --- FUNGSI TAMBAH ---
  const tambahData = (tipe) => {
    if (!deskripsi || !nominal) {
      Alert.alert("Eits!", "Isi dulu dong, jangan kosongan kayak hati~");
      return;
    }

    const itemBaru = {
      id: Date.now().toString(),
      ket: deskripsi,
      nominal: parseInt(nominal),
      tipe: tipe,
      icon: tipe === 'masuk' ? '💰' : '💸'
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setTransaksi([itemBaru, ...transaksi]);
    setDeskripsi('');
    setNominal('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Unik */}
      <View style={[styles.header, { backgroundColor: mood.col }]}>
        <Text style={styles.emoji}>{mood.emoji}</Text>
        <Text style={styles.statusTxt}>{mood.txt}</Text>
        <Text style={styles.saldoTxt}>Rp {saldo.toLocaleString('id-ID')}</Text>
      </View>

      {/* Form Input */}
      <View style={styles.formCard}>
        <TextInput 
          style={styles.input} 
          placeholder="Buat beli apa? (ex: Seblak)" 
          value={deskripsi}
          onChangeText={setDeskripsi}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Harganya berapa? (ex: 15000)" 
          keyboardType="numeric"
          value={nominal}
          onChangeText={setNominal}
        />
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.btnMasuk]} onPress={() => tambahData('masuk')}>
            <Text style={styles.btnTxt}>Dapet Duit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.btnKeluar]} onPress={() => tambahData('keluar')}>
            <Text style={styles.btnTxt}>Jajan/Bayar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List History */}
      <FlatList
        data={transaksi}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ListHeaderComponent={<Text style={styles.listTitle}>Catatan Duit Kita 📝</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{fontSize: 24}}>{item.icon}</Text>
            <View style={{flex: 1, marginLeft: 15}}>
              <Text style={styles.itemKet}>{item.ket}</Text>
              <Text style={{fontSize: 12, color: '#95a5a6'}}>{item.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</Text>
            </View>
            <Text style={[styles.itemNominal, { color: item.tipe === 'masuk' ? '#2ecc71' : '#e74c3c' }]}>
              {item.tipe === 'masuk' ? '+' : '-'} {item.nominal.toLocaleString('id-ID')}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Dompet masih kosong, belum ada transaksi. 😶</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc' },
  header: { padding: 40, alignItems: 'center', borderBottomLeftRadius: 50, borderBottomRightRadius: 50, elevation: 10 },
  emoji: { fontSize: 60, marginBottom: 5 },
  statusTxt: { color: '#fff', fontWeight: 'bold', fontSize: 14, opacity: 0.9 },
  saldoTxt: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  formCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 20, marginTop: -30, elevation: 5 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { flex: 0.48, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnMasuk: { backgroundColor: '#2ecc71' },
  btnKeluar: { backgroundColor: '#e74c3c' },
  btnTxt: { color: '#fff', fontWeight: 'bold' },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15, color: '#34495e' },
  item: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center', elevation: 2 },
  itemKet: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  itemNominal: { fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#bdc3c7', fontStyle: 'italic' }
});