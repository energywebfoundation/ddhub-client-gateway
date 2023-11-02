import { ArrayFieldTemplateItemType } from '@rjsf/utils';
import { Box, InputLabel, Stack, Typography } from '@mui/material';

export const CustomArrayFieldItemTemplate = ({
  index,
  children,
  onReorderClick,
  onDropIndexClick,
  hasMoveDown,
  hasMoveUp,
  hasRemove,
  classes,
  value,
  registry,
  disabled,
  readonly,
}: ArrayFieldTemplateItemType & {
  classes: Record<string, string>;
  value: string;
}) => {
  const { MoveUpButton, MoveDownButton, RemoveButton } =
    registry.templates.ButtonTemplates;

  const { onChange, formData } = children.props;

  if (!formData || formData !== value) {
    onChange(value);
  }

  return (
    <Stack direction="row" display="flex" width="100%">
      <InputLabel className={classes['label']}>{index + 1}.</InputLabel>
      <Box pl={1} flexGrow={1}>
        <Typography>{formData}</Typography>
      </Box>
      <Box>
        {(hasMoveUp || hasMoveDown) && (
          <MoveUpButton
            disabled={disabled || readonly || !hasMoveUp}
            onClick={onReorderClick(index, index - 1)}
            registry={registry}
          />
        )}
        {(hasMoveUp || hasMoveDown) && (
          <MoveDownButton
            disabled={disabled || readonly || !hasMoveDown}
            onClick={onReorderClick(index, index + 1)}
            registry={registry}
          />
        )}
        {hasRemove && (
          <RemoveButton
            disabled={disabled || readonly || !hasRemove}
            onClick={onDropIndexClick(index)}
            registry={registry}
          />
        )}
      </Box>
    </Stack>
  );
};
