import React from 'react';
import Divider from '@/components/ui/divider';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import Icon from "react-native-remix-icon";
import Button from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/ui/input';
import { router } from 'expo-router';
import { User } from '@/types/user';
import { useWallet, useWithdraw } from '@/hooks/useWallet';
import numeral from 'numeral';
import { useProducts } from '@/hooks/useProduct';
import { Product } from '@/types/product';
import { Meta } from '@/types/meta';
import Toast from 'react-native-toast-message';

export default function Dashboard() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [isWalletAmountVisible, setIsWalletAmountVisible] = useState(false);
    const { data: wallet } = useWallet();
    const [productList, setProductList] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [user, setUser] = useState<User | null>(null);
    const [amount, setAmount] = useState('');
    const { data: products, isFetching } = useProducts(user?.storeId, page);
    const { mutate: withdraw, isPending: isWithdrawing, isSuccess: isWithdrawSuccess, isError: isWithdrawError } = useWithdraw();

    const handleWithdraw = () => {
        withdraw({ amount: parseFloat(amount), phoneNumber: user?.phoneNumber ?? '' });
    }

    useEffect(() => {
        if (isWithdrawSuccess) {
            setWithdrawVisible(false);
            Toast.show({
                type: 'success',
                text1: 'Cash Withdrawal successful',
                text2: `Your withdrawal of KES ${numeral(amount).format('0,0.00')} to mobile number ${user?.phoneNumber} was processed successfully`,
            });
            setAmount('');
        } else if (isWithdrawError) {
            Toast.show({
                type: 'error',
                text1: 'Withdrawal failed',
                text2: 'Please try again',
            });
        }
    }, [isWithdrawSuccess, isWithdrawError]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Failed to load user:', error);
            }
        };

        fetchUser();
    }, []);

    const isProductArray = (products: any): products is Product[] => {
        return Array.isArray(products);
    };

    const hasMeta = (products: any): products is { meta: Meta } => {
        return products && typeof products.meta === 'object' && 'total' in products.meta;
    };

    useEffect(() => {
        if (isProductArray(products?.products)) {
            setProductList([...productList, ...products.products]);
        }
    }, [products]);
    
    return (
        <>
            <Modal modalVisible={menuVisible} setModalVisible={setMenuVisible} title="Menu" >
                <View>
                    <TouchableOpacity style={styles.modalItem}>
                        <Icon name="share-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Share Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItem}>
                        <Icon name="file-copy-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Copy Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItem}>
                        <Icon name="repeat-2-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Repost</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItem}>
                        <Icon name="delete-bin-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Delete Item</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal modalVisible={withdrawVisible} setModalVisible={setWithdrawVisible} title="Withdraw Cash" >
                <View style={styles.withdrawContainer}>
                    <Text style={styles.withdrawText}>Enter the number you wish to receive the money on.</Text>
                    <Text style={styles.withdrawText}>
                        <Text style={styles.withdrawTextBold}>NOTE:</Text> Transaction cost of KES 20.00 will be charged.
                    </Text>
                    <View style={styles.withdrawTextContainer}>
                        <Text style={styles.withdrawText}><Text style={styles.withdrawTextBold}>Withdrawal Number:</Text> +{user?.phoneNumber}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Input prefixComponent={<Icon name="hand-coin-line" size={14} color="#10B981" />} placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" /> 
                    </View>
                    <View style={styles.walletBalanceContainer}>
                        <Text style={styles.walletModalBalanceText}>Wallet Balance: KES {numeral(wallet?.availableBalance).format('0,0.00')}</Text>
                    </View>
                    <Button variant="primary" onPress={handleWithdraw} loading={isWithdrawing} disabled={isWithdrawing}>
                        <Text style={styles.buttonText}>Withdraw Cash</Text>
                    </Button>
                </View>
            </Modal>
            <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{user?.storeName}</Text>
                <View style={styles.headerIconContainer}>
                    <Icon name="notification-3-line" size={20} color="#EA580C" />
                </View>
            </View>
            <Divider width={12} height={2} />
            <View style={styles.walletContainer}>
                <Text style={styles.contentHeaderText}>Wallet Balance</Text>
                <View style={styles.dashboardWalletBalanceContainer}>
                    {
                        isWalletAmountVisible ? (
                            <Text style={styles.walletBalanceText}>KES {numeral(wallet?.availableBalance).format('0,0.00')}</Text>
                        ) : (
                            <Text style={styles.walletBalanceText}>********</Text>
                        )
                    }
                    <TouchableOpacity onPress={() => setIsWalletAmountVisible(!isWalletAmountVisible)}>
                        {isWalletAmountVisible ? <Icon name="eye-line" size={20} color="#1F2937" /> : <Icon name="eye-close-line" size={20} color="#1F2937" />}
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.actionContainer}>
                <Button variant="primary" onPress={() => router.push('/products/add')} style={styles.primaryButton}>
                    <View style={styles.buttonContent}>
                        <Icon name="add-line" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>New Product</Text>
                    </View>
                </Button>
                <Button variant="secondary" onPress={() => setWithdrawVisible(true)} style={styles.secondaryButton}>
                    <View style={styles.buttonContent}>
                        <Icon name="arrow-left-down-line" size={20} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Withdraw Cash</Text>
                    </View>
                </Button>
                <Button variant="icon" onPress={() => {}} style={styles.iconButton}>
                    <Icon name="share-line" size={16} color="#ffffff" />
                </Button>
            </View>
            </View>
            <Divider width="100%" height={1} color="#F3F4F6" />
            <View style={styles.productContainer}>
                <Text style={styles.productHeaderText}>Your Stock ({hasMeta(products) ? products.meta.total : 0} Products)</Text>
                <View style={styles.productListContainer}>
                    <FlatList
                        data={productList}
                        keyExtractor={(_, index) => index.toString()}
                        onEndReached={() => {
                            if (hasMeta(products) && products.meta.currentPage < products.meta.lastPage) {
                                console.log('current page', products.meta.currentPage);
                                console.log('last page', products.meta.lastPage);
                                setPage(products.meta.currentPage + 1);
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => {
                            if (isFetching) {
                                return (
                                    <View style={styles.footerContainer}>
                                        <ActivityIndicator size="large" color="#EA580C" />
                                    </View>
                                )
                            }
                            return null;
                        }}
                        renderItem={({ item }: { item: Product }) => (
                            <View style={styles.productItem}>
                            <Image source={{ uri: item.productImageUrls[0].url }} style={styles.productImage} />
                            <View style={styles.productItemTextContainerLeft}>
                                <View style={styles.productItemTextContainer}>
                                    <Text style={styles.productItemText}>{item.name}</Text>
                                    <Text style={styles.productItemTextDescription}>{item.size.name} | {item.genders.map(gender => gender.name).join(', ')}</Text>
                                    <Text style={styles.productItemText}>KES {numeral(item.price).format('0,0.00')}</Text>
                                </View>
                                <View style={styles.productItemActionContainer}>
                                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                                        <Icon name="more-2-fill" size={20} color="#EA580C" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        )}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({  
    scrollContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        padding: 20,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    headerText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937'
    },
    headerIconContainer: {
        marginRight: 10,
        backgroundColor: '#FFF7ED',
        borderRadius: '50%',
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    walletContainer: {
        marginTop: 10
    },
    contentHeaderText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280'
    },
    walletBalanceText: {
        fontSize: 30,
        fontWeight: '800',
        color: '#1F2937'
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    primaryButton: {
        marginRight: 5,
        height: 45,
        borderRadius: 35
    },
    secondaryButton: {
        height: 45,
        borderRadius: 35
    },
    iconButton: {
        marginLeft: 5,
        backgroundColor: '#3B82F6',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    productContainer: {
        padding: 20,
        backgroundColor: 'white',
    },
    productHeaderText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937'
    },
    productListContainer: {
        marginTop: 10,
        gap: 20,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    productItemTextContainer: {
        flexDirection: 'column',
        gap: 5
    },
    productItemTextContainerLeft: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'space-between',
        flex: 1
    },
    productItemText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937'
    },
    productItemTextDescription: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280'
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10
    },
    productItemActionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 5
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 10
    },
    modalItemText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#1F2937'
    },
    withdrawContainer: {
        flexDirection: 'column',
        gap: 5
    },
    withdrawTextContainer: {
        marginTop: 10
    },
    withdrawText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1F2937'
    },
    withdrawTextBold: {
        fontWeight: 'bold',
        color: '#1F2937'
    },
    inputContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    dashboardWalletBalanceContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10
    },
    walletBalanceContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'flex-end'
    },
    walletModalBalanceText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
    },
    footerContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
})