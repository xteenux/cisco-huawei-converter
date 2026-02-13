
export enum ConversionType {
  VRF = 'VRF',
  Routing = 'Routing',
  Physical = 'Physical',
  VLAN = 'VLAN',
}

export interface ConversionOption {
  id: ConversionType;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  example: string;
}
