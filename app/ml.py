from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch

# Load pretrained model and tokenizer
model_name = "markusbayer/CySecBERT"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

text = "Im speaking from ABC Bank. We have detected unusual activity on your account. Please verify your identity by clicking the link below."
inputs = tokenizer(text, return_tensors="pt")

# Perform inference
with torch.no_grad():
    outputs = model(**inputs)

# Get the predicted class
predictions = torch.argmax(outputs.logits, dim=-1)
print(f"Predicted class: {predictions.item()}")