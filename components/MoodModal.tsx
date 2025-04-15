import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, Button } from 'react-native';

interface Props {
    visible: boolean;
    date: string;
    onClose: () => void;
}

const MoodModal: React.FC<Props> = ({ visible, date, onClose }) => {
    const [note, setNote] = useState('');

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Mood for {date}</Text>
                    <TextInput placeholder="Write your note..." style={styles.input} value={note} onChangeText={setNote} />
                    <Button title="Save" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalView: { width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15 },
});

export default MoodModal;
