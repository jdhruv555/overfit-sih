from transformers import pipeline

# Zero-shot classification for cybersecurity incident types
# CySecBERT (markusbayer/CySecBERT) is an MLM model and does not provide a
# sequence classification head. We therefore use a strong NLI model for
# zero-shot classification and map texts to security labels.

# Candidate labels to detect — adjust as needed
SECURITY_LABELS = [
    "phishing",
    "malware",
    "ddos",
    "ransomware",
    "credential theft",
    "data exfiltration",
    "spam",
    "benign",
]


def get_classifier():
    """Return a zero-shot classification pipeline.

    Uses an NLI model because CySecBERT lacks a sequence classification head.
    """
    # Popular choices: 'facebook/bart-large-mnli' (English),
    # 'MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7' (multilingual)
    return pipeline(
        task="zero-shot-classification",
        model="facebook/bart-large-mnli",
    )


def classify_text(text, labels=None, multi_label=True):
    """Classify input text into cybersecurity categories.

    Args:
        text (str): The text to classify.
        labels (list[str]): Candidate labels to score.
        multi_label (bool): Allow multiple labels to be true.

    Returns:
        list[tuple[str, float]]: (label, score) sorted by score descending.
    """
    if labels is None:
        labels = SECURITY_LABELS
    clf = get_classifier()
    result = clf(text, candidate_labels=labels, multi_label=multi_label)
    # Normalize to list of (label, score)
    label_to_score = dict(zip(result["labels"], result["scores"]))
    top_ranked = sorted(label_to_score.items(), key=lambda kv: kv[1], reverse=True)
    return top_ranked


if __name__ == "__main__":
    import argparse
    import os
    from typing import List

    def run_zero_shot_demo():
        examples = [
            "Your account has been suspended. Verify your credentials at http://bit.ly/xyz.",
            "We observed high-volume traffic saturating the web server from multiple sources.",
            "Malicious attachment with trojan detected in the forwarded email.",
            "Monthly newsletter with product updates and no suspicious links.",
        ]

        for sample in examples:
            print("=" * 80)
            print(f"Text: {sample}")
            predictions = classify_text(sample)
            for lbl_out, sc_out in predictions[:5]:
                print(f"{lbl_out:<20} {sc_out:6.2%}")

    parser = argparse.ArgumentParser(description="Cybersecurity text classification utilities")
    parser.add_argument("--train", action="store_true", help="Fine-tune CySecBERT on the CSV dataset")
    parser.add_argument("--predict", type=str, default=None, help="Run prediction using a fine-tuned model on given text")
    parser.add_argument("--dataset", type=str, default=os.path.join("data", "Cybersecurity_Dataset.csv"), help="Path to CSV dataset")
    parser.add_argument("--text_column", type=str, default="Cleaned Threat Description", help="Text column name in the CSV")
    parser.add_argument("--label_column", type=str, default="Threat Category", help="Label column name in the CSV")
    parser.add_argument("--model_out", type=str, default=os.path.join("models", "cysecbert-threat-cls"), help="Directory to save/load fine-tuned model")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Per-device train/eval batch size")
    parser.add_argument("--lr", type=float, default=2e-5, help="Learning rate")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()

    if not args.train and not args.predict:
        run_zero_shot_demo()
        raise SystemExit(0)

    if args.train:
        import pandas as pd
        import numpy as np
        from sklearn.model_selection import train_test_split
        from datasets import Dataset
        # Metrics via scikit-learn to avoid optional dependency warnings
        import torch
        from transformers import (
            AutoTokenizer,
            AutoModelForSequenceClassification,
            DataCollatorWithPadding,
            Trainer,
            TrainingArguments,
            set_seed,
        )

        set_seed(args.seed)

        os.makedirs(args.model_out, exist_ok=True)

        df = pd.read_csv(args.dataset)
        if args.text_column not in df.columns:
            raise ValueError(f"Text column '{args.text_column}' not in CSV columns: {list(df.columns)}")
        if args.label_column not in df.columns:
            raise ValueError(f"Label column '{args.label_column}' not in CSV columns: {list(df.columns)}")

        df = df[[args.text_column, args.label_column]].dropna()
        df = df.rename(columns={args.text_column: "text", args.label_column: "label"})

        # Build label set and mapping
        unique_labels: List[str] = sorted(df["label"].astype(str).unique())
        label2id = {label: i for i, label in enumerate(unique_labels)}
        id2label = {i: label for label, i in label2id.items()}
        df["label_id"] = df["label"].map(label2id)

        train_df, val_df = train_test_split(df, test_size=0.2, random_state=args.seed, stratify=df["label_id"])
        train_ds = Dataset.from_pandas(train_df[["text", "label_id"]])
        val_ds = Dataset.from_pandas(val_df[["text", "label_id"]])

        model_name = "markusbayer/CySecBERT"
        tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True)
        model = AutoModelForSequenceClassification.from_pretrained(
            model_name,
            num_labels=len(unique_labels),
            id2label=id2label,
            label2id=label2id,
        )

        def tokenize_fn(batch):
            return tokenizer(batch["text"], truncation=True)

        train_ds = train_ds.map(tokenize_fn, batched=True)
        val_ds = val_ds.map(tokenize_fn, batched=True)
        data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

        from sklearn.metrics import accuracy_score, f1_score

        def compute_metrics(eval_pred):
            logits, labels = eval_pred
            preds = np.argmax(logits, axis=-1)
            return {
                "accuracy": float(accuracy_score(labels, preds)),
                "f1_macro": float(f1_score(labels, preds, average="macro")),
            }

        training_args = TrainingArguments(
            output_dir=os.path.join(args.model_out, "trainer"),
            num_train_epochs=args.epochs,
            per_device_train_batch_size=args.batch_size,
            per_device_eval_batch_size=args.batch_size,
            learning_rate=args.lr,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="f1_macro",
            logging_steps=50,
            report_to=[],
            seed=args.seed,
        )

        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_ds,
            eval_dataset=val_ds,
            tokenizer=tokenizer,
            data_collator=data_collator,
            compute_metrics=compute_metrics,
        )

        trainer.train()

        model.save_pretrained(args.model_out)
        tokenizer.save_pretrained(args.model_out)

        # Save label maps for later inference
        with open(os.path.join(args.model_out, "labels.txt"), "w", encoding="utf-8") as f:
            for idx in range(len(id2label)):
                f.write(f"{idx}\t{id2label[idx]}\n")

        print(f"Model fine-tuned and saved to: {args.model_out}")

    if args.predict is not None:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        import torch
        import numpy as np

        if not os.path.isdir(args.model_out):
            raise FileNotFoundError(f"Fine-tuned model directory not found: {args.model_out}. Run with --train first.")

        tokenizer = AutoTokenizer.from_pretrained(args.model_out)
        model = AutoModelForSequenceClassification.from_pretrained(args.model_out)
        id2label = model.config.id2label

        inputs = tokenizer(args.predict, return_tensors="pt", truncation=True)
        with torch.no_grad():
            outputs = model(**inputs)
            scores = torch.nn.functional.softmax(outputs.logits, dim=-1)[0].cpu().numpy()

        pred_ranked = sorted([(id2label[i], float(s)) for i, s in enumerate(scores)], key=lambda x: x[1], reverse=True)
        for lbl, sc in pred_ranked:
            print(f"{lbl:<20} {sc:6.2%}")