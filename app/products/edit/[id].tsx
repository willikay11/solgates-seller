import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "expo-router";
import Icon from "react-native-remix-icon";
import { Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import Divider from "@/components/ui/divider";
import ProductForm from "../components/product-form";
import { useGetProductById } from "@/hooks/useProduct";


export default function EditProduct() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const { data: product, isLoading: isLoadingProduct } = useGetProductById(id as string);

    return (
        <ScrollView style={[styles.container, { marginTop: 40 }]}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()} >
                <Icon name="arrow-left-line" size={24} color="#1F2937" />
                <Text style={styles.title}>Edit Product</Text>
            </TouchableOpacity>
            <Divider width="100%" color="#F3F4F6" />
            <ProductForm product={product} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 20,
        gap: 10
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937'
    },
});