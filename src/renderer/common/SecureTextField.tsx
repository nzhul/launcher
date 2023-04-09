import { MenuItem, TextField } from '@mui/material';

const SecureTextField: React.FC<{
  value: any;
  entity: any;
  setEntity: any;
  propertyName: string;
  dirtyProps: string[];
  setDirtyProps: any;
  validObj: { valid: boolean; message: string };
  submitting: boolean;
  disabled: boolean;
  size?: 'small' | 'medium';
  select?: boolean;
  menuItems?: { value: string; label: string }[];
  sx?: any;
  testId?: string;
  inputProps?: any;
  type?: React.InputHTMLAttributes<unknown>['type'];
}> = ({
  value,
  entity,
  setEntity,
  propertyName,
  dirtyProps,
  setDirtyProps,
  submitting,
  validObj,
  disabled,
  size,
  select,
  menuItems,
  sx,
  testId,
  inputProps,
  type,
}) => {
  return (
    <TextField
      type={type}
      data-testid={testId}
      error={
        (submitting || dirtyProps?.includes(propertyName)) && !validObj.valid
      }
      helperText={
        (submitting || dirtyProps?.includes(propertyName)) &&
        !validObj.valid &&
        validObj.message
      }
      disabled={disabled}
      fullWidth
      //   label={propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
      placeholder={propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
      variant="outlined"
      value={value}
      onChange={(e) => {
        const updated = {
          ...entity,
        };
        updated[propertyName] = e.target.value;

        setEntity(updated);

        if (!dirtyProps?.includes(propertyName)) {
          setDirtyProps([...dirtyProps!, propertyName]);
        }
      }}
      select={select}
      size={size}
      sx={{
        // TODO: Maybe move this into the main theme ?
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            borderColor: '#359adc', // todo; this should be main theme color - currently it is blue, but needs to be green.
          },
        '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: '#ff6e63',
        },
        '& fieldset': { borderRadius: 0 },
        '& .MuiFormHelperText-root.Mui-error': { color: '#ff6e63' },
        ...sx,
      }}
      InputProps={inputProps}
    >
      {select &&
        menuItems &&
        menuItems.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
};

export default SecureTextField;
