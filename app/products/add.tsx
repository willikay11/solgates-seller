import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Button from '@/components/ui/button';
import Icon from "react-native-remix-icon";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Divider from "@/components/ui/divider";
import ImagePicker from "@/components/ui/image-picker";
import Input from "@/components/ui/input";
import CategoryList, { CheckedItems } from "./components/category-list";
import { useGetBrands, useGetCategories, useGetCategoryTypes, useGetColours, useGetGenders, useGetSizes } from "@/hooks/useProduct";

export default function AddProduct() {
    const navigation = useNavigation();
    const [showNoneShoesCategory, setShowNoneShoesCategory] = useState<boolean>(false);
    const { data: genders, isFetching: isFetchingGenders } = useGetGenders();
    const { data: categories, isFetching: isFetchingCategories } = useGetCategories();  
    const { data: brands, isFetching } = useGetBrands();
    const { data: colours, isFetching: isFetchingColours } = useGetColours();
    const { data: categoryTypes, isFetching: isFetchingCategoryTypes } = useGetCategoryTypes();
    const { data: sizes, isFetching: isFetchingSizes } = useGetSizes();
    const [checkedItems, setCheckedItems] = useState<CheckedItems>({});

    const toggleCheck = ({id, label}: {id: string, label: string}) => {
        if (label.toLowerCase() === 'shoes') {
            setShowNoneShoesCategory(!showNoneShoesCategory);
        }
        
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
                <Input onChangeText={() => {}} placeholder="Product Name" />
                <Input onChangeText={() => {}} placeholder="Price" keyboardType="numeric" />
                <Input onChangeText={() => {}} placeholder="Quantity" keyboardType="numeric" />                
                <CategoryList title="Item/Products" isLoading={isFetchingCategories} data={categories?.map((category) => ({ id: category.id, label: category.name })) ?? []} checkedItems={checkedItems} toggleCheck={toggleCheck} /> 
                <CategoryList title="Category Types" isLoading={isFetchingCategoryTypes} data={categoryTypes?.map((categoryType) => ({ id: categoryType.id, label: categoryType.name })) ?? []} checkedItems={checkedItems} toggleCheck={toggleCheck} />
                <CategoryList title="Gender/Menu/Category" isLoading={isFetchingGenders} data={genders?.map((gender) => ({ id: gender.id, label: gender.name })) ?? []} checkedItems={checkedItems} toggleCheck={toggleCheck} />
                <CategoryList title="Brands" isLoading={isFetching} data={brands?.map((brand) => ({ id: brand.id, label: brand.name })) ?? []} checkedItems={checkedItems} toggleCheck={toggleCheck} visible={showNoneShoesCategory} />
                <CategoryList title="Colours" isLoading={isFetchingColours} data={colours?.map((colour) => ({ id: colour.id, label: colour.name })) ?? []} checkedItems={checkedItems} toggleCheck={toggleCheck} visible={showNoneShoesCategory} />
                <CategoryList title="Sizes" isLoading={isFetchingSizes} data={sizes?.map((size) => ({ id: size.id, label: size.name })) ?? []} checkedItems={checkedItems} toggleCheck={toggleCheck} />

                <View style={styles.buttonContainer}>
                    <Button onPress={() => navigation.goBack()} variant="danger" style={{ paddingHorizontal: 20 }}>Cancel</Button>
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