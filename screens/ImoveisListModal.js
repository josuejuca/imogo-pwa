import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios'; // Importando axios
import ImovelCard from './ImovelCardModal';

const ImoveisList = ({ usuario_id, navigation, status_user }) => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para controlar o pull to refresh

  // Função para buscar os imóveis do usuário
  const fetchImoveis = async () => {
    try {
      const response = await axios.get(`https://imogo.juk.re/api/v1/usuarios/${usuario_id}/imoveis?skip=0&limit=100`);
      const fetchedImoveis = response.data.map((imovel) => ({
        id: imovel.id,
        usuario_id: imovel.usuario_id,
        status: imovel.status, // Agora estamos usando IdStatus para o status numérico
        imagem: imovel.foto_app_capa,
        status_user: status_user,
        valor: imovel.valor_venda ? formatCurrency(imovel.valor_venda) : 'Valor não informado',
        localizacao: imovel.cidade && imovel.uf ? `${imovel.endereco} | ${imovel.bairro} - ${imovel.cidade}/${imovel.uf}` : 'Finalize o Cadastro',
      }));
      setImoveis(fetchedImoveis);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log()

  // Função para formatar o valor no formato de moeda brasileira
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  // Função chamada ao puxar para baixo a lista (refresh)
  const onRefresh = async () => {
    setRefreshing(true); // Ativa o estado de refreshing
    await fetchImoveis(); // Recarrega os imóveis
    setRefreshing(false); // Desativa o estado de refreshing
  };

  // Hook para buscar os imóveis quando o componente é montado
  useEffect(() => {
    fetchImoveis();
  }, [usuario_id]);

  const renderImovel = ({ item }) => (
    <ImovelCard
      imovel={item}
      onPress={() => navigation.navigate('DetalhesImovel', { imovelId: item.id })}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FB7D10" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {imoveis.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum imóvel encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={imoveis}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderImovel}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ImoveisList;
