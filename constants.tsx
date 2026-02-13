
import React from 'react';
import { ConversionType, type ConversionOption } from './types';

const VrfIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);

const RoutingIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const PhysicalIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);

const VlanIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const VRF_EXAMPLE = `vrf definition CUST_A
 rd 100:1
 route-target export 100:1
 route-target import 100:1
 !
 address-family ipv4
 exit-address-family
!
interface GigabitEthernet0/1
 vrf forwarding CUST_A
 ip address 192.168.1.1 255.255.255.0`;

const ROUTING_EXAMPLE = `router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.0.0.255 area 0
!
router bgp 65000
 bgp router-id 2.2.2.2
 neighbor 1.2.3.4 remote-as 65001`;

const PHYSICAL_EXAMPLE = `interface GigabitEthernet0/1
 description UPLINK_TO_ROUTER
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 mtu 9000
 speed 1000
 duplex full`;

const VLAN_EXAMPLE = `interface Vlan10
 description USERS_VLAN
 ip address 10.10.10.1 255.255.255.0
 standby 1 ip 10.10.10.3`;

export const CONVERSION_OPTIONS: ConversionOption[] = [
  {
    id: ConversionType.VRF,
    name: 'VRF',
    title: 'VRF Configuration',
    description: 'Convert Cisco VRF to Huawei VPN-Instance',
    icon: <VrfIcon className="w-5 h-5 mr-2" />,
    example: VRF_EXAMPLE,
  },
  {
    id: ConversionType.Routing,
    name: 'Routing',
    title: 'Routing Protocol Configuration',
    description: 'Convert OSPF, BGP, EIGRP configurations',
    icon: <RoutingIcon className="w-5 h-5 mr-2" />,
    example: ROUTING_EXAMPLE,
  },
  {
    id: ConversionType.Physical,
    name: 'Physical',
    title: 'Physical Port Configuration',
    description: 'Map physical interface configurations',
    icon: <PhysicalIcon className="w-5 h-5 mr-2" />,
    example: PHYSICAL_EXAMPLE,
  },
  {
    id: ConversionType.VLAN,
    name: 'VLAN',
    title: 'VLAN Interface Configuration',
    description: 'Convert Cisco SVI to Huawei VLANIF',
    icon: <VlanIcon className="w-5 h-5 mr-2" />,
    example: VLAN_EXAMPLE,
  },
];
