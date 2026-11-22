import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, FlatList, ScrollView, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DATA_INICIAL = [
  { id: 'SQ-01', nombre: 'Patita de Gato Mochi', categoria: 'Mochis', precio: 12000, stock: 15, descripcion: 'Squishy suave de silicona antiestrés.', resenas: [5] },
  { id: 'SQ-02', nombre: 'Mochi Foca Gordita', categoria: 'Mochis', precio: 14000, stock: 9, descripcion: 'Foca blanca apachurrable de retorno lento.', resenas: [5, 4] },
  { id: 'SQ-03', nombre: 'Pack x3 Mochis Frutas', categoria: 'Mochis', precio: 22000, stock: 7, descripcion: 'Fresa, durazno y sandía en textura gel.', resenas: [4] },
  { id: 'SQ-04', nombre: 'Dona Glaseada Gigante', categoria: 'Comida', precio: 35000, stock: 5, descripcion: 'Espuma de memoria con aroma a vainilla.', resenas: [5] },
  { id: 'SQ-05', nombre: 'Pan Tajado Kawaii', categoria: 'Comida', precio: 28000, stock: 6, descripcion: 'Rebanada de pan feliz slow rising.', resenas: [5] },
  { id: 'SQ-06', nombre: 'Helado Galaxia Jumbo', categoria: 'Comida', precio: 42000, stock: 0, descripcion: 'Squishy gigante edición colores pastel.', resenas: [4] },
  { id: 'SQ-07', nombre: 'Ajolote Rosa Pastel', categoria: 'Animales', precio: 30000, stock: 8, descripcion: 'Diseño tierno de ajolote súper blando.', resenas: [5] },
  { id: 'SQ-08', nombre: 'Panda Bambú XL', categoria: 'Animales', precio: 38000, stock: 4, descripcion: 'Oso panda ideal para aliviar el estrés.', resenas: [4, 5] },
  { id: 'SQ-09', nombre: 'Corgi Perrito Dormilón', categoria: 'Animales', precio: 26000, stock: 10, descripcion: 'Perrito corgi esponjoso y suave al tacto.', resenas: [5] },
  { id: 'SQ-10', nombre: 'Llavero Aguacate', categoria: 'Llaveros', precio: 15000, stock: 20, descripcion: 'Mini squishy con argolla para maleta.', resenas: [4] },
  { id: 'SQ-11', nombre: 'Llavero Capibara', categoria: 'Llaveros', precio: 18000, stock: 12, descripcion: 'Mini capibara con naranja apachurrable.', resenas: [5] },
  { id: 'SQ-12', nombre: 'Llavero Galleta Oreo', categoria: 'Llaveros', precio: 16000, stock: 11, descripcion: 'Llavero aromático textura de galleta.', resenas: [4] },
];

const CATS = ['Todas', 'Mochis', 'Comida', 'Animales', 'Llaveros'];
const cop = (n) => `$${n.toLocaleString('es-CO')}`;

