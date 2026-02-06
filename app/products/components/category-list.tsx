import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { useEffect } from 'react';

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
  multiple = true,
  onKeyboardOpen,
}: {
  title: string;
  data: { id: string; label: string }[];
  isLoading: boolean;
  checkedItems?: string | CheckedItems;
  toggleCheck: ({ id, label }: { id: string; label: string }) => void;
  visible?: boolean;
  multiple?: boolean;
  onKeyboardOpen?: () => void;
}) {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event: KeyboardEvent) => {
        onKeyboardOpen?.();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, [onKeyboardOpen]);

  if (!visible) return null;
  return (
    <View style={styles.columnContainer}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginHorizontal: 10,
        }}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}
          >
            <ActivityIndicator size="small" color="#EA580C" />
          </View>
        ) : (
          data.map((item, index) => (
            <View style={styles.checkboxContainer} key={`${item.id}-${index}`}>
              {multiple ? (
                <TouchableWithoutFeedback
                  onPress={() => toggleCheck({ id: item.id, label: item.label })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 30 }}>
                    <Checkbox
                      value={
                        typeof checkedItems === 'string'
                          ? checkedItems === item.id
                          : checkedItems?.[item.id] || false
                      }
                      color={
                        typeof checkedItems === 'string'
                          ? checkedItems === item.id
                            ? '#EA580C'
                            : '#1F2937'
                          : checkedItems?.[item.id]
                            ? '#EA580C'
                            : '#1F2937'
                      }
                      onValueChange={() => toggleCheck({ id: item.id, label: item.label })}
                    />
                    <Text style={{ fontSize: 14, marginLeft: 10 }}>{item.label}</Text>
                  </View>
                </TouchableWithoutFeedback>
              ) : (
                <TouchableWithoutFeedback
                  onPress={() => toggleCheck({ id: item.id, label: item.label })}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', height: 30 }}>
                    <View
                      style={[
                        styles.radioButton,
                        {
                          borderColor: (
                            typeof checkedItems === 'string'
                              ? checkedItems === item.id
                              : !!checkedItems?.[item.id]
                          )
                            ? '#EA580C'
                            : '#1F2937',
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.radioButtonInner,
                          (typeof checkedItems === 'string'
                            ? checkedItems === item.id
                            : !!checkedItems?.[item.id]) && styles.radioButtonInnerChecked,
                        ]}
                      />
                    </View>
                    <Text style={{ fontSize: 14 }}>{item.label}</Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
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
    marginHorizontal: 10,
  },
  checkboxContainer: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  radioButtonInnerChecked: {
    backgroundColor: '#EA580C',
  },
});
