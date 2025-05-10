
import { colors } from '@/constants/Colors';
import { categories } from '@/mocks/categories';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategoryButton,
              { borderColor: category.color }
            ]}
            onPress={() => onSelectCategory(category.id)}
            activeOpacity={0.7}
          >
            <View 
              style={[
                styles.colorIndicator, 
                { backgroundColor: category.color }
              ]} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  categoriesContainer: {
    paddingVertical: 4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  selectedCategoryButton: {
    backgroundColor: colors.inputBackground,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedCategoryText: {
    fontWeight: '600',
  },
});