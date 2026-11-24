import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { s, cop, stTot } from './datos';

export default function VistaDetalle({ selP, selV, setSelV, prods, setProds, cart, setCart, alertas, setAlertas, addNotif, abrirDet, volver }) {
  const [qs, setQs] = useState([{ id: 'Q1', pId: 'SQ-01', preg: '¿Es lavable?', resp: 'Simulado: Sí, con agua fría.', est: 'Respondida' }]);
  const [txtQ, setTxtQ] = useState('');

  const addCart = () => {
    if (!selV) return Alert.alert('Error', 'Elige una variante.');
    if (selV.st <= 0) return Alert.alert('Agotado', 'Variante sin stock.');
    const ex = cart.find((x) => x.vId === selV.id);
    if (ex && ex.c + 1 > selV.st) return Alert.alert('Límite', `Máximo ${selV.st} uds.`);
    setCart(ex ? cart.map((x) => x.vId === selV.id ? { ...x, c: x.c + 1 } : x) : [...cart, { pId: selP.id, vId: selV.id, nom: selP.nombre, et: selV.et, p: selV.p, c: 1 }]);
    Alert.alert('Listo', 'Agregado al carrito.');
  };

  const simRepo = () => {
    const np = prods.map((x) => x.id === selP.id ? { ...x, vars: x.vars.map((vr) => vr.id === selV.id ? { ...vr, st: vr.st + 5 } : vr) } : x);
    setProds(np);
    const act = np.find((x) => x.id === selP.id);
    abrirDet(act, act.vars.find((vr) => vr.id === selV.id));
    if (alertas.includes(selV.id)) {
      addNotif(`REPO-${selV.id}-${Date.now()}`, `¡Reposición! Ya hay stock de ${selP.nombre} (${selV.et}).`);
      setAlertas(alertas.filter((x) => x !== selV.id));
    }
    Alert.alert('Demo', '+5 unidades agregadas.');
  };

  return (
    <ScrollView style={s.bd}>
      <Pressable onPress={volver}><Text style={s.lk}>← Volver</Text></Pressable>
      <View style={s.cd}>
        <Text style={s.ct}>{selP.cat} • {selP.marca}</Text><Text style={s.h2}>{selP.nombre}</Text><Text>{selP.desc}</Text>
        <Text style={[s.bdT, { marginTop: 6 }]}>Variantes:</Text>
        <View style={s.rw}>{selP.vars.map((v) => <Pressable key={v.id} onPress={() => setSelV(v)} style={[s.ch, selV?.id === v.id && s.on]}><Text style={s.chT}>{v.et} ({cop(v.p)}) St:{v.st}</Text></Pressable>)}</View>
        {selV && <Text style={s.bdT}>Elegido: {selV.et} - {cop(selV.p)} ({selV.st > 0 ? `${selV.st} disp` : 'AGOTADO'})</Text>}
        <Pressable onPress={addCart} style={[s.btB, selV?.st === 0 && { backgroundColor: '#9CA3AF' }]}><Text style={s.btT}>+ Agregar al carrito</Text></Pressable>
        {selV?.st === 0 && (
          <View style={s.rw}>
            <Pressable onPress={() => { setAlertas(alertas.includes(selV.id) ? alertas.filter((x) => x !== selV.id) : [...alertas, selV.id]); Alert.alert('Aviso', 'Suscripción actualizada.'); }} style={[s.btB, { flex: 1, backgroundColor: '#7C3AED' }]}><Text style={s.btT}>{alertas.includes(selV.id) ? 'Quitar aviso' : '🔔 Avisarme stock'}</Text></Pressable>
            <Pressable onPress={simRepo} style={[s.btB, { flex: 1, backgroundColor: '#374151' }]}><Text style={s.btT}>[Demo] Reponer +5</Text></Pressable>
          </View>
        )}
      </View>

      <View style={s.cd}>
        <Text style={s.bdT}>Preguntas (HU24)</Text>
        <View style={s.rw}>
          <TextInput style={[s.in, { flex: 1, marginBottom: 0 }]} placeholder="Duda (mín 10 letras)" value={txtQ} onChangeText={setTxtQ} />
          <Pressable onPress={() => { if (txtQ.length < 10) return Alert.alert('Error', 'Mín 10 letras'); setQs([{ id: `Q${Date.now()}`, pId: selP.id, preg: txtQ, resp: '', est: 'Pendiente' }, ...qs]); setTxtQ(''); }} style={s.btB}><Text style={s.btT}>Enviar</Text></Pressable>
        </View>
        {qs.filter((q) => q.pId === selP.id).map((q) => (
          <View key={q.id} style={{ marginTop: 4 }}><Text style={s.bdT}>P: {q.preg} ({q.est})</Text>{q.resp ? <Text style={{ color: '#059669' }}>{q.resp}</Text> : <Pressable onPress={() => setQs(qs.map((x) => x.id === q.id ? { ...x, est: 'Respondida', resp: 'Respuesta simulada: Sí disponible.' } : x))}><Text style={s.lk}>[Demo] Simular respuesta</Text></Pressable>}</View>
        ))}
      </View>

      <View style={s.cd}>
        <Text style={s.bdT}>Relacionados (HU31)</Text>
        {prods.filter((p) => p.cat === selP.cat && p.id !== selP.id && stTot(p) > 0).map((r) => <Pressable key={r.id} onPress={() => abrirDet(r)}><Text style={s.lk}>• {r.nombre} - {cop(r.base)}</Text></Pressable>)}
      </View>
    </ScrollView>
  );
}