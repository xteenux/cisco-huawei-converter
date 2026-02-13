
import { GoogleGenAI } from "@google/genai";
import { ConversionType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (type: ConversionType): string => {
    let conversionDetails = '';
    switch (type) {
        case ConversionType.VRF:
            conversionDetails = `
- Handle both 'vrf definition <name>' and 'ip vrf <name>' syntaxes, mapping them to 'ip vpn-instance <name>'.
- When converting, automatically create the 'ipv4-family' context under the vpn-instance.
- Map 'rd <value>' to 'route-distinguisher <value>'.
- Map 'route-target export <value>' to 'vpn-target <value> export-extcommunity'.
- Map 'route-target import <value>' to 'vpn-target <value> import-extcommunity'.
- Map 'import map <policy>' to 'import route-policy <policy>'.
- Map 'export map <policy>' to 'export route-policy <policy>'.
- Map 'maximum routes <limit> <threshold>' to 'routing-table limit <limit> <threshold>'.
- Map interface assignment 'vrf forwarding <name>' or 'ip vrf forwarding <name>' to 'ip binding vpn-instance <name>' under the interface.`;
            break;
        case ConversionType.Routing:
            conversionDetails = `
- For OSPF:
  - Convert 'router ospf <pid>' to 'ospf <pid>'.
  - If a global router-id is present in the Cisco config, use it for the Huawei 'router-id' under OSPF.
  - 'auto-cost reference-bandwidth <bw>' -> 'bandwidth-reference <bw>'.
  - 'passive-interface default' -> 'silent-interface all'.
  - 'no passive-interface <intf>' -> 'undo silent-interface <intf>'.
  - 'timers throttle spf <delay> <initial-hold> <max-hold>' -> 'spf-schedule-interval <delay> <initial-hold> <max-hold>'.
- For BGP:
  - Convert 'router bgp <as>' to 'bgp <as>'.
  - 'bgp router-id <id>' -> 'router-id <id>'.
  - 'neighbor <ip> remote-as <as>' -> 'peer <ip> as-number <as>'.
  - 'neighbor <ip> update-source <intf>' -> 'peer <ip> connect-interface <intf>'.
  - 'neighbor <ip> description <desc>' -> 'peer <ip> description <desc>'.
  - 'neighbor <ip> password <pass>' -> 'peer <ip> password cipher <encrypted_pass>'.
  - 'address-family ipv4 vrf <name>' -> 'ipv4-family vpn-instance <name>'.
  - 'redistribute connected' -> 'import-route direct'.
  - 'redistribute static' -> 'import-route static'.
- For BGP Route-Reflectors:
  - If you identify peers activated under 'address-family vpnv4' that are likely route-reflector clients:
  - Create a peer group in Huawei (e.g., 'group RR internal').
  - Add common configurations to this group ('peer RR enable', 'peer RR advertise-community', etc.).
  - Assign the identified peers to this group ('peer <ip> group RR').
  - Under 'ipv4-family vpnv4', enable the group: 'peer RR enable' and apply 'peer RR route-reflector'.`;
            break;
        case ConversionType.Physical:
            conversionDetails = `
- Map interface names: 'GigabitEthernet' -> 'GE', 'TenGigabitEthernet' -> '10GE'.
- 'description <text>' -> 'description <text>'.
- 'switchport mode trunk' -> 'port link-type trunk'.
- 'switchport trunk allowed vlan <list>' -> 'port trunk allow-pass vlan <list>'.
- 'mtu <value>' -> 'mtu <value>'.
- 'no cdp enable' -> 'undo lldp enable'.
- 'spanning-tree bpdufilter enable' -> 'stp bpdu-filter enable'.
- 'spanning-tree guard root' -> 'stp root-protection'.
- For 'service instance <id> ethernet' configurations under a physical port:
  - Create a new L2 sub-interface: 'interface <phy>.<id> mode l2'.
  - 'encapsulation dot1q <vid>' -> 'encapsulation dot1q vid <vid>'.
  - 'rewrite ingress tag pop 1' -> 'rewrite pop single'.
  - 'bridge-domain <bd_id>' -> 'bridge-domain <bd_id>'.
  - If 'xconnect' is found, generate the corresponding 'vsi' and 'bridge-domain' configs as specified in the VLAN/VBDIF section.`;
            break;
        case ConversionType.VLAN:
            conversionDetails = `
- Scenario 1: L3 VLAN Interface (SVI).
  - Map 'interface Vlan<id>' to 'interface Vlanif<id>'.
  - 'description <text>' -> 'description <text>'.
  - 'ip address <ip> <subnet>' -> 'ip address <ip> <subnet-mask-length>'.
  - Map Cisco HSRP/VRRP 'standby <group> ip <vip>' to Huawei VRRP 'vrrp vrid <group> virtual-ip <vip>'.
- Scenario 2: L2 VPLS/VBDIF Interface.
  - If 'xconnect' is present, map 'interface Vlan<id>' to 'interface Vbdif<id>'. This is for L2VPNs.
  - For an 'xconnect <peer_ip> <vc_id> encapsulation mpls' command:
    1. Create a 'bridge-domain <vc_id>'. Bind the VBDIF: 'l2 binding vsi <vsi_name>'.
    2. Create a VSI: 'vsi <vsi_name> bd-mode'.
    3. Configure the VSI with 'pwsignal ldp', 'vsi-id <vc_id>', and 'peer <peer_ip>'.`;
            break;
    }

    return `You are an expert network engineer specializing in both Cisco IOS and Huawei VRP. Your task is to convert the provided Cisco configuration into the equivalent Huawei VRP configuration.

Follow these rules strictly:
1. Provide only the Huawei VRP configuration commands as a raw text block.
2. Do not include any explanations, apologies, introductory text, concluding text, or markdown code fences like \`\`\`.
3. Maintain the structure and intent of the original configuration precisely.
4. Adhere to the following specific conversion mappings for ${type} configurations:
${conversionDetails}
`;
};

export const convertConfiguration = async (type: ConversionType, configText: string): Promise<string> => {
  const systemInstruction = getSystemInstruction(type);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: configText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1,
      },
    });

    if (response.text) {
      return response.text.trim();
    }
    
    throw new Error('Received an empty response from the AI model.');

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to communicate with the AI service.');
  }
};
