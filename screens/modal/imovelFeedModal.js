import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageCarousel from './ImageCarouselModal';
const { width, height } = Dimensions.get('window');

// Mapeamento dos ícones de orientação
const icons = {
    Nascente: require('../../assets/icons/nascente.png'),
    Poente: require('../../assets/icons/poente.png'),
    Perpendicular: require('../../assets/icons/perpendicular.png'),
};

// Função para definir os ícones dos status
const getStatusIcon = (status) => {
    switch (status) {
        case 10:
            return require('../../assets/icons/juridico.png');
        case 11:
            return require('../../assets/icons/camera.png');
        case 12:
            return require('../../assets/icons/doc.png');
        case 13:
            return require('../../assets/icons/ok.png');
        case 20:
            return require('../../assets/icons/negociacao.png');
        case 21:
            return require('../../assets/icons/email.png');
        case 22:
            return require('../../assets/icons/doc.png');
        case 23:
            return require('../../assets/icons/calculadora.png');
        case 24:
            return require('../../assets/icons/dinheiro.png');
        default:
            return require('../../assets/icons/default.png'); // Ícone default para status 1-9
    }
};

// Função para definir as cores e progresso com base no status
const getProgressBar = (status) => {
    let stages = status >= 10 && status <= 19 ? 3 : 5; // 3 etapas para 10-19, 5 para 1-9 e 20-29
    let progress;

    // Ajuste da sequência do cadastro para status 1 a 5
    if (status >= 1 && status <= 5) {
        progress = status; // Progresso é baseado no próprio status
    } else if (status === 24 || status === 13) {
        progress = stages; // Completar todos os estágios para status 24 e 13
    } else {
        progress = Math.min(stages, (status % 10) + 1); // Progresso conforme o ID
    }

    let color = status >= 1 && status <= 9 ? '#8F9098' : '#FB7D10'; // Cor cinza para 1-9 e laranja para 10-29

    return { progress, stages, color };
};

// Função para definir a descrição com base no status
const getDescription = (status) => {
    if (status >= 1 && status <= 9) {
        return 'Finalize o cadastro do imóvel';
    } else if (status >= 10 && status <= 19) {
        switch (status) {
            case 10:
                return 'Em análise jurídica';
            case 11:
                return 'Agendar visita fotográfica';
            case 12:
                return 'Publicando anúncio';
            case 13:
                return 'Anúncio publicando';
            default:
                return 'Em progresso';
        }
    } else if (status >= 20 && status <= 29) {
        switch (status) {
            case 20:
                return 'Aguardando agendamento de visita';
            case 21:
                return 'Aguardando assinatura da carta proposta';
            case 22:
                return 'Aguardando assinatura do contrato de corretagem';
            case 23:
                return 'Em análise financeira';
            case 24:
                return 'Vendido';
            default:
                return 'Em progresso';
        }
    }
    return 'Status desconhecido';
};

