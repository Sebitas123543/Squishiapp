import React, { useState } from 'react';
import { Text, View, Pressable, SafeAreaView } from 'react-native';
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

  const sinLeer = notifs.filter((n) => !n.leida).length;
  const totalCart = cart.reduce((a, b) => a + b.c, 0);

  return (
    <SafeAreaView style={s.c}>
      {/* HEADER COMPACTO CON ACCESOS DIRECTOS A DIRECCIONES Y AVISOS */}
      <View style={s.hd}>
        <View>
          <Text style={s.tt}>🫧 SquishyPop 2.0</Text>
          <Text style={{ color: '#FBCFE8', fontSize: 10 }}>Apreta el estrés, colecciona ternura</Text>
        </View>
        <View style={s.hdIcons}>
          <Pressable onPress={() => setVista('dirs')} style={[s.iconBtn, vista === 'dirs' && s.iconBtnOn]}>
            <Text style={s.tbT}>📍 Envío</Text>
          </Pressable>
          <Pressable onPress={() => setVista('not')} style={[s.iconBtn, vista === 'not' && s.iconBtnOn]}>
            <Text style={s.tbT}>🔔 {sinLeer}</Text>
          </Pressable>
        </View>
      </View>

      {/* CONTENIDO CENTRAL */}
      <View style={{ flex: 1 }}>
        {vista === 'cat' && <VistaCatalogo prods={prods} comp={comp} setComp={setComp} abrirDet={abrirDet} />}
        {vista === 'comp' && <VistaComparador prods={prods} comp={comp} setComp={setComp} />}
        {vista === 'det' && selP && <VistaDetalle selP={selP} selV={selV} setSelV={setSelV} prods={prods} setProds={setProds} cart={cart} setCart={setCart} alertas={alertas} setAlertas={setAlertas} addNotif={addNotif} abrirDet={abrirDet} volver={() => setVista('cat')} />}
        {vista === 'cart' && <VistaCarrito cart={cart} setCart={setCart} dirs={dirs} dirId={dirId} setDirId={setDirId} prods={prods} setProds={setProds} peds={peds} setPeds={setPeds} addNotif={addNotif} irPedidos={() => setVista('peds')} />}
        {vista === 'dirs' && <VistaDirecciones dirs={dirs} setDirs={setDirs} />}
        {vista === 'peds' && <VistaPedidos peds={peds} setPeds={setPeds} prods={prods} setProds={setProds} addNotif={addNotif} />}
        {vista === 'not' && <VistaNotifs notifs={notifs} setNotifs={setNotifs} />}
        {vista === 'ayu' && <VistaAyuda peds={peds} />}
      </View>

      {/* BARRA DE NAVEGACIÓN INFERIOR FIJA (ESTILO APP NATIVA) */}
      <View style={s.bottomBar}>
        {[
          ['cat', '🛍️', 'Tienda'],
          ['comp', '⚖️', `Comp(${comp.length})`],
          ['cart', '🛒', `Carrito(${totalCart})`],
          ['peds', '📦', 'Pedidos'],
          ['ayu', '💬', 'Ayuda']
        ].map(([k, ico, lbl]) => (
          <Pressable key={k} onPress={() => setVista(k)} style={[s.bTab, vista === k && s.on]}>
            <Text style={{ fontSize: 15 }}>{ico}</Text>
            <Text style={s.tbT}>{lbl}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}