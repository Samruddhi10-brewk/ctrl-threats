from flask import Flask, render_template, request, jsonify
import time
import logging
from app.utils.validator import check_email_authentication, is_valid_email_header

# Setup logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger()

app = Flask(__name__)

@app.route('/validate', methods=['POST'])
def validate():
    start_time = time.time()  # Capture the start time
    logger.info("Validation process started")

    header_text = request.form.get('header_text', '')  # Get email header input from the form
    logger.debug(f"Received header_text: {header_text}")

    # Validate the header format
    if not is_valid_email_header(header_text):
        logger.error("Invalid email header format")
        return jsonify({"error": "Invalid email header format. Please provide a valid email header."}), 400

    # Perform the email header analysis for phishing indicators
    logger.info("Performing email header analysis")
    result = check_email_authentication(header_text)
    logger.debug(f"Analysis result: {result}")

    end_time = time.time()  # Capture the end time
    processing_time = round(end_time - start_time, 4)  # Time in seconds, rounded to 4 decimal places

    logger.info(f"Validation process completed in {processing_time} seconds")

    # Return a JSON response with the result and processing time
    return jsonify({"result": result, "processing_time": processing_time})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

# test
