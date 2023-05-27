from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import re
import pandas as pd

app = Flask(__name__)
CORS(app)

df = pd.read_csv("orbital.csv")

# Clean text
text = list(df['Question'])
corpus = []
for i in range(len(text)):
    r = re.sub('[^a-zA-Z]', ' ', text[i])
    r = r.lower()
    r = r.split()
    r = [word for word in r if word not in ["the", "a", "an"]]
    r = ' '.join(r)
    corpus.append(r)

# Assign corpus to df['Question']
df['Question'] = corpus

# Convert text data into numerical features
vectorizer = TfidfVectorizer()
features = vectorizer.fit_transform(df["Question"])

# Train the classifier (Random Forest Classifier)
classifier = RandomForestClassifier()
classifier.fit(features, df["Topic"])


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        # Calculate and return the accuracy
        accuracy = calculate_accuracy()
        return jsonify({'accuracy': accuracy})
    elif request.method == 'POST':
        # Make a prediction
        question = request.json['question']
        # Clean the question
        corpus = []
        r = re.sub('[^a-zA-Z]', ' ', question)
        r = r.lower()
        r = r.split()
        r = [word for word in r if word not in ["the", "a", "an"]]
        r = ' '.join(r)
        corpus.append(r)
        question = corpus
        # Transform the question into features
        new_features = vectorizer.transform(question)
        # Make the prediction
        new_prediction = classifier.predict(new_features)
        # Prepare the prediction response
        response = {'prediction': new_prediction[0]}
        return jsonify(response)


def calculate_accuracy():
    # Split the data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(features, df["Topic"], test_size=0.3, random_state=42)
    # Train the classifier (Random Forest Classifier)
    classifier.fit(X_train, y_train)
    # Predict the labels for the test set
    predictions = classifier.predict(X_test)
    # Calculate the accuracy of the classifier
    accuracy = accuracy_score(y_test, predictions)
    return round(accuracy * 100, 2)


if __name__ == '__main__':
    app.run(debug=True)
