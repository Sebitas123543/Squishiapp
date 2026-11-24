import React, { useState } from 'react';
import { Text, View, Pressable, ScrollView, SafeAreaView } from 'react-native';
import { DATA_INICIAL, s } from './src/datos';
import { VistaCatalogo, VistaComparador } from './src/catalogo';
import VistaDetalle from './src/detalle';
import { VistaCarrito, VistaDirecciones } from './src/compra';
import { VistaPedidos, VistaNotifs, VistaAyuda } from './src/posventa';

export default function App() {
  const [vista, setVista] = useState('cat');
  const [prods, setProds] = useState(DATA_INICIAL);
  const [selP, setSelP] = useState(null);
  const [selV, setSelV] = useState(null);
  const [comp, setComp] = useState([]);
  const [cart, setCart] = useState([]);
  const [dirs, setDirs] = useState([{ id: 'D1', alias: 'Casa', mun: 'Madrid', ref: 'Bloque 18 Casa 24', pri: true }, { id: 'D2', alias: 'SENA', mun: 'Mosquera', ref: 'CBA Km 7', pri: false }]);
  const [dirId, setDirId] = useState('D1');
  const [peds, setPeds] = useState([{ id: 'SQP-1001', items: [{ pId: 'SQ-02', vId: 'V2A', nom: 'Mochi Foca', et: 'Única', p: 14000, c: 1 }], tot: 20000, env: 6000, est: 'Confirmado', log: ['Confirmado - Inicial'] }]);
  const [notifs, setNotifs] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const addNotif = (key, msg) => setNotifs((prev) => prev.some((n) => n.key === key) ? prev : [{ id: Date.now() + Math.random(), key, msg, leida: false }, ...prev]);
  const abrirDet = (p, vForzada = null) => { setSelP(p); setSelV(vForzada || (p.vars.length === 1 ? p.vars[0] : null)); setVista('det'); };

  return (
    <SafeAreaView style={s.c}>
      <View style={s.hd}><Text style={s.tt}>🫧 SquishyPop 2.0</Text></View>
      <ScrollView horizontal style={s.nv}>
        {[['cat', 'Catálogo'], ['comp', `Comparar(${comp.length})`], ['cart', `Carrito(${cart.reduce((a, b) => a + b.c, 0)})`], ['dirs', 'Direcciones'], ['peds', 'Pedidos'], ['not', `Avisos(${notifs.filter((n) => !n.leida).length})`], ['ayu', 'Ayuda']].map(([k, t]) => (
          <Pressable key={k} onPress={() => setVista(k)} style={[s.tb, vista === k && s.on]}><Text style={s.tbT}>{t}</Text></Pressable>
        ))}
      </ScrollView>

      {vista === 'cat' && <VistaCatalogo prods={prods} comp={comp} setComp={setComp} abrirDet={abrirDet} />}
      {vista === 'comp' && <VistaComparador prods={prods} comp={comp} setComp={setComp} />}
      {vista === 'det' && selP && <VistaDetalle selP={selP} selV={selV} setSelV={setSelV} prods={prods} setProds={setProds} cart={cart} setCart={setCart} alertas={alertas} setAlertas={setAlertas} addNotif={addNotif} abrirDet={abrirDet} volver={() => setVista('cat')} />}
      {vista === 'cart' && <VistaCarrito cart={cart} setCart={setCart} dirs={dirs} dirId={dirId} setDirId={setDirId} prods={prods} setProds={setProds} peds={peds} setPeds={setPeds} addNotif={addNotif} irPedidos={() => setVista('peds')} />}
      {vista === 'dirs' && <VistaDirecciones dirs={dirs} setDirs={setDirs} />}
      {vista === 'peds' && <VistaPedidos peds={peds} setPeds={setPeds} prods={prods} setProds={setProds} addNotif={addNotif} />}
      {vista === 'not' && <VistaNotifs notifs={notifs} setNotifs={setNotifs} />}
      {vista === 'ayu' && <VistaAyuda peds={peds} />}
    </SafeAreaView>
  );
}