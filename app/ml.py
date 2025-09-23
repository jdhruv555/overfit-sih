# -*- coding: utf-8 -*-
"""
ml.py

This script fine-tunes a CySecBERT model for classifying cybersecurity-related
texts. It uses the Hugging Face Trainer API for a streamlined workflow.

It handles data loading, preprocessing, model training, and provides an
inference example using the pipeline API.
"""
import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import os

# --- 1. Load the Local Dataset ---
# Note: The CSV should have 'Cleaned Threat Description' and 'Threat Category' columns.
file_path = "data/Cybersecurity_Dataset.csv"
print(f"Loading local dataset from: {file_path}")

try:
    df = pd.read_csv(file_path)
    # Prepare the dataframe by renaming columns for the rest of the script
    df = df.rename(columns={"Cleaned Threat Description": "text", "Threat Category": "labels_text"})
except FileNotFoundError:
    print(f"Error: Dataset not found at {file_path}")
    # Create a dummy dataframe for demonstration purposes if the file is not found
    data = {
        'text': [
            "urgent action required your account is suspended click here",
            "download this new awesome game installer exe",
            "this is a benign text about network security protocols",
            "verify your banking details immediately to avoid closure",
            "a new trojan horse variant has been discovered in the wild",
            "how to configure your firewall for optimal protection"
        ],
        'labels_text': ["phishing", "malware", "others", "phishing", "malware", "others"]
    }
    df = pd.DataFrame(data)
    print("Using a dummy dataset for demonstration.")


print("Dataset loaded successfully. First 5 records:")
print(df.head())


# --- 2. Prepare the Data for Training ---
print("\nPreparing data for training...")

# Create integer labels required for training
labels = df['labels_text'].unique().tolist()
label2id = {label: i for i, label in enumerate(labels)}
id2label = {i: label for i, label in enumerate(labels)}
num_labels = len(labels)
df['labels'] = df['labels_text'].map(label2id)

# Split data into training and validation sets
train_df, val_df = train_test_split(df, test_size=0.2, stratify=df['labels'], random_state=42)

train_dataset = Dataset.from_pandas(train_df)
val_dataset = Dataset.from_pandas(val_df)


# --- 3. Load the Model and Tokenizer ---
model_name = "markusbayer/CySecBERT"
output_dir = "./cysec_threat_classifier" # Directory to save the trained model

print(f"\nLoading model '{model_name}' with a new head for {num_labels} labels...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name,
    num_labels=num_labels,
    id2label=id2label,
    label2id=label2id
)

# Tokenize the datasets
def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=128)

print("Tokenizing datasets...")
tokenized_train_dataset = train_dataset.map(tokenize_function, batched=True)
tokenized_val_dataset = val_dataset.map(tokenize_function, batched=True)


# --- 4. Fine-Tune the Model ---
print("\nStarting the fine-tuning process...")
training_args = TrainingArguments(
    output_dir=output_dir,
    num_train_epochs=1,  # increase to 3-4 for real training
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    logging_dir='./logs',
    logging_steps=10,
    evaluation_strategy="steps",   
    eval_steps=50,                 
    save_strategy="steps",        
    save_steps=50,                
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train_dataset,
    eval_dataset=tokenized_val_dataset,
)

# This is the training step!
trainer.train()

# Save the fine-tuned model
trainer.save_model(output_dir)
print(f"✅ Training complete! Model saved to '{output_dir}'.")


# --- 5. Use the TRAINED Model for Inference ---
print("\n--- Performing Inference with the Fine-Tuned Model ---")
from transformers import pipeline

# Load the trained model using a pipeline
classifier = pipeline("text-classification", model=output_dir)

text = "Im speaking from ABC Bank. We have detected unusual activity on your account. Please verify your identity by clicking the link below."
prediction = classifier(text)

print(f"\nText to classify: '{text}'")
print(f"Predicted class: {prediction}")

