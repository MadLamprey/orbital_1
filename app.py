#!/usr/bin/env python
# coding: utf-8

# ## Libraries

# In[1]:


# Text to numbers
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
# ML Modules
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn.naive_bayes import MultinomialNB
from sklearn.tree import DecisionTreeClassifier
# Text cleaning
import re
# misc
import pandas as pd
import matplotlib.pyplot as plt


# THE DATA
df = pd.read_csv("orbital.csv")

# In[2]:

'''
plt.figure(figsize=(10, 6))  # Set the figure size to 10 inches wide and 6 inches high
plt.hist(df["Topic"], rwidth=0.7)
plt.show()
'''

# ## CLEANING TEXT

# In[3]:


text = list(df['Question'])
corpus = []
for i in range(len(text)):
    r = re.sub('[^a-zA-Z]', ' ', text[i])
    r = r.lower()
    r = r.split()
    r = [word for word in r if word not in ["the", "a", "an"]]  # Stop words removal without NLTK
    r = ' '.join(r)
    corpus.append(r)

# Assign corpus to df['Question']
df['Question'] = corpus
# df["Question"]


# ## TOKENIZING AND MODEL PIPELINE

# In[4]:


# df = pd.read_csv("orbital.csv")

# Convert text data into numerical features
vectorizer = TfidfVectorizer()
features = vectorizer.fit_transform(df["Question"])

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, df["Topic"], test_size=0.3, random_state=42)

# Train the classifier (Random Forest Classifier)
classifier = RandomForestClassifier()
classifier.fit(X_train, y_train)

# Predict the labels for the test set
predictions = classifier.predict(X_test)

# Calculate the accuracy of the classifier
accuracy = accuracy_score(y_test, predictions)
print("Accuracy:", round(accuracy * 100, 2), "%")

# Example usage: Predict the label for new text data
# new_text = ["This is an AVL tree after inserting one alphabet into a height-balanced tree but before balancing. "]

question = input()

# Clean the question also
corpus = []
r = re.sub('[^a-zA-Z]', ' ', question)
r = r.lower()
r = r.split()
r = [word for word in r if word not in ["the", "a", "an"]]  # Stop words removal without NLTK
r = ' '.join(r)
corpus.append(r)

# Assign corpus to question variable
question = corpus
# print(question)
new_features = vectorizer.transform(question)
new_prediction = classifier.predict(new_features)
print("Prediction:", new_prediction[0])
