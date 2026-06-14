export type User = {
  id: string;
  name: string;
  avatar_url?: string;
  flag_color: string;
  created_at: string;
};

export type GlobalPropertyOption = {
  id: string;
  label: string;
  color: string;
};

export type GlobalProperty = {
  id: string;
  name: string;
  type: 'select' | 'text' | 'number' | 'checkbox';
  options?: GlobalPropertyOption[]; // For 'select' type
};

export type NodeProperties = {
  [propertyId: string]: string | number | boolean;
};

export type CustomNodeData = {
  title: string;
  description?: string;
  progress: number;
  properties: NodeProperties;
  created_at?: string;
  updated_at?: string;
};

export type Presence = {
  user_id: string;
  working_on_node_id?: string;
  status: 'online' | 'offline';
  cursor_position?: { x: number; y: number };
};
