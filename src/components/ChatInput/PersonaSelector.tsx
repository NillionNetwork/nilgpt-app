import type { TPersona } from '@/types/chat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ui/select';
import { Text } from '@ui/text';
import { PERSONA_OPTIONS_MAP, PERSONAS } from './constants';
import type { IPersonaSelectorProps } from './types';

const PersonaSelector: React.FC<IPersonaSelectorProps> = ({
  persona,
  disabled,
  onPersonaChange,
}) => {
  return (
    <Select
      value={PERSONA_OPTIONS_MAP[persona]}
      onValueChange={(option) => onPersonaChange(option?.value as TPersona)}>
      <SelectTrigger size="sm" disabled={disabled}>
        <SelectValue placeholder="Select a persona" />
      </SelectTrigger>
      <SelectContent
        align="center"
        position="item-aligned"
        side="top"
        sideOffset={5}
        className="w-[240px]">
        {PERSONAS.map((persona) => (
          <SelectItem
            key={persona.value}
            value={persona.value}
            label={persona.label}
            className="flex flex-col items-start gap-0.5">
            <Text className="select-none text-sm text-foreground">
              {persona.label}
            </Text>
            <Text className="select-none text-xs text-muted-foreground">
              {persona.description}
            </Text>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PersonaSelector;
