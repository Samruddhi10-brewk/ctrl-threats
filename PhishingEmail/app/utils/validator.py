import re

def is_valid_email_header(header_text):
    """
    Check if the provided text contains essential email header fields.
    Requires at least 2 of these common email header fields: From, To, Subject, Date, Received, Delivered-To
    """
    # Strip whitespace
    header_text = header_text.strip()
    
    if not header_text:
        return False
    
    # Define email header patterns (case-insensitive, flexible matching)
    header_patterns = [
        r"Received:",           # Checks for 'Received' header
        r"From:",               # Checks for 'From' header
        r"To:",                 # Checks for 'To' header
        r"Subject:",            # Checks for 'Subject' header
        r"Date:",               # Checks for 'Date' header
        r"Delivered-To:",       # Checks for 'Delivered-To' header
    ]

    # Count how many email header fields are present
    found_count = 0
    for pattern in header_patterns:
        if re.search(pattern, header_text, re.IGNORECASE | re.MULTILINE):
            found_count += 1
    
    # Require at least 2 header fields to consider it a valid email header
    return found_count >= 2

def check_email_authentication(header_text):
    """
    Analyze email headers for SPF, DKIM, DMARC, and other phishing indicators.
    """
    # Validate the email header format
    if not is_valid_email_header(header_text):
        return {"error": "Invalid email header format. Please provide a valid email header."}

    # Initialize variables for storing header information
    spf_status, dkim_status, dmarc_status = "Not Found", "Not Found", "Not Found"
    is_phishing = False
    other_indicators = []

    # Check SPF
    spf_result = re.search(r"spf=(pass|none|fail|softfail|neutral|permerror|temperror)", header_text, re.IGNORECASE)
    if spf_result:
        spf_status = spf_result.group(1).capitalize()
        if spf_status != "Pass":
            is_phishing = True  # Flag phishing if SPF fails

    # Check DKIM
    dkim_result = re.search(r"dkim=(pass|none|fail|neutral|permerror|temperror)", header_text, re.IGNORECASE)
    if dkim_result:
        dkim_status = dkim_result.group(1).capitalize()
        if dkim_status != "Pass":
            is_phishing = True  # Flag phishing if DKIM fails

    # Check DMARC
    dmarc_result = re.search(r"dmarc=(pass|none|fail|reject|quarantine)", header_text, re.IGNORECASE)
    if dmarc_result:
        dmarc_status = dmarc_result.group(1).capitalize()
        if dmarc_status != "Pass":
            is_phishing = True  # Flag phishing if DMARC fails

    # Additional checks for phishing indicators
    php_origin_script = re.search(r"X-PHP-Originating-Script", header_text, re.IGNORECASE)
    reply_to_mismatch = re.search(r"Reply-To:\s*(\S+@\S+)\s*\nFrom:\s*(\S+@\S+)", header_text, re.IGNORECASE)
    proofpoint_spam_details = re.search(r"X-Proofpoint-Spam-Details", header_text, re.IGNORECASE)

    if php_origin_script:
        other_indicators.append("Suspicious PHP Origin")
        is_phishing = True  # Flag phishing if PHP script origin is found

    if reply_to_mismatch:
        reply_to_domain = reply_to_mismatch.group(1).split('@')[-1].lower()
        from_domain = reply_to_mismatch.group(2).split('@')[-1].lower()
        if reply_to_domain != from_domain:
            other_indicators.append("Reply-To Mismatch")
            is_phishing = True  # Flag phishing if 'Reply-To' domain does not match 'From' domain

    if proofpoint_spam_details:
        other_indicators.append("Proofpoint Spam Indicator")
        is_phishing = True  # Flag phishing if Proofpoint spam header is found

    # Prepare and return the result
    return {
        "spf_status": spf_status,
        "dkim_status": dkim_status,
        "dmarc_status": dmarc_status,
        "is_phishing": is_phishing,
        "other_indicators": other_indicators,
    }