export default function App() {
  const [vista, setVista] = useState('catalogo');
  const [productos, setProductos] = useState(DATA_INICIAL);
  const [sel, setSel] = useState(null);
  const [favs, setFavs] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [pedidoSel, setPedidoSel] = useState(null);

  const [busq, setBusq] = useState('');
  const [cat, setCat] = useState('Todas');
  const [orden, setOrden] = useState('');

  const [cupon, setCupon] = useState('');
  const [descActivo, setDescActivo] = useState(false);
  const [cliente, setCliente] = useState({ nombre: '', tel: '', mun: '', dir: '' });
  const [voto, setVoto] = useState('');
  const [editId, setEditId] = useState(null);
  const [formAdmin, setFormAdmin] = useState({ nombre: '', categoria: 'Mochis', precio: '', stock: '', descripcion: '' });

  useEffect(() => {
    AsyncStorage.getItem('@sp_data').then((res) => {
      if (res) {
        const d = JSON.parse(res);
        if (d.carrito) setCarrito(d.carrito);
        if (d.favs) setFavs(d.favs);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@sp_data', JSON.stringify({ carrito, favs })).catch(() => {});
  }, [carrito, favs]);

  const toggleFav = (id) => setFavs(favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id]);

  const addCarrito = (p) => {
    const prod = productos.find((x) => x.id === p.id);
    if (!prod || prod.stock <= 0) return Alert.alert('Agotado', 'Sin existencias disponibles.');
    const enCarro = carrito.find((x) => x.id === p.id);
    if (enCarro && enCarro.cantidad + 1 > prod.stock) return Alert.alert('Límite', `Solo hay ${prod.stock} unidades.`);
    setCarrito(enCarro
      ? carrito.map((x) => (x.id === p.id ? { ...x, cantidad: x.cantidad + 1 } : x))
      : [...carrito, { ...prod, cantidad: 1 }]
    );
    Alert.alert('Listo', `${p.nombre} agregado al carrito.`);
  };

  const modCant = (id, delta) => {
    const prod = productos.find((x) => x.id === id);
    const item = carrito.find((x) => x.id === id);
    if (item.cantidad + delta <= 0) return Alert.alert('Aviso', 'Usa el botón Quitar para eliminar.');
    if (item.cantidad + delta > prod.stock) return Alert.alert('Sin stock', `Máximo ${prod.stock} disponibles.`);
    setCarrito(carrito.map((x) => (x.id === id ? { ...x, cantidad: x.cantidad + delta } : x)));
  };

  const subtotal = carrito.reduce((a, b) => a + b.precio * b.cantidad, 0);
  const descuento = descActivo ? Math.round(subtotal * 0.1) : 0;
  const subDesc = Math.max(0, subtotal - descuento);
  const envio = carrito.length === 0 ? 0 : subDesc >= 150000 ? 0 : 8000;
  const total = subDesc + envio;

  const validarCupon = () => {
    if (cupon.trim().toUpperCase() === 'BIENVENIDO10' && carrito.length > 0) {
      setDescActivo(true);
      Alert.alert('Cupón aplicado', '10% de descuento aplicado.');
    } else {
      setDescActivo(false);
      Alert.alert('Error', 'Cupón inválido o carrito vacío.');
    }
  };

  const confirmarPedido = () => {
    if (!cliente.nombre.trim() || !cliente.tel.trim() || !cliente.mun.trim() || !cliente.dir.trim()) {
      return Alert.alert('Error', 'Completa todos los campos de entrega.');
    }
    for (let i of carrito) {
      const p = productos.find((x) => x.id === i.id);
      if (!p || p.stock < i.cantidad) return Alert.alert('Error', `Stock insuficiente en ${i.nombre}.`);
    }
    setProductos(productos.map((p) => {
      const c = carrito.find((x) => x.id === p.id);
      return c ? { ...p, stock: p.stock - c.cantidad } : p;
    }));
    const ped = {
      codigo: `SQP-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toLocaleString('es-CO'),
      cliente: { ...cliente },
      items: [...carrito],
      envio,
      total
    };
    setHistorial([ped, ...historial]);
    setCarrito([]);
    setDescActivo(false);
    setCupon('');
    setCliente({ nombre: '', tel: '', mun: '', dir: '' });
    Alert.alert('¡Compra Simulada!', `Pedido ${ped.codigo} registrado (Simulación sin cobro real).`);
    setVista('historial');
  };

  const enviarVoto = () => {
    const n = parseInt(voto, 10);
    if (isNaN(n) || n < 1 || n > 5) return Alert.alert('Error', 'Califica entre 1 y 5.');
    const nuevos = productos.map((p) => (p.id === sel.id ? { ...p, resenas: [...p.resenas, n] } : p));
    setProductos(nuevos);
    setSel({ ...sel, resenas: [...sel.resenas, n] });
    setVoto('');
    Alert.alert('Gracias', 'Reseña agregada.');
  };

  const guardarAdmin = () => {
    const pr = parseInt(formAdmin.precio, 10);
    const st = parseInt(formAdmin.stock, 10);
    if (!formAdmin.nombre.trim() || formAdmin.descripcion.trim().length < 15 || isNaN(pr) || pr <= 0 || isNaN(st) || st < 0) {
      return Alert.alert('Error', 'Revisa: nombre obligatorio, descripción >15 letras, precio >0 y stock >=0.');
    }
    if (editId) {
      setProductos(productos.map((p) => (p.id === editId ? { ...p, ...formAdmin, precio: pr, stock: st } : p)));
      setEditId(null);
      Alert.alert('Editado', 'Producto actualizado.');
    } else {
      const id = `SQ-${String(productos.length + 1).padStart(2, '0')}`;
      setProductos([{ id, ...formAdmin, precio: pr, stock: st, resenas: [5] }, ...productos]);
      Alert.alert('Creado', `Producto ${id} agregado.`);
    }
    setFormAdmin({ nombre: '', categoria: 'Mochis', precio: '', stock: '', descripcion: '' });
  };

  const filtrados = productos
    .filter((p) => (cat === 'Todas' || p.categoria === cat) && p.nombre.toLowerCase().includes(busq.toLowerCase()))
    .sort((a, b) => (orden === 'asc' ? a.precio - b.precio : orden === 'desc' ? b.precio - a.precio : 0));

  return (
    <SafeAreaView style={s.container}>
      {/* HEADER (HU01) */}
      <View style={s.header}>
        <Text style={s.title}>🫧 SquishyPop</Text>
        <Text style={s.sub}>Apreta el estrés, colecciona ternura</Text>
      </View>

      {/* NAV (HU02) */}
      <View style={s.nav}>
        {[['catalogo', 'Catálogo'], ['favs', `Favs (${favs.length})`], ['carrito', `Carrito (${carrito.reduce((a, b) => a + b.cantidad, 0)})`], ['historial', 'Pedidos'], ['admin', 'Admin']].map(([k, txt]) => (
          <Pressable key={k} onPress={() => { setVista(k); setPedidoSel(null); }} style={[s.tab, vista === k && s.tabOn]}>
            <Text style={s.tabTxt}>{txt}</Text>
          </Pressable>
        ))}
      </View>

      {/* CATÁLOGO (HU03-HU06) */}
      {vista === 'catalogo' && (
        <View style={s.body}>
          <TextInput style={s.input} placeholder="Buscar squishy..." value={busq} onChangeText={setBusq} />
          <View style={s.row}>
            {CATS.map((c) => (
              <Pressable key={c} onPress={() => setCat(c)} style={[s.chip, cat === c && s.chipOn]}>
                <Text style={{ color: cat === c ? '#FFF' : '#831843', fontSize: 11 }}>{c}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.row}>
            <Text style={{ fontSize: 12 }}>Ordenar: </Text>
            <Pressable onPress={() => setOrden('asc')} style={s.chip}><Text style={{ fontSize: 11 }}>Menor precio</Text></Pressable>
            <Pressable onPress={() => setOrden('desc')} style={s.chip}><Text style={{ fontSize: 11 }}>Mayor precio</Text></Pressable>
          </View>

          {filtrados.length === 0 ? <Text style={s.empty}>No encontramos productos</Text> : (
            <FlatList
              data={filtrados}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => { setSel(item); setVista('detalle'); }} style={s.card}>
                  <View style={s.between}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.cat}>{item.categoria} • {item.id}</Text>
                      <Text style={s.bold}>{item.nombre}</Text>
                      <Text style={s.price}>{cop(item.precio)}</Text>
                      <Text style={{ color: item.stock > 0 ? '#059669' : '#E11D48', fontSize: 12 }}>
                        {item.stock > 0 ? `Stock: ${item.stock}` : 'AGOTADO'}
                      </Text>
                    </View>
                    <Pressable onPress={() => toggleFav(item.id)}><Text style={{ fontSize: 20 }}>{favs.includes(item.id) ? '❤️' : '🤍'}</Text></Pressable>
                  </View>
                  <Pressable onPress={() => addCarrito(item)} disabled={item.stock === 0} style={[s.btn, item.stock === 0 && s.btnOff]}>
                    <Text style={s.btnTxt}>{item.stock === 0 ? 'Agotado' : '+ Agregar'}</Text>
                  </Pressable>
                </Pressable>
              )}
            />
          )}
        </View>
      )}

      {/* DETALLE Y RESEÑAS (HU07, HU19) */}
      {vista === 'detalle' && sel && (
        <ScrollView style={s.body}>
          <Pressable onPress={() => setVista('catalogo')}><Text style={s.link}>← Volver</Text></Pressable>
          <View style={s.card}>
            <Text style={s.cat}>{sel.categoria} • {sel.id}</Text>
            <Text style={s.h2}>{sel.nombre}</Text>
            <Text style={s.price}>{cop(sel.precio)}</Text>
            <Text style={{ color: sel.stock > 0 ? '#059669' : '#E11D48', marginVertical: 4 }}>
              {sel.stock > 0 ? `Disponibles: ${sel.stock}` : 'Producto Agotado'}
            </Text>
            <Text style={{ marginVertical: 8 }}>{sel.descripcion}</Text>
            <View style={s.row}>
              <Pressable onPress={() => addCarrito(sel)} disabled={sel.stock === 0} style={[s.btn, { flex: 1 }, sel.stock === 0 && s.btnOff]}>
                <Text style={s.btnTxt}>Agregar al carrito</Text>
              </Pressable>
              <Pressable onPress={() => toggleFav(sel.id)} style={[s.btn, { backgroundColor: '#FCE7F3' }]}>
                <Text>{favs.includes(sel.id) ? '❤️' : '🤍'}</Text>
              </Pressable>
            </View>
          </View>
          <View style={s.card}>
            <Text style={s.bold}>Calificación: ⭐ {(sel.resenas.reduce((a, b) => a + b, 0) / sel.resenas.length).toFixed(1)} / 5</Text>
            <View style={[s.row, { marginTop: 8 }]}>
              <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Estrellas (1-5)" keyboardType="numeric" value={voto} onChangeText={setVoto} />
              <Pressable onPress={enviarVoto} style={s.btn}><Text style={s.btnTxt}>Votar</Text></Pressable>
            </View>
          </View>
        </ScrollView>
      )}

      {/* FAVORITOS (HU08) */}
      {vista === 'favs' && (
        <View style={s.body}>
          {favs.length === 0 ? <Text style={s.empty}>No tienes favoritos guardados.</Text> : (
            <FlatList
              data={productos.filter((p) => favs.includes(p.id))}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={s.card}>
                  <Text style={s.bold}>{item.nombre} - {cop(item.precio)}</Text>
                  <View style={[s.row, { marginTop: 8 }]}>
                    <Pressable onPress={() => { setSel(item); setVista('detalle'); }} style={s.btn}><Text style={s.btnTxt}>Ver</Text></Pressable>
                    <Pressable onPress={() => toggleFav(item.id)} style={[s.btn, { backgroundColor: '#E11D48' }]}><Text style={s.btnTxt}>Quitar</Text></Pressable>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      )}

      {/* CARRITO Y CUPÓN (HU09, HU10, HU11, HU17) */}
      {vista === 'carrito' && (
        <ScrollView style={s.body}>
          {carrito.length === 0 ? <Text style={s.empty}>Carrito vacío | Total: $0 | Envío: $0</Text> : (
            <>
              {carrito.map((i) => (
                <View key={i.id} style={s.card}>
                  <Text style={s.bold}>{i.nombre}</Text>
                  <Text>{cop(i.precio)} x {i.cantidad} = {cop(i.precio * i.cantidad)}</Text>
                  <View style={[s.row, { marginTop: 8, alignItems: 'center' }]}>
                    <Pressable onPress={() => modCant(i.id, -1)} style={s.qty}><Text>-</Text></Pressable>
                    <Text style={s.bold}>{i.cantidad}</Text>
                    <Pressable onPress={() => modCant(i.id, 1)} style={s.qty}><Text>+</Text></Pressable>
                    <Pressable onPress={() => setCarrito(carrito.filter((x) => x.id !== i.id))} style={[s.btn, { backgroundColor: '#E11D48', marginLeft: 'auto' }]}>
                      <Text style={s.btnTxt}>Quitar</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              <View style={s.card}>
                <Text style={s.bold}>Cupón (BIENVENIDO10):</Text>
                <View style={[s.row, { marginTop: 6 }]}>
                  <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Código" value={cupon} onChangeText={setCupon} />
                  <Pressable onPress={validarCupon} style={s.btn}><Text style={s.btnTxt}>Aplicar</Text></Pressable>
                </View>
              </View>
              <View style={s.card}>
                <Text>Subtotal: {cop(subtotal)}</Text>
                {descActivo && <Text style={{ color: '#059669' }}>Descuento 10%: -{cop(descuento)}</Text>}
                <Text>Envío: {envio === 0 ? 'GRATIS' : cop(envio)}</Text>
                <Text style={s.h2}>Total: {cop(total)}</Text>
                <Pressable onPress={() => setVista('checkout')} style={[s.btn, { marginTop: 10 }]}><Text style={s.btnTxt}>Ir a pagar (Simulado)</Text></Pressable>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* CHECKOUT (HU12, HU13) */}
      {vista === 'checkout' && (
        <ScrollView style={s.body}>
          <Pressable onPress={() => setVista('carrito')}><Text style={s.link}>← Volver</Text></Pressable>
          <View style={s.card}>
            <Text style={s.h2}>Datos de Entrega</Text>
            <TextInput style={s.input} placeholder="Nombre completo" value={cliente.nombre} onChangeText={(t) => setCliente({ ...cliente, nombre: t })} />
            <TextInput style={s.input} placeholder="Teléfono" keyboardType="phone-pad" value={cliente.tel} onChangeText={(t) => setCliente({ ...cliente, tel: t })} />
            <TextInput style={s.input} placeholder="Municipio" value={cliente.mun} onChangeText={(t) => setCliente({ ...cliente, mun: t })} />
            <TextInput style={s.input} placeholder="Dirección" value={cliente.dir} onChangeText={(t) => setCliente({ ...cliente, dir: t })} />
            <Text style={s.bold}>Total a pagar: {cop(total)}</Text>
            <Pressable onPress={confirmarPedido} style={[s.btn, { marginTop: 10 }]}><Text style={s.btnTxt}>Confirmar compra simulada</Text></Pressable>
          </View>
        </ScrollView>
      )}

      {/* HISTORIAL (HU15) */}
      {vista === 'historial' && (
        <ScrollView style={s.body}>
          {historial.length === 0 ? <Text style={s.empty}>No hay pedidos registrados.</Text> : pedidoSel ? (
            <View style={s.card}>
              <Pressable onPress={() => setPedidoSel(null)}><Text style={s.link}>← Volver</Text></Pressable>
              <Text style={s.h2}>{pedidoSel.codigo}</Text>
              <Text>Fecha: {pedidoSel.fecha}</Text>
              <Text>Cliente: {pedidoSel.cliente.nombre} - {pedidoSel.cliente.mun}</Text>
              {pedidoSel.items.map((x) => <Text key={x.id}>• {x.cantidad}x {x.nombre} ({cop(x.precio)})</Text>)}
              <Text>Envío: {cop(pedidoSel.envio)} | Total: {cop(pedidoSel.total)}</Text>
            </View>
          ) : historial.map((p) => (
            <Pressable key={p.codigo} onPress={() => setPedidoSel(p)} style={s.card}>
              <Text style={s.bold}>{p.codigo} - {cop(p.total)}</Text>
              <Text style={{ fontSize: 12 }}>{p.fecha} (Toca para ver detalle)</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* PANEL VENDEDOR (HU18) */}
      {vista === 'admin' && (
        <ScrollView style={s.body}>
          <View style={s.card}>
            <Text style={s.bold}>{editId ? `Editando ${editId}` : 'Nuevo Squishy'}</Text>
            <TextInput style={s.input} placeholder="Nombre" value={formAdmin.nombre} onChangeText={(t) => setFormAdmin({ ...formAdmin, nombre: t })} />
            <TextInput style={s.input} placeholder="Categoría (Mochis, Comida, Animales, Llaveros)" value={formAdmin.categoria} onChangeText={(t) => setFormAdmin({ ...formAdmin, categoria: t })} />
            <TextInput style={s.input} placeholder="Precio COP" keyboardType="numeric" value={formAdmin.precio} onChangeText={(t) => setFormAdmin({ ...formAdmin, precio: t })} />
            <TextInput style={s.input} placeholder="Stock" keyboardType="numeric" value={formAdmin.stock} onChangeText={(t) => setFormAdmin({ ...formAdmin, stock: t })} />
            <TextInput style={s.input} placeholder="Descripción (mín. 15 letras)" value={formAdmin.descripcion} onChangeText={(t) => setFormAdmin({ ...formAdmin, descripcion: t })} />
            <Pressable onPress={guardarAdmin} style={s.btn}><Text style={s.btnTxt}>Guardar producto</Text></Pressable>
          </View>
          {productos.map((p) => (
            <Pressable key={p.id} onPress={() => { setEditId(p.id); setFormAdmin({ nombre: p.nombre, categoria: p.categoria, precio: String(p.precio), stock: String(p.stock), descripcion: p.descripcion }); }} style={s.card}>
              <Text style={s.bold}>{p.id} - {p.nombre}</Text>
              <Text>Precio: {cop(p.precio)} | Stock: {p.stock} (Toca para editar)</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF1F2' },
  header: { backgroundColor: '#831843', padding: 16, paddingTop: 28 },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  sub: { color: '#FBCFE8', fontSize: 12 },
  nav: { flexDirection: 'row', backgroundColor: '#9D174D', padding: 6, justifyContent: 'space-around' },
  tab: { padding: 6, borderRadius: 6 },
  tabOn: { backgroundColor: '#DB2777' },
  tabTxt: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  body: { flex: 1, padding: 12 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FBCFE8', borderRadius: 8, padding: 8, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { backgroundColor: '#FCE7F3', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  chipOn: { backgroundColor: '#DB2777' },
  card: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#FBCFE8' },
  cat: { fontSize: 11, color: '#9D174D', fontWeight: 'bold' },
  bold: { fontWeight: 'bold', fontSize: 15 },
  h2: { fontWeight: 'bold', fontSize: 18, marginVertical: 4 },
  price: { color: '#DB2777', fontWeight: 'bold', fontSize: 15 },
  btn: { backgroundColor: '#DB2777', padding: 9, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  btnOff: { backgroundColor: '#9CA3AF' },
  btnTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  qty: { backgroundColor: '#FCE7F3', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  empty: { textAlign: 'center', color: '#831843', marginTop: 30, fontSize: 15 },
  link: { color: '#DB2777', fontWeight: 'bold', marginBottom: 8 }
});