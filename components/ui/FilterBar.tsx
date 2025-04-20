import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

const options = ["Tất cả", "Di tích", "Lễ hội", "Sự kiện"];

const FilterBar = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (val: string) => void;
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (opt: string) => {
    onSelect(opt);
    setVisible(false);
  };

  return (
    <>
      {/* Nút trôi nổi để mở filter */}
      <TouchableOpacity
        style={styles.floatingFilter}
        onPress={() => setVisible(!visible)}
        activeOpacity={0.8}
      >
        <Ionicons name="filter" size={18} color="#fff" />
        <Text style={styles.filterLabel}>Lọc: {selected}</Text>
      </TouchableOpacity>

      {/* Dropdown hiện khi bấm nút */}
      {visible && (
        <View style={styles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => handleSelect(opt)}
              style={[
                styles.dropdownItem,
                selected === opt && styles.dropdownItemSelected,
              ]}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selected === opt && styles.dropdownTextSelected,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  floatingFilter: {
    position: "absolute",
    top: 180,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e86de",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 100,
  },
  filterLabel: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 220,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 6,
    width: 160,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  dropdownItemSelected: {
    backgroundColor: "#e8f0fe",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownTextSelected: {
    color: "#2e86de",
    fontWeight: "700",
  },
});

export default FilterBar;
