from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

import torch
import cv2
import numpy as np
import pathlib

from googletrans import Translator

UPLOAD_FOLDER = 'C:/Users/Carlos/Desktop/imagenes-frontend'

temp = pathlib.PosixPath

pathlib.PosixPath = pathlib.WindowsPath

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:''@localhost/flask3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)
ma = Marshmallow(app)

app.app_context().push()

model = torch.hub.load('ultralytics/yolov5', 'custom', 
                    path= 'C:/Users/Carlos/Desktop/prueba3/yolo/modelo.pt',
                    force_reload=True)

class Recursos2(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    recid = db.Column(db.String(10))
    recurso = db.Column(db.String(100))
    desc = db.Column(db.Text())

    def __init__(self, recid, recurso, desc):
        self.recid = recid
        self.recurso = recurso
        self.desc = desc

class RecursoSchema(ma.Schema):
    class Meta:
        fields = ('id', 'recid','recurso','desc')

recurso_schema = RecursoSchema()
recursos_schema = RecursoSchema(many="true")

@app.route('/get', methods=['GET'])
def get_articles():
    print("ENTRO A GET")
    recid = request.args.get('recid')
    print('DEVOLVIO::::', recid)
    if recid:
        articles = Recursos2.query.filter_by(recid=recid).all()
    else:
        articles = Recursos2.query.all()

    results = recursos_schema.dump(articles)

    return jsonify(results)
    
    """
    all_articles = Recursos2.query.all()

    results = recursos_schema.dump(all_articles)
    """
    return jsonify(results)


@app.route('/add', methods=['POST'])
def add_article():
    recid = request.json['recid']
    recurso = request.json['recurso']
    desc  = request.json['desc']

    articles = Recursos2(recid, recurso, desc)
    db.session.add(articles)
    db.session.commit()
    return recurso_schema.jsonify(articles)


@app.route('/imagen', methods=['POST'])
def ver_imagen():
    print("entro aca")
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    print('file:   ', file)
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Leer la imagen con OpenCV
    nparr = np.fromstring(file.read(), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    pred = model(img)

    if len(pred.xyxy[0]) > 0:  # Verifica si hay al menos una detección
        # Obtiene la etiqueta de la primera detección
        label = pred.names[int(pred.xyxy[0][0][-1])]
        print("La imagen contiene:", label)
        return jsonify({'label': label})
    else:
        print("No se detectaron objetos en la imagen")
        return jsonify({'label': 'No se detectaron objetos'})

    return jsonify({'message': 'File opened successfully'})

@app.route('/idioma', methods=['POST'])
def cambiar_idioma():
    nidio = request.json['nidio']
    datos = request.json['datos'][0]
    descripcion = datos['desc']
    print('intento1: ',nidio)
    print('error3: ',datos)
    print('descripcion: ', descripcion)
    translator = Translator()
    idioma_origen = translator.detect(descripcion).lang
    descripcion = translator.translate(descripcion, src = idioma_origen, dest = nidio).text
    print('2')
    print("nueva descripcion: ", descripcion)
    datos['desc'] = descripcion
    datos = [datos]
    print(datos)
    return jsonify({'data': datos})
    """
    # Guardar la imagen en el servidor
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

    # Puedes realizar cualquier operación adicional con la imagen aquí

    return jsonify({'message': 'File uploaded successfully'})
    """
if __name__ == "__main__":
    app.run(host = '127.0.0.1', port=5000, debug=True)