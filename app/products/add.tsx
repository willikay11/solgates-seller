import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-remix-icon";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Divider from "@/components/ui/divider";
import ImagePicker from "@/components/ui/image-picker";
import Input from "@/components/ui/input";
import { Checkbox } from 'react-native-paper';

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

type CheckedItems = {
  [key: string]: boolean;
};

export default function AddProduct() {
    const navigation = useNavigation();
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

    const toggleCheck = (id: string) => {
      setCheckedItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const renderFilterTitle = ({title}: {title: string}) => {
        return (
            <Text style={styles.filterTitle}>{title}</Text>
        )
    }
    return (
        <View style={styles.container}>
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
            </View>           
            <FlatList
                style={{ padding: 20 }}
                ListHeaderComponent={() => renderFilterTitle({title: 'Item/Product'})}
                data={data}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.checkboxContainer}>
                            <Checkbox.Item
                                label={item.label}
                                status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                                onPress={() => toggleCheck(item.id)}
                                labelStyle={{ fontSize: 14 }}
                                mode="android"
                                position="leading"
                                color="#EA580C"
                            />
                        </View>
                    )
                }}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.columnContainer}
            />
        </View>
    )
}  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
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
    row: {
        // backgroundColor: '#F3F4F6',
        // borderRadius: 8,
    },
    columnContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    checkboxContainer: {
        width: '50%',    
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 20,
    }
})