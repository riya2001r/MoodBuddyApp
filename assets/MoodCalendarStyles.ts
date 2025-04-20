import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#e3f2fd',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
    },
    // New styles for the updated journal entry modal
    detailsModalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        width: 'auto',
        alignSelf: 'center',
    },
    closeButtonContainerDetails: {
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 10,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    centeredEmojiList: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    journalContainer: {
        marginTop: 10,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    journalDate: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2d4150',
        flex: 1,
    },
    journalEmoji: {
        fontSize: 36
    },
    noteContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
        paddingTop: 20,
    },
    journalNote: {
        fontSize: 16,
        color: '#7f8c8d',
        lineHeight: 24,
    },
    dayCell: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 72,
        width: '100%',
        paddingTop: 8,
    },
    dayText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
    },
    disabledText: {
        color: '#90a4ae',
    },
    otherMonthText: {
        color: '#cfd8dc',
    },
    moodCircle: {
        backgroundColor: '#f1f1f1',
        borderRadius: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
        borderWidth: 2,
        borderTopColor: '#fff',
        borderLeftColor: '#fff',
        borderRightColor: '#ccc',
        borderBottomColor: '#ccc',
    },
    emojiContainer: {
        position: 'relative',
    },
    emoji: {
        fontSize: 20,
        lineHeight: 36,
    },
    emojiBase: {
        position: 'relative',
        top: -1,
        left: -1,
    },
    emojiShadow: {
        position: 'absolute',
        color: 'rgba(0,0,0,0.15)',
        top: 1,
        left: 1,
    },
    otherMonthEmoji: {
        color: '#cfd8dc',
    },
    placeholderContainer: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderEmoji: {
        fontSize: 20,
        color: '#90a4ae',
    },
    plusContainer: {
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusSign: {
        fontSize: 20,
        color: '#90a4ae',
        lineHeight: 42,
        position: 'relative',
        top: -1,
        left: -1,
    },
    plusSignShadow: {
        position: 'absolute',
        color: 'rgba(0,0,0,0.15)',
        top: 1,
        left: 1,
    },
    otherMonthPlus: {
        color: '#cfd8dc',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
        position: 'relative',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        color: '#0d47a1',
    },
    closeButtonContainer: {
        position: 'absolute',
        right: 0,
    },
    closeButton: {
        fontSize: 28,
        color: '#1976d2',
        paddingHorizontal: 10,
    },
    dateText: {
        marginBottom: 15,
        fontSize: 16,
        color: '#1976d2',
        textDecorationLine: 'underline',
    },
    emojiList: {
        paddingHorizontal: 16,
    },
    emojiOption: {
        paddingHorizontal: 8,
    },
    textInput: {
        width: '100%',
        borderColor: '#90caf9',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 20,
        textAlignVertical: 'top',
        minHeight: 80,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#90caf9',
    },
    saveButton: {
        backgroundColor: '#1976d2',
        padding: 12,
        borderRadius: 10,
        width: '45%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#0d47a1',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    datePickerModal: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        maxHeight: '80%',
    },
    dateItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    selectedDateItem: {
        backgroundColor: '#e3f2fd',
    },
    dateItemText: {
        fontSize: 16,
        color: '#1976d2',
    },
    dateItemMood: {
        fontSize: 24,
    },
    entryListContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    entryListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#bbdefb',
        borderBottomWidth: 1,
        borderBottomColor: '#90caf9',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#1976d2',
        fontSize: 16,
        fontWeight: '500',
    },
    entryListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d47a1',
    },
    placeholder: {
        width: 80, // Match width of back button for balanced header
    },
    entryListContent: {
        padding: 12,
    },
    entrySeparator: {
        height: 12,
    },
    entryItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        // Elevation for Android
        elevation: 2,
    },
    entriesButton: {
        backgroundColor: '#1976d2',
        padding: 12,
        borderRadius: 8,
        margin: 16,
        alignItems: 'center',
    },
    entriesButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Table styles for entries
    journalTable: {
        width: '100%',
    },
    journalRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    journalEmoticonCell: {
        padding: 16,
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        width: 80,
    },
    journalEmoticonText: {
        fontSize: 42,
    },
    journalInfoCell: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    journalDateText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d4150',
        marginBottom: 8,
    },
    journalNoteText: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
    },
    compactModalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 10,
    },
    dateContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    centeredContent: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 10,
    },
    dragIndicator: {
        alignSelf: 'center',
        width: 40,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginBottom: 10,
    },
    compactTextInput: {
        borderColor: '#90caf9',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginVertical: 16,
        textAlignVertical: 'top',
        minHeight: 100,
        maxHeight: 150,
    },
});

export default styles;