const FeedModal = ({
    
}) => {
    const orientacao = 'Perpendicular';
    const descricao = '';
    const preco = 'R$ 0;00';
    const localizacao = '';
    const areaPrivativa = '';
    const areaTotal = '';
    const condominio = 'R$ 0;00';
    const detalhesImovel = [];
    const detalhesCondominio = [];
    const situacao = '';
    const formasPagamento = [];
    const status = 1; // Colocando um valor padrão para o status

    const [showFullDescription, setShowFullDescription] = useState(false);
    const descriptionLimit = 200; // Limite de caracteres antes de mostrar o "ver mais"

    // Usando as funções de progresso e status
    const { progress, stages, color } = getProgressBar(status);
    const statusDescription = getDescription(status);
    const icon = getStatusIcon(status);

    const toggleDescription = () => setShowFullDescription(!showFullDescription);

    const renderDescription = () => {
        if (descricao.length <= descriptionLimit) {
            return <Text style={styles.description} allowFontScaling={false}>{descricao}</Text>;
        }

        if (showFullDescription) {
            return (
                <Text style={styles.description} allowFontScaling={false}>
                    {descricao}
                    <Text style={styles.moreText} onPress={toggleDescription} allowFontScaling={false}> ver menos</Text>
                </Text>
            );
        }

        return (
            <Text style={styles.description} allowFontScaling={false}>
                {descricao.substring(0, descriptionLimit)}...
                <Text style={styles.moreText} onPress={toggleDescription} allowFontScaling={false}> ver mais</Text>
            </Text>
        );
    };

    return (
        <ScrollView style={styles.container}>
        
            <View style={styles.section}>
                {/* Progresso */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        {[...Array(stages)].map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.progressSegment,
                                    {
                                        backgroundColor:
                                            index < progress - 1 || (status === 24 || status === 13)
                                                ? color // Estágios anteriores completos ou progresso completo para status 13/24
                                                : index === progress - 1 && status !== 24 && status !== 13
                                                    ? 'transparent' // Barra ativa será dividida em duas cores, exceto para 13/24
                                                    : '#D0D0D0', // Estágios futuros vazios
                                    },
                                ]}
                            >
                                {index === progress - 1 && status !== 24 && status !== 13 && (
                                    <View style={styles.activeProgressSegment}>
                                        {/* Metade preenchida com a cor ativa */}
                                        <View style={[styles.progressHalf, { backgroundColor: color }]} />
                                        {/* Metade preenchida com a cor inativa */}
                                        <View style={[styles.progressHalf, { backgroundColor: '#D0D0D0' }]} />
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Ícone de Status */}
                    {icon && <Image source={icon} style={styles.statusIcon} />}
                </View>

                {/* Descrição do Progresso */}
                <Text style={[styles.descriptionText, { color: status >= 10 ? '#FB7D10' : '#8F9098' }]} allowFontScaling={false}>
                    {statusDescription}
                </Text>
            </View>

            {/* Preço e localização */}
            <View style={styles.section}>
                <Text style={styles.price} allowFontScaling={false}>{preco}</Text>
                <Text style={styles.location} allowFontScaling={false}>
                    <Ionicons name="location-sharp" color="#FB7D10" size={16} /> {localizacao}
                </Text>
                <Text style={styles.details} allowFontScaling={false}>Área privativa: {areaPrivativa} m² • Área total: {areaTotal} m²</Text>
                <Text style={styles.details} allowFontScaling={false}>Condomínio: {condominio}</Text>
                <Text style={styles.secondarydetails} allowFontScaling={false}>3 quartos | 3 banheiros | 2 vagas de garagem</Text>
            </View>

            {/* Orientação do Sol */}
            <View style={styles.section}>
                <Text style={styles.label} allowFontScaling={false}>Orientação do sol</Text>
                <View style={styles.orientationBox}>
                    <Text style={styles.orientationText} allowFontScaling={false}>{orientacao}</Text>
                    <Image source={icons[orientacao]} style={styles.icon} />
                </View>
            </View>

            {/* Detalhes do imóvel */}
            <View style={styles.section}>
                <Text style={styles.label} allowFontScaling={false}>Detalhes do imóvel</Text>
                <View style={styles.tagContainer}>
                    {detalhesImovel.map((item, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText} allowFontScaling={false}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Detalhes do condomínio */}
            <View style={styles.section}>
                <Text style={styles.label} allowFontScaling={false}>Detalhes do condomínio</Text>
                <View style={styles.tagContainer}>
                    {detalhesCondominio.map((item, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText} allowFontScaling={false}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Descrição complementar */}
            <View style={styles.section}>
                <Text style={styles.label} allowFontScaling={false}>Descrição complementar</Text>
                {renderDescription()}
            </View>

            {/* Situação */}
            <View style={styles.section}>
                <Text style={styles.label} allowFontScaling={false}>Situação</Text>
                <Text style={styles.secondarydetails} allowFontScaling={false}>{situacao}</Text>
            </View>

            {/* Formas de pagamento */}
            <View style={styles.section}>
                <Text style={styles.label} allowFontScaling={false}>Formas de pagamento aceitas</Text>
                <View style={styles.tagContainer}>
                    {formasPagamento.map((item, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText} allowFontScaling={false}>{item}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Parte do progresso:
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    progressBar: {
        flexDirection: 'row',
        flex: 1,
    },
    progressSegment: {
        height: 8,
        flex: 1,
        marginHorizontal: 2,
        borderRadius: 4,
    },
    activeProgressSegment: {
        flexDirection: 'row',
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden', // Para que as metades fiquem dentro da barra
    },
    progressHalf: {
        flex: 1,
        height: '100%',
    },
    statusIcon: {
        width: 34,
        height: 34,
        marginLeft: width * 0.02,
    },
    descriptionText: {
        fontSize: width * 0.035,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: height * 0.02,
    },

    // Fim parte do progresso

    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: Platform.select({
            ios: width * 0.05,
            android: width * 0.05,
        }),
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: Platform.select({
            ios: 10,
            android: 8,
        }),
    },
    location: {
        fontSize: 16,
        color: '#FB7D10',
        marginBottom: Platform.select({
            ios: 10,
            android: 8,
        }),
    },
    details: {
        fontSize: 16,
        color: '#1F2024',
        marginBottom: Platform.select({
            ios: 5,
            android: 4,
        }),
    },
    secondarydetails: {
        fontSize: 16,
        color: '#71727A',
        marginBottom: Platform.select({
            ios: 5,
            android: 4,
        }),
    },
    section: {
        marginBottom: Platform.select({
            ios: width * 0.05,
            android: width * 0.06,
        }),
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    orientationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FB7D10',
        padding: Platform.select({
            ios: 15,
            android: 12,
        }),
        borderRadius: 25, // Mais arredondado
    },
    orientationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#FFFFFF', // Garantindo que os ícones fiquem brancos
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#E9E9E9',
        paddingVertical: Platform.select({
            ios: 5,
            android: 4,
        }),
        paddingHorizontal: 10,
        borderRadius: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    tagText: {
        fontSize: 14,
        color: '#1F2024',
    },
    description: {
        fontSize: 16,
        color: '#71727A',
    },
    moreText: {
        color: '#FB7D10',
        fontWeight: 'bold',
    },
});

export default FeedModal;
