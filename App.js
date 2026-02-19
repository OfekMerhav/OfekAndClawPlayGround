import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';

const COLOR_OPTIONS = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
  '#FDCB6E', // Soft Yellow
  '#6C5CE7', // Purple
  '#A8E6CF', // Mint Green
  '#FF8ED4', // Pink
];

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const addTask = () => {
    const trimmed = task.trim();
    if (!trimmed) return;
    setTasks([
      ...tasks, 
      { 
        id: Date.now().toString(), 
        text: trimmed, 
        done: false, 
        color: selectedColor 
      }
    ]);
    setTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const openColorModal = (taskId) => {
    setEditingTaskId(taskId);
    setColorModalVisible(true);
  };

  const changeTaskColor = (color) => {
    setTasks(tasks.map((t) => 
      t.id === editingTaskId ? { ...t, color } : t
    ));
    setColorModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>📝 My Colorful To-Do List</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View 
            style={[
              styles.taskRow, 
              { backgroundColor: item.color || selectedColor }
            ]}
          >
            <TouchableOpacity 
              onPress={() => toggleTask(item.id)} 
              style={styles.taskTextWrap}
            >
              <Text style={[
                styles.taskText, 
                item.done && styles.taskDone
              ]}>
                {item.done ? '✅' : '⬜'} {item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openColorModal(item.id)}>
              <Text style={styles.colorBtn}>🎨</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteBtn}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet — add one below!</Text>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#999"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity 
          style={[styles.colorPreview, { backgroundColor: selectedColor }]} 
          onPress={() => setColorModalVisible(true)}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Color Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={colorModalVisible}
        onRequestClose={() => setColorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Task Color</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { backgroundColor: color }]}
                  onPress={() => {
                    editingTaskId 
                      ? changeTaskColor(color) 
                      : setSelectedColor(color);
                    setColorModalVisible(false);
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTextWrap: {
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: 'rgba(255,255,255,0.5)',
  },
  colorBtn: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  deleteBtn: {
    fontSize: 18,
    paddingLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    marginTop: 40,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    backgroundColor: '#4f46e5',
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
});