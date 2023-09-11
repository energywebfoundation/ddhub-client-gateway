import { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/mui';

// const theme: ThemeProps = {};

// export function generateTheme<
//   T = any,
//   S extends StrictRJSFSchema = RJSFSchema,
//   F extends FormContextType = any
// >(): ThemeProps<T, S, F> {
//   return {
//     templates: {},
//     widgets: {},
//   };
// }

// export function generateForm<
//   T = any,
//   S extends StrictRJSFSchema = RJSFSchema,
//   F extends FormContextType = any
// >(): ComponentType<FormProps<T, S, F>> {
//   return withTheme<T, S, F>(generateTheme<T, S, F>());
// }

export const ThemedForm = withTheme(Theme);

// export const CustomForm = () => <ThemedForm validator={validator} />;
