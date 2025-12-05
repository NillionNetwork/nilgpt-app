import { StyleSheet } from 'react-native';
import colors from 'tailwindcss/colors';

export const markdownStyles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.gray[500],
    borderRadius: 8,
  },
  tr: {
    borderBottomColor: colors.gray[400],
    borderRadius: 8,
  },
  thead: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    fontWeight: 'bold',
  },
});
