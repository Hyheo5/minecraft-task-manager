import { GlobalProperty } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PropertyRowProps {
  property: GlobalProperty;
  value: any;
  onChange: (val: string | number | boolean) => void;
}

export default function PropertyRow({ property, value, onChange }: PropertyRowProps) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
      <Label className="text-neutral-400 text-sm font-normal">{property.name}</Label>
      
      {property.type === 'text' && (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 bg-transparent border-transparent hover:border-neutral-700 focus:border-neutral-700 focus-visible:ring-0 px-2"
          placeholder="Empty"
        />
      )}

      {property.type === 'number' && (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="h-8 bg-transparent border-transparent hover:border-neutral-700 focus:border-neutral-700 focus-visible:ring-0 px-2"
          placeholder="Empty"
        />
      )}

      {property.type === 'select' && (
        <Select value={value?.toString() || ''} onValueChange={onChange}>
          <SelectTrigger className="h-8 bg-transparent border-transparent hover:border-neutral-700 focus:ring-0 px-2 w-full justify-between">
            <SelectValue placeholder="Empty" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
            {property.options?.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                  {opt.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {property.type === 'checkbox' && (
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 accent-green-500 cursor-pointer"
        />
      )}
    </div>
  );
}
