export type DNSData = {
    "DNS Server": string;
    "IP Address": string;
    "DoH Support": string;
    note?: string;
};

export type NoteData = {
    note: string;
};

export type DNSResults = {
    result: (DNSData | NoteData)[];
};
