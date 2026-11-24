import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { s, cop } from './datos';

export function VistaPedidos({ peds, setPeds, prods, setProds, addNotif }) {
  const [pedSel, setPedSel] = useState(null);

  const avanzar = (p) => {
    const fl = ['Confirmado', 'Preparando', 'En camino', 'Entregado'];
    const i = fl.indexOf(p.est);
    if (i === -1 || i === 3) return Alert.alert('Aviso', 'No admite más avances.');
    const sig = fl[i + 1];
    const up = { ...p, est: sig, log: [...p.log, `${sig} - ${new Date().toLocaleTimeString()}`] };
    setPeds(peds.map((x) => x.id === p.id ? up : x));
    setPedSel(up);
    addNotif(`${p.id}-${sig}`, `Pedido ${p.id} pasó a ${sig}.`);
  };

  const cancelar = (p) => {
    if (p.est !== 'Confirmado' && p.est !== 'Preparando') return Alert.alert('Bloqueado', 'No se puede cancelar en este estado.');
    setProds(prods.map((pr) => ({ ...pr, vars: pr.vars.map((v) => { const i = p.items.find((x) => x.vId === v.id); return i ? { ...v, st: v.st + i.c } : v; }) })));
    const up = { ...p, est: 'Cancelado', log: [...p.log, `Cancelado (Stock reintegrado) - ${new Date().toLocaleTimeString()}`] };
    setPeds(peds.map((x) => x.id === p.id ? up : x));
    setPedSel(up);
    addNotif(`${p.id}-Cancelado`, `Pedido ${p.id} Cancelado y stock devuelto.`);
  };

  return (
    <ScrollView style={s.bd}>
      {pedSel ? (
        <View style={s.cd}>
          <Pressable onPress={() => setPedSel(null)}><Text style={s.lk}>← Volver</Text></Pressable>
          <Text style={s.h2}>{pedSel.id} • {pedSel.est}</Text>
          {pedSel.log.map((l, i) => <Text key={i}>✓ {l}</Text>)}
          <Pressable onPress={() => avanzar(pedSel)} style={[s.btB, { backgroundColor: '#2563EB' }]}><Text style={s.btT}>Simular avance de entrega</Text></Pressable>
          <Pressable onPress={() => cancelar(pedSel)} style={[s.btB, { backgroundColor: '#E11D48' }]}><Text style={s.btT}>Cancelar pedido</Text></Pressable>
        </View>
      ) : peds.map((p) => <Pressable key={p.id} onPress={() => setPedSel(p)} style={s.cd}><Text style={s.bdT}>{p.id} - {p.est} ({cop(p.tot)})</Text><Text style={s.lk}>Ver seguimiento →</Text></Pressable>)}
    </ScrollView>
  );
}

export function VistaNotifs({ notifs, setNotifs }) {
  return (
    <ScrollView style={s.bd}>
      {notifs.length === 0 ? <Text style={s.em}>Sin avisos.</Text> : notifs.map((n) => (
        <Pressable key={n.id} onPress={() => setNotifs(notifs.map((x) => x.id === n.id ? { ...x, leida: true } : x))} style={[s.cd, !n.leida && { borderColor: '#DB2777', borderWidth: 2 }]}><Text style={s.bdT}>{n.leida ? '✓' : '🔴'} {n.msg}</Text></Pressable>
      ))}
    </ScrollView>
  );
}

export function VistaAyuda({ peds }) {
  const [tks, setTks] = useState([]);
  const [tkP, setTkP] = useState(peds[0]?.id || 'SQP-1001');
  const [tkM, setTkM] = useState('Entrega');
  const [tkD, setTkD] = useState('');

  return (
    <ScrollView style={s.bd}>
      <View style={s.cd}>
        <View style={s.rw}>{peds.map((p) => <Pressable key={p.id} onPress={() => setTkP(p.id)} style={[s.ch, tkP === p.id && s.on]}><Text style={s.chT}>{p.id}</Text></Pressable>)}</View>
        <View style={s.rw}>{['Entrega', 'Producto', 'Otro'].map((m) => <Pressable key={m} onPress={() => setTkM(m)} style={[s.ch, tkM === m && s.on]}><Text style={s.chT}>{m}</Text></Pressable>)}</View>
        <TextInput style={s.in} placeholder="Detalle (mín 15 letras)" value={tkD} onChangeText={setTkD} />
        <Pressable onPress={() => { if (tkD.length < 15) return Alert.alert('Error', 'Mín 15 letras'); setTks([{ id: `TK-${Date.now()}`, ped: tkP, mot: tkM, desc: tkD, est: 'Abierto', resp: '' }, ...tks]); setTkD(''); }} style={s.btB}><Text style={s.btT}>Crear Ticket</Text></Pressable>
      </View>
      {tks.map((t) => (
        <View key={t.id} style={s.cd}><Text style={s.bdT}>{t.ped} • {t.mot} ({t.est})</Text><Text>{t.desc}</Text>{t.resp ? <Text style={{ color: '#059669' }}>{t.resp}</Text> : <Pressable onPress={() => setTks(tks.map((x) => x.id === t.id ? { ...x, est: 'Respondido', resp: 'Soporte Simulado: Caso atendido.' } : x))}><Text style={s.lk}>[Demo] Simular respuesta</Text></Pressable>}</View>
      ))}
    </ScrollView>
  );
}