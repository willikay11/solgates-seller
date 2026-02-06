import { Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import Icon from "react-native-remix-icon";
import React from "react";
import { useNavigation } from "expo-router";
import Divider from "@/components/ui/divider";
import ProductForm from "./components/product-form";

export default function AddProduct() {
    const navigation = useNavigation();

    return (
        <ScrollView style={[styles.container, { marginTop: 40, marginBottom: 40 }]}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()} >
                <Icon name="arrow-left-line" size={24} color="#1F2937" />
                <Text style={styles.title}>Add New Product</Text>
            </TouchableOpacity>
            <Divider width="100%" color="#F3F4F6" /> 
            <ProductForm />
        </ScrollView>
    )
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
    contentContainer: {
        padding: 20,
        gap: 10
    },
})