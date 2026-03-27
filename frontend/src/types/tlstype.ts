type CipherSuite = {
    cipher: string;
    code: number;
    protocols: string[];
    pubkey: number;
    sigalg: string;
    ticket_hint: string;
    ocsp_stapling: boolean;
    pfs: string;
    curves: string;
};

export type ConnectionInfo = {
    scanIP: string;
    serverside: boolean;
    ciphersuite: CipherSuite[];
    curvesFallback: boolean;
};

type AnalysisResultAwsCertlint = {
    bugs: string;
    errors: string;
    notices: string;
    warnings: string;
    fatalErrors: string;
    informational: string;
};

type AnalysisResultCaaWorker = {
    host: string;
    issue: string[];
    has_caa: boolean;
    issuewild: string | null;
};

type AnalysisResultCrlWorker = {
    revoked: boolean;
    RevocationTime: string;
};

type Failures = {
    bad: string | null;
    old: string[];
    modern: string[];
    intermediate: string[];
};

type AnalysisResultMozillaEvaluationWorker = {
    level: string;
    failures: Failures;
};

type AnalysisResultMozillaGradingWorker = {
    grade: number;
    failures: string | null;
    lettergrade: string;
};

type SslLabsClientSupport = {
    name: string;
    curve?: string;
    version: string;
    platform: string;
    protocol?: string;
    curve_code: number;
    ciphersuite?: string;
    is_supported: boolean;
    protocol_code: number;
    ciphersuite_code?: number;
};

type AnalysisResultSymantecDistrust = {
    reasons: string | null;
    isDistrusted: boolean;
};

type Top1mTarget = {
    rank: number;
    domain: string;
    alexa_rank: number;
    cisco_rank: number;
};

type Top1mCertificate = {
    rank: number;
    domain: string;
    alexa_rank: number;
    cisco_rank: number;
    alexa_domain: string;
    cisco_domain: string;
};

type AnalysisResultTop1m = {
    target: Top1mTarget;
    certificate: Top1mCertificate;
};

export type Analysis = {
    id: number;
    analyzer: string;
    result:
    | AnalysisResultAwsCertlint
    | AnalysisResultCaaWorker
    | AnalysisResultCrlWorker
    | AnalysisResultMozillaEvaluationWorker
    | AnalysisResultMozillaGradingWorker
    | SslLabsClientSupport[]
    | AnalysisResultSymantecDistrust
    | AnalysisResultTop1m;
    success: boolean;
};

export type TlsData = {
    [x: string]: any;
    id: number;
    timestamp: string;
    target: string;
    replay: number;
    has_tls: boolean;
    cert_id: number;
    trust_id: number;
    is_valid: boolean;
    completion_perc: number;
    connection_info: ConnectionInfo;
    analysis: Analysis[];
    ack: boolean;
    attempts: number;
    analysis_params: Record<string, unknown>;
};

export type JsonTLSResponse = {
    statusCode: number;
    body: TlsData;
};

