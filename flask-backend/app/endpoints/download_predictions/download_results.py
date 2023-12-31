from flask import Blueprint, send_file
import app.globals as globals
import os

download_results_blueprint = Blueprint('download_results_bp', __name__)

@download_results_blueprint.route('/download', methods=['GET'])
def download_csv_results():
    target = globals.BATCH_PREDICTION_RESULTS_DIRECTORY
    prediction_file_path = os.path.join(target, 'predictions.csv')
    
    if os.path.exists(prediction_file_path):
        return send_file(prediction_file_path, as_attachment=True, download_name='predictions.csv')
    else:
        return "File not found", 404
