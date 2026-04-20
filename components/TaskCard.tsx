import Colors from "@/constants/Colors";
import Fonts from "@/constants/Fonts";
import { Task } from "@/types/Task";
import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type TaskCardProps = Task & {
  onToggleTaskCompleted: (id: string) => Promise<void>;
  onUpdateTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export default function TaskCard({
  id,
  description,
  completed,
  onToggleTaskCompleted,
  onUpdateTask,
  onDeleteTask,
}: TaskCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <BouncyCheckbox
          onPress={async () => onToggleTaskCompleted(id)}
          bounceEffectIn={1.2}
          fillColor={completed ? Colors.success : Colors.gray}
          innerIconStyle={styles.innerIconStyle}
          isChecked={completed}
          size={20}
          text={description}
          textStyle={styles.description}
          unFillColor="transparent"
        />
      </View>
      <TouchableOpacity
        style={styles.actionButton}
        activeOpacity={0.7}
        onPress={() => onUpdateTask(id)}
      >
        <FontAwesome5 name="edit" size={14} color={Colors.light} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: Colors.danger }]}
        activeOpacity={0.7}
        onPress={() => onDeleteTask(id)}
      >
        <FontAwesome5 name="trash" size={14} color={Colors.light} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.dark_light,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    padding: 16,
  },
  info: {
    flex: 1,
  },
  innerIconStyle: {
    borderWidth: 1,
  },
  description: {
    color: Colors.light,
    flex: 1,
    fontFamily: Fonts.family.medium,
    fontSize: Fonts.size.normal,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
});
