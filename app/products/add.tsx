
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-remix-icon";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Divider from "@/components/ui/divider";
import ImagePicker from "@/components/ui/image-picker";
import Input from "@/components/ui/input";
import CheckBox from '@react-native-community/checkbox';

export default function AddProduct() {
    const navigation = useNavigation();
    const [isChecked, setIsChecked] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.headerContainer} onPress={() => navigation.goBack()} >
                <Icon name="arrow-left-line" size={24} color="#1F2937" />
                <Text style={styles.title}>Add New Product</Text>
            </TouchableOpacity>
            <Divider width="100%" color="#F3F4F6" />
            <ScrollView style={styles.contentContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Product Photos</Text>
                    <Divider width="100%" color="#E5E7EB" />
                    <ImagePicker />
                    <Input value={""} onChangeText={() => {}} placeholder="Product Name" />
                    <Input value={""} onChangeText={() => {}} placeholder="Price" keyboardType="numeric" />
                    <Input value={""} onChangeText={() => {}} placeholder="Quantity" keyboardType="numeric" />
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.label}>Item/Product</Text>
                        <CheckBox
                            value={isChecked}
                            onValueChange={setIsChecked}
                            tintColors={{ true: '#2563EB', false: '#9CA3AF' }}
                            />
                    </View>
                </View>
            </ScrollView>
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
        gap: 10
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
    }
})