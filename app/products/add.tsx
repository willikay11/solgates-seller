import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Button from '@/components/ui/button';
import Icon from "react-native-remix-icon";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Divider from "@/components/ui/divider";
import ImagePicker from "@/components/ui/image-picker";
import Input from "@/components/ui/input";
import CategoryList, { CheckedItems } from "./components/category-list";

const data = [
    { id: '1', label: 'Shoes' },
    { id: '2', label: 'T-shirt' },
    { id: '3', label: 'Socks' },
    { id: '4', label: 'Hats' },
    { id: '5', label: 'Shorts' },
    { id: '6', label: 'Bags' },
    { id: '7', label: 'Hoodies & Sweatshirts' },
    { id: '8', label: 'Sweatpants' },
    { id: '9', label: 'Sunglasses' },
    { id: '10', label: 'Tops' },
    { id: '11', label: 'Jeans' },
    { id: '12', label: 'Accessories' },
    { id: '13', label: 'Dresses/Skirts' },
  ];

const genderData = [
    { id: '1', label: 'Men' },
    { id: '2', label: 'Women' },
    { id: '3', label: 'Kids' },
]

export default function AddProduct() {
    const navigation = useNavigation();
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

    const toggleCheck = (id: string) => {
      setCheckedItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()} >
                <Icon name="arrow-left-line" size={24} color="#1F2937" />
                <Text style={styles.title}>Add New Product</Text>
            </TouchableOpacity>
            <Divider width="100%" color="#F3F4F6" />
            <View style={styles.formContainer}>
                <Text style={styles.label}>Product Photos</Text>
                <Divider width="100%" color="#E5E7EB" />
                <ImagePicker />
                <Input value={""} onChangeText={() => {}} placeholder="Product Name" />
                <Input value={""} onChangeText={() => {}} placeholder="Price" keyboardType="numeric" />
                <Input value={""} onChangeText={() => {}} placeholder="Quantity" keyboardType="numeric" />                
                <CategoryList title="Item/Products" data={data} checkedItems={checkedItems} toggleCheck={toggleCheck} /> 
                <CategoryList title="Gender/Menu/Category" data={genderData} checkedItems={checkedItems} toggleCheck={toggleCheck} />
                <View style={styles.buttonContainer}>
                    <Button onPress={() => {}} variant="danger" style={{ paddingHorizontal: 20 }}>Cancel</Button>
                    <Button onPress={() => {}} style={{ paddingHorizontal: 50 }}>Save</Button>
                </View>
            </View>    
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
    formContainer: {
        gap: 10,
        paddingHorizontal: 20,
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937'
    },
    descriptionContainer: {
        gap: 10,
        borderRadius: 8,
        borderColor: '#F3F4F6',
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginBottom: 20,
    },
})