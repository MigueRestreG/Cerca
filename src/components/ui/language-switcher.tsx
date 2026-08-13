import { View } from 'react-native';

import type { Language } from '@/domain/demo-market';

import { Pill } from './pill';

export function LanguageSwitcher({
  value,
  onChange,
  languages,
}: {
  value: Language;
  onChange: (language: Language) => void;
  languages: readonly { code: Language; label: string }[];
}) {
  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {languages.map((language) => (
          <Pill key={language.code} label={language.label} selected={value === language.code} onPress={() => onChange(language.code)} />
        ))}
      </View>
    </View>
  );
}