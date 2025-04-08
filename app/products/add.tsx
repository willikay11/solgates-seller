import { View, Text, StyleSheet, TextInput } from "react-native";

export default function AddProduct() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add New Product</Text>
        </View>
    )
}  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937'
    }
})