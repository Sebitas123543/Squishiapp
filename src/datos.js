import { StyleSheet } from 'react-native';

export const DATA_INICIAL = [
  { id: 'SQ-01', nombre: 'Patita de Gato Mochi', cat: 'Mochis', marca: 'KawaiiSoft', base: 12000, desc: 'Squishy suave de silicona.', vars: [{ id: 'V1A', et: 'Rosa', p: 12000, st: 8 }, { id: 'V1B', et: 'Blanco', p: 13000, st: 5 }, { id: 'V1C', et: 'Negro', p: 14000, st: 0 }] },
  { id: 'SQ-02', nombre: 'Mochi Foca Gordita', cat: 'Mochis', marca: 'KawaiiSoft', base: 14000, desc: 'Foca blanca apachurrable.', vars: [{ id: 'V2A', et: 'Única', p: 14000, st: 9 }] },
  { id: 'SQ-03', nombre: 'Pack x3 Mochis Frutas', cat: 'Mochis', marca: 'PopToys', base: 22000, desc: 'Fresa, durazno y sandía.', vars: [{ id: 'V3A', et: 'Mix', p: 22000, st: 7 }] },
  { id: 'SQ-04', nombre: 'Dona Glaseada Gigante', cat: 'Comida', marca: 'SweetFoam', base: 35000, desc: 'Espuma aroma a vainilla.', vars: [{ id: 'V4A', et: 'Fresa', p: 35000, st: 4 }, { id: 'V4B', et: 'Choco', p: 38000, st: 3 }] },
  { id: 'SQ-05', nombre: 'Pan Tajado Kawaii', cat: 'Comida', marca: 'SweetFoam', base: 28000, desc: 'Pan feliz slow rising.', vars: [{ id: 'V5A', et: 'Clásico', p: 28000, st: 6 }] },
  { id: 'SQ-06', nombre: 'Helado Galaxia Jumbo', cat: 'Comida', marca: 'SweetFoam', base: 42000, desc: 'Gigante colores pastel.', vars: [{ id: 'V6A', et: 'XL', p: 42000, st: 0 }] },
  { id: 'SQ-07', nombre: 'Ajolote Rosa Pastel', cat: 'Animales', marca: 'KawaiiSoft', base: 30000, desc: 'Ajolote tierno súper blando.', vars: [{ id: 'V7A', et: 'Mediano', p: 30000, st: 5 }, { id: 'V7B', et: 'XL', p: 36000, st: 2 }] },
  { id: 'SQ-08', nombre: 'Panda Bambú XL', cat: 'Animales', marca: 'PopToys', base: 38000, desc: 'Oso panda antiestrés.', vars: [{ id: 'V8A', et: 'Grande', p: 38000, st: 4 }] },
  { id: 'SQ-09', nombre: 'Corgi Perrito', cat: 'Animales', marca: 'PopToys', base: 26000, desc: 'Perrito corgi esponjoso.', vars: [{ id: 'V9A', et: 'Canela', p: 26000, st: 10 }] },
  { id: 'SQ-10', nombre: 'Llavero Aguacate', cat: 'Llaveros', marca: 'MiniPop', base: 15000, desc: 'Mini squishy con argolla.', vars: [{ id: 'V10A', et: 'Verde', p: 15000, st: 12 }] },
  { id: 'SQ-11', nombre: 'Llavero Capibara', cat: 'Llaveros', marca: 'MiniPop', base: 18000, desc: 'Capibara con naranja.', vars: [{ id: 'V11A', et: 'Naranja', p: 18000, st: 8 }, { id: 'V11B', et: 'Mochila', p: 19000, st: 0 }] },
  { id: 'SQ-12', nombre: 'Llavero Galleta Oreo', cat: 'Llaveros', marca: 'MiniPop', base: 16000, desc: 'Llavero aromático galleta.', vars: [{ id: 'V12A', et: 'Choco', p: 16000, st: 11 }] }
];

export const TARIFAS_ENVIO = {
  Mosquera: { Estandar: 6000, Expres: 10000 },
  Funza: { Estandar: 8000, Expres: 12000 },
  Madrid: { Estandar: 10000, Expres: 14000 }
};

export const cop = (n) => `$${n.toLocaleString('es-CO')}`;
export const stTot = (p) => p.vars.reduce((a, v) => a + v.st, 0);

export const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFF1F2' },
  hd: { backgroundColor: '#831843', paddingHorizontal: 14, paddingTop: 30, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tt: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  hdIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: { backgroundColor: '#9D174D', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  iconBtnOn: { backgroundColor: '#DB2777' },
  bottomBar: { flexDirection: 'row', backgroundColor: '#831843', paddingVertical: 8, borderTopWidth: 2, borderColor: '#DB2777', justifyContent: 'space-around' },
  bTab: { alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  on: { backgroundColor: '#DB2777' },
  tbT: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  bd: { flex: 1, padding: 10 },
  in: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FBCFE8', borderRadius: 10, padding: 8, marginBottom: 6, fontSize: 12 },
  rw: { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' },
  bt: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ch: { backgroundColor: '#FCE7F3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  chT: { fontSize: 11, fontWeight: 'bold', color: '#831843' },
  chTOn: { color: '#FFF' },
  cd: { backgroundColor: '#FFF', padding: 12, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: '#FBCFE8' },
  gridCard: { flex: 1, backgroundColor: '#FFF', padding: 10, borderRadius: 14, margin: 4, borderWidth: 1, borderColor: '#FBCFE8', justifyContent: 'space-between' },
  ct: { fontSize: 10, color: '#9D174D', fontWeight: 'bold', textTransform: 'uppercase' },
  bdT: { fontWeight: 'bold', fontSize: 13, color: '#1F2937' },
  h2: { fontWeight: 'bold', fontSize: 16, marginVertical: 4, color: '#831843' },
  pr: { color: '#DB2777', fontWeight: 'bold', fontSize: 14, marginVertical: 2 },
  btB: { backgroundColor: '#DB2777', padding: 9, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btT: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  em: { textAlign: 'center', color: '#831843', marginTop: 25, fontWeight: 'bold' },
  er: { textAlign: 'center', color: '#E11D48', fontWeight: 'bold', marginVertical: 10 },
  lk: { color: '#DB2777', fontWeight: 'bold', fontSize: 12, marginTop: 4 }
});