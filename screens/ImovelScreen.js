import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Share, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { height, width, width: screenWidth } = Dimensions.get('window');


// codigo do info 

// Mapeamento dos ícones de orientação
const icons = {
    Nascente: require('../assets/icons/nascente.png'),
    Poente: require('../assets/icons/poente.png'),
    Perpendicular: require('../assets/icons/perpendicular.png'),
};

// Função para definir os ícones dos status
const getStatusIcon = (status) => {
    switch (status) {
        case 10:
            return require('../assets/icons/juridico.png');
        case 11:
            return require('../assets/icons/camera.png');
        case 12:
            return require('../assets/icons/doc.png');
        case 13:
            return require('../assets/icons/ok.png');
        case 20:
            return require('../assets/icons/negociacao.png');
        case 21:
            return require('../assets/icons/email.png');
        case 22:
            return require('../assets/icons/doc.png');
        case 23:
            return require('../assets/icons/calculadora.png');
        case 24:
            return require('../assets/icons/dinheiro.png');
        default:
            return require('../assets/icons/default.png'); // Ícone default para status 1-9
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
// codigo do info 
const ImovelScreen = ({ route, navigation }) => {
    const { id, status } = route.params || {};
    const [imovelData, setImovelData] = useState(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        // Chamada para buscar dados do imóvel pela API
        const fetchImovelData = async () => {
            try {
                const response = await axios.get(`https://imogo.juk.re/api/v1/imoveis/${id}`);
                const data = response.data;
                setImovelData(data);
            } catch (error) {
                console.error('Erro ao buscar os dados do imóvel:', error);
            }
        };
        fetchImovelData();
    }, [id]);

    const handleScroll = (event) => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / screenWidth);
        if (slide !== activeSlide) {
            setActiveSlide(slide);
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message:  imovelData.link || 'Visite o nosso site: https://imogo.com.br/' ,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Compartilhado com tipo de atividade
                } else {
                    // Compartilhado sem tipo de atividade
                }
            } else if (result.action === Share.dismissedAction) {
                // Compartilhamento foi cancelado
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    // Formatação de endereço e preços
    const formatEndereco = (imovel) => {
        if (!imovel) return '';
        const { endereco, bairro, cidade, uf } = imovel;
        return `${endereco} | ${bairro} - ${cidade}/${uf}`;
    };

    const formatPreco = (valor) => {
        if (!valor) return 'R$ 0,00';
        return `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Funções de progresso e status
    const { progress, stages, color } = getProgressBar(status);
    const statusDescription = getDescription(status);
    const icon = getStatusIcon(status);

    const toggleDescription = () => setShowFullDescription(!showFullDescription);

    const renderDescription = () => {
        if (!imovelData || !imovelData.descricao_complementar) return null;

        const descriptionLimit = 200;
        const { descricao_complementar } = imovelData;

        if (descricao_complementar.length <= descriptionLimit) {
            return <Text style={styles.description} allowFontScaling={false}>{descricao_complementar}</Text>;
        }

        if (showFullDescription) {
            return (
                <Text style={styles.description} allowFontScaling={false}>
                    {descricao_complementar}
                    <Text style={styles.moreText} onPress={toggleDescription} allowFontScaling={false}> ver menos</Text>
                </Text>
            );
        }

        return (
            <Text style={styles.description} allowFontScaling={false}>
                {descricao_complementar.substring(0, descriptionLimit)}...
                <Text style={styles.moreText} onPress={toggleDescription} allowFontScaling={false}> ver mais</Text>
            </Text>
        );
    };

    if (!imovelData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FB7D10" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View style={styles.carouselContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={styles.carousel}
                    >
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: imovelData.foto_app_capa }} style={styles.image} />
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <Image source={require('../assets/icons/back_white.png')} style={styles.backIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                                <Image source={require('../assets/icons/share.png')} style={styles.shareIcon} />
                            </TouchableOpacity>
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>
                                    {activeSlide + 1}/1
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                {/* Progresso */}
                <View style={styles.section}>
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
                                                    ? color
                                                    : index === progress - 1 && status !== 24 && status !== 13
                                                        ? 'transparent'
                                                        : '#D0D0D0',
                                        },
                                    ]}
                                >
                                    {index === progress - 1 && status !== 24 && status !== 13 && (
                                        <View style={styles.activeProgressSegment}>
                                            <View style={[styles.progressHalf, { backgroundColor: color }]} />
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
                    <Text style={styles.price} allowFontScaling={false}>{formatPreco(imovelData.valor_venda)}</Text>
                    <Text style={styles.location} allowFontScaling={false}>
                        <Ionicons name="location-sharp" color="#FB7D10" size={16} /> {formatEndereco(imovelData)}
                    </Text>
                    <Text style={styles.details} allowFontScaling={false}>Área privativa: {imovelData.area_privativa} m² • Área total: {imovelData.area_total || 'N/A'} m²</Text>
                    <Text style={styles.details} allowFontScaling={false}>Condomínio: {formatPreco(imovelData.valorCondominio)}</Text>
                    <Text style={styles.secondarydetails} allowFontScaling={false}>
                        {imovelData.numero_quartos} quartos | {imovelData.numero_banheiros} banheiros | {imovelData.numero_garagem} vagas de garagem
                    </Text>
                </View>

                {/* Orientação do Sol */}
                <View style={styles.section}>
                    <Text style={styles.label} allowFontScaling={false}>Orientação do sol</Text>
                    <View style={styles.orientationBox}>
                        <Text style={styles.orientationText} allowFontScaling={false}>{imovelData.orientacao_sol}</Text>
                        <Image source={icons[imovelData.orientacao_sol]} style={styles.icon} />
                    </View>
                </View>

                {/* Detalhes do imóvel */}
                <View style={styles.section}>
                    <Text style={styles.label} allowFontScaling={false}>Detalhes do imóvel</Text>
                    <View style={styles.tagContainer}>
                        {imovelData.detalhes_do_imovel.map((item, index) => (
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
                        {imovelData.detalhes_do_condominio.map((item, index) => (
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
                    <Text style={styles.secondarydetails} allowFontScaling={false}>{imovelData.situacao || 'N/A'}</Text>
                </View>

                {/* Formas de pagamento */}
                <View style={styles.section}>
                    <Text style={styles.label} allowFontScaling={false}>Formas de pagamento aceitas</Text>
                    <View style={styles.tagContainer}>
                        {imovelData.formas_pagamento.map((item, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText} allowFontScaling={false}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    // testes
    // Ajuste para o container do carrossel ocupar 100% da largura e altura proporcionais
    carouselContainer: {
        width: screenWidth,  // Garante 100% da largura da tela
        height: screenWidth * 0.75,  // Proporção ajustada
        marginHorizontal: 0,  // Remove margens horizontais
        paddingHorizontal: 0,  // Remove padding horizontal
        marginBottom: 10,
    },

    imageContainer: {

        width: screenWidth,  // Cada imagem vai ocupar 100% da largura da tela
        height: '100%',  // O container da imagem vai ocupar toda a altura do carrossel
        margin: 0,  // Remove qualquer margem
        padding: 0,  // Remove qualquer padding
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',  // Garante que a imagem preencha o container sem ser cortada
    },

    carousel: {
        flex: 1,
        backgroundColor: "black"
    },


    // testes

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

    // detalhes
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2024',
        marginBottom: Platform.select({
            ios: 10,
            android: 8,
            web: 8,
        }),
    },
    location: {
        fontSize: 16,
        color: '#FB7D10',
        marginBottom: Platform.select({
            ios: 10,
            android: 8,
            web: 8,
        }),
    },
    details: {
        fontSize: 16,
        color: '#1F2024',
        marginBottom: Platform.select({
            ios: 5,
            android: 4,
            web:4
        }),
    },
    secondarydetails: {
        fontSize: 16,
        color: '#71727A',
        marginBottom: Platform.select({
            ios: 5,
            android: 4,
            web:4
        }),
    },
    // Para o conteúdo ocupar 90% e ficar centralizado, ajuste o section
    section: {
        width: '90%',  // Ocupa 90% da largura da tela
        alignSelf: 'center',  // Centraliza o conteúdo sem usar marginLeft
        marginBottom: Platform.select({
            ios: width * 0.05,
            android: width * 0.06,
            web: width * 0.06,
        }),
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    // Orientação do Sol - Ajustes para Web
    orientationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FB7D10',
        padding: Platform.select({
            ios: 15,
            android: 12,
            web: 20, // Aumenta o padding para web
        }),
        borderRadius: 25, // Mantém o arredondado
        marginBottom: 20, // Espaçamento extra abaixo do campo
    },
    orientationText: {
        fontSize: Platform.select({
            ios: 16,
            android: 16,
            web: 18, // Aumenta o tamanho da fonte para web
        }),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: 10, // Espaçamento entre o texto e o ícone
    },
    icon: {
        width: 30,
        height: 30,
        tintColor: '#FFFFFF',
        marginLeft: 10, // Espaçamento entre o ícone e o texto
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

    // fim detalhes

    // estilo do avaliador
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: Platform.select({
            android: StatusBar.currentHeight + 1, // Para Android
            ios: 4, // Para iOS
            web: 20, // Maior espaçamento no topo para Web
        }),
    },
    // estilo das fotos
    container: {
        backgroundColor: '#F5F5F5',
    },

    backButton: {
        position: 'absolute',
        top: 20,
        left: 15,
        zIndex: 2,
    },
    backIcon: {
        width: 24, // Ajusta a largura da seta
        height: 24, // Ajusta a altura da seta
    },
    shareButton: {
        position: 'absolute',
        top: 20,
        right: 15,
        zIndex: 2,
    },
    shareIcon: {
        width: 24,
        height: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: '#FFFFFF', // Fundo branco
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerText: {
        color: '#000', // Texto preto
        fontSize: 14,
    },
});

export default ImovelScreen;
