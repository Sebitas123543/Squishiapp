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
  const [verFiltros, setVerFiltros] = useState(false);

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
      {/* Buscador + Botón para abrir/cerrar filtros avanzados */}
      <View style={s.rw}>
        <TextInput style={[s.in, { flex: 1, marginBottom: 0 }]} placeholder="🔍 Buscar squishy..." value={busq} onChangeText={setBusq} />
        <Pressable onPress={() => setVerFiltros(!verFiltros)} style={[s.ch, verFiltros && s.on, { paddingVertical: 9 }]}>
          <Text style={[s.chT, verFiltros && s.chTOn]}>🎛️ Filtros</Text>
        </Pressable>
      </View>

      {/* Carrusel horizontal de categorías */}
      <View style={{ height: 34, marginBottom: 6 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Todas', 'Mochis', 'Comida', 'Animales', 'Llaveros'].map((x) => (
            <Pressable key={x} onPress={() => setCat(x)} style={[s.ch, cat === x && s.on, { marginRight: 5 }]}>
              <Text style={[s.chT, cat === x && s.chTOn]}>{x}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Cajón desplegable de filtros combinados (HU23) */}
      {verFiltros && (
        <View style={[s.cd, { backgroundColor: '#FCE7F3' }]}>
          <Text style={[s.ct, { marginBottom: 4 }]}>Filtrar por Marca:</Text>
          <View style={s.rw}>
            {['Todas', 'KawaiiSoft', 'SweetFoam', 'PopToys', 'MiniPop'].map((x) => (
              <Pressable key={x} onPress={() => setMarca(x)} style={[s.ch, { backgroundColor: '#FFF' }, marca === x && s.on]}>
                <Text style={[s.chT, marca === x && s.chTOn]}>{x}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.rw}>
            <TextInput style={[s.in, { flex: 1, marginBottom: 0 }]} placeholder="Precio Mín" keyboardType="numeric" value={min} onChangeText={setMin} />
            <TextInput style={[s.in, { flex: 1, marginBottom: 0 }]} placeholder="Precio Máx" keyboardType="numeric" value={max} onChangeText={setMax} />
            <Pressable onPress={() => setDisp(!disp)} style={[s.ch, { backgroundColor: '#FFF' }, disp && s.on]}>
              <Text style={[s.chT, disp && s.chTOn]}>Con Stock</Text>
            </Pressable>
            <Pressable onPress={() => { setBusq(''); setCat('Todas'); setMarca('Todas'); setMin(''); setMax(''); setDisp(false); }} style={[s.ch, { backgroundColor: '#374151' }]}>
              <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>Reset</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Cuadrícula de 2 columnas (Grid 2xN) */}
      {errRango ? <Text style={s.er}>Precio mínimo mayor al máximo.</Text> : filtrados.length === 0 ? <Text style={s.em}>Sin resultados.</Text> : (
        <FlatList
          data={filtrados}
          numColumns={2}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            const st = stTot(item);
            const enComp = comp.includes(item.id);
            return (
              <Pressable onPress={() => abrirDet(item)} style={s.gridCard}>
                <View>
                  <Text style={s.ct}>{item.cat} • {item.marca}</Text>
                  <Text style={s.bdT} numberOfLines={2}>{item.nombre}</Text>
                  <Text style={s.pr}>{cop(item.base)}</Text>
                  <Text style={{ fontSize: 11, color: st > 0 ? '#059669' : '#E11D48', fontWeight: 'bold' }}>
                    {st > 0 ? `● ${st} disp.` : '● Agotado'}
                  </Text>
                </View>
                <Pressable onPress={() => toggleComp(item.id)} style={[s.ch, enComp && s.on, { marginTop: 8, alignItems: 'center' }]}>
                  <Text style={[s.chT, enComp && s.chTOn]}>{enComp ? '✓ Comparando' : '+ Comparar'}</Text>
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

export function VistaComparador({ prods, comp, setComp }) {
  return (
    <ScrollView style={s.bd}>
      <Text style={s.h2}>⚖️ Comparando ({comp.length}/3)</Text>
      {comp.length === 0 ? <Text style={s.em}>Marca hasta 3 productos en la tienda para compararlos.</Text> : (
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {prods.filter((p) => comp.includes(p.id)).map((p) => (
            <View key={p.id} style={[s.cd, { flex: 1 }]}>
              <Text style={s.bdT}>{p.nombre}</Text>
              <Text style={s.ct}>{p.marca}</Text>
              <Text style={s.pr}>{cop(p.base)}</Text>
              <Text style={{ fontSize: 12 }}>Stock: {stTot(p)}</Text>
              <Pressable onPress={() => setComp(comp.filter((x) => x !== p.id))} style={[s.btB, { backgroundColor: '#E11D48' }]}>
                <Text style={s.btT}>Quitar</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}