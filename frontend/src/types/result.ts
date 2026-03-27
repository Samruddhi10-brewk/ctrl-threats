import { ReactNode } from "react";

export interface DomainInfo {
    jobs_successful: any;
    jobs_skipped: any;
    jobs_failed: any;
    domain: string;
    associated_domains: AssociatedDomains;
    carbon: Carbon;
    check_dnssec: CheckDNSSEC;
    check_email_configuration: CheckEmailConfiguration;
    check_firewall_endpoint: CheckFirewallEndpoint;
    check_hsts: CheckHSTS;
    check_http_security: CheckHTTPHeaderSecurity;
    check_security: CheckSecurity;
    check_server_status: CheckServerStatus;
    check_threat: CheckThreat;
    check_tls: CheckTLS;
    check_url: CheckURL;
    cookies: Cookies;
    dns_record: DNSRecord;
    domain_info: DomainInfoDetails;
    get_links: GetLinks;
    get_rank: GetRank;
    get_social_tags: GetSocialTags;
    http_headers: HTTPHeaders;
    ip: IPInfo;
    redirect_chain: RedirectChain[];
    robots_txt: string;
    scan_ports_api: ScanPortsAPI;
    server_info: ServerInfo;
    server_location: ServerLocation;
    ssl: SSLInfo;
    ssl_curve: SSLCurve;
}

export interface AssociatedDomains {
    associated_domains: string[];
    domain: string;
}

export interface Carbon {
    cleanerThan: number;
    green: boolean;
    rating: string;
    scanUrl: string;
    statistics: CarbonStatistics;
}

export interface CarbonStatistics {
    adjustedBytes: number;
    co2: Co2;
    energy: number;
}

export interface Co2 {
    grid: Co2Details;
    renewable: Co2Details;
}

export interface Co2Details {
    grams: number;
    litres: number;
}

export interface CheckDNSSEC {
    DNSKEY: DNSKey;
    DS: DNSKey;
    RRSIG: DNSKey;
}

export interface DNSKey {
    "Authentic Data (AD)": boolean;
    "Checking Disabled (CD)": boolean;
    Present: string;
    "Recursion Available (RA)": boolean;
    "Recursion Desired (RD)": boolean;
    "TrunCation (TC)": boolean;
}

export interface CheckEmailConfiguration {
    spf: string;
    dkim: string;
    dmarc: string;
    bimi: string;
    mxRecords: any;
    result: string;
}

export interface CheckFirewallEndpoint {
    firewallEnabled: any;
    wafType: any;
    domain: string;
    firewall_info: FirewallInfo;
}

export interface FirewallInfo {
    Firewall: string;
    WAF: string;
}

export interface CheckHSTS {
    hstsEnabled: boolean;
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
    compatibility: {
        preloadReady: boolean;
        notes: string;
    };
}

export interface CheckHTTPHeaderSecurity {
    security_headers: SecurityHeaders;
    url: string;
}

export interface SecurityHeaders {
    "Content Security Policy": boolean;
    "Strict Transport Policy": boolean;
    "X-Content-Type-Options": boolean;
    "X-Frame-Options": boolean;
    "X-XSS-Protection": boolean;
}

export interface CheckSecurity {
    result: string;
}

export interface CheckServerStatus {
    message: string;
}

export interface CheckThreat {
    details: ThreatDetails;
    overall_verdict: string;
}

export interface ThreatDetails {
    "Google Safe Browsing": string;
    Threats: string;
    "VirusTotal": string;
}

export interface CheckTLS {
    body: TLSBody;
    statusCode: number;
}

export interface TLSBody {
    ack: boolean;
    analysis_params: object;
    attempts: number;
    cert_id: number;
    completion_perc: number;
    connection_info: ConnectionInfo;
    has_tls: boolean;
    id: number;
    is_valid: boolean;
    replay: number;
    target: string;
    timestamp: string;
    trust_id: number;
}

export interface ConnectionInfo {
    ciphersuite: string | null;
    curvesFallback: boolean;
    scanIP: string;
    serverside: boolean;
}

export interface CheckURL {
    [key: string]: string;
}

export interface Cookies {
    cookies: Record<string, Cookie>;
    domain: string;
}

export interface Cookie {
    Domain: string;
    HttpOnly: boolean;
    Path: string;
    Secure: boolean;
    Value: string;
}

export interface DNSRecord {
    dns_records: DNSRecords;
    domain: string;
}

export interface DNSRecords {
    A: string[];
    AAAA: string[];
    CNAME: string;
    MX: string[];
    NS: string[];
    TXT: string[];
}

export interface DomainInfoDetails {
    "Administrative Contact": ContactInfo;
    "Domain Information": DomainInformation;
    "Raw Whois Data": string;
    "Registrant Contact": ContactInfo;
    "Technical Contact": ContactInfo;
}

export interface ContactInfo {
    City: string | null;
    Country: string;
    Email: string | null;
    Name: string | null;
    Organization: string;
    Phone: string | null;
    "Postal Code": string | null;
    State: string;
    Street: string | null;
}

export interface DomainInformation {
    Domain: string[];
    "Expires On": string;
    "Name Servers": string[];
    "Registered On": string;
    Registrar: string;
    Status: string[];
    "Updated On": string;
}

export interface GetLinks {
    external: string[];
    internal: string[];
}

export interface GetRank {
    ranks: Array<{ date: string, rank: number }>,
    domain: string
}

export interface GetSocialTags {
    [key: string]: string;
}

export interface HTTPHeaders {
    domain: string;
    headers: Record<string, string>;
}

export interface IPInfo {
    domain: string;
    ip_addresses: string;
}

export interface RedirectChain {
    redirect_chain(redirect_chain: any): unknown;
    domain: ReactNode;
    "Redirected URL": string;
    "Status Code": number;
    "Final URL"?: string;
}

export interface ScanPortsAPI {
    domain: string;
    open_ports: number[];
}

export interface ServerInfo {
    "ASN Code": string;
    "Content Type": string;
    Country: string | null;
    IP: string;
    ISP: string;
    "Network Range": string;
    Organization: string;
    "Server Type": string;
}

export interface ServerLocation {
    domain: string;
    ip_address: string;
    location_info: LocationInfo;
}

export interface LocationInfo {
    City: string;
    Country: string;
    "IP Address": string;
    Latitude: string;
    Longitude: number;
    Organization: number;
    Postal: string;
    Region: string;
    Timezone: string;
}

export interface SSLInfo {
    domain: string;
    ssl_info: SSLDetails;
}

export interface SSLDetails {
    Expires: string;
    Fingerprint: string;
    Issuer: string;
    Renewed: string;
    "Serial Num": string;
    Subject: string;
}

export interface SSLCurve {
    ASN1_Curve: string;
    NIST_Curve: string;
    domain: string;
}

