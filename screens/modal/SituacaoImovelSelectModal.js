import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const SituacaoImovelSelect = ({ onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSituacao, setSelectedSituacao] = useState(null);
  const situacoes = ['Alugado', 'Desocupado', 'Ocupado pelo proprietário'];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (situacao) => {
    setSelectedSituacao(situacao);
    setIsExpanded(false); // Recolhe a lista após a seleção
    onSelect(situacao); // Chama a função passada via props
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label} allowFontScaling={false}>Situação do imóvel</Text>
      
      <TouchableOpacity style={styles.selectBox} onPress={toggleExpand}>
        <Text style={[styles.selectText, !selectedSituacao && styles.placeholderText]} allowFontScaling={false}>
          {selectedSituacao ? selectedSituacao : 'Selecione'}
        </Text>
        <Text style={styles.arrow}>{isExpanded ? '⌃' : '⌵'}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.optionsContainer}>
          {situacoes.map((situacao, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelect(situacao)} style={styles.option}>
              <Text style={styles.optionText} allowFontScaling={false}>{situacao}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2024',
    marginBottom: 5,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#494A50',
  },
  placeholderText: {
    color: '#A9A9A9',
  },
  arrow: {
    color: '#A9A9A9',
    fontSize: 16,
  },
  optionsContainer: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    marginTop: 5,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  optionText: {
    fontSize: 16,
    color: '#1F2024',
  },
});

export default SituacaoImovelSelect;
