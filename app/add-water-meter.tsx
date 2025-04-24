import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React, { useState, ReactElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddWaterMeterScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        serialNumber: '',
        location: '',
        installationDate: '',
        initialReading: '',
        description: ''
    });

    // Validation errors state
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({
        serialNumber: '',
        location: '',
        initialReading: ''
    });

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData({ ...formData, [field]: value });
        // Clear error when typing
        if (field in errors) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    // Extract validation logic for each field
    const validateSerialNumber = (value: string) => {
        return value.trim() ? '' : 'Vui lòng nhập số serial';
    };

    const validateLocation = (value: string) => {
        return value.trim() ? '' : 'Vui lòng nhập vị trí đồng hồ';
    };

    const validateInitialReading = (value: string) => {
        if (!value.trim()) return 'Vui lòng nhập chỉ số ban đầu';
        if (isNaN(Number(value))) return 'Chỉ số phải là số';
        return '';
    };

    const validateForm = () => {
        const newErrors = {
            serialNumber: validateSerialNumber(formData.serialNumber),
            location: validateLocation(formData.location),
            initialReading: validateInitialReading(formData.initialReading)
        };
        
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            console.log('Submitted water meter:', formData);
            router.back();
        } catch (error) {
            console.error('Failed to add water meter:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Extract form field rendering
    const renderFormField = (
        label: string, 
        field: keyof typeof formData, 
        placeholder: string, 
        isRequired = false,
        options = {}
    ): ReactElement => (
        <View style={styles.formGroup}>
            <ThemedText type="defaultSemiBold">{label}{isRequired ? ' *' : ''}</ThemedText>
            <TextInput
                style={[
                    styles.input,
                    {
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                        borderColor: field in errors && errors[field] ? '#ff6b6b' : '#ccc'
                    }
                ]}
                placeholder={placeholder}
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                value={formData[field]}
                onChangeText={(value) => updateField(field, value)}
                {...options}
            />
            {field in errors && errors[field] ? (
                <ThemedText style={styles.errorText}>{errors[field]}</ThemedText>
            ) : null}
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <ThemedView style={styles.formContainer}>
                    <ThemedText type="title" style={styles.formTitle}>
                        Thêm đồng hồ nước mới
                    </ThemedText>

                    {renderFormField('Số Serial', 'serialNumber', 'Nhập số serial đồng hồ', true)}
                    {renderFormField('Vị trí lắp đặt', 'location', 'Nhập vị trí lắp đặt', true)}
                    {renderFormField('Ngày lắp đặt', 'installationDate', 'DD/MM/YYYY')}
                    {renderFormField('Chỉ số ban đầu (m³)', 'initialReading', 'Nhập chỉ số ban đầu', true, {keyboardType: 'numeric'})}

                    <View style={styles.formGroup}>
                        <ThemedText type="defaultSemiBold">Ghi chú</ThemedText>
                        <TextInput
                            style={[
                                styles.textarea,
                                { color: colorScheme === 'dark' ? '#fff' : '#000' }
                            ]}
                            placeholder="Nhập ghi chú (không bắt buộc)"
                            placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                            value={formData.description}
                            onChangeText={(value) => updateField('description', value)}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={() => router.back()}
                        >
                            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                                Hủy
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.submitButton,
                                isSubmitting && styles.disabledButton
                            ]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                                {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        padding: 16,
    },
    formContainer: {
        width: '100%',
        padding: 16,
        borderRadius: 8,
    },
    formTitle: {
        marginBottom: 24,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 16,
    },
    input: {
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        marginTop: 8,
    },
    textarea: {
        height: 100,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingTop: 10,
        marginTop: 8,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    button: {
        height: 45,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        minWidth: '45%',
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    submitButton: {
        backgroundColor: '#4a90e2',
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
    },
});
