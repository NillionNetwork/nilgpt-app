import { StyleSheet } from 'react-native';
import colors from 'tailwindcss/colors';

export const markdownStyles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 21,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.neutral[300],
    borderRadius: 8,
  },
  tr: {
    borderBottomColor: colors.neutral[400],
    borderRadius: 8,
  },
  thead: {
    backgroundColor: colors.neutral[800],
    borderRadius: 8,
    fontWeight: 'bold',
  },
  blockquote: {
    backgroundColor: colors.neutral[800],
    paddingBottom: 10,
    marginTop: 10,
  },
  bullet_list_icon: {
    color: colors.neutral[300],
  },
  ordered_list_icon: {
    color: colors.neutral[300],
    lineHeight: 24,
  },
});
