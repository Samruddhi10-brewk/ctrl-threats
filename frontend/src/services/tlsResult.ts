export const tlsData = {
    "statusCode": 200,
    "body": {
        "id": 60314989,
        "timestamp": "2024-12-02T05:46:10.912246Z",
        "target": "kaggle.com",
        "replay": -1,
        "has_tls": true,
        "cert_id": 189692284,
        "trust_id": 344047252,
        "is_valid": true,
        "completion_perc": 100,
        "connection_info": {
            "scanIP": "35.244.233.98",
            "serverside": true,
            "ciphersuite": [
                {
                    "cipher": "AES256-SHA",
                    "code": 53,
                    "protocols": [
                        "TLSv1.2"
                    ],
                    "pubkey": 2048,
                    "sigalg": "sha256WithRSAEncryption",
                    "ticket_hint": "7200",
                    "ocsp_stapling": false,
                    "pfs": "None",
                    "curves": "None"
                },
                {
                    "cipher": "DES-CBC3-SHA",
                    "code": 10,
                    "protocols": [
                        "TLSv1.2"
                    ],
                    "pubkey": 2048,
                    "sigalg": "sha256WithRSAEncryption",
                    "ticket_hint": "7200",
                    "ocsp_stapling": false,
                    "pfs": "None",
                    "curves": "None"
                },
                {
                    "cipher": "DES-CBC3-ihwen",
                    "code": 10,
                    "protocols": [
                        "TLSv1.2"
                    ],
                    "pubkey": 2048,
                    "sigalg": "sha256WithRSAEncryption",
                    "ticket_hint": "7200",
                    "ocsp_stapling": false,
                    "pfs": "None",
                    "curves": "None"
                },
                {
                    "cipher": "DES-CBC3-uhnwd",
                    "code": 10,
                    "protocols": [
                        "TLSv1.2"
                    ],
                    "pubkey": 2048,
                    "sigalg": "sha256WithRSAEncryption",
                    "ticket_hint": "7200",
                    "ocsp_stapling": false,
                    "pfs": "None",
                    "curves": "None"
                }
            ],
            "curvesFallback": false
        },
        "analysis": [
            {
                "id": 171397544,
                "analyzer": "awsCertlint",
                "result": {
                    "bugs": "None",
                    "errors": "None",
                    "notices": "None",
                    "warnings": "None",
                    "fatalErrors": "None",
                    "informational": "None"
                },
                "success": true
            },
            {
                "id": 171397540,
                "analyzer": "caaWorker",
                "result": {
                    "host": "kaggle.com",
                    "issue": [
                        "pki.goog"
                    ],
                    "has_caa": true,
                    "issuewild": "None"
                },
                "success": true
            },
            {
                "id": 171397543,
                "analyzer": "crlWorker",
                "result": {
                    "revoked": false,
                    "RevocationTime": "0001-01-01T00:00:00Z"
                },
                "success": true
            },
            {
                "id": 171397542,
                "analyzer": "mozillaEvaluationWorker",
                "result": {
                    "level": "intermediate",
                    "failures": {
                        "bad": "None",
                        "old": [
                            "sha256WithRSAEncryption is not an old certificate signature, use sha1WithRSAEncryption",
                            "consider adding ciphers ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-CHACHA20-POLY1305, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-AES256-GCM-SHA384, DHE-RSA-AES128-GCM-SHA256, DHE-DSS-AES128-GCM-SHA256, DHE-DSS-AES256-GCM-SHA384, DHE-RSA-AES256-GCM-SHA384, ECDHE-RSA-AES128-SHA256, ECDHE-ECDSA-AES128-SHA256, ECDHE-ECDSA-AES128-SHA, ECDHE-RSA-AES256-SHA384, ECDHE-ECDSA-AES256-SHA384, ECDHE-ECDSA-AES256-SHA, DHE-RSA-AES128-SHA256, DHE-RSA-AES128-SHA, DHE-DSS-AES128-SHA256, DHE-RSA-AES256-SHA256, DHE-DSS-AES256-SHA, DHE-RSA-AES256-SHA, ECDHE-RSA-DES-CBC3-SHA, ECDHE-ECDSA-DES-CBC3-SHA, EDH-RSA-DES-CBC3-SHA, AES128-SHA256, AES256-SHA256, DHE-DSS-AES256-SHA256, DHE-DSS-AES128-SHA, DHE-RSA-CHACHA20-POLY1305, ECDHE-RSA-CAMELLIA256-SHA384, ECDHE-ECDSA-CAMELLIA256-SHA384, DHE-RSA-CAMELLIA256-SHA256, DHE-DSS-CAMELLIA256-SHA256, DHE-RSA-CAMELLIA256-SHA, DHE-DSS-CAMELLIA256-SHA, CAMELLIA256-SHA256, CAMELLIA256-SHA, ECDHE-RSA-CAMELLIA128-SHA256, ECDHE-ECDSA-CAMELLIA128-SHA256, DHE-RSA-CAMELLIA128-SHA256, DHE-DSS-CAMELLIA128-SHA256, DHE-RSA-CAMELLIA128-SHA, DHE-DSS-CAMELLIA128-SHA, CAMELLIA128-SHA256, CAMELLIA128-SHA, DHE-RSA-SEED-SHA, DHE-DSS-SEED-SHA, SEED-SHA",
                            "add protocols TLSv1.1, TLSv1, SSLv3",
                            "consider enabling OCSP stapling"
                        ],
                        "modern": [
                            "remove ciphersuites ECDHE-RSA-AES128-SHA, ECDHE-RSA-AES256-SHA, AES128-GCM-SHA256, AES256-GCM-SHA384, AES128-SHA, AES256-SHA, DES-CBC3-SHA",
                            "consider adding ciphers ECDHE-ECDSA-AES256-GCM-SHA384, ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-CHACHA20-POLY1305, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-AES256-SHA384, ECDHE-RSA-AES256-SHA384, ECDHE-ECDSA-AES128-SHA256, ECDHE-RSA-AES128-SHA256",
                            "consider enabling OCSP stapling",
                            "use a certificate of type ecdsa, not RSA"
                        ],
                        "intermediate": [
                            "consider adding ciphers ECDHE-ECDSA-CHACHA20-POLY1305, ECDHE-RSA-CHACHA20-POLY1305, ECDHE-ECDSA-AES128-GCM-SHA256, ECDHE-ECDSA-AES256-GCM-SHA384, DHE-RSA-AES128-GCM-SHA256, DHE-RSA-AES256-GCM-SHA384, ECDHE-ECDSA-AES128-SHA256, ECDHE-RSA-AES128-SHA256, ECDHE-ECDSA-AES128-SHA, ECDHE-RSA-AES256-SHA384, ECDHE-ECDSA-AES256-SHA384, ECDHE-ECDSA-AES256-SHA, DHE-RSA-AES128-SHA256, DHE-RSA-AES128-SHA, DHE-RSA-AES256-SHA256, DHE-RSA-AES256-SHA, ECDHE-ECDSA-DES-CBC3-SHA, ECDHE-RSA-DES-CBC3-SHA, EDH-RSA-DES-CBC3-SHA, AES128-SHA256, AES256-SHA256",
                            "add protocols TLSv1.1, TLSv1",
                            "consider enabling OCSP stapling"
                        ]
                    }
                },
                "success": true
            },
            {
                "id": 171397537,
                "analyzer": "mozillaGradingWorker",
                "result": {
                    "grade": 93,
                    "failures": "None",
                    "lettergrade": "A"
                },
                "success": true
            },
            {
                "id": 171397538,
                "analyzer": "sslLabsClientSupport",
                "result": [
                    {
                        "name": "Apple ATS",
                        "curve": "secp256r1",
                        "version": "9",
                        "platform": "iOS 9",
                        "protocol": "TLSv1.2",
                        "curve_code": 23,
                        "ciphersuite": "ECDHE-RSA-AES256-GCM-SHA384",
                        "is_supported": true,
                        "protocol_code": 771,
                        "ciphersuite_code": 49200
                    },
                    {
                        "name": "Tor",
                        "version": "17.0.9",
                        "platform": "",
                        "curve_code": 0,
                        "is_supported": false,
                        "protocol_code": 0
                    },
                    {
                        "name": "Yahoo Slurp",
                        "version": "Oct 2013",
                        "platform": "",
                        "curve_code": 0,
                        "is_supported": false,
                        "protocol_code": 0
                    },
                    {
                        "name": "Yahoo Slurp",
                        "curve": "secp384r1",
                        "version": "Jun 2014",
                        "platform": "",
                        "protocol": "TLSv1.2",
                        "curve_code": 24,
                        "ciphersuite": "ECDHE-RSA-AES256-GCM-SHA384",
                        "is_supported": true,
                        "protocol_code": 771,
                        "ciphersuite_code": 49200
                    },
                    {
                        "name": "Yahoo Slurp",
                        "curve": "secp384r1",
                        "version": "Jan 2015",
                        "platform": "",
                        "protocol": "TLSv1.2",
                        "curve_code": 24,
                        "ciphersuite": "ECDHE-RSA-AES256-GCM-SHA384",
                        "is_supported": true,
                        "protocol_code": 771,
                        "ciphersuite_code": 49200
                    },
                    {
                        "name": "YandexBot",
                        "version": "3.0",
                        "platform": "",
                        "curve_code": 0,
                        "is_supported": false,
                        "protocol_code": 0
                    },
                    {
                        "name": "YandexBot",
                        "version": "May 2014",
                        "platform": "",
                        "curve_code": 0,
                        "is_supported": false,
                        "protocol_code": 0
                    },
                    {
                        "name": "YandexBot",
                        "curve": "secp384r1",
                        "version": "Sep 2014",
                        "platform": "",
                        "protocol": "TLSv1.2",
                        "curve_code": 24,
                        "ciphersuite": "ECDHE-RSA-AES256-GCM-SHA384",
                        "is_supported": true,
                        "protocol_code": 771,
                        "ciphersuite_code": 49200
                    },
                    {
                        "name": "YandexBot",
                        "curve": "secp384r1",
                        "version": "Jan 2015",
                        "platform": "",
                        "protocol": "TLSv1.2",
                        "curve_code": 24,
                        "ciphersuite": "ECDHE-RSA-AES256-GCM-SHA384",
                        "is_supported": true,
                        "protocol_code": 771,
                        "ciphersuite_code": 49200
                    }
                ],
                "success": true
            },
            {
                "id": 171397541,
                "analyzer": "symantecDistrust",
                "result": {
                    "reasons": "None",
                    "isDistrusted": false
                },
                "success": true
            },
            {
                "id": 171397539,
                "analyzer": "top1m",
                "result": {
                    "target": {
                        "rank": 1759,
                        "domain": "kaggle.com",
                        "alexa_rank": 1759,
                        "cisco_rank": 126102
                    },
                    "certificate": {
                        "rank": 1759,
                        "domain": "kaggle.com",
                        "alexa_rank": 1759,
                        "cisco_rank": 126102,
                        "alexa_domain": "kaggle.com",
                        "cisco_domain": "kaggle.com"
                    }
                },
                "success": true
            }
        ],
        "ack": true,
        "attempts": 1,
        "analysis_params": {}
    }
}

