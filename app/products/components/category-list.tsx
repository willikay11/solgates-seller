import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Checkbox, RadioButton } from "react-native-paper";

export type CheckedItems = {
    [key: string]: boolean;
};

export default function CategoryList({
    title,
    data,
    isLoading,
    checkedItems,
    toggleCheck,
    visible = true,
    multiple = true
}: {
    title: string, 
    data: {id: string, label: string}[], 
    isLoading: boolean,
    checkedItems: string | CheckedItems, 
    toggleCheck: ({id, label}: {id: string, label: string}) => void, 
    visible?: boolean, 
    multiple?: boolean
}){
    if (!visible) return null;
    return (
        <View style={styles.columnContainer}>
            <Text style={styles.filterTitle}>{title}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
                        <ActivityIndicator size="small" color="#EA580C" />
                    </View>
                ) : (
                    data.map((item, index) => (
                        <View style={styles.checkboxContainer} key={`${item.id}-${index}`}>
                            {multiple ? (
                            <Checkbox.Item
                                label={item.label}
                                status={typeof checkedItems === 'string' ? checkedItems === item.id ? 'checked' : 'unchecked' : checkedItems[item.id] ? 'checked' : 'unchecked'}
                                onPress={() => toggleCheck({id: item.id, label: item.label})}
                                labelStyle={{ fontSize: 14 }}   
                                mode="android"
                                position="leading"
                                color="#EA580C"
                                style={{ height: 40 }}
                            />
                            ) : (
                                <RadioButton.Item
                                    label={item.label}
                                    value={item.id}
                                    status={typeof checkedItems === 'string' ? checkedItems === item.id ? 'checked' : 'unchecked' : checkedItems[item.id] ? 'checked' : 'unchecked'}
                                    onPress={() => toggleCheck({id: item.id, label: item.label})}
                                    position="leading"
                                    color="#EA580C"
                                    style={{ height: 40 }}
                                />
                            )}
                        </View>
                    ))
                )}
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