import React from 'react';
import Divider from '@/components/ui/divider';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform, BackHandler, Animated, Easing, RefreshControl } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from "react-native-remix-icon";
import Button from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/ui/input';
import { router, usePathname } from 'expo-router';
import { User } from '@/types/user';
import { useWallet, useWithdraw } from '@/hooks/useWallet';
import * as Sharing from 'expo-sharing';
import { useGetBrands, useGetCategories, useGetCategoryTypes, useGetColours, useGetConditions, useGetGenders, useGetSizes, useUpdateProduct } from "@/hooks/useProduct";
import numeral from 'numeral';
import { useDeleteProduct, useProducts } from '@/hooks/useProduct';
import { Product } from '@/types/product';
import { Meta } from '@/types/meta';
import Toast from 'react-native-toast-message';
import * as FileSystem from 'expo-file-system';
import Share from 'react-native-share'
import { useLogout } from '@/hooks/useAuth';

export default function Dashboard() {
    const _ = useGetGenders();
    const __ = useGetCategories(); 
    const ___ = useGetBrands();
    const ____ = useGetColours();
    const _____ = useGetCategoryTypes();
    const ______ = useGetSizes();
    const _______ = useGetConditions();

    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [isWalletAmountVisible, setIsWalletAmountVisible] = useState(false);
    const [logoutVisible, setLogoutVisible] = useState(false);
    const { data: wallet } = useWallet();
    const [page, setPage] = useState(1);
    const [user, setUser] = useState<User | null>(null);
    const [productsList, setProductsList] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const [amount, setAmount] = useState('');
    const { data: products, isFetching, refetch, isRefetching } = useProducts(user?.storeId, page, debouncedSearchQuery);
    const { mutate: logout, isPending: isLoggingOut, isSuccess: isLogoutSuccess, isError: isLogoutError } = useLogout();
    const { mutate: deleteProduct, isPending: isDeleting, isSuccess: isDeleteSuccess, isError: isDeleteError } = useDeleteProduct();
    const { mutate: withdraw, isPending: isWithdrawing, isSuccess: isWithdrawSuccess, isError: isWithdrawError } = useWithdraw();
    const { mutate: updateProduct, isPending: isUpdatingProduct, isSuccess: isUpdateProductSuccess, isError: isUpdateProductError } = useUpdateProduct();
    const pathname = usePathname();
    const fadeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

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
            await Sharing.shareAsync(uri, {
              dialogTitle: title,
              UTI: 'public.jpeg',
              mimeType: 'image/jpeg',
            });
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
        setUpdatingItemId(null)
        if (isUpdateProductSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Congratulations',
                text2: `The product has marked as sold`,
            });
        } else if(isUpdateProductError) {
            Toast.show({
                type: 'error',
                text1: 'Product sold failed',
                text2: 'Please try again',
            });
        }
    }, [isUpdateProductSuccess, isUpdateProductError])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Only show logout dialog if we're on the dashboard screen
            if (pathname === '/dashboard') {
                setLogoutVisible(true);
                return true; // Prevent default behavior
            }
            return false; // Allow default behavior for other screens
        });

        return () => backHandler.remove();
    }, [pathname]);

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

    // Initialize animation values for new items
    const initializeAnimation = (itemId: string) => {
        if (!fadeAnimations[itemId]) {
            fadeAnimations[itemId] = new Animated.Value(1);
        }
    };

    // Clean up animation values for removed items
    const cleanupAnimation = (itemId: string) => {
        if (fadeAnimations[itemId]) {
            delete fadeAnimations[itemId];
        }
    };

    // Get the transform for folding animation
    const getFoldingTransform = (itemId: string, index: number) => {
        if (!updatingItemId) return [{ translateY: 0 }];
        
        const deletingIndex = productsList.findIndex(item => item.id.toString() === updatingItemId);
        if (deletingIndex === -1 || index <= deletingIndex) return [{ translateY: 0 }];
        
        // Items below the deleted item should move up
        return [{
            translateY: fadeAnimations[updatingItemId].interpolate({
                inputRange: [0, 1],
                outputRange: [-90, 0] // Move up by the height of one item (90px)
            })
        }];
    };

    useEffect(() => {
        const newProductsList = products?.pages.flatMap(page => Array.isArray(page.products) ? page.products : []) ?? [];
        setProductsList(newProductsList);
    }, [products])

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1); // Reset to first page on new search
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery])
    
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
                        <Text style={styles.buttonText}>{isLoggingOut ? 'Logging Out...' : 'Logout'}</Text>
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
                        imageUrl: user?.displayImageUrl ?? ''
                    })} style={styles.iconButton}>
                        <Icon name="share-line" size={16} color="#ffffff" />
                    </Button>
                </View>
                </View>
                <Divider width="100%" height={1} color="#F3F4F6" />
                <View style={styles.productContainer}>
                <Text style={styles.productHeaderText}>Your Stock ({productsList.length} Products)</Text>
                <View style={styles.searchContainer}>
                    <Input 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={{ backgroundColor: "#F9FAFB" }}
                        prefixComponent={<Icon name="search-line" size={20} color="#9CA3AF" />}
                        loading={searchQuery !== debouncedSearchQuery || (isFetching && debouncedSearchQuery !== '')}
                    />
                </View>
                <View style={styles.productListContainer}>
                    <SwipeListView
                        data={productsList}
                        keyExtractor={(item) => item.id.toString()}
                        disableLeftSwipe={true}
                        refreshControl={
                            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#EA580C" />
                        }
                        renderItem={({ item, index }: { item: Product; index: number }) => {
                            const itemId = item.id.toString();
                            initializeAnimation(itemId);
                            return (
                                <Animated.View style={[
                                    styles.productItem, 
                                    { 
                                        opacity: fadeAnimations[itemId],
                                        transform: getFoldingTransform(itemId, index)
                                    }
                                ]}>
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
                                </Animated.View>
                            );
                        }}
                        renderHiddenItem={({ item, index }: { item: Product; index: number }) => {
                            const itemId = item.id.toString();
                            return (
                                <Animated.View style={[
                                    styles.hiddenContainer,
                                    { 
                                        opacity: updatingItemId === itemId ? 0 : 1,
                                        transform: getFoldingTransform(itemId, index)
                                    }
                                ]}>
                                    <TouchableOpacity onPress={() => {
                                        const itemId = item.id.toString();
                                        setUpdatingItemId(itemId);
                                        if (item.quantity - 1 === 0) {
                                            // Animate with easeOut effect
                                            Animated.timing(fadeAnimations[itemId], {
                                                toValue: 0,
                                                duration: 400,
                                                useNativeDriver: true,
                                                easing: Easing.out(Easing.cubic),
                                            }).start(() => {
                                                // After animation completes, update the list
                                                const newList = productsList.filter((i: Product) => i.id !== item.id);
                                                setProductsList(newList);
                                                // Clean up the animation value and reset deleting state
                                                cleanupAnimation(itemId);
                                                setUpdatingItemId(null);
                                            });
                                        }
                                        updateProduct({ product: {quantity: `${item.quantity - 1}`}, id: item.id })
                                    }}>
                                         <Icon name="shopping-cart-line" size={32} color="red" />
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        }}
                        leftOpenValue={50}
                        rightOpenValue={50}
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
        flex: 1,
    },
    productHeaderText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937'
    },
    searchContainer: {
        marginTop: 15,
        marginBottom: 10,
    },
    productListContainer: {
        marginTop: 10,
        flex: 1,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'white'
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
    },
    hiddenContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
})