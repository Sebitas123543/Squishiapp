import React, { useState } from 'react';
import { Text, View, TextInput, Pressable, FlatList, ScrollView, Alert } from 'react-native';
import { s, cop, stTot } from './datos';

export function VistaCatalogo({ prods, comp, setComp, abrirDet }) {
  const [busq, setBusq] = useState('');
  const [cat, setCat] = useState('Todas');
  const [marca, setMarca] = useState('Todas');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [disp, setDisp] = useState(false);

  const toggleComp = (id) => comp.includes(id)
    ? setComp(comp.filter((x) => x !== id))
    : comp.length >= 3 ? Alert.alert('Límite', 'Máximo 3 productos.') : setComp([...comp, id]);

  const errRango = min && max && parseInt(min) > parseInt(max);
  const filtrados = errRango ? [] : prods.filter((p) =>
    p.nombre.toLowerCase().includes(busq.toLowerCase()) &&
    (cat === 'Todas' || p.cat === cat) && (marca === 'Todas' || p.marca === marca) &&
    p.base >= (min ? parseInt(min) : 0) && p.base <= (max ? parseInt(max) : Infinity) && (!disp || stTot(p) > 0)
  );

  return (
    <View style={s.bd}>
      <TextInput style={s.in} placeholder="Buscar squishy..." value={busq} onChangeText={setBusq} />
      <View style={s.rw}>{['Todas', 'Mochis', 'Comida', 'Animales', 'Llaveros'].map((x) => <Pressable key={x} onPress={() => setCat(x)} style={[s.ch, cat === x && s.on]}><Text style={s.chT}>{x}</Text></Pressable>)}</View>
      <View style={s.rw}>{['Todas', 'KawaiiSoft', 'SweetFoam', 'PopToys', 'MiniPop'].map((x) => <Pressable key={x} onPress={() => setMarca(x)} style={[s.ch, marca === x && s.on]}><Text style={s.chT}>{x}</Text></Pressable>)}</View>
      <View style={s.rw}>
        <TextInput style={[s.in, { flex: 1, marginBottom: 0 }]} placeholder="Mín" keyboardType="numeric" value={min} onChangeText={setMin} />
        <TextInput style={[s.in, { flex: 1, marginBottom: 0 }]} placeholder="Máx" keyboardType="numeric" value={max} onChangeText={setMax} />
        <Pressable onPress={() => setDisp(!disp)} style={[s.ch, disp && s.on]}><Text style={s.chT}>Stock</Text></Pressable>
        <Pressable onPress={() => { setBusq(''); setCat('Todas'); setMarca('Todas'); setMin(''); setMax(''); setDisp(false); }} style={[s.ch, { backgroundColor: '#374151' }]}><Text style={{ color: '#FFF', fontSize: 11 }}>Reset</Text></Pressable>
      </View>

      {errRango ? <Text style={s.er}>Precio mínimo mayor al máximo.</Text> : filtrados.length === 0 ? <Text style={s.em}>Sin resultados.</Text> : (
        <FlatList data={filtrados} keyExtractor={(i) => i.id} renderItem={({ item }) => (
          <Pressable onPress={() => abrirDet(item)} style={s.cd}>
            <View style={s.bt}>
              <View><Text style={s.ct}>{item.cat} • {item.marca}</Text><Text style={s.bdT}>{item.nombre}</Text><Text style={s.pr}>Desde {cop(item.base)} | Stock: {stTot(item)}</Text></View>
              <Pressable onPress={() => toggleComp(item.id)} style={[s.ch, comp.includes(item.id) && s.on]}><Text style={s.chT}>{comp.includes(item.id) ? '✓ Comp' : '+ Comp'}</Text></Pressable>
            </View>
          </Pressable>
        )} />
      )}
    </View>
  );
}

export function VistaComparador({ prods, comp, setComp }) {
  return (
    <ScrollView style={s.bd}>
      {comp.length === 0 ? <Text style={s.em}>Selecciona hasta 3 productos en el catálogo.</Text> : (
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {prods.filter((p) => comp.includes(p.id)).map((p) => (
            <View key={p.id} style={[s.cd, { flex: 1 }]}>
              <Text style={s.bdT}>{p.nombre}</Text><Text style={s.ct}>{p.marca}</Text><Text style={s.pr}>{cop(p.base)}</Text><Text>St: {stTot(p)}</Text>
              <Pressable onPress={() => setComp(comp.filter((x) => x !== p.id))} style={[s.btB, { backgroundColor: '#E11D48' }]}><Text style={s.btT}>Quitar</Text></Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}