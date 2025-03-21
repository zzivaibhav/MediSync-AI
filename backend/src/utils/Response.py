from flask import jsonify

def Response(data=None, message="Success", status_code=200, error=None):
    """
    Creates a consistent JSON response for all API endpoints.
    
    :param data: The data to be returned (default: None).
    :param message: A message describing the response (default: "Success").
    :param status_code: The HTTP status code (default: 200).
    :param error: An error message or details (default: None).
    :return: A JSON response.
    """
    response = {
        "status": "success" if status_code < 400 else "error",
        "message": message,
        "data": data,
        "error": error
    }
    return jsonify(response), status_code