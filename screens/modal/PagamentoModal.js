import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions,Platform } from 'react-native';

const { width } = Dimensions.get('window');

const PagamentoModal = ({ isVisible, toggleModal, formasPagamento, setFormasPagamento }) => {
  const formasDisponiveis = ['À vista', 'FGTS', 'Financiamento', 'Permuta'];

  // Função para adicionar ou remover formas de pagamento
  const toggleFormaPagamento = (forma) => {
    if (formasPagamento.includes(forma)) {
      setFormasPagamento(formasPagamento.filter((item) => item !== forma));
    } else {
      setFormasPagamento([...formasPagamento, forma]);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle} allowFontScaling={false}>Formas de pagamento aceitas</Text>
          <Text style={styles.modalSubtitle} allowFontScaling={false}>Selecione uma ou mais opções aceitas pelo proprietário</Text>
          <ScrollView style={styles.scrollView}>
            {formasDisponiveis.map((forma, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleFormaPagamento(forma)}
                style={[
                  styles.formaOption,
                  formasPagamento.includes(forma) && styles.selectedOption,
                ]}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.formaOptionText,
                    formasPagamento.includes(forma) && styles.selectedOptionText,
                  ]}
                >
                  {forma}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={toggleModal} style={styles.saveButton}>
            <Text style={styles.saveButtonText} allowFontScaling={false}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    height: '50%',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  modalTitle: {
    fontSize: Platform.select({ ios: width * 0.045, android: width * 0.043 }),
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2024',
  },
  modalSubtitle: {
    fontSize: Platform.select({ ios: width * 0.035, android: width * 0.033 }),
    color: '#7A7A7A',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
  formaOption: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#FF7A00',
    borderColor: '#FF7A00',
  },
  formaOptionText: {
    fontSize: Platform.select({ ios: width * 0.04, android: width * 0.038 }),
    color: '#494A50',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#FFF',
  },
  saveButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: Platform.select({ ios: width * 0.04, android: width * 0.038 }),
    color: '#FFF',
    fontWeight: 'bold',
  },
};

export default PagamentoModal;
