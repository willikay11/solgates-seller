import Divider from '@/components/ui/divider';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Icon from "react-native-remix-icon";
import Button from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Input from '@/components/ui/input';
import { router } from 'expo-router';
import { User } from '@/types/user';
const products = [
    {
        name: 'Beano Originals Classic Striped Red Shirt',
        price: 7100,
        image: require('@/assets/images/image.png')
    },
    {
        name: 'Plain Black Tee Leaves Printed Sleeves',
        price: 7100,
        image: require('@/assets/images/image.png')
    },
    {
        name: 'Cotton Blended Pale Yellow T-Shirt',
        price: 7100,
        image: require('@/assets/images/image.png')
    },
    {
        name: 'Penn Sport "USA" Special Tee',
        price: 7100,
        image: require('@/assets/images/image.png')
    },
    {
        name: 'Pure Energy Yellow T-Shirt',
        price: 7100,
        image: require('@/assets/images/image.png')
    },
    {
        name: 'Nike Flow 2020 ISPA SE',
        price: 7100,
        image: require('@/assets/images/image.png')
    },
]

export default function Dashboard() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [withdrawVisible, setWithdrawVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [user, setUser] = useState<User | null>(null);

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

    return (
        <ScrollView style={styles.scrollContainer}>
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
                        <Text style={styles.withdrawText}><Text style={styles.withdrawTextBold}>Withdrawal Number:</Text> +254712345678</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Input prefixComponent={<Icon name="hand-coin-line" size={14} color="#10B981" />} placeholder="Amount" value={amount} onChangeText={setAmount} /> 
                    </View>
                    <View style={styles.walletBalanceContainer}>
                        <Text style={styles.walletModalBalanceText}>Wallet Balance: KES 67,123.10</Text>
                    </View>
                    <Button variant="primary" onPress={() => setWithdrawVisible(false)}>
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
                <Text style={styles.walletBalanceText}>KES 67,123.10</Text>
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
                <Button variant="secondary" onPress={() => {}} style={styles.iconButton}>
                    <Icon name="share-line" size={30} color="#FFFFFF" />
                </Button>
            </View>
            </View>
            <Divider width="100%" height={1} color="#F3F4F6" />
            <View style={styles.productContainer}>
                <Text style={styles.productHeaderText}>Your Stock (32 Products)</Text>
                <View style={styles.productListContainer}>
                    {products.map((product, index) => (
                        <View key={index} style={styles.productItem}>
                            <Image source={product.image} style={styles.productImage} /> 
                            <View style={styles.productItemTextContainerLeft}>
                                <View style={styles.productItemTextContainer}>
                                    <Text style={styles.productItemText}>{product.name}</Text>
                                    <Text style={styles.productItemTextDescription}>XL | Men</Text>
                                    <Text style={styles.productItemText}>KES 7,100</Text>
                                </View>
                                <View style={styles.productItemActionContainer}>
                                    <TouchableOpacity onPress={() => setMenuVisible(true)}>
                                        <Icon name="more-2-fill" size={20} color="#EA580C" />   
                                    </TouchableOpacity>
                                </View> 
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({  
    scrollContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        padding: 20
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
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
        fontWeight: 'normal',
        color: '#6B7280'
    },
    walletBalanceText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1F2937'
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10
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
        borderRadius: 50,
        width: 50,
        height: 50, 
        justifyContent: 'center',
        alignItems: 'center'
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
        padding: 20
    },
    productHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937'
    },
    productListContainer: {
        marginTop: 10,
        gap: 20,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
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
        fontWeight: 'semibold',
        color: '#1F2937'
    },
    productItemTextDescription: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#6B7280'
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10
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
        fontWeight: 'normal',
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
    walletBalanceContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'flex-end'
    },
    walletModalBalanceText: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#6B7280'
    }
})