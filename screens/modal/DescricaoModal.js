import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

const DescricaoModal = ({ isVisible, toggleModal, descricao, setDescricao }) => {
  const [descricaoInput, setDescricaoInput] = useState(descricao || '');

  const salvarDescricao = () => {
    setDescricao(descricaoInput);
    toggleModal();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <TouchableOpacity style={styles.modalContainer} onPress={toggleModal} activeOpacity={1}>
        <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle} allowFontScaling={false}>Descrição complementar</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText} allowFontScaling={false}>X</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText} allowFontScaling={false}>
            Descreva aqui da melhor forma possível as características únicas do seu imóvel que faltaram anteriormente.
          </Text>

          <TextInput
            style={styles.input}
            multiline
            maxLength={200}
            value={descricaoInput}
            onChangeText={setDescricaoInput}
            placeholder="Digite a descrição aqui..."
            placeholderTextColor="#D3D3D3"
            allowFontScaling={false}
          />

          <Text style={styles.charCount} allowFontScaling={false}>
            {descricaoInput.length}/200
          </Text>

          <TouchableOpacity style={styles.saveButton} onPress={salvarDescricao}>
            <Text style={styles.saveButtonText} allowFontScaling={false}>Salvar</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
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
    width: Platform.select({ ios: '85%', android: '90%' , web: '90%'}),
    alignItems: 'center',
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    position: 'relative',
    right: 0,
  },
  closeButtonText: {
    fontSize: Platform.select({ ios: 18, android: 16 }),
    color: '#000',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: Platform.select({ ios: 18, android: 16 }),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  helperText: {
    fontSize: Platform.select({ ios: 14, android: 13 }),
    color: '#7A7A7A',
    textAlign: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    height: 120,
    fontSize: Platform.select({ ios: 16, android: 15 }),
    textAlignVertical: 'top',
    backgroundColor: '#FFF',
  },
  charCount: {
    alignSelf: 'flex-start',
    fontSize: Platform.select({ ios: 12, android: 11 }),
    color: '#7A7A7A',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#FF7A00',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: Platform.select({ ios: 16, android: 15 }),
    fontWeight: 'bold',
  },
};

export default DescricaoModal;
