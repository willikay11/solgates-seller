import React from 'react';
import Divider from '@/components/ui/divider';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Platform, BackHandler } from 'react-native';
import Icon from "react-native-remix-icon";
import Button from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/ui/input';
import { router } from 'expo-router';
import { User } from '@/types/user';
import { useWallet, useWithdraw } from '@/hooks/useWallet';
import numeral from 'numeral';
import { useDeleteProduct, useProducts } from '@/hooks/useProduct';
import { Product } from '@/types/product';
import { Meta } from '@/types/meta';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';
import Share from 'react-native-share'
import { useLogout } from '@/hooks/useAuth';

export default function Dashboard() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [isWalletAmountVisible, setIsWalletAmountVisible] = useState(false);
    const [logoutVisible, setLogoutVisible] = useState(false);
    const { data: wallet } = useWallet();
    const [page, setPage] = useState(1);
    const [user, setUser] = useState<User | null>(null);
    const [amount, setAmount] = useState('');
    const { data: products, isFetching } = useProducts(user?.storeId, page);
    const { mutate: logout, isPending: isLoggingOut, isSuccess: isLogoutSuccess, isError: isLogoutError } = useLogout();
    const { mutate: deleteProduct, isPending: isDeleting, isSuccess: isDeleteSuccess, isError: isDeleteError } = useDeleteProduct();
    const { mutate: withdraw, isPending: isWithdrawing, isSuccess: isWithdrawSuccess, isError: isWithdrawError } = useWithdraw();

    const handleWithdraw = () => {
        withdraw({ amount: parseFloat(amount), phoneNumber: user?.phoneNumber ?? '' });
    }

    const shareProduct = async ({
        message,
        imageUrl,
        title,
      }: {
        message: string;
        imageUrl: string;
        title: string;
      }) => {
        try {
          // Step 1: Download image to local cache
          const localUri = FileSystem.cacheDirectory + 'shared-image.jpg';
          const { uri } = await FileSystem.downloadAsync(imageUrl, localUri);

          if (Platform.OS === 'android') {
            const shareOptions = {
                title: title,
                message: message,
                url: 'file://' + uri.replace('file://', ''), // ensure proper format
                type: 'image/jpeg',
                failOnCancel: false,
              };

              // Step 2a: Android — Use native share + file URI + message
              await Share.open(shareOptions);
          } else {
            // Step 2b: iOS — Share only the image (text won't be shown)
            // await Sharing.shareAsync(downloadResult.uri, {
            //   dialogTitle: title,
            //   UTI: 'public.jpeg',
            //   mimeType: 'image/jpeg',
            // });
          }
        } catch (error: any) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error?.message ?? 'An error occurred',
          });
        }
      };

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

    useEffect(() => {
        setMenuVisible(false);
        if (isDeleteSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Product deleted successfully',
                text2: `The product has been removed from your stock`,
            });
        } else if (isDeleteError) {
            Toast.show({
                type: 'error',
                text1: 'Product deletion failed',
                text2: 'Please try again',
            });
        }
        setSelectedProduct(null);
    }, [isDeleteSuccess, isDeleteError]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            setLogoutVisible(true);
            return true; // Prevent default behavior
        });

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (isLogoutSuccess) {
            router.replace('/(auth)');
        } else if (isLogoutError) {
            Toast.show({ type: 'error', text1: 'Logout failed', text2: 'Please try again' });
        }
    }, [isLogoutSuccess, isLogoutError]);

    const hasMeta = (products: any): products is { meta: Meta } => {
        return products && typeof products.meta === 'object' && 'total' in products.meta;
    };

    const productsList = products?.pages.flatMap(page => Array.isArray(page.products) ? page.products : []) ?? [];
    
    return (
        <View style={styles.scrollContainer}>
            <Modal modalVisible={menuVisible} setModalVisible={setMenuVisible} title="Menu" >
                <View>
                    <TouchableOpacity style={styles.modalItem} onPress={() => {
                        setMenuVisible(false);
                        shareProduct({ 
                            title: `${selectedProduct?.name} - ${selectedProduct?.size.name} on solgates`,
                            message: `Buy ${selectedProduct?.name} | ${selectedProduct?.genders.map(gender => gender.name).join(', ')} | size: ${selectedProduct?.size.name} on solgates, tap https://staging.solgates.com/product/${selectedProduct?.id}`,
                            imageUrl: selectedProduct?.productImageUrls[0].url ?? '' });
                    }}>
                        <Icon name="share-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Share Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItem}>
                        <Icon name="file-copy-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Copy Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItem} onPress={() => {
                        if (selectedProduct) {
                            setMenuVisible(false);
                            router.push(`/products/edit/${selectedProduct.id}`);
                        }
                    }}>
                        <Icon name="repeat-2-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>Edit Item</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItem} onPress={() => {
                        if (selectedProduct) {
                            deleteProduct(selectedProduct.id)
                        }
                    }}>
                        <Icon name="delete-bin-line" size={14} color="#1F2937" />
                        <Text style={styles.modalItemText}>{isDeleting ? 'Removing...' : 'Remove Item'}</Text>
                        {isDeleting && <ActivityIndicator size="small" color="#1F2937" />}
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

            <Modal modalVisible={logoutVisible} setModalVisible={setLogoutVisible} title="Logout" >
                <View style={styles.logoutContainer}>
                    <Text style={styles.logoutText}>Are you sure you want to logout?</Text>
                    <Button variant="primary" onPress={() => logout()} loading={isLoggingOut} disabled={isLoggingOut}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </Button>
                </View>
            </Modal>

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>{user?.storeName}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <Button variant="icon" onPress={() => setLogoutVisible(true)} style={[styles.iconButton, {height: 40, width: 40, backgroundColor: '#FEE2E2'}]}>
                            <Icon name="logout-circle-r-line" size={20} color="#EF4444" />
                        </Button>
                        <View style={styles.headerIconContainer}>
                            <Icon name="notification-3-line" size={20} color="#EA580C" />
                        </View>
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
                    <Button variant="icon" onPress={() => shareProduct({
                        title: `View my shop ${user?.storeName} on solgates`,
                        message: `View my shop ${user?.storeName} on solgates, tap https://staging.solgates.com/collection?store=${user?.storeName}`,
                        imageUrl: 'https://res.cloudinary.com/dp1buffig/image/upload/v1732653215/xgx78grvpmffpoznozow.jpg'
                    })} style={styles.iconButton}>
                        <Icon name="share-line" size={16} color="#ffffff" />
                    </Button>
                </View>
                </View>
                <Divider width="100%" height={1} color="#F3F4F6" />
                <View style={styles.productContainer}>
                <Text style={styles.productHeaderText}>Your Stock ({productsList.length} Products)</Text>
                <View style={styles.productListContainer}>
                    <FlatList
                        data={productsList}
                        keyExtractor={(_, index) => index.toString()}
                        onEndReached={() => {
                            if (hasMeta(products) && products.meta.currentPage < products.meta.lastPage) {
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
                                    <TouchableOpacity onPress={() => {
                                            setMenuVisible(true)
                                            setSelectedProduct(item)
                                        }}>
                                        <Icon name="more-2-fill" size={20} color="#EA580C" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        )}
                    />
                </View>
            </View>
        </View>
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
        fontWeight: '400',
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
    logoutContainer: {
        flexDirection: 'column',
        gap: 5
    },
    logoutText: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '400',
        color: '#1F2937',
        marginBottom: 10
    }
})