import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Button from '@/components/ui/button';
import Icon from "react-native-remix-icon";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Divider from "@/components/ui/divider";
import ImagePicker from "@/components/ui/image-picker";
import Input from "@/components/ui/input";
import CategoryList from "./components/category-list";
import { useAddProduct, useGetBrands, useGetCategories, useGetCategoryTypes, useGetColours, useGetConditions, useGetGenders, useGetSizes } from "@/hooks/useProduct";
import Toast from "react-native-toast-message";

export default function AddProduct() {
    const navigation = useNavigation();
    const { data: genders, isFetching: isFetchingGenders } = useGetGenders();
    const { data: categories, isFetching: isFetchingCategories } = useGetCategories(); 
    const [productUrls, setProductUrls] = useState<{ url: string }[]>([]);
    const { data: brands, isFetching } = useGetBrands();
    const { data: colours, isFetching: isFetchingColours } = useGetColours();
    const { data: categoryTypes, isFetching: isFetchingCategoryTypes } = useGetCategoryTypes();
    const { data: sizes, isFetching: isFetchingSizes } = useGetSizes();
    const { mutate: addProduct, isPending: isAddingProduct, isSuccess: isAddProductSuccess, isError: isAddProductError } = useAddProduct();
    const { data: conditions, isFetching: isFetchingConditions } = useGetConditions();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCategoryType, setSelectedCategoryType] = useState<string>('');
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [selectedCondition, setSelectedCondition] = useState<string>('');
    const [selectedColours, setSelectedColours] = useState<string[]>([]);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [showNoneShoesCategory, setShowNoneShoesCategory] = useState<boolean>(false);
    const [productName, setProductName] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');

    const handleImageUploaded = (url: string) => {
        setProductUrls([...productUrls, { url: url }]);
    }

    const handleSubmit = () => {
        addProduct({
            name: productName,
            price: price,
            quantity: quantity,
            colours: selectedColours,
            genders: selectedGenders,
            sizeId: selectedSize,
            categoryId: selectedCategory,
            productConditionId: selectedCondition,
            categoryTypeId: selectedCategoryType,
            brandId: selectedBrand,
            productUrls: productUrls,
        });
    }

    useEffect(() => {
        if (isAddProductSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Product added successfully',
            });
            navigation.goBack();
        }
        if (isAddProductError) {
            Toast.show({
                type: 'error',
                text1: 'Product addition failed',
            });
        }
    }, [isAddProductSuccess, isAddProductError]);

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
                <ImagePicker onImageUploaded={handleImageUploaded} />
                <Input onChangeText={setProductName} placeholder="Product Name" />
                <Input onChangeText={setPrice} placeholder="Price" keyboardType="numeric" />
                <Input onChangeText={setQuantity} placeholder="Quantity" keyboardType="numeric" />    

                <CategoryList
                    title="Item/Products"
                    isLoading={isFetchingCategories}
                    data={categories?.map((category) => ({ id: category.id, label: category.name })) ?? []}
                    checkedItems={selectedCategory}
                    toggleCheck={({id, label}: {id: string, label: string}) => {
                        if (label.toLowerCase() === 'shoes') {
                            setShowNoneShoesCategory(!showNoneShoesCategory);
                        }
                        setSelectedCategory(id);
                    }}
                    multiple={false}
                /> 
                <CategoryList 
                    title="Category Types" 
                    isLoading={isFetchingCategoryTypes} 
                    data={categoryTypes?.map((categoryType) => ({ id: categoryType.id, label: categoryType.name })) ?? []} 
                    checkedItems={selectedCategoryType} 
                    toggleCheck={({id}: {id: string, label: string}) => {
                        setSelectedCategoryType(id);
                    }}
                    multiple={false}
                />
                <CategoryList
                    title="Gender/Menu/Category"
                    isLoading={isFetchingGenders}
                    data={genders?.map((gender) => ({ id: gender.id, label: gender.name })) ?? []}
                    checkedItems={selectedGenders.reduce((acc, gender) => ({ ...acc, [gender]: true }), {})}
                    toggleCheck={({id}: {id: string, label: string}) => {   
                        if (selectedGenders.includes(id)) {
                            setSelectedGenders(selectedGenders.filter((gender) => gender !== id));
                        } else {
                            setSelectedGenders([...selectedGenders, id]);
                        }
                    }}
                />
                <CategoryList
                    title="Conditions"
                    isLoading={isFetchingConditions}
                    data={conditions?.map((condition) => ({ id: condition.id, label: condition.name })) ?? []}
                    checkedItems={selectedCondition}
                    toggleCheck={({id}: {id: string, label: string}) => {
                        setSelectedCondition(id);
                    }}
                    multiple={false}
                />
                <CategoryList
                    title="Brands" 
                    isLoading={isFetching} 
                    data={brands?.map((brand) => ({ id: brand.id, label: brand.name })) ?? []} 
                    checkedItems={selectedBrand} 
                    toggleCheck={({id}: {id: string, label: string}) => {
                        setSelectedBrand(id);
                    }}
                    visible={showNoneShoesCategory} 
                    multiple={false}
                />
                <CategoryList
                    title="Colours"
                    isLoading={isFetchingColours}
                    data={colours?.map((colour) => ({ id: colour.id, label: colour.name })) ?? []}
                    checkedItems={selectedColours.reduce((acc, colour) => ({ ...acc, [colour]: true }), {})}
                    toggleCheck={({id}: {id: string, label: string}) => {
                        if (selectedColours.includes(id)) {
                            setSelectedColours(selectedColours.filter((colour) => colour !== id));
                        } else {
                            setSelectedColours([...selectedColours, id]);
                        }
                    }} 
                    visible={showNoneShoesCategory}
                />
                <CategoryList
                    title="Sizes"
                    isLoading={isFetchingSizes}
                    data={sizes?.map((size) => ({ id: size.id, label: size.name })) ?? []}
                    checkedItems={selectedSize}
                    toggleCheck={({id}: {id: string, label: string}) => {
                        setSelectedSize(id);
                    }}  
                    multiple={false}
                />

                <View style={styles.buttonContainer}>
                    <Button onPress={() => navigation.goBack()} variant="danger" style={{ paddingHorizontal: 20 }}>Cancel</Button>
                    <Button onPress={handleSubmit} style={{ paddingHorizontal: 50 }} disabled={isAddingProduct} loading={isAddingProduct} >Save</Button>
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