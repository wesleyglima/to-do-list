import Button from "@/components/Button";
import Input from "@/components/Input";
import TaskCard from "@/components/TaskCard";
import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { db } from "@/firebase/firebaseConfig";
import { useUserStore } from "@/store/UserStore";
import { Task } from "@/types/Task";
import { Entypo } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalInputField, setModalInputField] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [updatingTask, setUpdatingTask] = useState<Task | null>(null);

  const inputRef = useRef<TextInput>(null);

  const { t } = useTranslation();

  const { user } = useUserStore();

  const filteredTasks = useMemo(() => {
    if (!inputText.trim()) return tasks;

    return tasks.filter(({ description }) =>
      description.toLowerCase().includes(inputText.toLowerCase()),
    );
  }, [inputText, tasks]);

  function renderListEmptyComponent() {
    return (
      <Text style={[styles.emptyText, { fontSize: Fonts.size.normal }]}>
        {t("myTasks.emptySearchResults")}
      </Text>
    );
  }

  async function getTasks() {
    setTasks([]);

    try {
      setIsLoading(true);

      const q = query(
        collection(db, "tasks"),
        where("userId", "==", user?.uid),
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        setTasks((prev) => [
          ...prev,
          {
            id: doc.id,
            userId: doc.data().userId,
            description: doc.data().description,
            completed: doc.data().completed,
          },
        ]);
      });
    } catch (error) {
      console.log(error);

      Alert.alert(t("myTasks.alertTitle"), t("myTasks.getTasksErrorMessage"));
    } finally {
      setIsLoading(false);
    }
  }

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setModalInputField("");
    if (updatingTask) setUpdatingTask(null);
  }

  async function addTask() {
    if (!user) return;

    try {
      setIsProcessing(true);

      const newTask = {
        userId: user.uid,
        description: modalInputField,
        completed: false,
      };

      const { id } = await addDoc(collection(db, "tasks"), newTask);

      setTasks((prev) => [
        ...prev,
        {
          id,
          ...newTask,
        },
      ]);
    } catch (error) {
      console.log(error);

      Alert.alert(t("myTasks.alertTitle"), t("muTasks.addTaskErrorMessage"));
    } finally {
      setIsProcessing(false);
    }

    closeModal();
  }

  async function updateTask() {
    if (!updatingTask) return;

    try {
      setIsProcessing(true);
      const taskRef = doc(db, "tasks", updatingTask.id);

      await updateDoc(taskRef, {
        description: modalInputField,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskRef.id
            ? { ...task, description: modalInputField }
            : task,
        ),
      );

      closeModal();
    } catch (error) {
      console.log(error);

      Alert.alert(t("myTasks.alertTitle"), t("myTasks.updateTaskErrorMessage"));
    } finally {
      setIsProcessing(false);
    }
  }

  function handleUpdateTask(id: string) {
    const task = tasks?.find((task) => task.id === id);

    if (!task) return;

    setShowModal(true);
    setModalInputField(task.description);
    setUpdatingTask(task);
  }

  async function toggleTaskCompleted(id: string) {
    const updatingTask = tasks.find((task) => task.id === id);

    if (updatingTask) {
      setIsProcessing(true);

      try {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task,
          ),
        );

        const taskRef = doc(db, "tasks", id);

        await updateDoc(taskRef, {
          completed: !updatingTask.completed,
        });
      } catch (error) {
        console.log(error);

        Alert.alert(
          t("myTasks.alertTitle"),
          t("myTasks.completeTaskErrorMessage"),
        );
      } finally {
        setIsProcessing(false);
      }
    }
  }

  async function deleteTask(id: string) {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);

      Alert.alert(t("myTasks.alertTitle"), t("myTasks.deleteTaskErrorMessage"));
    }

    closeModal();
  }

  function handleDeleteTask(id: string) {
    const task = tasks?.find((task) => task.id === id);

    if (!task) return;

    Alert.alert(
      t("myTasks.deleteTaskAlertTitle"),
      `${t("myTasks.deleteTaskAlertMessage")} "${task.description}"?`,
      [
        {
          text: t("myTasks.deleteTaskAlertCancelCta"),
          style: "cancel",
        },
        {
          text: t("myTasks.deleteTaskAlertConfirmCta"),
          style: "destructive",
          onPress: () => deleteTask(task.id),
        },
      ],
    );
  }

  useEffect(() => {
    getTasks();
  }, []);

  if (isLoading)
    return (
      <View
        style={[
          styles.container,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );

  return (
    <View
      style={[
        styles.container,
        !tasks.length && {
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      {!tasks.length ? (
        <Text style={styles.emptyText}>{t("myTasks.emptyText")}</Text>
      ) : (
        <>
          <View style={styles.header}>
            <Input
              onChangeText={setInputText}
              placeholder={t("myTasks.searchableInputPlaceholder")}
              searchable
              value={inputText}
            />
          </View>
          <FlatList
            contentContainerStyle={styles.list}
            data={filteredTasks}
            keyboardShouldPersistTaps="always"
            keyExtractor={(task) => task.id}
            ListEmptyComponent={renderListEmptyComponent}
            renderItem={({ item }) => (
              <TaskCard
                {...item}
                onToggleTaskCompleted={toggleTaskCompleted}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
            onRefresh={async () => await getTasks()}
            refreshControl={
              <RefreshControl
                colors={[Colors.light]}
                progressBackgroundColor={Colors.primary}
                refreshing={isLoading}
              />
            }
            refreshing={isLoading}
          />
        </>
      )}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={openModal}
      >
        <Entypo name="plus" size={24} color={Colors.light} />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        onShow={() => {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 500);
        }}
        statusBarTranslucent
        transparent
        visible={showModal}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <Input
              editable={!isProcessing}
              onChangeText={setModalInputField}
              onSubmitEditing={
                !updatingTask ? async () => addTask() : async () => updateTask()
              }
              placeholder={t("myTasks.modalInputPlaceholder")}
              ref={inputRef}
              value={modalInputField}
            />
            <View style={styles.buttons}>
              {!isProcessing && (
                <View style={styles.buttonWrapper}>
                  <Button
                    title={t("myTasks.modalCancelCta")}
                    variant="outline"
                    onPress={closeModal}
                    disabled={isProcessing}
                  />
                </View>
              )}
              {modalInputField.trim() &&
                modalInputField.trim() !== updatingTask?.description && (
                  <View style={styles.buttonWrapper}>
                    <Button
                      title={
                        !updatingTask
                          ? t("myTasks.modalAddCta")
                          : t("myTasks.modalUpdateCta")
                      }
                      onPress={
                        !updatingTask
                          ? async () => addTask()
                          : async () => updateTask()
                      }
                      disabled={isProcessing}
                    />
                  </View>
                )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark,
    flex: 1,
  },
  emptyText: {
    color: Colors.light,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.lg,
    textAlign: "center",
  },
  header: {
    borderBottomWidth: 0.2,
    borderColor: Colors.gray,
    padding: 24,
  },
  list: {
    gap: 8,
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 24,
    bottom: 48,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    width: 48,
  },
  modal: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    flex: 1,
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: Colors.dark,
    borderRadius: 8,
    gap: 16,
    padding: 24,
    width: "90%",
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
  buttonWrapper: {
    flex: 1,
  },
});
