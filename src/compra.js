import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { s, cop, TARIFAS_ENVIO } from './datos';

export function VistaCarrito({ cart, setCart, dirs, dirId, setDirId, prods, setProds, peds, setPeds, addNotif, irPedidos }) {
  const [mod, setMod] = useState('Estandar');
  const dirObj = dirs.find((d) => d.id === dirId);
  const costoEnv = (cart.length > 0 && dirObj) ? TARIFAS_ENVIO[dirObj.mun][mod] : 0;
  const sub = cart.reduce((a, b) => a + b.p * b.c, 0);
  const tot = sub + costoEnv;

  const comprar = () => {
    if (!dirObj) return Alert.alert('Error', 'Selecciona dirección.');
    setProds(prods.map((p) => ({ ...p, vars: p.vars.map((v) => { const i = cart.find((c) => c.vId === v.id); return i ? { ...v, st: Math.max(0, v.st - i.c) } : v; }) })));
    const np = { id: `SQP-${Math.floor(2000 + Math.random() * 7000)}`, items: [...cart], tot, env: costoEnv, est: 'Confirmado', log: [`Confirmado - ${new Date().toLocaleTimeString()}`] };
    setPeds([np, ...peds]);
    setCart([]);
    addNotif(`${np.id}-Confirmado`, `Pedido ${np.id} Confirmado.`);
    Alert.alert('¡Compra Simulada!', `Pedido ${np.id} creado.`);
    irPedidos();
  };

  return (
    <ScrollView style={s.bd}>
      {cart.length === 0 ? <Text style={s.em}>Carrito vacío.</Text> : (
        <>
          {cart.map((i) => <View key={i.vId} style={s.cd}><Text style={s.bdT}>{i.nom} ({i.et}) x{i.c} = {cop(i.p * i.c)}</Text><Pressable onPress={() => setCart(cart.filter((x) => x.vId !== i.vId))}><Text style={s.lk}>Quitar</Text></Pressable></View>)}
          <View style={s.cd}>
            <Text style={s.bdT}>Dirección:</Text>
            <View style={s.rw}>{dirs.map((d) => <Pressable key={d.id} onPress={() => setDirId(d.id)} style={[s.ch, dirId === d.id && s.on]}><Text style={s.chT}>{d.alias} ({d.mun})</Text></Pressable>)}</View>
            <Text style={s.bdT}>Envío:</Text>
            <View style={s.rw}>{['Estandar', 'Expres'].map((m) => <Pressable key={m} onPress={() => setMod(m)} style={[s.ch, mod === m && s.on]}><Text style={s.chT}>{m}</Text></Pressable>)}</View>
            <Text>Subtotal: {cop(sub)} | Envío ({dirObj?.mun}): {cop(costoEnv)} (1-2 días)</Text>
            <Text style={s.h2}>Total: {cop(tot)}</Text>
            <Pressable onPress={comprar} style={s.btB}><Text style={s.btT}>Confirmar compra simulada</Text></Pressable>
          </View>
        </>
      )}
    </ScrollView>
  );
}

export function VistaDirecciones({ dirs, setDirs }) {
  const [fDir, setFDir] = useState({ id: null, alias: '', mun: 'Mosquera', ref: '' });

  return (
    <ScrollView style={s.bd}>
      <View style={s.cd}>
        <TextInput style={s.in} placeholder="Alias" value={fDir.alias} onChangeText={(t) => setFDir({ ...fDir, alias: t })} />
        <View style={s.rw}>{['Mosquera', 'Funza', 'Madrid'].map((m) => <Pressable key={m} onPress={() => setFDir({ ...fDir, mun: m })} style={[s.ch, fDir.mun === m && s.on]}><Text style={s.chT}>{m}</Text></Pressable>)}</View>
        <TextInput style={s.in} placeholder="Dirección" value={fDir.ref} onChangeText={(t) => setFDir({ ...fDir, ref: t })} />
        <Pressable onPress={() => { if (!fDir.alias || !fDir.ref) return; setDirs(fDir.id ? dirs.map((d) => d.id === fDir.id ? { ...d, ...fDir } : d) : [...dirs, { id: `D${Date.now()}`, ...fDir, pri: false }]); setFDir({ id: null, alias: '', mun: 'Mosquera', ref: '' }); }} style={s.btB}><Text style={s.btT}>Guardar</Text></Pressable>
      </View>
      {dirs.map((d) => (
        <View key={d.id} style={s.cd}>
          <Text style={s.bdT}>{d.alias} ({d.mun}) {d.pri ? '⭐' : ''}</Text><Text>{d.ref}</Text>
          <View style={s.rw}><Pressable onPress={() => setDirs(dirs.map((x) => ({ ...x, pri: x.id === d.id })))}><Text style={s.lk}>Principal</Text></Pressable><Pressable onPress={() => setFDir(d)}><Text style={s.lk}>Editar</Text></Pressable></View>
        </View>
      ))}
    </ScrollView>
  );
}