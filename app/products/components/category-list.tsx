import { StyleSheet, View, Text } from "react-native";
import { Checkbox } from "react-native-paper";

export type CheckedItems = {
    [key: string]: boolean;
};

export default function CategoryList({title, data, checkedItems, toggleCheck}: {title: string, data: {id: string, label: string}[], checkedItems: CheckedItems, toggleCheck: (id: string) => void}) {
    return (
        <View style={styles.columnContainer}>
            <Text style={styles.filterTitle}>{title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {
                    data.map((item, index) => (
                        <View style={styles.checkboxContainer} key={`${item.id}-${index}`}>
                            <Checkbox.Item
                                label={item.label}
                                status={checkedItems[item.id] ? 'checked' : 'unchecked'}
                                onPress={() => toggleCheck(item.id)}
                                labelStyle={{ fontSize: 14 }}   
                                mode="android"
                                position="leading"
                                color="#EA580C"
                                style={{ height: 40 }}
                            />
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    columnContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginTop: 10,
        marginBottom: 5,
        marginHorizontal: 20,
    },
    checkboxContainer: {
        width: '50%',    
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
})